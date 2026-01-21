from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, ForeignKey, JSON
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

# 用户设置模型
class UserSettings(Base):
    __tablename__ = "user_settings"  # 用户设置表
    
    id = Column(String(100), primary_key=True, index=True, comment="设置ID")
    user_id = Column(String(100), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, comment="用户ID")
    
    # 外观设置
    appearance = Column(JSON, nullable=True, default={
        "theme": "light",  # 主题: light, dark, auto
        "font_size": "medium",  # 字体大小: small, medium, large
        "show_progress": True,  # 是否显示学习进度
        "show_score": True,  # 是否显示得分
        "compact_mode": False  # 是否紧凑模式
    }, comment="外观设置")
    
    # 答题设置
    quiz = Column(JSON, nullable=True, default={
        "auto_play": True,  # 是否自动播放
        "show_answer": False,  # 是否显示答案
        "quiz_mode": "normal",  # 答题模式: normal, shuffle, challenge
        "answer_delay": 3000,  # 答案显示延迟(毫秒)
        "repeat_times": 1,  # 重复次数
        "auto_next": True  # 是否自动进入下一题
    }, comment="答题设置")
    
    # 播放设置
    playback = Column(JSON, nullable=True, default={
        "playback_speed": 1.0,  # 播放速度: 0.5, 0.75, 1.0, 1.25, 1.5, 2.0
        "auto_play": True,  # 是否自动播放下一句
        "repeat_mode": "none",  # 重复模式: none, once, all
        "show_subtitles": True,  # 是否显示字幕
        "highlight_text": True,  # 是否高亮文本
        "line_by_line": True  # 是否逐行显示
    }, comment="播放设置")
    
    # 听力设置
    listening = Column(JSON, nullable=True, default={
        "volume": 80,  # 音量: 0-100
        "background_music": 30,  # 背景音乐音量: 0-100
        "speech_recognition": True,  # 是否开启语音识别
        "speech_language": "en-US",  # 语音识别语言
        "noise_reduction": True  # 是否开启降噪
    }, comment="听力设置")
    
    # 口语设置
    speaking = Column(JSON, nullable=True, default={
        "recording_duration": 5000,  # 录音时长(毫秒)
        "auto_stop": True,  # 是否自动停止录音
        "feedback_level": "detailed",  # 反馈级别: basic, detailed, comprehensive
        "pronunciation_score": True,  # 是否显示发音评分
        "fluency_score": True,  # 是否显示流利度评分
        "accuracy_score": True,  # 是否显示准确率评分
        "auto_play_recording": True  # 是否自动播放录音
    }, comment="口语设置")
    
    # 其他设置
    notifications = Column(JSON, nullable=True, default={
        "email_notifications": True,  # 是否开启邮件通知
        "push_notifications": True,  # 是否开启推送通知
        "daily_reminder": True,  # 是否开启每日提醒
        "achievement_notifications": True,  # 是否开启成就通知
        "reminder_time": "20:00"  # 提醒时间
    }, comment="通知设置")
    
    # 数据同步设置
    sync = Column(JSON, nullable=True, default={
        "auto_sync": True,  # 是否自动同步
        "sync_frequency": "daily",  # 同步频率: hourly, daily, weekly
        "sync_over_wifi": True,  # 是否仅在WiFi下同步
        "backup_data": True  # 是否备份数据
    }, comment="同步设置")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="创建时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="更新时间")
