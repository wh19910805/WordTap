import sys
import os
from datetime import datetime, timedelta

# 添加后端目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import UserStats
from app.models.course import UserLearningProgress
from app.core.config import settings

def recalculate_user_stats(user_id):
    """直接从数据库重新计算指定用户的统计数据"""
    print(f"开始重新计算用户 {user_id} 的统计数据")
    
    # 创建数据库连接
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # 获取用户的所有学习进度记录
        progress_records = db.query(UserLearningProgress).filter(
            UserLearningProgress.user_id == user_id
        ).all()
        
        print(f"找到 {len(progress_records)} 条学习记录")
        
        # 获取或创建用户统计记录
        user_stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
        if not user_stats:
            user_stats = UserStats(
                id=f"stats_{user_id}",
                user_id=user_id
            )
            db.add(user_stats)
        
        # 重置统计数据
        user_stats.study_time_total = 0
        user_stats.study_time_today = 0
        user_stats.study_time_week = 0
        user_stats.study_time_month = 0
        user_stats.study_time_year = 0
        user_stats.completed_lessons = 0
        
        # 获取当前时间参考点
        now = datetime.now()
        today = now.date()
        today_start = datetime.combine(today, datetime.min.time())
        
        week_start = today - timedelta(days=today.weekday())
        week_start_datetime = datetime.combine(week_start, datetime.min.time())
        
        month_start = datetime(now.year, now.month, 1)
        year_start = datetime(now.year, 1, 1)
        
        # 统计已完成的课时ID
        completed_lesson_ids = set()
        
        # 计算总学习时长
        total_study_time = 0
        today_study_time = 0
        week_study_time = 0
        month_study_time = 0
        year_study_time = 0
        
        # 遍历所有学习记录
        for record in progress_records:
            total_study_time += record.study_time
            
            # 按时间范围累加学习时长
            if record.last_studied_at and record.last_studied_at >= today_start:
                today_study_time += record.study_time
            
            if record.last_studied_at and record.last_studied_at >= week_start_datetime:
                week_study_time += record.study_time
            
            if record.last_studied_at and record.last_studied_at >= month_start:
                month_study_time += record.study_time
            
            if record.last_studied_at and record.last_studied_at >= year_start:
                year_study_time += record.study_time
            
            # 统计已完成的课时
            if record.is_completed:
                completed_lesson_ids.add(record.lesson_id)
        
        # 更新统计数据
        user_stats.study_time_total = total_study_time
        user_stats.study_time_today = today_study_time
        user_stats.study_time_week = week_study_time
        user_stats.study_time_month = month_study_time
        user_stats.study_time_year = year_study_time
        user_stats.completed_lessons = len(completed_lesson_ids)
        
        # 更新最后学习日期
        if progress_records:
            # 获取最新的学习记录
            latest_record = max(progress_records, key=lambda x: x.last_studied_at or datetime.min)
            user_stats.last_study_date = latest_record.last_studied_at
        
        # 计算连续学习天数和累计打卡
        if user_stats.last_study_date:
            # 计算实际学习天数
            study_dates = set(record.last_studied_at.date() for record in progress_records if record.last_studied_at)
            user_stats.total_check_in = len(study_dates)
            
            # 简化处理连续学习天数，实际应用中可能需要更复杂的逻辑
            user_stats.streak = 1
        
        # 提交更改
        db.commit()
        db.refresh(user_stats)
        
        print(f"✅ 用户 {user_id} 的统计数据已重新计算")
        print(f"总学习时长: {user_stats.study_time_total} 秒")
        print(f"今日学习时长: {user_stats.study_time_today} 秒")
        print(f"本周学习时长: {user_stats.study_time_week} 秒")
        print(f"本月学习时长: {user_stats.study_time_month} 秒")
        print(f"本年学习时长: {user_stats.study_time_year} 秒")
        print(f"已完成课时数: {user_stats.completed_lessons}")
        print(f"最后学习日期: {user_stats.last_study_date}")
        print(f"连续学习天数: {user_stats.streak}")
        print(f"累计打卡天数: {user_stats.total_check_in}")
        
        return True
        
    except Exception as e:
        print(f"❌ 重新计算用户统计数据失败: {str(e)}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    # 指定要重新计算的用户ID
    target_user_id = "user_20260116210324_074f3a50"
    recalculate_user_stats(target_user_id)
