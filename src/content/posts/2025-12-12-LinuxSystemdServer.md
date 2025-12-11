---
title: Linux Systemd 服务管理
published: 2025-12-12
description: '项目部署到linux上的重要一步'
image: ''
tags: ['部署']
category: '备忘'
draft: false
lang: ''
---

# 命令
## 1. `sudo systemctl daemon-reload`
**作用**：重新加载 systemd 服务配置文件
**使用时机**：当你修改了 `.service` 文件后必须执行
```bash
# 比如你修改了 /etc/systemd/system/flaskapp.service
sudo nano /etc/systemd/system/flaskapp.service
sudo systemctl daemon-reload  # 让 systemd 知道配置变了
```

## 2. `sudo systemctl enable flaskapp`
**作用**：启用服务，让它在系统启动时自动运行
```bash
# 启用服务（开机自启）
sudo systemctl enable flaskapp

# 禁用服务（不开机自启）
sudo systemctl disable flaskapp
```

## 3. `sudo systemctl start flaskapp`
**作用**：立即启动服务
```bash
# 启动服务
sudo systemctl start flaskapp

# 停止服务
sudo systemctl stop flaskapp

# 重启服务
sudo systemctl restart flaskapp
```

## 4. `sudo systemctl status flaskapp`
**作用**：查看服务的运行状态和日志
```bash
# 查看状态
sudo systemctl status flaskapp

# 查看详细日志
sudo journalctl -u flaskapp -f
```

# 工作流

## 第一次设置服务时：
```bash
# 1. 创建服务文件
sudo vim /etc/systemd/system/flaskapp.service

# 2. 重新加载配置（让 systemd 认识新服务）
sudo systemctl daemon-reload

# 3. 启用服务（开机自启）
sudo systemctl enable flaskapp

# 4. 启动服务
sudo systemctl start flaskapp

# 5. 检查状态
sudo systemctl status flaskapp
```

## 日常管理：
```bash
# 查看状态
sudo systemctl status flaskapp

# 重启服务（部署新代码后）
sudo systemctl restart flaskapp

# 停止服务
sudo systemctl stop flaskapp

# 查看日志
sudo journalctl -u flaskapp -f
```

# 服务配置文件
```ini
# /etc/systemd/system/flaskapp.service
[Unit]
Description=Flask Backend Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/flask_backend
Environment=PATH=/root/flask_backend/.venv/bin
ExecStart=/root/flask_backend/.venv/bin/gunicorn -w 2 -b 0.0.0.0:5000 "flaskr:create_app()"
Restart=always

[Install]
WantedBy=multi-user.target
```