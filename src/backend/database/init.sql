-- CampusPool Database Initialization Script
-- Created: 2025-11-22
-- Version: 1.0

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT '用户邮箱',
  password VARCHAR(255) NOT NULL COMMENT 'bcrypt 加密密码',
  name VARCHAR(100) NOT NULL COMMENT '用户姓名',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id CHAR(36) PRIMARY KEY COMMENT '用户ID',
  name VARCHAR(100) NOT NULL COMMENT '显示名称',
  college VARCHAR(200) COMMENT '学校名称',
  has_car BOOLEAN DEFAULT FALSE COMMENT '是否有车',
  car_model VARCHAR(100) COMMENT '车型',
  car_color VARCHAR(50) COMMENT '车辆颜色',
  car_year VARCHAR(10) COMMENT '车辆年份',
  car_license VARCHAR(50) COMMENT '车牌号',
  bio TEXT COMMENT '个人简介',
  profile_picture VARCHAR(500) COMMENT '头像URL',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户资料表';

-- 3. Carpool Requests Table
CREATE TABLE IF NOT EXISTS carpool_requests (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  user_id CHAR(36) NOT NULL COMMENT '发布者ID',
  user_name VARCHAR(100) NOT NULL COMMENT '发布者姓名',
  user_picture VARCHAR(500) COMMENT '发布者头像',
  type ENUM('offer', 'request') NOT NULL DEFAULT 'request' COMMENT '类型：offer=提供, request=请求',
  destination VARCHAR(200) NOT NULL COMMENT '目的地',
  date DATE NOT NULL COMMENT '日期',
  time TIME NOT NULL COMMENT '时间',
  seats INT NOT NULL COMMENT '可用座位数',
  notes TEXT COMMENT '备注',
  responses JSON COMMENT '响应用户ID数组',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_date (date),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拼车请求表';

-- 4. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id VARCHAR(100) PRIMARY KEY COMMENT '对话ID',
  participants JSON NOT NULL COMMENT '参与者ID数组',
  status ENUM('pending', 'accepted', 'denied') DEFAULT 'pending' COMMENT '对话状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='对话表';

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  conversation_id VARCHAR(100) NOT NULL COMMENT '对话ID',
  sender_id CHAR(36) NOT NULL COMMENT '发送者ID',
  content TEXT NOT NULL COMMENT '消息内容',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';

SET FOREIGN_KEY_CHECKS = 1;
