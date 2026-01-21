import sys
import os
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker

# 定义简化的模型
Base = declarative_base()

class UserStats(Base):
    __tablename__ = "user_stats"
    id = Column(String(50), primary_key=True)
    user_id = Column(String(100), nullable=False)
    streak = Column(Integer, default=0)
    total_check_in = Column(Integer, default=0)
    word_count = Column(Integer, default=0)
    study_time_today = Column(Integer, default=0)
    study_time_week = Column(Integer, default=0)
    study_time_month = Column(Integer, default=0)
    study_time_year = Column(Integer, default=0)
    study_time_total = Column(Integer, default=0)
    last_study_date = Column(DateTime)
    completed_lessons = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    wrong_answers = Column(Integer, default=0)
    accuracy = Column(Integer, default=0)
    xp_points = Column(Integer, default=0)
    level = Column(Integer, default=1)

class UserLearningProgress(Base):
    __tablename__ = "user_learning_progress"
    id = Column(String(100), primary_key=True)
    user_id = Column(String(100), nullable=False)
    course_id = Column(String(100), nullable=False)
    lesson_id = Column(String(100), nullable=False)
    current_line = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    last_studied_at = Column(DateTime)
    study_time = Column(Integer, default=0)

def recalculate_user_stats(user_id, db_url):
    """直接从数据库重新计算指定用户的统计数据"""
    print(f"开始重新计算用户 {user_id} 的统计数据")
    
    # 创建数据库连接
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # 获取用户的所有学习进度记录
        progress_records = db.query(UserLearningProgress).filter(
            UserLearningProgress.user_id == user_id
        ).all()
        
        print(f"找到 {len(progress_records)} 条学习记录")
        
        # 计算总学习时长
        total_study_time = 0
        for record in progress_records:
            total_study_time += record.study_time
        
        print(f"总学习时长: {total_study_time} 秒")
        
        # 获取或创建用户统计记录
        user_stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
        if not user_stats:
            user_stats = UserStats(
                id=f"stats_{user_id}",
                user_id=user_id
            )
            db.add(user_stats)
        
        # 获取当前时间参考点
        now = datetime.now()
        today = now.date()
        today_start = datetime.combine(today, datetime.min.time())
        
        week_start = today - timedelta(days=today.weekday())
        week_start_datetime = datetime.combine(week_start, datetime.min.time())
        
        month_start = datetime(now.year, now.month, 1)
        year_start = datetime(now.year, 1, 1)
        
        # 统计各时间范围的学习时长
        today_study_time = 0
        week_study_time = 0
        month_study_time = 0
        year_study_time = 0
        
        # 统计已完成的课时ID
        completed_lesson_ids = set()
        
        for record in progress_records:
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
        
        # 统计学习天数
        study_dates = set(record.last_studied_at.date() for record in progress_records if record.last_studied_at)
        total_study_days = len(study_dates)
        
        # 获取最新的学习日期
        latest_study_date = None
        if progress_records:
            latest_study_date = max(record.last_studied_at for record in progress_records if record.last_studied_at)
        
        # 更新统计数据
        user_stats.study_time_total = total_study_time
        user_stats.study_time_today = today_study_time
        user_stats.study_time_week = week_study_time
        user_stats.study_time_month = month_study_time
        user_stats.study_time_year = year_study_time
        user_stats.completed_lessons = len(completed_lesson_ids)
        user_stats.last_study_date = latest_study_date
        user_stats.total_check_in = total_study_days
        user_stats.streak = 1  # 简化处理，实际应用中需要更复杂的逻辑
        
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
        print(f"错误类型: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    # 直接指定数据库连接信息
    DATABASE_URL = "mysql+pymysql://admin:admin123@localhost:3306/wordtap?charset=utf8mb4"
    # 指定要重新计算的用户ID
    target_user_id = "user_20260116210324_074f3a50"
    recalculate_user_stats(target_user_id, DATABASE_URL)
