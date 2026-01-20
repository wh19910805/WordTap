from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import Annotated
import uuid
from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token
from app.models.user import User, UserStats
from app.schemas.auth import UserRegister, UserLogin, RegisterResponse, LoginResponse, Response, UserResponse
from datetime import datetime, timedelta

router = APIRouter()

# 用户注册
@router.post("/register")
async def register_user(
    user_data: UserRegister,
    db: Annotated[Session, Depends(get_db)]
):
    # 检查用户名是否已存在
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        return Response(success=False, message="用户名已存在")
    
    # 检查邮箱是否已存在
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        return Response(success=False, message="邮箱已被注册")
    
    # 创建新用户
    user_id = f"user_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        id=user_id,
        username=user_data.username,
        email=user_data.email,
        password=hashed_password,
        language="zh-CN",
        timezone="Asia/Shanghai"
    )
    
    # 创建用户统计记录
    user_stats = UserStats(
        user_id=user_id,
        id=f"stats_{user_id}"
    )
    
    try:
        db.add(new_user)
        db.add(user_stats)
        db.commit()
        db.refresh(new_user)
        
        # 生成token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=new_user.id, expires_delta=access_token_expires
        )
        
        return {
            "success": True,
            "message": "注册成功",
            "token": access_token,
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email
            }
        }
    except Exception as e:
        db.rollback()
        return Response(success=False, message="注册失败，请重试")

# 用户登录
@router.post("/login")
async def login_user(
    login_data: UserLogin,
    db: Annotated[Session, Depends(get_db)]
):
    # 查找用户
    user = db.query(User).filter(
        (User.username == login_data.usernameOrEmail) | (User.email == login_data.usernameOrEmail)
    ).first()
    
    if not user:
        return Response(success=False, message="用户名或密码错误")
    
    # 验证密码
    if not verify_password(login_data.password, user.password):
        return Response(success=False, message="用户名或密码错误")
    
    # 更新用户登录信息
    try:
        user.last_login_at = datetime.utcnow()
        user.login_count += 1
        db.commit()
        
        # 生成token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user.id, expires_delta=access_token_expires
        )
        
        return {
            "success": True,
            "message": "登录成功",
            "token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }
    except Exception as e:
        db.rollback()
        return Response(success=False, message="登录失败，请重试")

# 从请求头获取token的依赖函数
async def get_current_user_id(request: Request):
    # 从Authorization头获取token
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证凭据"
        )
    
    # 检查Bearer前缀
    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证格式"
        )
    
    # 提取token
    token = auth_header[7:]
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证凭据"
        )
    
    # 解析token获取用户ID
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证凭据"
        )
    
    return user_id

# 获取当前用户信息
@router.get("/me", response_model=UserResponse)
async def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    
    # 查找用户
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    return user
