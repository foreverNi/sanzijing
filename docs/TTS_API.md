# 开源 TTS 接口接入

GitHub Pages 是纯静态站点，不能直接运行 CosyVoice、GPT-SoVITS 等模型。页面现在会调用 `tts-config.js` 中配置的 HTTPS 接口，由你自托管的开源 TTS 服务返回音频。

## 前端配置

编辑 `tts-config.js`：

```js
window.SANZIJING_TTS_CONFIG = {
  enabled: true,
  endpoint: "https://your-tts.example.com/api/tts",
  timeoutMs: 60000,
  cacheAudio: true,
  voicePrompt: "温柔、清晰、亲切的幼儿园女老师，用普通话慢速讲给三岁到六岁儿童听，语气活泼但不夸张。",
  requestFormat: "json",
  outputFormat: "mp3"
};
```

## 请求格式

页面会发送 `POST` JSON：

```json
{
  "text": "人之初，性本善。rén zhī chū, xìng běn shàn",
  "kind": "verse",
  "page": 1,
  "verse": "人之初，性本善",
  "voicePrompt": "温柔、清晰、亲切的幼儿园女老师，用普通话慢速讲给三岁到六岁儿童听，语气活泼但不夸张。",
  "format": "mp3"
}
```

`kind` 为 `verse` 或 `story`。

## 响应格式

接口任选一种返回方式：

1. 直接返回音频：
   - `Content-Type: audio/mpeg`
   - body 为 MP3 bytes

2. 返回音频 URL：

```json
{
  "audioUrl": "https://your-cdn.example.com/tts/abc.mp3"
}
```

3. 返回 base64：

```json
{
  "mimeType": "audio/mpeg",
  "audioBase64": "..."
}
```

## 服务端要求

- 必须启用 HTTPS，否则 GitHub Pages 页面会被浏览器拦截。
- 必须允许 CORS，例如：
  - `Access-Control-Allow-Origin: https://foreverni.github.io`
  - `Access-Control-Allow-Headers: Content-Type`
  - `Access-Control-Allow-Methods: POST, OPTIONS`
- 不要把私有 API key 放在前端仓库里。如果 TTS 服务需要密钥，应由你的服务端保存密钥，前端只调用你的服务端。

## 推荐开源方案

- CosyVoice：适合中文、支持 instruction 控制情绪/语速/音量，可自托管 FastAPI/gRPC 服务。
- GPT-SoVITS：适合少样本声线定制，但需要授权音频样本和更多调参。

当前默认按 CosyVoice 风格接入。
