---
title: ffmpeg备忘
published: 2025-10-14
description: '记录一下ffmpeg的命令，需要的时候直接在这复制'
image: ''
tags: [markdwon]
category: '备忘'
draft: true 
lang: ''
---
# 基本用法

```bash
ffmpeg -i input.mp4 output.avi
```
# 编码器
可以选择编码器
- libx264（cpu软解）(默认)
- h264_nvenc（nvidia显卡硬解）
```bash
ffmpeg -i input.mp4 -c:v libx264 output.avi
ffmpeg -i input.mp4 -c:v h264_nvenc output.avi
```

# 编码速度
有多种预设视频编码速度`-preset xxx`
- ultrafast(导出视频最大)
- superfast
- veryfast
- faster
- fast
- medium (默认)
- slow
- slower
- veryslow(导出视频最小)
```bash
ffmpeg -i input.mp4 -c:v libx264 -preset medium output.avi
```
# 图像质量
可以修改图像质量比如：`-crf 22`。参数（0-51）越小质量越好，最常用（19-28）。
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 22 output.avi
```