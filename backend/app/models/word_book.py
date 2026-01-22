from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

# 生词本模型
class UserWordBook(Base):
    __tablename__ = "user_word_books"  # 生词本表
    
    id = Column(String(100), primary_key=True, index=True, comment="生词记录ID")
    user_id = Column(String(100), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, comment="用户ID")
    word = Column(String(100), nullable=False, comment="单词")
    phonetic = Column(String(100), nullable=True, comment="音标")
    definition = Column(String(500), nullable=True, comment="释义")
    example = Column(String(1000), nullable=True, comment="例句")
    part_of_speech = Column(String(50), nullable=True, comment="词性")
    tags = Column(String(200), nullable=True, comment="标签，逗号分隔")
    frequency = Column(Integer, default=1, nullable=False, comment="学习频率")
    proficiency_level = Column(Integer, default=1, nullable=False, comment="熟练度等级：1-5")
    last_reviewed_at = Column(DateTime(timezone=True), nullable=True, comment="最后复习时间")
    next_review_at = Column(DateTime(timezone=True), nullable=True, comment="下次复习时间")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="添加时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="更新时间")

# 错题本模型
class UserWrongWord(Base):
    __tablename__ = "user_wrong_words"  # 错题本表
    
    id = Column(String(100), primary_key=True, index=True, comment="错题记录ID")
    user_id = Column(String(100), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, comment="用户ID")
    word = Column(String(100), nullable=False, comment="单词")
    question_type = Column(String(50), nullable=False, comment="题型")
    course_id = Column(String(100), nullable=True, comment="课程ID")
    lesson_id = Column(String(100), nullable=True, comment="课时ID")
    user_answer = Column(String(500), nullable=True, comment="用户答案")
    correct_answer = Column(String(500), nullable=False, comment="正确答案")
    explanation = Column(String(1000), nullable=True, comment="解析")
    wrong_count = Column(Integer, default=1, nullable=False, comment="错误次数")
    last_wrong_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="最后错误时间")
    is_reviewed = Column(Boolean, default=False, nullable=False, comment="是否已复习")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, comment="创建时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="更新时间")
