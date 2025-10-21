---
title: python相关备忘
published: 2025-10-16
description: '无关语法'
image: ''
tags: [python]
category: '备忘'
draft: false 
lang: ''
---
**官网**:https://www.python.org/
# python自带的虚拟环境
## 创建虚拟环境
```bash
python -m venv <环境名称>
```
他会在你的当前目录下创建一个对应名称的文件夹环境存在的地方
## 激活虚拟环境
```bash
# Windows
<环境名称>\Scripts\activate
# macOS/Linux
source <环境名称>/bin/activate
```
## 退出虚拟环境
```bash
deactivate
```
# Pip相关
```bash
pip list
# 生成环境库的列表
pip freeze
# 结果输出到文件requirements.txt
#把requirements.txt里的依赖全安装下来
pip install -r requirements.txt
```
