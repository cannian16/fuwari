---
title: 安卓开发环境配置
published: 2026-03-20
description: '建议使用docker部署最干净，不然sdk太污染全局环境了，用过uv再用gradle/java真是一大坨啊，确实顶不住，捏着鼻子用吧'
image: ''
tags: ['android','环境配置']
category: '工程实践'
draft: false 
lang: ''
---
# 简介
安卓项项目本质上就是一个带着AGP（Android Gradle 插件）的一个特殊的Gradle项目。构建流程具体看该[文档](https://developer.android.com/build/gradle-build-overview?hl=zh-cn)，可以看该页面下的[兼容列表](https://developer.android.com/build/releases/agp-9-1-0-release-notes?hl=zh-cn)来选择需要什么版本的Gradle，sdk，java等等。AGP来控制gradle在构建的时候用sdk里的platform和build-tools。
## SDK
SDK建议用谷歌官方的开发者工具`cmdlinetools`，在[这里](https://developer.android.com/studio?hl=zh-cn)下载（要划到最下面，谷歌就像让你用他的ide开发）。
cmdlinetools里有一个sdkmanager,这个东西就是能统一管理sdk的安卓开发的包管理器。除此之外还有一些别的凑数用的工具，比如管理安卓虚拟机啥的，解析apk的，性能分析的工具。最重要的还是sdk。
### sdkmanager
用`sdkmanager --list`可以看到一大堆包,你可以用grep筛选你想要查的。
- platform-tools：这里面有adb之类的安卓调试工具
- build-tools：这里是把java项目打包成apk的工具
- platforms：这个是包含着那些安卓上的API的定义文件，告诉了安卓有哪些系统调用可以使用
- emulator：安卓模拟器的包（类似于qemu，VMware）
- system-images：安卓系统的镜像包（系统镜像）
- sources：安卓系统框架的源码
- ndk：可以让应用调用C/C++的代码，类似于内联汇编，之类的
- skiaparser：布局检查器，安卓底层的图形引擎，让你在电脑上看最终渲染的效果
里面最重要的其实就是platforms和build-tools，有了这俩就能输出apk文件，无论是用adb调试方便一点，或者其他的方式传到手机上就可用了。
这些包的很多后面都带着版本号，比如我拿出来几条，我grep "36"的
```text
build-tools;36.0.0   | 36.0.0     | Android SDK Build-Tools 36     
platforms;android-36    | 2       | Android SDK Platform 36
```
这个后面带的数字就是API的版本号36，他和我们现在用的手机安卓16是对应的，今天谷歌新开发了一套api就会把他推到api上，安卓系统上也会有一套对应的。目前来说API36对应安卓16，API35对应安卓15。
platform-tools几乎不更新版本，adb是兼容任何版本的手机的，稳定的。记得把下载好的SDK的位置放到ANDROID_HOME这个环境变量里，AGP会指定Gradle去这里调用SDK。这个环境变量的文件结构是有点奇葩的，我就不赘述了。
### adb
调试的时候会用到。我列举一些常用的别的用`--help`自己看吧
```bash
adb pair HOST[:PORT] [PAIRING CODE] #配对命令
adb connect <IP:端口> #这个和配对的端口不同，注意了
adb devices 
adb -s <指定的IP> install app/build/outputs/apk/debug/app-debug.apk
```
可以用wireguard＋adb来远程调试的很方便
## [gradle](https://gradle.org/)
可以用包管理器装，我在后面dockerfile用的是手动的方式。实际上预装这个gradle版本啥的都无所谓，主要是要在项目里初始化`gradle wapper`,有了这个你就算没有gradle，这个gradlew也能给你自动装个项目需要的gradle，不过我还是全局装个gradle在镜像里，这样方便点，虽然没啥用。用`gradle wrapper --gradle-version 9.4.0 --distribution-type all`这个可以输出gradle wapper,有了这个其实gradle就可以删了，安卓的gradle项目结构我就不说了，太乱太杂了，目前为止需要的依赖已经全都有了，最后编译安卓项目，有很多种编译方式的，为了适配play store和各家的应用市场可以有很多种编译方式的
```bash
./gradlew :app:assembleDebug  #会在这里编译出app/build/outputs/apk/debug/app-debug.apk
```

# 安装sdk、java和gradle
## Dockerfile
```
FROM eclipse-temurin:21-jdk-noble

# 1. 构建参数（带上协议头）
ARG SDK_URL="https://dl.google.com/android/repository/commandlinetools-linux-14742923_latest.zip?hl=zh-cn"
ARG GRADLE_VERSION="9.4.0"
# 2. 设置环境变量
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:\
${ANDROID_HOME}/cmdline-tools/latest/bin:\
${ANDROID_HOME}/platform-tools:\
${ANDROID_HOME}/build-tools/36.0.0:\
/opt/gradle/gradle-${GRADLE_VERSION}/bin

# 3. 安装系统工具

RUN apt update && apt install -y wget unzip git && rm -rf /var/lib/apt/lists/*

# 4. 安装cmdline-tools
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget --tries=5 -O cmdline.zip "${SDK_URL}" && \
    unzip cmdline.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm cmdline.zip

# 5. 下载 SDK 组件
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "build-tools;36.0.0" "platforms;android-36"

RUN wget -q https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-all.zip &&\
    mkdir /opt/gradle && unzip -d /opt/gradle gradle-${GRADLE_VERSION}-all.zip \
    &&rm gradle-${GRADLE_VERSION}-all.zip

WORKDIR /workspace
```

## docker compose

```yml
services:
  android-builder:
    image: android-dev-env
    container_name: android_dev_container
    network_mode: host
    volumes:
      - ./workspace:/workspace
      - ./.gradle:/root/.gradle
    tty: true
    stdin_open: true
    working_dir: /workspace
```

