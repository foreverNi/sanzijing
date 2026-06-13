# edge-tts 自托管代理

这个服务把前端的 `POST /api/tts` 请求转成 `edge-tts` 在线神经语音，并返回 `audio/mpeg`。

默认声音：

- voice: `zh-CN-XiaoxiaoNeural`
- rate: `-8%`
- pitch: `+4Hz`

## 本地运行

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

测试：

```bash
curl -X POST http://127.0.0.1:8000/api/tts ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"人之初，性本善。\",\"kind\":\"verse\",\"page\":1,\"voice\":\"zh-CN-XiaoxiaoNeural\",\"rate\":\"-8%\",\"pitch\":\"+4Hz\",\"format\":\"mp3\"}" ^
  --output test.mp3
```

## 部署

可以部署到 Render、Railway、Fly.io、VPS 等支持 Python Web 服务的平台。

环境变量：

- `ALLOWED_ORIGINS`: 允许跨域的站点，默认包含 `https://foreverni.github.io`
- `EDGE_TTS_DEFAULT_VOICE`: 默认声音，默认 `zh-CN-XiaoxiaoNeural`
- `EDGE_TTS_DEFAULT_RATE`: 默认语速，默认 `-8%`
- `EDGE_TTS_DEFAULT_PITCH`: 默认音调，默认 `+4Hz`
- `PORT`: 服务端口，默认 `8000`

部署后把前端 `tts-config.js` 改成：

```js
window.SANZIJING_TTS_CONFIG = {
  enabled: true,
  endpoint: "https://your-edge-tts-proxy.example.com/api/tts",
  timeoutMs: 60000,
  cacheAudio: true,
  voice: "zh-CN-XiaoxiaoNeural",
  rate: "-8%",
  pitch: "+4Hz",
  requestFormat: "json",
  outputFormat: "mp3"
};
```

注意：`edge-tts` 调用的是 Microsoft Edge 在线语音能力。它适合个人项目和轻量试用；公开生产使用前需要自行评估稳定性和服务条款风险。
