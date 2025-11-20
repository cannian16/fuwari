---
title: ffmpeg备忘
published: 2025-10-15
description: '记录一下ffmpeg的命令，需要的时候直接在这复制'
image: ''
tags: [ffmpeg]
category: '备忘'
draft: true 
lang: ''
---

一站式的视频、音频、图片的处理工具。
**官网**:https://www.ffmpeg.org/
# 基本用法
```bash
ffmpeg -i input.mp4 output.avi
```
## 编码器
可以选择编码器
- libx264（cpu软解）(默认)
- h264_nvenc（nvidia显卡硬解）
```bash
ffmpeg -i input.mp4 -c:v libx264 output.avi
ffmpeg -i input.mp4 -c:v h264_nvenc output.avi
```

## 编码速度
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
## 图像质量
可以修改图像质量比如：`-crf 22`。参数（0-51）越小质量越好，最常用（19-28）。
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 22 output.avi
```

# 使用过的命令

## 分割图片
```bash
# 获取图片高度并分成上下两半
ffmpeg -i input.jpg -filter_complex \
"[0]crop=iw:ih/2:0:0[top];\
 [0]crop=iw:ih/2:0:ih/2[bottom]" \
-map "[top]" top.jpg \
-map "[bottom]" bottom.jpg

# 获取图片宽度并分成左右两半
ffmpeg -i input.jpg -filter_complex \
"[0]crop=iw/2:ih:0:0[left];\
 [0]crop=iw/2:ih:iw/2:0[right]" \
-map "[left]" left.jpg \
-map "[right]" right.jpg
```

## 压缩图片
以便上传到图床，占用较大流量带宽
```bash
# 转换为WebP，质量设置为80%，宽度1200像素
ffmpeg -i input.jpg -vf "scale=1200:-1" -quality 80 output.webp

# 更精细的WebP控制
ffmpeg -i input.jpg -vf "scale=1200:-1" -c:v libwebp -quality 80 -compression_level 6 output.webp
```
