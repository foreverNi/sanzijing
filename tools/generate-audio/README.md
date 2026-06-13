# CosyVoice 音频生成说明

本站点使用静态 MP3 文件播放朗读音频，GitHub Pages 不运行 TTS 模型。

推荐使用开源项目 [CosyVoice](https://github.com/FunAudioLLM/CosyVoice) 离线生成音频：

- 声线提示词：`温柔、清晰、亲切的幼儿园女老师，用普通话慢速讲给三岁到六岁儿童听，语气活泼但不夸张。`
- 输出格式：MP3，单声道，64-96 kbps
- 经文音频：`audio/verse/001.mp3` 到 `audio/verse/100.mp3`
- 故事音频：`audio/story/001.mp3` 到 `audio/story/100.mp3`

## 生成文本清单

在项目根目录运行：

```bash
node tools/generate-audio/export-texts.js
```

脚本会生成 `tools/generate-audio/texts.json`，其中包含每个音频文件的目标路径、文本和声线提示词。

## 生成流程建议

1. 按 CosyVoice 官方说明安装模型环境。
2. 读取 `texts.json` 中的 `items`。
3. 对每条记录使用 `text` 作为合成文本，使用 `voicePrompt` 作为风格/指令提示。
4. 输出到记录中的 `output` 路径。
5. 确认每个 MP3 可播放后提交 `audio/verse/*.mp3` 和 `audio/story/*.mp3`。

如果暂时没有音频文件，网页会显示“音频还在准备中，请稍后再试。”。
