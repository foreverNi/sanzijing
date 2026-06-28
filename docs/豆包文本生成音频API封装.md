# 豆包文本生成音频 API 封装

本项目已把“输入文本，生成音频文件”的豆包调用封装到：

```text
scripts/doubao_tts_api.py
```

该文件不依赖三字经项目结构，也不依赖第三方 Python 包，可以复制到其他 Python 工程直接使用。

## 环境变量

在调用工程的 `.env` 中配置：

```env
APIKey=你的火山语音新版控制台 API Key
DOUBAO_SPEAKER=控制台音色库中的音色 ID
```

可选配置：

```env
DOUBAO_RESOURCE_ID=seed-tts-2.0
DOUBAO_MODEL=seed-tts-2.0-standard
DOUBAO_AUDIO_FORMAT=wav
DOUBAO_SAMPLE_RATE=24000
```

不要把 `.env` 提交到 Git。

## Python API

```python
from pathlib import Path

from doubao_tts_api import config_from_env, synthesize_to_file, validate_wav

config = config_from_env(".env")
synthesize_to_file("人之初，性本善", Path("output.wav"), config)
validate_wav("output.wav")
```

如果想直接拿到音频 bytes：

```python
from doubao_tts_api import config_from_env, synthesize_audio

config = config_from_env(".env")
audio_bytes = synthesize_audio("人之初，性本善", config)
```

## CLI 用法

项目内提供了一个命令行包装：

```bash
python3 scripts/doubao_tts_cli.py \
  --env .env \
  --text "人之初，性本善" \
  --output output.wav
```

也可以覆盖音频格式和采样率：

```bash
python3 scripts/doubao_tts_cli.py \
  --env .env \
  --text "人之初，性本善" \
  --output output.mp3 \
  --format mp3 \
  --sample-rate 24000
```

## 默认请求参数

封装默认使用新版流式接口：

```text
POST https://openspeech.bytedance.com/api/v3/tts/unidirectional
X-Api-Resource-Id: seed-tts-2.0
model: seed-tts-2.0-standard
audio format: wav
sample rate: 24000
```

接口返回的是 chunked JSON，其中 `data` 字段是 base64 音频分片。封装会自动解码并拼接为完整音频 bytes。

## 错误处理

API 错误会抛出 `DoubaoTTSError`。如果服务端返回 HTTP 错误，异常信息会包含 HTTP 状态、`X-Tt-Logid` 和截断后的响应体，便于去火山控制台排查。
