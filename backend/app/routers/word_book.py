from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated, List
from datetime import datetime, timedelta
from uuid import uuid4

from app.core.database import get_db
from app.models.word_book import UserWordBook, UserWrongWord
from app.schemas.word_book import (
    WordBookCreate, WordBookUpdate, WordBookResponse, WordBookListResponse,
    WrongWordCreate, WrongWordUpdate, WrongWordResponse, WrongWordListResponse,
    WordStatsResponse
)
from app.routers.auth import get_current_user_id

router = APIRouter()

# 生词本 - 获取列表
@router.get("/word-book", response_model=WordBookListResponse)
async def get_word_book(
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id),
    page: int = 1,
    size: int = 20,
    search: str = ""
):
    try:
        # 构建查询
        query = db.query(UserWordBook).filter(UserWordBook.user_id == user_id)
        
        # 搜索过滤
        if search:
            query = query.filter(UserWordBook.word.ilike(f"%{search}%"))
        
        # 计算总数
        total = query.count()
        
        # 分页
        offset = (page - 1) * size
        items = query.offset(offset).limit(size).all()
        
        return WordBookListResponse(
            items=items,
            total=total,
            page=page,
            size=size
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取生词本失败: {str(e)}"
        )

# 生词本 - 添加生词
@router.post("/word-book", response_model=WordBookResponse)
async def add_word_to_book(
    word_data: WordBookCreate,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        # 检查单词是否已存在
        existing_word = db.query(UserWordBook).filter(
            UserWordBook.user_id == user_id,
            UserWordBook.word == word_data.word
        ).first()
        
        if existing_word:
            # 如果单词已存在，返回现有记录
            return existing_word
        
        # 创建新单词记录
        new_word = UserWordBook(
            id=f"word_{uuid4()}",
            user_id=user_id,
            **word_data.dict()
        )
        
        db.add(new_word)
        db.commit()
        db.refresh(new_word)
        
        return new_word
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"添加生词失败: {str(e)}"
        )

# 生词本 - 获取单个生词
@router.get("/word-book/{word_id}", response_model=WordBookResponse)
async def get_word_detail(
    word_id: str,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        word = db.query(UserWordBook).filter(
            UserWordBook.id == word_id,
            UserWordBook.user_id == user_id
        ).first()
        
        if not word:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="生词不存在"
            )
        
        return word
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取生词详情失败: {str(e)}"
        )

# 生词本 - 更新生词
@router.put("/word-book/{word_id}", response_model=WordBookResponse)
async def update_word(
    word_id: str,
    word_data: WordBookUpdate,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        word = db.query(UserWordBook).filter(
            UserWordBook.id == word_id,
            UserWordBook.user_id == user_id
        ).first()
        
        if not word:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="生词不存在"
            )
        
        # 更新字段
        for field, value in word_data.dict(exclude_unset=True).items():
            setattr(word, field, value)
        
        db.commit()
        db.refresh(word)
        
        return word
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新生词失败: {str(e)}"
        )

# 生词本 - 删除生词
@router.delete("/word-book/{word_id}")
async def delete_word(
    word_id: str,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        word = db.query(UserWordBook).filter(
            UserWordBook.id == word_id,
            UserWordBook.user_id == user_id
        ).first()
        
        if not word:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="生词不存在"
            )
        
        db.delete(word)
        db.commit()
        
        return {"message": "生词删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除生词失败: {str(e)}"
        )

# 错题本 - 获取列表
@router.get("/wrong-words", response_model=WrongWordListResponse)
async def get_wrong_words(
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id),
    page: int = 1,
    size: int = 20,
    search: str = "",
    is_reviewed: bool = None
):
    try:
        # 构建查询
        query = db.query(UserWrongWord).filter(UserWrongWord.user_id == user_id)
        
        # 搜索过滤
        if search:
            query = query.filter(UserWrongWord.word.ilike(f"%{search}%"))
        
        # 已复习状态过滤
        if is_reviewed is not None:
            query = query.filter(UserWrongWord.is_reviewed == is_reviewed)
        
        # 计算总数
        total = query.count()
        
        # 分页
        offset = (page - 1) * size
        items = query.order_by(UserWrongWord.last_wrong_at.desc()).offset(offset).limit(size).all()
        
        return WrongWordListResponse(
            items=items,
            total=total,
            page=page,
            size=size
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取错题本失败: {str(e)}"
        )

# 错题本 - 添加错题
@router.post("/wrong-words", response_model=WrongWordResponse)
async def add_wrong_word(
    wrong_word_data: WrongWordCreate,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        # 检查是否已存在相同的错题记录
        existing_wrong_word = db.query(UserWrongWord).filter(
            UserWrongWord.user_id == user_id,
            UserWrongWord.word == wrong_word_data.word,
            UserWrongWord.question_type == wrong_word_data.question_type
        ).first()
        
        if existing_wrong_word:
            # 如果已存在，更新错误次数和最后错误时间
            existing_wrong_word.wrong_count += 1
            existing_wrong_word.last_wrong_at = datetime.now()
            existing_wrong_word.is_reviewed = False
            db.commit()
            db.refresh(existing_wrong_word)
            return existing_wrong_word
        
        # 创建新错题记录
        new_wrong_word = UserWrongWord(
            id=f"wrong_{uuid4()}",
            user_id=user_id,
            **wrong_word_data.dict()
        )
        
        db.add(new_wrong_word)
        db.commit()
        db.refresh(new_wrong_word)
        
        return new_wrong_word
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"添加错题失败: {str(e)}"
        )

# 错题本 - 获取单个错题
@router.get("/wrong-words/{wrong_word_id}", response_model=WrongWordResponse)
async def get_wrong_word_detail(
    wrong_word_id: str,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        wrong_word = db.query(UserWrongWord).filter(
            UserWrongWord.id == wrong_word_id,
            UserWrongWord.user_id == user_id
        ).first()
        
        if not wrong_word:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="错题不存在"
            )
        
        return wrong_word
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取错题详情失败: {str(e)}"
        )

# 错题本 - 更新错题
@router.put("/wrong-words/{wrong_word_id}", response_model=WrongWordResponse)
async def update_wrong_word(
    wrong_word_id: str,
    wrong_word_data: WrongWordUpdate,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        wrong_word = db.query(UserWrongWord).filter(
            UserWrongWord.id == wrong_word_id,
            UserWrongWord.user_id == user_id
        ).first()
        
        if not wrong_word:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="错题不存在"
            )
        
        # 更新字段
        for field, value in wrong_word_data.dict(exclude_unset=True).items():
            setattr(wrong_word, field, value)
        
        db.commit()
        db.refresh(wrong_word)
        
        return wrong_word
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新错题失败: {str(e)}"
        )

# 错题本 - 删除错题
@router.delete("/wrong-words/{wrong_word_id}")
async def delete_wrong_word(
    wrong_word_id: str,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        wrong_word = db.query(UserWrongWord).filter(
            UserWrongWord.id == wrong_word_id,
            UserWrongWord.user_id == user_id
        ).first()
        
        if not wrong_word:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="错题不存在"
            )
        
        db.delete(wrong_word)
        db.commit()
        
        return {"message": "错题删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除错题失败: {str(e)}"
        )

# 错题本 - 标记为已复习
@router.patch("/wrong-words/{wrong_word_id}/review")
async def mark_wrong_word_as_reviewed(
    wrong_word_id: str,
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        wrong_word = db.query(UserWrongWord).filter(
            UserWrongWord.id == wrong_word_id,
            UserWrongWord.user_id == user_id
        ).first()
        
        if not wrong_word:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="错题不存在"
            )
        
        wrong_word.is_reviewed = True
        db.commit()
        
        return {"message": "错题已标记为已复习"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"标记错题为已复习失败: {str(e)}"
        )

# 获取单词统计数据
@router.get("/word-stats", response_model=WordStatsResponse)
async def get_word_stats(
    db: Annotated[Session, Depends(get_db)],
    user_id: str = Depends(get_current_user_id)
):
    try:
        # 获取生词数量
        word_book_count = db.query(UserWordBook).filter(
            UserWordBook.user_id == user_id
        ).count()
        
        # 获取错题数量
        wrong_word_count = db.query(UserWrongWord).filter(
            UserWrongWord.user_id == user_id
        ).count()
        
        # 获取待复习错题数量
        pending_review_count = db.query(UserWrongWord).filter(
            UserWrongWord.user_id == user_id,
            UserWrongWord.is_reviewed == False
        ).count()
        
        return WordStatsResponse(
            word_book_count=word_book_count,
            wrong_word_count=wrong_word_count,
            pending_review_count=pending_review_count
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取单词统计数据失败: {str(e)}"
        )
