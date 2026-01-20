-- WordTap 数据库结构

CREATE DATABASE IF NOT EXISTS wordtap_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE wordtap_db;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) NULL,
  nickname VARCHAR(50) NULL,
  gender ENUM('male', 'female', 'unknown') DEFAULT 'unknown',
  birthdate DATE NULL,
  phone VARCHAR(20) NULL,
  country VARCHAR(50) NULL,
  language VARCHAR(20) DEFAULT 'zh-CN',
  timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_code VARCHAR(20) NULL,
  verification_expire TIMESTAMP NULL,
  last_login_ip VARCHAR(45) NULL,
  login_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户统计表
CREATE TABLE IF NOT EXISTS user_stats (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
  user_id VARCHAR(100) NOT NULL,
  streak INT DEFAULT 0,
  total_check_in INT DEFAULT 0,
  word_count INT DEFAULT 0,
  study_time_today INT DEFAULT 0,
  study_time_week INT DEFAULT 0,
  study_time_month INT DEFAULT 0,
  study_time_year INT DEFAULT 0,
  study_time_total INT DEFAULT 0,
  last_study_date DATE NULL,
  completed_lessons INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  wrong_answers INT DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0.00,
  xp_points INT DEFAULT 0,
  level INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户等级表
CREATE TABLE IF NOT EXISTS user_levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  level INT DEFAULT 1,
  xp_required INT DEFAULT 100,
  current_xp INT DEFAULT 0,
  next_level_xp INT DEFAULT 100,
  level_up_reward JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户成就表
CREATE TABLE IF NOT EXISTS user_achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  achievement_id VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  achievement_type ENUM('learning', 'social', 'special') DEFAULT 'learning',
  rarity ENUM('common', 'rare', 'epic', 'legendary') DEFAULT 'common',
  points INT DEFAULT 0,
  unlocked_at TIMESTAMP NULL,
  is_unlocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_achievement_id (achievement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 课程表
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  category VARCHAR(50),
  sub_category VARCHAR(50) NULL,
  difficulty ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
  language VARCHAR(20) DEFAULT 'en',
  tags TEXT,
  thumbnail VARCHAR(255) NULL,
  total_lessons INT DEFAULT 0,
  total_words INT DEFAULT 0,
  estimated_hours DECIMAL(5,2) DEFAULT 0.00,
  completion_rate DECIMAL(5,2) DEFAULT 0.00,
  is_public BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_category (category),
  INDEX idx_sub_category (sub_category),
  INDEX idx_difficulty (difficulty),
  INDEX idx_is_public (is_public),
  INDEX idx_is_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 课时表
CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(100) PRIMARY KEY,
  course_id VARCHAR(100) NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  title VARCHAR(200),
  description TEXT NULL,
  `order` INT DEFAULT 0,
  duration INT DEFAULT 0,
  word_count INT DEFAULT 0,
  completed_at TIMESTAMP NULL,
  best_time INT NULL,
  attempt_count INT DEFAULT 0,
  last_study_time TIMESTAMP NULL,
  is_locked BOOLEAN DEFAULT FALSE,
  unlock_condition JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 学习进度表
CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  course_id VARCHAR(100) NOT NULL,
  lesson_id VARCHAR(100) NOT NULL,
  sentence_index INT NOT NULL,
  input_text TEXT,
  is_correct BOOLEAN DEFAULT FALSE,
  accuracy DECIMAL(5,2) DEFAULT 0.00,
  study_time INT DEFAULT 0,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_lesson_id (lesson_id),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 词汇表
CREATE TABLE IF NOT EXISTS vocabulary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  word VARCHAR(100) NOT NULL,
  pronunciation VARCHAR(100) NULL,
  definition TEXT NOT NULL,
  example_sentences TEXT NULL,
  part_of_speech VARCHAR(50) NULL,
  difficulty ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
  frequency INT DEFAULT 0,
  course_id VARCHAR(100) NULL,
  lesson_id VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  INDEX idx_word (word),
  INDEX idx_course_id (course_id),
  INDEX idx_lesson_id (lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户词汇掌握表
CREATE TABLE IF NOT EXISTS user_vocabulary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  word_id INT NOT NULL,
  word VARCHAR(100) NOT NULL,
  mastery_level ENUM('unlearned', 'learning', 'mastered') DEFAULT 'unlearned',
  review_count INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  wrong_count INT DEFAULT 0,
  last_reviewed TIMESTAMP NULL,
  next_review TIMESTAMP NULL,
  review_interval INT DEFAULT 0,
  ease_factor DECIMAL(3,2) DEFAULT 2.5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (word_id) REFERENCES vocabulary(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_word (word),
  INDEX idx_mastery_level (mastery_level),
  INDEX idx_next_review (next_review)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 设置表
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_key (user_id, `key`),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 系统设置表
CREATE TABLE IF NOT EXISTS system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL,
  value TEXT,
  description VARCHAR(255) NULL,
  setting_type ENUM('general', 'security', 'notifications', 'marketing') DEFAULT 'general',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_key (`key`),
  INDEX idx_setting_type (setting_type),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  notification_type ENUM('system', 'learning', 'marketing', 'achievement') DEFAULT 'system',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_notification_type (notification_type),
  INDEX idx_is_read (is_read),
  INDEX idx_priority (priority),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 营销活动表
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  campaign_type ENUM('discount', 'promotion', 'event', 'newsletter') DEFAULT 'promotion',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  discount_percentage DECIMAL(5,2) NULL,
  discount_amount DECIMAL(10,2) NULL,
  coupon_code VARCHAR(50) NULL,
  max_uses INT DEFAULT 0,
  current_uses INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  target_audience JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_campaign_type (campaign_type),
  INDEX idx_is_active (is_active),
  INDEX idx_start_date (start_date),
  INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 优惠券表
CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR(100) PRIMARY KEY,
  campaign_id VARCHAR(100) NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2) NULL,
  max_discount DECIMAL(10,2) NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  user_id VARCHAR(100) NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_campaign_id (campaign_id),
  INDEX idx_user_id (user_id),
  INDEX idx_code (code),
  INDEX idx_is_used (is_used),
  INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户行为记录表
CREATE TABLE IF NOT EXISTS user_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  activity_type ENUM('login', 'logout', 'course_start', 'course_complete', 'lesson_start', 'lesson_complete', 'word_learn', 'word_review', 'achievement_unlock', 'notification_read', 'coupon_use') NOT NULL,
  activity_data JSON NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_activity_type (activity_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 应用崩溃日志表
CREATE TABLE IF NOT EXISTS app_crashes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NULL,
  error_type VARCHAR(100) NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT NULL,
  user_agent TEXT NULL,
  browser_info JSON NULL,
  os_info JSON NULL,
  device_info JSON NULL,
  page_url VARCHAR(255) NULL,
  referrer_url VARCHAR(255) NULL,
  session_id VARCHAR(100) NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_error_type (error_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户反馈表
CREATE TABLE IF NOT EXISTS user_feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NULL,
  feedback_type ENUM('bug', 'feature_request', 'suggestion', 'complaint', 'other') DEFAULT 'other',
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
  screenshot_url VARCHAR(255) NULL,
  attachments JSON NULL,
  user_agent TEXT NULL,
  browser_info JSON NULL,
  os_info JSON NULL,
  device_info JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_feedback_type (feedback_type),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 学习计划表
CREATE TABLE IF NOT EXISTS study_plans (
  id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  target_goal VARCHAR(100) NULL,
  target_date DATE NULL,
  current_progress DECIMAL(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 学习计划任务表
CREATE TABLE IF NOT EXISTS study_plan_tasks (
  id VARCHAR(100) PRIMARY KEY,
  study_plan_id VARCHAR(100) NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  task_type ENUM('course', 'lesson', 'word_review', 'daily_goal') DEFAULT 'daily_goal',
  task_data JSON NOT NULL,
  target_value INT DEFAULT 0,
  current_value INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  due_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (study_plan_id) REFERENCES study_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_study_plan_id (study_plan_id),
  INDEX idx_user_id (user_id),
  INDEX idx_task_type (task_type),
  INDEX idx_is_completed (is_completed),
  INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

