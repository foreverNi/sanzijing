import os
from typing import Literal

import edge_tts
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


DEFAULT_VOICE = os.getenv("EDGE_TTS_DEFAULT_VOICE", "zh-CN-XiaoxiaoNeural")
DEFAULT_RATE = os.getenv("EDGE_TTS_DEFAULT_RATE", "-8%")
DEFAULT_PITCH = os.getenv("EDGE_TTS_DEFAULT_PITCH", "+4Hz")
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "https://foreverni.github.io,http://localhost:8000,http://127.0.0.1:8000").split(",")
    if origin.strip()
]

app = FastAPI(title="Sanzijing Edge TTS Proxy")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class TtsRequest(BaseModel):
    text: str = Field(min_length=1, max_length=3000)
    kind: Literal["verse", "story"] = "story"
    page: int = Field(ge=1, le=197)
    verse: str = ""
    voice: str = DEFAULT_VOICE
    rate: str = DEFAULT_RATE
    pitch: str = DEFAULT_PITCH
    format: Literal["mp3"] = "mp3"
    voicePrompt: str = ""


@app.get("/health")
async def health():
    return {"ok": True, "voice": DEFAULT_VOICE}


@app.post("/api/tts")
async def synthesize(payload: TtsRequest):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    communicate = edge_tts.Communicate(
        text=text,
        voice=payload.voice or DEFAULT_VOICE,
        rate=payload.rate or DEFAULT_RATE,
        pitch=payload.pitch or DEFAULT_PITCH,
    )

    audio = bytearray()
    try:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio.extend(chunk["data"])
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"edge-tts failed: {exc}") from exc

    if not audio:
        raise HTTPException(status_code=502, detail="edge-tts returned empty audio")

    headers = {
        "Cache-Control": "public, max-age=86400",
        "X-TTS-Voice": payload.voice or DEFAULT_VOICE,
    }
    return Response(content=bytes(audio), media_type="audio/mpeg", headers=headers)
