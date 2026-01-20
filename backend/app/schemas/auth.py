from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

# 用户注册请求模型
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="用户名")
    email: EmailStr = Field(..., description="邮箱")
    password: str = Field(..., min_length=6, max_length=50, description="密码")

# 用户登录请求模型
class UserLogin(BaseModel):
    usernameOrEmail: str = Field(..., description="用户名或邮箱")
    password: str = Field(..., description="密码")

# 用户响应模型
class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    nickname: Optional[str] = None
    avatar: Optional[str] = None
    language: str
    timezone: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# 登录响应模型
class LoginResponse(BaseModel):
    success: bool = True
    message: str = "登录成功"
    token: str
    user: UserResponse

# 注册响应模型
class RegisterResponse(BaseModel):
    success: bool = True
    message: str = "注册成功"
    token: str
    user: UserResponse

# 通用响应模型
class Response(BaseModel):
    success: bool
    message: str
