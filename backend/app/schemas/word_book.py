from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# 生词本基础模型
class WordBookBase(BaseModel):
    word: str = Field(..., description="单词")
    phonetic: Optional[str] = Field(None, description="音标")
    definition: Optional[str] = Field(None, description="释义")
    example: Optional[str] = Field(None, description="例句")
    part_of_speech: Optional[str] = Field(None, description="词性")
    tags: Optional[str] = Field(None, description="标签，逗号分隔")

# 生词本创建模型
class WordBookCreate(WordBookBase):
    pass

# 生词本更新模型
class WordBookUpdate(BaseModel):
    phonetic: Optional[str] = None
    definition: Optional[str] = None
    example: Optional[str] = None
    part_of_speech: Optional[str] = None
    tags: Optional[str] = None
    proficiency_level: Optional[int] = None
    last_reviewed_at: Optional[datetime] = None
    next_review_at: Optional[datetime] = None

# 生词本响应模型
class WordBookResponse(WordBookBase):
    id: str
    user_id: str
    frequency: int
    proficiency_level: int
    last_reviewed_at: Optional[datetime]
    next_review_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 生词本列表响应
class WordBookListResponse(BaseModel):
    items: List[WordBookResponse]
    total: int
    page: int
    size: int

# 错题本基础模型
class WrongWordBase(BaseModel):
    word: str = Field(..., description="单词")
    question_type: str = Field(..., description="题型")
    course_id: Optional[str] = Field(None, description="课程ID")
    lesson_id: Optional[str] = Field(None, description="课时ID")
    user_answer: Optional[str] = Field(None, description="用户答案")
    correct_answer: str = Field(..., description="正确答案")
    explanation: Optional[str] = Field(None, description="解析")
    wrong_count: Optional[int] = Field(1, description="错误次数")

# 错题本创建模型
class WrongWordCreate(WrongWordBase):
    pass

# 错题本更新模型
class WrongWordUpdate(BaseModel):
    user_answer: Optional[str] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    wrong_count: Optional[int] = None
    last_wrong_at: Optional[datetime] = None
    is_reviewed: Optional[bool] = None

# 错题本响应模型
class WrongWordResponse(WrongWordBase):
    id: str
    user_id: str
    wrong_count: int
    last_wrong_at: datetime
    is_reviewed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 错题本列表响应
class WrongWordListResponse(BaseModel):
    items: List[WrongWordResponse]
    total: int
    page: int
    size: int

# 单词统计响应
class WordStatsResponse(BaseModel):
    word_book_count: int
    wrong_word_count: int
    pending_review_count: int
