---
title: 我的世界服务器部署
published: 2026-01-17
description: '也维护了这么久服务器了，踩的坑也不少'
image: ''
tags: [minecraft]
category: '业务应用'
draft: false
lang: ''
---
# 部署
使用docker部署，这里有个项目非常方便，写个compose直接就都给你弄好了。
这样暴露的面是最小的，而且服务器不直接跑在裸机上安全性上是最好的。
::github{repo="itzg/docker-minecraft-server"}
一个比较典型的docker-compose
具体所有的详细配置可以看[项目文档](https://docker-minecraft-server.readthedocs.io/en/latest/)
这个[网站](https://setupmc.com/java-server/)可以用交互的方式生成compose
```yml
services:
  mc:
    image: itzg/minecraft-server:latest
    tty: true
    stdin_open: true
    ports:
      - "25565:25565"
    environment:
      EULA: "TRUE"
      TYPE: "FABRIC"
      VERSION: "1.21.11"
      MEMORY: "4G"
      MOTD: "1.21.11fabric"
      TZ: "Asia/Shanghai"
      USE_AIKAR_FLAGS: "true"  
    volumes:
      - "./data:/data"
```
# rcon
用这个项目部署的服务器，自带了rcon-cli，在容器内配置了环境变量和rcon密钥，
交互可以直接使用docker内的rcon-cli
```bash
docker compose exec mc rcon-cli "say 111"
```
还可以用也是同一个作者的rcon-cli项目，发送tcp请求连接服务器
::github{repo="itzg/rcon-cli"}
当然还有其他的rcon客户端
::github{repo="Tiiffi/mcrcon"}
为了方便管理可以使用python脚本来简化控制。

# 避雷
forge的服务端rcon有bug，发送`say、tellraw`这种命令返回的不是json类型的对象，而是布尔值True，bash会卡死，所以使用脚本的时候一定要有超时中断，可以捏着鼻子用。

# 服务器管理
## [白名单](https://zh.minecraft.wiki/w/%E5%91%BD%E4%BB%A4/whitelist?variant=zh-cn)管理
离线服务器，白名单使用uuid。
wiki上可以查看[uuid](https://zh.minecraft.wiki/w/%E9%80%9A%E7%94%A8%E5%94%AF%E4%B8%80%E8%AF%86%E5%88%AB%E7%A0%81?variant=zh-cn)
```bash
whitelist add <玩家名>
#重载白名单
whitelist reload
```
## TPS
| 数据指标 | 正常范围 | 含义 |
| --- | --- | --- |
| **TPS** | **20.0** | 理想状态。如果低于 20，玩家会感觉到瞬移、方块回退。 |
| **MSPT** | **< 50ms** | 每刻耗时。只要低于 50ms，TPS 就能维持在 20。 |
| **MSPT** | **> 50ms** | 服务器开始“赶工”，TPS 随之下降。 |
## 清除凋落物
如果某个区块的掉落物实体过多，比如刷沙机。
```bash
#强制加载末地的主导区块
rcon-cli execute in minecraft:the_end run forceload add 128 0
#清除凋落物
rcon-cli execute in minecraft:the_end run kill @e[type=item]
#移除强制加载
rcon-cli execute in minecraft:the_end run forceload remove 128 0
```
如果连服务器都进不去了，直接删除对应区块的实体文件也行。
## 管理模组
| 库名  | 描述 |
|------ |------|
| [easyauth](https://modrinth.com/mod/easyauth) | 为离线/在线服务器安装认证模组 |
| [spark](https://modrinth.com/mod/spark) | 一款面向 Minecraft 客户端、服务器和代理的性能分析工具。 |