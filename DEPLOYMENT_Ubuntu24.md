# WordTap 项目 Ubuntu 24.04 部署文档

## 1. 环境准备

### 1.1 系统要求

- **操作系统**: Ubuntu 24.04 LTS
- **Python**: 3.12 (系统默认)
- **Node.js**: 18.x 或更高版本
- **内存**: 至少 2GB RAM
- **磁盘**: 至少 20GB 可用空间

### 1.2 依赖安装

#### 1.2.1 安装基础工具

# 更新系统包索引

apt update -y && apt upgrade -y

# 安装基础工具

apt install -y git wget curl vim gcc g++ make unzip

# 安装 Python 3.12 开发包

apt install -y python3.12-dev python3-pip python3.12-venv

# 安装 Node.js 18

curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 验证安装版本

python3 --version # 应显示 Python 3.12.x
node --version # 应显示 v18.x.x
npm --version # 应显示相应版本

````

#### 1.2.2 安装数据库

安装使用 MySQL/MariaDB，请按照以下步骤安装：

##### 安装 MariaDB

```bash
# 安装 MariaDB
apt install -y mariadb-server mariadb-client libmariadb-dev

# 启动并设置开机自启
systemctl start mariadb
systemctl enable mariadb

# 验证服务状态
systemctl status mariadb
````

##### 配置数据库

```bash
# 初始化数据库安全设置
# 如果您刚安装好 MySQL，还没有运行推荐的安全配置脚本，这是官方的方法。
mysql_secure_installation
1、ould you like to setup VALIDATE PASSWORD component?
Press y|Y for Yes, any other key for No:

# 登录 MySQL
mysql -u root -p

# 创建数据库和用户
CREATE DATABASE wordtap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wordtap_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON wordtap.* TO 'wordtap_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 1.2.3 安装 Nginx

```bash
# 安装 Nginx
apt install -y nginx

# 启动并设置开机自启
systemctl start nginx
systemctl enable nginx

# 验证服务状态
systemctl status nginx
```

#### 1.2.4 配置防火墙

Ubuntu 24.04 默认使用 UFW（Uncomplicated Firewall），按照以下步骤配置：

```bash
# 启用防火墙
ufw enable

# 开放必要端口
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw allow 22/tcp      # SSH（如果需要远程连接）

# 查看开放端口
ufw status
```

**注意**：

- 8000 端口（后端 API）将通过 Nginx 反向代理访问，无需直接对外暴露
- 3306 端口（MySQL）仅用于本地连接，无需对外暴露

## 2. 后端部署

### 2.1 克隆项目代码

```bash
# 创建项目目录
mkdir -p /opt/wordtap
cd /opt/wordtap

# 克隆代码库
git clone https://github.com/wh19910805/wordTap.git .
```

### 2.2 配置后端

#### 2.2.1 创建环境变量文件

```bash
# 进入后端目录
cd backend

# 复制环境变量示例文件
cp .env.example .env

# 编辑环境变量文件
vim .env
```

#### 2.2.2 配置环境变量

根据实际情况修改 `.env` 文件中的配置：

```env
# 应用配置
APP_NAME=WordTap
APP_ENV=production
APP_DEBUG=False
APP_URL=http://your-domain.com

# 数据库配置
# SQLite 配置（默认，推荐生产环境使用）
DATABASE_URL=sqlite:///./wordtap.db

# 或 MySQL/MariaDB 配置
# DATABASE_URL=mysql+pymysql://wordtap_user:your_secure_password@localhost/wordtap

# 安全配置
SECRET_KEY=your_secure_secret_key  # 建议使用 openssl rand -hex 32 生成
ACCESS_TOKEN_EXPIRE_MINUTES=43200  # 30天

# CORS 配置（允许前端域名访问）
CORS_ORIGINS=http://your-domain.com,https://your-domain.com

# 日志配置
LOG_LEVEL=info
```

### 2.3 安装 Python 依赖

```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 升级 pip
pip install --upgrade pip

# 安装依赖
pip install -r requirements.txt
```

### 2.4 初始化数据库

```bash
# 执行数据库迁移（如果使用 Alembic）
alembic upgrade head

# 初始化数据
python init_data.py
```

### 2.5 测试后端服务

```bash
# 启动开发服务器测试
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

在浏览器中访问 `http://your-server-ip:8000/api/courses`，如果返回课程列表，则后端服务运行正常。按 `Ctrl+C` 停止测试服务器。

### 2.6 配置 Systemd 服务

创建 Systemd 服务文件，以便管理后端服务：

```bash
cat > /etc/systemd/system/wordtap-backend.service << EOF
[Unit]
Description=WordTap Backend Service
After=network.target

[Service]
User=root
WorkingDirectory=/opt/wordtap/backend
ExecStart=/opt/wordtap/backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000 main:app
Restart=on-failure
RestartSec=5
Environment="PYTHONPATH=/opt/wordtap/backend"

[Install]
WantedBy=multi-user.target
EOF
```

启动并启用服务：

```bash
systemctl daemon-reload
systemctl start wordtap-backend
systemctl enable wordtap-backend

# 查看服务状态
systemctl status wordtap-backend
```

## 3. 前端部署

### 3.1 安装前端依赖

```bash
# 返回项目根目录
cd /opt/wordtap

# 安装依赖
npm install
```

### 3.2 配置前端

编辑 `.env` 文件，配置 API 地址：

```bash
# 如果没有 .env 文件，创建一个
cp .env.example .env

# 编辑 .env 文件
vim .env
```

配置内容：

```env
# 生产环境配置
VITE_API_BASE_URL=/api
```

**注意**：使用相对路径 `/api`，配合 Nginx 代理配置，避免跨域问题。

### 3.3 构建前端

```bash
# 构建生产版本
npm run build
```

构建完成后，静态文件将生成在 `dist` 目录中。

### 3.4 部署前端静态文件

```bash
# 创建 Nginx 站点目录
mkdir -p /var/www/wordtap

# 复制静态文件
cp -r dist/* /var/www/wordtap/

# 设置权限
chown -R www-data:www-data /var/www/wordtap/
```

## 4. 配置 Nginx

### 4.1 创建 Nginx 配置文件

```bash
cat > /etc/nginx/conf.d/wordtap.conf << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/wordtap;
    index index.html;

    # 前端静态资源
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # 日志配置
    access_log /var/log/nginx/wordtap_access.log;
    error_log /var/log/nginx/wordtap_error.log;
}
EOF
```

### 4.2 测试 Nginx 配置

```bash
# 测试配置是否正确
nginx -t

# 重新加载 Nginx
systemctl reload nginx
```

## 5. 配置 HTTPS（推荐）

使用 Let's Encrypt 免费证书配置 HTTPS：

### 5.1 安装 Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 5.2 申请 SSL 证书

```bash
# 申请证书
certbot --nginx -d your-domain.com -d www.your-domain.com
```

按照提示完成证书申请，Certbot 会自动配置 Nginx 以使用 HTTPS。

### 5.3 配置证书自动续期

Certbot 会自动配置系统定时器，定期检查并续期证书。您可以通过以下命令测试自动续期：

```bash
certbot renew --dry-run
```

## 6. 部署验证

### 6.1 验证前端访问

在浏览器中访问 `http://your-domain.com` 或 `https://your-domain.com`，应该能看到 WordTap 的首页。

### 6.2 验证后端 API

访问 `http://your-domain.com/api/courses` 或 `https://your-domain.com/api/courses`，应该能返回课程列表。

### 6.3 验证完整功能

1. 注册/登录账号
2. 浏览课程
3. 加入课程
4. 开始学习
5. 查看学习统计

## 7. 监控与维护

### 7.1 日志管理

#### 查看后端日志

```bash
systemctl status wordtap-backend -f
# 或查看完整日志
journalctl -u wordtap-backend -f
```

#### 查看 Nginx 日志

```bash
# 访问日志
tail -f /var/log/nginx/wordtap_access.log

# 错误日志
tail -f /var/log/nginx/wordtap_error.log
```

### 7.2 定期备份

#### 备份数据库

```bash
# SQLite 备份
mkdir -p /opt/wordtap/backup
cp /opt/wordtap/backend/wordtap.db /opt/wordtap/backup/wordtap_db_$(date +%Y%m%d).bak

# MySQL 备份
# mysqldump -u wordtap_user -p wordtap > /opt/wordtap/backup/wordtap_db_$(date +%Y%m%d).sql
```

#### 备份代码和配置

```bash
tar -czf /opt/wordtap/backup/wordtap_$(date +%Y%m%d).tar.gz /opt/wordtap --exclude=venv --exclude=node_modules
```

### 7.3 定期更新

```bash
# 更新系统包
apt update -y && apt upgrade -y

# 更新项目代码
cd /opt/wordtap
git pull

# 更新前端依赖
npm install

# 更新后端依赖
cd backend
source venv/bin/activate
pip install --upgrade -r requirements.txt

# 重新构建前端
cd ..
npm run build
cp -r dist/* /var/www/wordtap/

# 重启服务
systemctl restart wordtap-backend
systemctl reload nginx
```

## 8. 常见问题排查

### 8.1 后端服务无法启动

- 检查端口是否被占用：`ss -tlnp | grep 8000`
- 查看服务日志：`journalctl -u wordtap-backend -f`
- 检查依赖是否安装完整：`pip list`
- 检查环境变量配置：`cat .env`

### 8.2 前端无法访问后端 API

- 检查 Nginx 代理配置：`cat /etc/nginx/conf.d/wordtap.conf`
- 检查后端服务是否在运行：`systemctl status wordtap-backend`
- 检查 CORS 配置：`cat backend/.env | grep CORS`
- 查看浏览器控制台的网络请求和错误信息

### 8.3 Nginx 404 错误

- 检查 Nginx 配置的根目录：`cat /etc/nginx/conf.d/wordtap.conf | grep root`
- 检查静态文件是否存在：`ls -la /var/www/wordtap/`
- 检查 `try_files` 配置是否正确

### 8.4 数据库连接错误

- 检查数据库配置：`cat backend/.env | grep DATABASE_URL`
- 检查数据库服务是否运行：`systemctl status mariadb`
- 检查数据库用户权限：`mysql -u wordtap_user -p -e "SHOW GRANTS;"`

## 9. 性能优化

### 9.1 后端优化

- 调整 Gunicorn 进程数：根据服务器 CPU 核心数调整 `gunicorn` 命令中的 `-w` 参数（建议设置为 CPU 核心数 × 2 + 1）
- 启用 uvicorn 的 worker 类：`-k uvicorn.workers.UvicornWorker`
- 配置合适的日志级别：`LOG_LEVEL=warning`

### 9.2 前端优化

- 确保 Nginx 配置了 Gzip 压缩
- 启用 HTTP/2（Certbot 配置 HTTPS 时会自动启用）
- 配置合适的缓存策略：为静态资源设置合理的 `expires` 头

### 9.3 Nginx 优化

在 `/etc/nginx/nginx.conf` 的 `http` 块中添加以下配置：

```nginx
http {
    # ... 其他配置 ...

    # 启用 Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript text/javascript;

    # 启用 HTTP/2
    http2 on;

    # 调整 worker 进程数
    worker_processes auto;
    worker_connections 1024;

    # ... 其他配置 ...
}
```

## 10. 安全加固

### 10.1 系统安全

- 定期更新系统和软件包：`apt update -y && apt upgrade -y`
- 启用防火墙，只开放必要端口：`ufw status`
- 禁用 root 远程登录：编辑 `/etc/ssh/sshd_config`，设置 `PermitRootLogin no`
- 使用 SSH 密钥登录，禁用密码登录：编辑 `/etc/ssh/sshd_config`，设置 `PasswordAuthentication no`

### 10.2 应用安全

- 使用 HTTPS 加密传输
- 配置强密码策略
- 定期更新依赖，修复安全漏洞：`pip list --outdated` 和 `npm outdated`
- 配置适当的 CORS 策略，只允许信任的域名访问
- 对用户输入进行验证和过滤
- 定期备份数据

## 11. 扩展部署

### 11.1 使用 Docker 部署（可选）

如果您希望使用 Docker 部署 WordTap，可以创建以下 `docker-compose.yml` 文件：

```yaml
version: "3.8"

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./wordtap.db
      - SECRET_KEY=your_secure_secret_key
    volumes:
      - ./backend:/app
    restart: always

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    volumes:
      - ./dist:/usr/share/nginx/html
    restart: always
```

然后使用以下命令启动服务：

```bash
docker-compose up -d
```

## 12. 总结

本部署文档详细介绍了在 Ubuntu 24.04 LTS 上部署 WordTap 项目的完整流程，包括：

1. 环境准备和依赖安装
2. 后端部署和配置
3. 前端部署和构建
4. Nginx 配置和反向代理
5. HTTPS 配置
6. 部署验证和监控
7. 常见问题排查和性能优化
8. 安全加固建议

按照本文档的步骤操作，可以确保 WordTap 项目在 Ubuntu 24.04 环境中稳定、安全地运行。

## 13. 联系方式

- 项目地址：https://github.com/wh19910805/wordTap
- 问题反馈：https://github.com/wh19910805/wordTap/issues

---

部署文档版本：v1.0
更新日期：2026-01-21
适用系统：Ubuntu 24.04 LTS
