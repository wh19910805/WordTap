from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

# 用户模型
class User(Base):
    __tablename__ = "users"  # 用户表
    
    id = Column(String(100), primary_key=True, index=True, comment="用户ID")
    username = Column(String(50), unique=True, index=True, nullable=False, comment="用户名")
    email = Column(String(100), unique=True, index=True, nullable=False, comment="邮箱")
    password = Column(String(255), nullable=False, comment="密码哈希值")
    avatar = Column(String(255), nullable=True, comment="头像URL")
    nickname = Column(String(50), nullable=True, comment="昵称")
    gender = Column(String(10), default="unknown", nullable=False, comment="性别")
    birthdate = Column(DateTime, nullable=True, comment="出生日期")
    phone = Column(String(20), nullable=True, comment="电话号码")
    country = Column(String(50), nullable=True, comment="国家")
    language = Column(String(20), default="zh-CN", nullable=False, comment="语言偏好")
    timezone = Column(String(50), default="Asia/Shanghai", nullable=False, comment="时区偏好")
    is_verified = Column(Boolean, default=False, nullable=False, comment="邮箱是否已验证")
    verification_code = Column(String(20), nullable=True, comment="邮箱验证码")
    verification_expire = Column(DateTime, nullable=True, comment="验证码过期时间")
    last_login_ip = Column(String(45), nullable=True, comment="最后登录IP")
    login_count = Column(Integer, default=0, nullable=False, comment="登录次数")
    is_active = Column(Boolean, default=True, nullable=False, comment="账户是否激活")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="创建时间")
    last_login_at = Column(DateTime(timezone=True), nullable=True, comment="最后登录时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="更新时间")

# 用户统计表
class UserStats(Base):
    __tablename__ = "user_stats"  # 用户统计表
    
    id = Column(String(50), primary_key=True, default="main", comment="统计记录ID，默认'main'")
    user_id = Column(String(100), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, comment="用户ID")
    streak = Column(Integer, default=0, nullable=False, comment="连续学习天数")
    total_check_in = Column(Integer, default=0, nullable=False, comment="总打卡次数")
    word_count = Column(Integer, default=0, nullable=False, comment="学习单词总数")
    study_time_today = Column(Integer, default=0, nullable=False, comment="今日学习时长(秒)")
    study_time_week = Column(Integer, default=0, nullable=False, comment="本周学习时长(秒)")
    study_time_month = Column(Integer, default=0, nullable=False, comment="本月学习时长(秒)")
    study_time_year = Column(Integer, default=0, nullable=False, comment="本年学习时长(秒)")
    study_time_total = Column(Integer, default=0, nullable=False, comment="总学习时长(秒)")
    last_study_date = Column(DateTime(timezone=True), nullable=True, comment="最后学习日期")
    completed_lessons = Column(Integer, default=0, nullable=False, comment="已完成课时数")
    correct_answers = Column(Integer, default=0, nullable=False, comment="正确答案数")
    wrong_answers = Column(Integer, default=0, nullable=False, comment="错误答案数")
    accuracy = Column(Float, default=0.00, nullable=False, comment="答题准确率")
    xp_points = Column(Integer, default=0, nullable=False, comment="经验值")
    level = Column(Integer, default=1, nullable=False, comment="用户等级")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="创建时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="更新时间")
