from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # 应用设置
    APP_NAME: str = "WordTap API"
    DEBUG: bool = True
    
    # 数据库设置
    DATABASE_URL: str = "mysql+pymysql://root:mysqlpass@localhost/wordtap_db"
    
    # JWT设置
    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60  # 30天
    
    # CORS设置
    CORS_ORIGINS: List[str] = ["*"]  # 生产环境应限制来源
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
