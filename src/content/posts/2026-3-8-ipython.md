---
title: IPython
published: 2026-03-08
description: '分享一下，我遇到一个新库的探索方式'
image: ''
tags: ['python']
category: '工程实践'
draft: false
lang: ''
---
当我们遇到需求的时候，需要解决第一时间就要去找需要的库。比如注册时密码需要被hash运算，
那么我们就去[hashlib](https://pypi.org/project/hashlib/)里找需要的算法，需要生成一个密钥随机值，就导入[secret](https://pypi.org/project/python-secrets/)。
但是遇到了个新库怎么快速的入手，不止能看官方文档，也可以使用[ipython](https://ipython.org/)来探索
# 安装ipython
建议使用uv来安装，安装到全局工具里，和ruff，jupyter一样。
```bash
uv tool install ipython
```

## 使用ipython
全局安装完成之后，他会被uv自动加载到全局的环境变量里直接`ipython`即可。但是这样启动的ipython可以导入的库很少，只有在全局python环境里的才能导入。
我们可以需要在项目里`uv run ipyhton`这样打开的ipython是从这个项目的.venv里导包的和项目需要的包一致。
启动之后，他这个就相当于一个智能版的python交互式解释器。
你要尽可能的多用`tab`，他会在模块的命名空间里看有什么实例，类，模块，函数啥的。并且会告诉你函数的输入之类的
还有`?`它可以列举出这个包的文档，路径，类型啥的。
仔细用用，大部分库的文档都很标准很齐全，可以去体验一下datetime，os，pathlib这种标准库，交互式的感觉比文档要好的多
还有python原生的help()函数这个功能其实和ipython的tab，?差不多，只不过没有这么好用。