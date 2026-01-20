#!/usr/bin/env python3
"""
数据初始化脚本：将前端public/dicts/en下的课程和课时数据导入到数据库中
支持article、word和xingrong-courses三种类型的数据
"""

import os
import json
import sys
from datetime import datetime
import uuid

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import engine, Base, get_db
from app.models.course import Course, Lesson

# 课程配置映射
COURSE_CONFIG = {
    "NCE_1": {
        "title": "新概念英语1",
        "description": "新概念英语第一册，适合英语初学者",
        "level": "beginner",
        "category": "classic"
    },
    "NCE_2": {
        "title": "新概念英语2",
        "description": "新概念英语第二册，适合英语基础学习者",
        "level": "intermediate",
        "category": "classic"
    },
    "NCE_3": {
        "title": "新概念英语3",
        "description": "新概念英语第三册，适合英语中级学习者",
        "level": "intermediate",
        "category": "classic"
    },
    "NCE_4": {
        "title": "新概念英语4",
        "description": "新概念英语第四册，适合英语高级学习者",
        "level": "advanced",
        "category": "classic"
    }
}

# 单词课程配置映射
WORD_COURSE_CONFIG = {
    "Top50Prepositions": {
        "title": "英语介词50例",
        "description": "英语中最常用的50个介词及用法",
        "level": "beginner",
        "category": "vocabulary"
    },
    "NCE_1": {
        "title": "新概念英语1词汇",
        "description": "新概念英语第一册核心词汇",
        "level": "beginner",
        "category": "vocabulary"
    },
    "NCE_2": {
        "title": "新概念英语2词汇",
        "description": "新概念英语第二册核心词汇",
        "level": "intermediate",
        "category": "vocabulary"
    },
    "NCE_3": {
        "title": "新概念英语3词汇",
        "description": "新概念英语第三册核心词汇",
        "level": "intermediate",
        "category": "vocabulary"
    },
    "NCE_4": {
        "title": "新概念英语4词汇",
        "description": "新概念英语第四册核心词汇",
        "level": "advanced",
        "category": "vocabulary"
    },
    "Top1500NounWords": {
        "title": "高频名词1500个",
        "description": "英语中最常用的1500个名词",
        "level": "intermediate",
        "category": "vocabulary"
    },
    "Top1000VerbWords": {
        "title": "高频动词1000个",
        "description": "英语中最常用的1000个动词",
        "level": "intermediate",
        "category": "vocabulary"
    },
    "Top500AdjectiveWords": {
        "title": "高频形容词500个",
        "description": "英语中最常用的500个形容词",
        "level": "intermediate",
        "category": "vocabulary"
    },
    "Top250AdverbWords": {
        "title": "高频副词250个",
        "description": "英语中最常用的250个副词",
        "level": "intermediate",
        "category": "vocabulary"
    }
}

# 情景课程配置映射
XINGRONG_COURSE_CONFIG = {
    "01": {
        "title": "基础情景对话1",
        "description": "日常基础情景对话，适合初学者",
        "level": "beginner",
        "category": "conversation"
    },
    "02": {
        "title": "基础情景对话2",
        "description": "日常基础情景对话，适合初学者",
        "level": "beginner",
        "category": "conversation"
    },
    "03": {
        "title": "基础情景对话3",
        "description": "日常基础情景对话，适合初学者",
        "level": "beginner",
        "category": "conversation"
    },
    "04": {
        "title": "基础情景对话4",
        "description": "日常基础情景对话，适合初学者",
        "level": "beginner",
        "category": "conversation"
    },
    "05": {
        "title": "基础情景对话5",
        "description": "日常基础情景对话，适合初学者",
        "level": "beginner",
        "category": "conversation"
    },
    "06": {
        "title": "基础情景对话6",
        "description": "日常基础情景对话，适合初学者",
        "level": "beginner",
        "category": "conversation"
    },
    "07": {
        "title": "基础情景对话7",
        "description": "日常基础情景对话，适合初学者",
        "level": "beginner",
        "category": "conversation"
    },
    "08": {
        "title": "基础情景对话8",
        "description": "日常基础情景对话，适合初学者",
        "level": "beginner",
        "category": "conversation"
    },
    "09": {
        "title": "基础情景对话9",
        "description": "日常基础情景对话，适合初学者",
        "level": "beginner",
        "category": "conversation"
    },
    "10": {
        "title": "基础情景对话10",
        "description": "日常基础情景对话，适合初学者",
        "level": "beginner",
        "category": "conversation"
    }
}

# 数据文件目录
DATA_DIR = {
    "article": "f:\\桌面0228\\wordTap\\public\\dicts\\en\\article",
    "word": "f:\\桌面0228\\wordTap\\public\\dicts\\en\\word",
    "xingrong": "f:\\桌面0228\\wordTap\\public\\dicts\\en\\xingrong-courses\\data\\courses"
}

def init_courses(db: Session):
    """初始化课程数据"""
    print("开始初始化课程数据...")
    
    # 获取所有数据文件
    data_files = [f for f in os.listdir(DATA_DIR) if f.endswith(".json")]
    
    for file_name in data_files:
        # 提取课程代码（如NCE_1）
        course_code = file_name.split(".")[0]
        
        if course_code not in COURSE_CONFIG:
            print(f"跳过未知课程: {course_code}")
            continue
        
        # 检查课程是否已存在
        existing_course = db.query(Course).filter(Course.title == COURSE_CONFIG[course_code]["title"]).first()
        if existing_course:
            print(f"课程已存在: {COURSE_CONFIG[course_code]['title']}")
            continue
        
        # 创建课程
        course_id = f"course_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
        course = Course(
            id=course_id,
            title=COURSE_CONFIG[course_code]["title"],
            description=COURSE_CONFIG[course_code]["description"],
            level=COURSE_CONFIG[course_code]["level"],
            category=COURSE_CONFIG[course_code]["category"],
            is_active=True
        )
        
        db.add(course)
        db.commit()
        db.refresh(course)
        
        print(f"创建课程: {course.title} (ID: {course.id})")
        
        # 初始化课时数据
        init_lessons(db, course, os.path.join(DATA_DIR, file_name))

def init_lessons(db: Session, course: Course, data_file: str, lesson_type: str = "article"):
    """初始化课时数据，支持不同类型的课程"""
    print(f"  开始初始化{course.title}的课时数据...")
    
    with open(data_file, "r", encoding="utf-8") as f:
        lessons_data = json.load(f)
    
    lesson_number = 1
    total_lessons = 1  # 默认为1个课时
    
    if lesson_type == "article":
        # 文章类型：每个条目是一个课时
        total_lessons = len(lessons_data)
        
        for lesson_data in lessons_data:
            # 计算课时内容的行数
            text_lines = lesson_data["text"].strip().split("\n")
            total_lines = len(text_lines)
            
            # 构建课时内容
            content = {
                "lines": text_lines,
                "text": lesson_data["text"],
                "textTranslate": lesson_data["textTranslate"],
                "audioSrc": lesson_data["audioSrc"],
                "lrcPosition": lesson_data.get("lrcPosition", [])
            }
            
            # 创建课时
            lesson_id = f"lesson_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
            lesson = Lesson(
                id=lesson_id,
                course_id=course.id,
                lesson_number=lesson_number,
                title=lesson_data["title"],
                content=content,
                total_lines=total_lines
            )
            
            db.add(lesson)
            
            # 每10个课时提交一次，避免事务过大
            if lesson_number % 10 == 0 or lesson_number == total_lessons:
                db.commit()
                print(f"  已导入课时: {lesson_number}/{total_lessons}")
            
            lesson_number += 1
            
    elif lesson_type == "word":
        # 单词类型：整个文件是一个课时
        lesson_id = f"lesson_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
        
        # 构建课时内容
        content = {
            "words": lessons_data,
            "totalWords": len(lessons_data)
        }
        
        lesson = Lesson(
            id=lesson_id,
            course_id=course.id,
            lesson_number=1,
            title=f"{course.title} - 单词列表",
            content=content,
            total_lines=len(lessons_data)  # 将单词数量作为行数
        )
        
        db.add(lesson)
        db.commit()
        print(f"  已导入单词: {len(lessons_data)}个")
        
    elif lesson_type == "xingrong":
        # 情景对话类型：整个文件是一个课时
        lesson_id = f"lesson_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
        
        # 构建课时内容
        content = {
            "sentences": lessons_data,
            "totalSentences": len(lessons_data)
        }
        
        lesson = Lesson(
            id=lesson_id,
            course_id=course.id,
            lesson_number=1,
            title=f"{course.title} - 情景对话",
            content=content,
            total_lines=len(lessons_data)  # 将句子数量作为行数
        )
        
        db.add(lesson)
        db.commit()
        print(f"  已导入句子: {len(lessons_data)}个")
    
    # 更新课程的总课时数
    course.total_lessons = total_lessons
    db.commit()
    
    print(f"  完成{course.title}的课时数据初始化，共导入{total_lessons}个课时")

def init_word_courses(db: Session):
    """初始化单词课程数据"""
    print("开始初始化单词课程数据...")
    
    # 检查数据目录是否存在
    if not os.path.exists(DATA_DIR["word"]):
        print(f"错误: 单词数据目录不存在: {DATA_DIR['word']}")
        return
    
    # 获取所有单词数据文件
    data_files = [f for f in os.listdir(DATA_DIR["word"]) if f.endswith(".json")]
    
    for file_name in data_files:
        # 提取课程代码
        course_code = file_name.split(".")[0]
        
        # 获取课程配置，如果不存在则使用默认配置
        if course_code in WORD_COURSE_CONFIG:
            config = WORD_COURSE_CONFIG[course_code]
        else:
            # 使用默认配置
            config = {
                "title": course_code,
                "description": f"单词课程: {course_code}",
                "level": "intermediate",
                "category": "vocabulary"
            }
            print(f"使用默认配置导入单词课程: {course_code}")
        
        # 检查课程是否已存在
        existing_course = db.query(Course).filter(Course.title == config["title"]).first()
        if existing_course:
            print(f"单词课程已存在: {config['title']}")
            continue
        
        # 创建课程
        course_id = f"course_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
        course = Course(
            id=course_id,
            title=config["title"],
            description=config["description"],
            level=config["level"],
            category=config["category"],
            is_active=True
        )
        
        db.add(course)
        db.commit()
        db.refresh(course)
        
        print(f"创建单词课程: {course.title} (ID: {course.id})")
        
        # 初始化课时数据
        init_lessons(db, course, os.path.join(DATA_DIR["word"], file_name), lesson_type="word")

def init_xingrong_courses(db: Session):
    """初始化情景课程数据"""
    print("开始初始化情景课程数据...")
    
    # 检查数据目录是否存在
    if not os.path.exists(DATA_DIR["xingrong"]):
        print(f"错误: 情景课程数据目录不存在: {DATA_DIR['xingrong']}")
        return
    
    # 获取所有情景课程数据文件
    data_files = [f for f in os.listdir(DATA_DIR["xingrong"]) if f.endswith(".json")]
    
    for file_name in data_files:
        # 提取课程代码（去掉.json）
        course_code = file_name.split(".")[0]
        
        # 获取课程配置，如果不存在则使用默认配置
        if course_code in XINGRONG_COURSE_CONFIG:
            config = XINGRONG_COURSE_CONFIG[course_code]
        else:
            # 使用默认配置
            config = {
                "title": f"基础情景对话{course_code}",
                "description": f"日常基础情景对话{course_code}，适合初学者",
                "level": "beginner",
                "category": "conversation"
            }
            print(f"使用默认配置导入情景课程: {course_code}")
        
        # 检查课程是否已存在
        existing_course = db.query(Course).filter(Course.title == config["title"]).first()
        if existing_course:
            print(f"情景课程已存在: {config['title']}")
            continue
        
        # 创建课程
        course_id = f"course_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
        course = Course(
            id=course_id,
            title=config["title"],
            description=config["description"],
            level=config["level"],
            category=config["category"],
            is_active=True
        )
        
        db.add(course)
        db.commit()
        db.refresh(course)
        
        print(f"创建情景课程: {course.title} (ID: {course.id})")
        
        # 初始化课时数据
        init_lessons(db, course, os.path.join(DATA_DIR["xingrong"], file_name), lesson_type="xingrong")

def init_courses(db: Session):
    """初始化文章课程数据"""
    print("开始初始化文章课程数据...")
    
    # 检查数据目录是否存在
    if not os.path.exists(DATA_DIR["article"]):
        print(f"错误: 文章数据目录不存在: {DATA_DIR['article']}")
        return
    
    # 获取所有数据文件
    data_files = [f for f in os.listdir(DATA_DIR["article"]) if f.endswith(".json")]
    
    for file_name in data_files:
        # 提取课程代码（如NCE_1）
        course_code = file_name.split(".")[0]
        
        if course_code not in COURSE_CONFIG:
            print(f"跳过未知课程: {course_code}")
            continue
        
        # 检查课程是否已存在
        existing_course = db.query(Course).filter(Course.title == COURSE_CONFIG[course_code]["title"]).first()
        if existing_course:
            print(f"课程已存在: {COURSE_CONFIG[course_code]['title']}")
            continue
        
        # 创建课程
        course_id = f"course_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
        course = Course(
            id=course_id,
            title=COURSE_CONFIG[course_code]["title"],
            description=COURSE_CONFIG[course_code]["description"],
            level=COURSE_CONFIG[course_code]["level"],
            category=COURSE_CONFIG[course_code]["category"],
            is_active=True
        )
        
        db.add(course)
        db.commit()
        db.refresh(course)
        
        print(f"创建课程: {course.title} (ID: {course.id})")
        
        # 初始化课时数据
        init_lessons(db, course, os.path.join(DATA_DIR["article"], file_name), lesson_type="article")

def main():
    """主函数"""
    print("=== 数据初始化脚本 ===")
    print(f"当前时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # 创建数据库会话
    db = next(get_db())
    
    try:
        # 初始化文章课程数据
        init_courses(db)
        
        # 初始化单词课程数据
        init_word_courses(db)
        
        # 初始化情景课程数据
        init_xingrong_courses(db)
        
        print()
        print("=== 数据初始化完成 ===")
        
    except Exception as e:
        print(f"错误: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
