from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated, List
from datetime import datetime, date, timedelta
from sqlalchemy import func

from app.core.database import get_db
from app.models.user import User, UserStats, UserSettings
from app.models.course import UserLearningProgress, Course, Lesson
from app.schemas.user import (
    UserStatsUpdate, UserStatsResponse, 
    CheckInResponse, HeatmapResponse, HeatmapData,
    RecentStudiesResponse, RecentStudyRecord,
    UserSettingsResponse, UserSettingsUpdate
)
from app.routers.auth import get_current_user_id

router = APIRouter()

# 获取用户统计数据
@router.get("/stats", response_model=UserStatsResponse)
async def get_user_stats(
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    # 查找用户统计数据
    user_stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    
    if not user_stats:
        # 如果没有统计数据，创建默认数据
        user_stats = UserStats(
            id=f"stats_{user_id}",
            user_id=user_id
        )
        db.add(user_stats)
        db.commit()
        db.refresh(user_stats)
    
    return user_stats

# 更新用户统计数据
@router.put("/stats", response_model=UserStatsResponse)
async def update_user_stats(
    stats_data: UserStatsUpdate,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    # 查找用户统计数据
    user_stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    
    if not user_stats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户统计数据不存在"
        )
    
    # 更新统计数据
    update_data = stats_data.model_dump(exclude_unset=True)
    
    # 计算准确率
    if "correct_answers" in update_data or "wrong_answers" in update_data:
        correct = update_data.get("correct_answers", user_stats.correct_answers)
        wrong = update_data.get("wrong_answers", user_stats.wrong_answers)
        total = correct + wrong
        update_data["accuracy"] = round(correct / total * 100, 2) if total > 0 else 0.00
    
    # 更新字段
    for field, value in update_data.items():
        setattr(user_stats, field, value)
    
    # 更新最后学习日期
    user_stats.last_study_date = datetime.now()
    
    db.commit()
    db.refresh(user_stats)
    
    return user_stats

# 每日打卡
@router.post("/check-in", response_model=CheckInResponse)
async def check_in(
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    # 查找用户统计数据
    user_stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    
    if not user_stats:
        # 如果没有统计数据，创建默认数据
        user_stats = UserStats(
            id=f"stats_{user_id}",
            user_id=user_id
        )
        db.add(user_stats)
    
    # 获取今天的日期
    today = date.today()
    is_new_check_in = False
    
    # 检查上次打卡日期
    if user_stats.last_study_date:
        last_checkin_date = user_stats.last_study_date.date()
        
        # 计算日期差
        days_diff = (today - last_checkin_date).days
        
        if days_diff == 0:
            # 今天已经打卡
            return {
                "success": True,
                "message": "今天已经打卡",
                "streak": user_stats.streak,
                "total_check_in": user_stats.total_check_in,
                "is_new_check_in": False
            }
        elif days_diff == 1:
            # 连续打卡，增加连续天数
            user_stats.streak += 1
            is_new_check_in = True
        else:
            # 中断连续打卡，重置连续天数
            user_stats.streak = 1
            is_new_check_in = True
    else:
        # 第一次打卡
        user_stats.streak = 1
        is_new_check_in = True
    
    # 更新打卡次数和最后学习日期
    if is_new_check_in:
        user_stats.total_check_in += 1
        user_stats.last_study_date = datetime.now()
        
    db.commit()
    db.refresh(user_stats)
    
    return {
        "success": True,
        "message": "打卡成功",
        "streak": user_stats.streak,
        "total_check_in": user_stats.total_check_in,
        "is_new_check_in": is_new_check_in
    }

# 获取学习热力图数据
@router.get("/heatmap", response_model=HeatmapResponse)
async def get_heatmap_data(
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id),
    months: int = 6  # 默认获取最近6个月的数据
):
    try:
        # 计算开始日期
        end_date = date.today()
        start_date = end_date - timedelta(days=months*30)
        
        # 查询用户学习进度记录，按日期分组统计
        # 添加过滤条件，排除last_studied_at为None的记录
        progress_records = db.query(
            func.date(UserLearningProgress.last_studied_at).label("study_date"),
            func.count(UserLearningProgress.id).label("study_count")
        ).filter(
            UserLearningProgress.user_id == user_id,
            UserLearningProgress.last_studied_at >= start_date,
            UserLearningProgress.last_studied_at.isnot(None)
        ).group_by(
            func.date(UserLearningProgress.last_studied_at)
        ).all()
        
        # 转换为响应格式
        heatmap_data = []
        for record in progress_records:
            heatmap_data.append(HeatmapData(
                date=str(record.study_date),
                count=record.study_count
            ))
        
        return HeatmapResponse(data=heatmap_data)
    except Exception as e:
        # 记录错误并返回友好响应
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取学习热力图数据失败: {str(e)}"
        )

# 获取最近学习记录
@router.get("/recent-studies", response_model=RecentStudiesResponse)
async def get_recent_studies(
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id),
    limit: int = 10,
    offset: int = 0
):
    try:
        # 查询最近学习记录，关联课程和课时信息
        # 使用COALESCE处理可能为None的last_studied_at字段
        recent_records = db.query(
            UserLearningProgress,
            Course.title.label("course_name"),
            Lesson.title.label("lesson_name")
        ).join(
            Course, UserLearningProgress.course_id == Course.id
        ).join(
            Lesson, UserLearningProgress.lesson_id == Lesson.id
        ).filter(
            UserLearningProgress.user_id == user_id
        ).order_by(
            UserLearningProgress.last_studied_at.desc()
        ).limit(limit).offset(offset).all()
        
        # 计算总数
        total = db.query(UserLearningProgress).filter(
            UserLearningProgress.user_id == user_id
        ).count()
        
        # 转换为响应格式
        records = []
        for progress, course_name, lesson_name in recent_records:
            # 确保last_studied_at不为None
            last_studied = progress.last_studied_at or datetime.now()
            records.append(RecentStudyRecord(
                id=progress.id,
                course_id=progress.course_id,
                course_name=course_name,
                lesson_id=progress.lesson_id,
                lesson_name=lesson_name,
                study_time=progress.study_time,
                last_studied_at=last_studied,
                is_completed=progress.is_completed
            ))
        
        return RecentStudiesResponse(records=records, total=total)
    except Exception as e:
        # 记录错误并返回友好响应
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取最近学习记录失败: {str(e)}"
        )

# 获取当前用户信息（包含统计数据）
@router.get("/me/stats", response_model=dict)
async def get_current_user_with_stats(
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    # 查找用户信息
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 查找用户统计数据
    user_stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    
    if not user_stats:
        # 如果没有统计数据，创建默认数据
        user_stats = UserStats(
            id=f"stats_{user_id}",
            user_id=user_id
        )
        db.add(user_stats)
        db.commit()
        db.refresh(user_stats)
    
    # 返回包含用户信息和统计数据的响应
    return {
        "user": user,
        "stats": user_stats
    }

# 获取用户设置
@router.get("/settings", response_model=UserSettingsResponse)
async def get_user_settings(
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        # 查找用户设置
        user_settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
        
        if not user_settings:
            # 如果没有设置数据，创建默认设置
            from datetime import datetime
            import uuid
            settings_id = f"settings_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
            user_settings = UserSettings(
                id=settings_id,
                user_id=user_id
            )
            db.add(user_settings)
            db.commit()
            db.refresh(user_settings)
        
        return user_settings
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取用户设置失败: {str(e)}"
        )

# 更新用户设置
@router.put("/settings", response_model=UserSettingsResponse)
async def update_user_settings(
    settings_data: UserSettingsUpdate,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        # 查找用户设置
        user_settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
        
        if not user_settings:
            # 如果没有设置数据，创建默认设置
            from datetime import datetime
            import uuid
            settings_id = f"settings_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
            user_settings = UserSettings(
                id=settings_id,
                user_id=user_id
            )
            db.add(user_settings)
        
        # 更新设置数据
        update_data = settings_data.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            if value is not None:
                # 如果是字典类型，合并更新
                if hasattr(user_settings, key) and isinstance(getattr(user_settings, key), dict) and isinstance(value, dict):
                    current_value = getattr(user_settings, key) or {}
                    current_value.update(value)
                    setattr(user_settings, key, current_value)
                else:
                    setattr(user_settings, key, value)
        
        db.commit()
        db.refresh(user_settings)
        
        return user_settings
    except Exception as e:
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新用户设置失败: {str(e)}"
        )
