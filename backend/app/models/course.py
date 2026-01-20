from sqlalchemy import Column, String, Integer, Text, ForeignKey, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

# 课程模型
class Course(Base):
    __tablename__ = "courses"  # 课程表
    
    id = Column(String(100), primary_key=True, index=True, comment="课程ID")
    title = Column(String(100), nullable=False, comment="课程标题")
    description = Column(Text, nullable=True, comment="课程描述")
    level = Column(String(20), nullable=False, default="beginner", comment="难度级别: beginner, intermediate, advanced")
    category = Column(String(50), nullable=False, comment="课程类别")
    cover_image = Column(String(255), nullable=True, comment="课程封面图")
    total_lessons = Column(Integer, default=0, nullable=False, comment="总课时数")
    is_active = Column(Boolean, default=True, nullable=False, comment="是否激活")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="创建时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="更新时间")

# 课时模型
class Lesson(Base):
    __tablename__ = "lessons"  # 课时表
    
    id = Column(String(100), primary_key=True, index=True, comment="课时ID")
    course_id = Column(String(100), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True, comment="所属课程ID")
    lesson_number = Column(Integer, nullable=False, comment="课时编号")
    title = Column(String(100), nullable=False, comment="课时标题")
    content = Column(JSON, nullable=False, comment="课时内容，JSON格式便于存储结构化内容")
    total_lines = Column(Integer, default=0, nullable=False, comment="总行数")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="创建时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="更新时间")

# 用户学习进度模型
class UserLearningProgress(Base):
    __tablename__ = "user_learning_progress"  # 用户学习进度表
    
    id = Column(String(100), primary_key=True, index=True, comment="进度记录ID")
    user_id = Column(String(100), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True, comment="用户ID")
    course_id = Column(String(100), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True, comment="课程ID")
    lesson_id = Column(String(100), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True, comment="课时ID")
    current_line = Column(Integer, default=0, nullable=False, comment="当前学习到的行数")
    is_completed = Column(Boolean, default=False, nullable=False, comment="该课时是否已完成")
    last_studied_at = Column(DateTime(timezone=True), nullable=True, comment="最后学习时间")
    study_time = Column(Integer, default=0, nullable=False, comment="累计学习时长(秒)")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="创建时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="更新时间")

# 用户课程关联模型（我的课程）
class UserCourse(Base):
    __tablename__ = "user_courses"  # 用户课程关联表
    
    user_id = Column(String(100), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, nullable=False, index=True, comment="用户ID")
    course_id = Column(String(100), ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True, nullable=False, index=True, comment="课程ID")
    tags = Column(Text, nullable=True, comment="用户自定义标签，JSON格式")
    added_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="添加时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="更新时间")
