from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any

# 课程请求模型
class CourseCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="课程标题")
    description: Optional[str] = Field(None, description="课程描述")
    level: str = Field("beginner", description="难度级别: beginner, intermediate, advanced")
    category: str = Field(..., min_length=1, max_length=50, description="课程类别")
    cover_image: Optional[str] = Field(None, description="课程封面图")

# 课程更新模型
class CourseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100, description="课程标题")
    description: Optional[str] = Field(None, description="课程描述")
    level: Optional[str] = Field(None, description="难度级别: beginner, intermediate, advanced")
    category: Optional[str] = Field(None, min_length=1, max_length=50, description="课程类别")
    cover_image: Optional[str] = Field(None, description="课程封面图")
    is_active: Optional[bool] = Field(None, description="是否激活")

# 课程响应模型
class CourseResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    level: str
    category: str
    cover_image: Optional[str]
    total_lessons: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# 课时内容模型
class LessonContent(BaseModel):
    lines: List[str] = Field(..., description="课时内容行列表")
    
# 课时请求模型
class LessonCreate(BaseModel):
    course_id: str = Field(..., description="所属课程ID")
    lesson_number: int = Field(..., description="课时编号")
    title: str = Field(..., min_length=1, max_length=100, description="课时标题")
    content: LessonContent = Field(..., description="课时内容")

# 课时更新模型
class LessonUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100, description="课时标题")
    content: Optional[LessonContent] = Field(None, description="课时内容")

# 课时响应模型
class LessonResponse(BaseModel):
    id: str
    course_id: str
    lesson_number: int
    title: str
    total_lines: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# 课时详情响应模型
class LessonDetailResponse(LessonResponse):
    content: Dict[str, Any]

# 学习进度请求模型
class LearningProgressUpdate(BaseModel):
    course_id: str = Field(..., description="课程ID")
    lesson_id: str = Field(..., description="课时ID")
    current_line: int = Field(..., ge=0, description="当前学习到的行数")
    study_time: Optional[int] = Field(0, ge=0, description="本次学习时长(秒)")
    is_completed: Optional[bool] = Field(False, description="是否完成该课时")

# 学习进度响应模型
class LearningProgressResponse(BaseModel):
    id: str
    user_id: str
    course_id: str
    lesson_id: str
    current_line: int
    is_completed: bool
    last_studied_at: Optional[datetime]
    study_time: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# 学习进度详情响应模型
class LearningProgressDetailResponse(LearningProgressResponse):
    course: CourseResponse
    lesson: LessonResponse

# 用户课程请求模型
class UserCourseCreate(BaseModel):
    course_id: str = Field(..., description="课程ID")
    tags: Optional[str] = Field(None, description="用户自定义标签，JSON格式")

# 用户课程响应模型
class UserCourseResponse(BaseModel):
    user_id: str
    course_id: str
    tags: Optional[str]
    added_at: datetime
    updated_at: datetime
    course: CourseResponse
    
    class Config:
        from_attributes = True

# 用户课程更新模型
class UserCourseUpdate(BaseModel):
    tags: Optional[str] = Field(None, description="用户自定义标签，JSON格式")
