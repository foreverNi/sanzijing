# edge-tts 自托管接口接入

本站点托管在 GitHub Pages 上，前端不能直接运行 TTS 模型。当前方案是部署一个 `edge-tts` 代理服务，由网页调用代理接口并播放返回的 MP3。

代理服务代码在：

```text
server/edge-tts-proxy/
```

## 前端配置

编辑 `tts-config.js`：

```js
window.SANZIJING_TTS_CONFIG = {
  enabled: true,
  endpoint: "https://your-edge-tts-proxy.example.com/api/tts",
  timeoutMs: 60000,
  cacheAudio: true,
  voice: "zh-CN-XiaoxiaoNeural",
  rate: "-8%",
  pitch: "+4Hz",
  voicePrompt: "温柔、清晰、亲切的幼儿园女老师，用普通话慢速讲给三岁到六岁儿童听，语气活泼但不夸张。",
  requestFormat: "json",
  outputFormat: "mp3"
};
```

`zh-CN-XiaoxiaoNeural` 是温柔中文女声，先作为“幼儿园老师声音”的默认版本。

## 请求格式

页面会发送 `POST` JSON：

```json
{
  "text": "人之初，性本善。rén zhī chū, xìng běn shàn",
  "kind": "verse",
  "page": 1,
  "verse": "人之初，性本善",
  "voice": "zh-CN-XiaoxiaoNeural",
  "rate": "-8%",
  "pitch": "+4Hz",
  "voicePrompt": "温柔、清晰、亲切的幼儿园女老师，用普通话慢速讲给三岁到六岁儿童听，语气活泼但不夸张。",
  "format": "mp3"
}
```

`voicePrompt` 是保留字段，edge-tts 不直接使用；以后切换到 CosyVoice 等模型时可以继续使用。

## 响应格式

代理服务默认直接返回：

- `Content-Type: audio/mpeg`
- body 为 MP3 bytes

前端也兼容下面两种响应，便于以后接其它 TTS 服务：

```json
{ "audioUrl": "https://your-cdn.example.com/tts/abc.mp3" }
```

```json
{ "mimeType": "audio/mpeg", "audioBase64": "..." }
```

## 部署要求

- 代理服务必须使用 HTTPS，否则 GitHub Pages 页面会被浏览器拦截。
- 代理服务必须允许 CORS：
  - `Access-Control-Allow-Origin: https://foreverni.github.io`
  - `Access-Control-Allow-Headers: Content-Type`
  - `Access-Control-Allow-Methods: POST, OPTIONS`
- 不要把任何私有 key 放进前端仓库。

## 本地测试

进入代理目录：

```bash
cd server/edge-tts-proxy
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

然后临时把 `tts-config.js` 改成：

```js
enabled: true,
endpoint: "http://127.0.0.1:8000/api/tts"
```

线上发布时必须换成 HTTPS 地址。
