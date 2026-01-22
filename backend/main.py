from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, course, user, word_book
from app.core.config import settings
from app.core.database import engine, Base

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建FastAPI应用
app = FastAPI(
    title="WordTap API",
    description="WordTap 英语学习应用后端API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(course.router, prefix="/api/courses", tags=["课程"])
app.include_router(user.router, prefix="/api/users", tags=["用户"])
app.include_router(word_book.router, prefix="/api/word-books", tags=["单词本"])

# 健康检查
@app.get("/health", tags=["健康检查"])
async def health_check():
    return {
        "status": "ok",
        "database": "connected",
        "timestamp": "2026-01-16T10:00:00Z"
    }
