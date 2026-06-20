# 三字经故事乐园 Android 版

这是现有网页内容的原生 Android 版本，源码位于 `android/app`。

## 功能

- 使用 Android 系统 `TextToSpeech` 朗读三字经和故事，不再依赖网页 TTS 接口。
- 复用根目录 `data.js` 的 100 页三字经内容，通过 `tools/generate-content.ps1` 生成 Android 内容类。
- 使用低饱和绿色、米白色和页面主题色混合的护眼配色。
- 自动播放模式：每页按“读三字经、讲故事”为一轮，循环 3 轮；完成后等待 1 分钟自动进入下一页。
- 自动播放时显示全屏锁定层，避免误触；三指同时按住左上、右上、下方中央约 0.9 秒解锁并停止自动播放。

## 同步内容

修改根目录 `data.js` 后运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\generate-content.ps1
```

## 构建

在安装 Android SDK 和 Gradle 后运行：

```powershell
gradle -p .\android assembleDebug
```

本机当前可构建产物：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## 设备要求

自动播放依赖设备系统 TTS。若设备没有中文 TTS 引擎，应用会显示系统语音设置错误提示；需要在 Android 系统设置中安装或启用中文语音。
