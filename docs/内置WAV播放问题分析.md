# 内置 WAV 播放问题分析

## 问题现象

Android 版本中点击“播放”后，没有按预期播放 `android/app/src/main/assets/audio/` 下预置的 WAV 文件。

用户可观察到的表现包括：

- 点击“播放”后没有听到预置语音。
- 播放状态可能很快结束，或者没有持续显示“正在播放内置语音...”。
- 手动播放流程本应先播放当前页 `verse_XXX.wav`，再接续播放 `story_XXX.wav`，但实际没有稳定完成这一流程。

## 影响范围

受影响的是 Android 原生应用的内置音频播放路径：

- `audio/verse_001.wav` 到 `audio/verse_197.wav`
- `audio/story_001.wav` 到 `audio/story_197.wav`

用户录音、系统 TTS 合成播放仍使用原来的 `MediaPlayer` 路径，不属于本次问题的主要影响范围。

## 排查过程

排查时确认了以下事实：

1. 预置音频资源存在，数量完整：
   - `verse_*.wav` 共 197 个。
   - `story_*.wav` 共 197 个。

2. WAV 文件本身是标准 PCM 音频：
   - 16-bit
   - mono
   - 24000 Hz

3. APK 中 WAV 文件保持未压缩存储：
   - `assets/audio/verse_001.wav` 为 `Stored`
   - `assets/audio/story_001.wav` 为 `Stored`

4. 模拟器验证显示，原 `MediaPlayer` 路径会创建播放器后很快释放，未按真实音频时长播放。

5. 进一步检查 WAV 文件头发现，部分 WAV 文件使用 FFmpeg 常见的未知长度写法：

```text
RIFF size = 0xFFFFFFFF
data size = 0xFFFFFFFF
```

这类文件实际 PCM 数据从 `data` chunk 后一直持续到文件末尾。

## 根因

根因是 Android 端直接使用 `MediaPlayer` 播放内置 PCM WAV 文件不够可靠。

具体表现为：

- 预置 WAV 文件虽然是可识别的 PCM WAV，但其 `RIFF` 和 `data` chunk 长度使用 `0xFFFFFFFF` 表示未知长度。
- `MediaPlayer` 对这类 WAV 容器在部分 Android 环境中表现不稳定，会过早触发完成或释放，导致用户听不到完整音频。
- 原实现缺少针对内置 WAV 的低层级 PCM 播放兜底，只要 `MediaPlayer` 处理异常或提前完成，就无法保证预置音频正常播放。

## 解决方法

本次修复将“内置 WAV 播放”从 `MediaPlayer` 切换为专用的 PCM WAV 播放路径。

主要变更：

1. 新增 `BundledWavPlayer`
   - 从 assets 读取 WAV 文件。
   - 解析 `RIFF/WAVE`、`fmt `、`data` chunk。
   - 支持 `data size = 0xFFFFFFFF` 的未知长度写法。
   - 仅接受当前资源使用的 PCM 16-bit WAV 格式。
   - 使用 `AudioTrack` 播放 PCM 数据。

2. 保留其他音频路径
   - 用户录音仍使用 `MediaPlayer`。
   - 系统 TTS 临时音频仍使用 `MediaPlayer`。
   - 修复范围只收敛在预置内置 WAV。

3. 明确 APK 打包策略
   - 在 `android/app/build.gradle` 中增加：

```gradle
androidResources {
    noCompress "wav"
}
```

这样可以避免后续 Android Gradle Plugin 或 aapt 行为变化导致 WAV 资源被压缩，降低资源读取和播放的不确定性。

## 验证结果

在本地 Android 模拟器上验证通过：

- `verse_001.wav` 正常播放约 3 秒后完成。
- 播放完成后自动接续 `story_001.wav`。
- `story_001.wav` 正常播放约 20 秒后完成。
- 播放中 UI 显示“正在播放内置语音...”。
- 未出现 `AndroidRuntime` 或 `AudioTrack` 错误。

构建验证：

```bash
/Users/noah/development/gradle/gradle-8.13/bin/gradle -p android assembleDebug
/Users/noah/development/gradle/gradle-8.13/bin/gradle -p android assembleRelease
```

两个构建均已通过。

发布验证：

- Android 版本已更新为 `versionName 1.0.12` / `versionCode 13`。
- GitHub 已创建预发布 `v1.0.12`。
- 预发布 APK 为 `sanzijing-v1.0.12-debug-signed.apk`。

## 后续注意事项

- 继续生成预置音频时，建议保持 PCM WAV 参数一致，避免混入压缩编码或多声道格式。
- 如果以后改用 MP3、AAC 等压缩音频格式，可以重新评估是否回到 `MediaPlayer` 或引入 ExoPlayer。
- 如果需要正式发布 APK，应配置正式签名；当前预发布上传的是 debug-signed APK，适合验证安装和功能测试。
