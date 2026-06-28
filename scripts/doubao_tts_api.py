#!/usr/bin/env python3
"""Reusable Doubao text-to-speech API client.

This module is intentionally dependency-free so it can be copied into other
Python projects. It wraps Volcengine/Doubao's HTTP chunked TTS endpoint and
returns plain audio bytes for a text input.
"""

from __future__ import annotations

import base64
import json
import os
import urllib.error
import urllib.request
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


DEFAULT_API_URL = "https://openspeech.bytedance.com/api/v3/tts/unidirectional"
DEFAULT_MODEL = "seed-tts-2.0-standard"
DEFAULT_RESOURCE_ID = "seed-tts-2.0"
DEFAULT_FORMAT = "wav"
DEFAULT_SAMPLE_RATE = 24000
SUCCESS_CODES = {0, 20000000}


class DoubaoTTSError(RuntimeError):
    """Raised when the Doubao TTS API returns an error or invalid response."""


@dataclass
class DoubaoTTSConfig:
    api_key: str
    speaker: str
    api_url: str = DEFAULT_API_URL
    resource_id: str = DEFAULT_RESOURCE_ID
    model: str = DEFAULT_MODEL
    audio_format: str = DEFAULT_FORMAT
    sample_rate: int = DEFAULT_SAMPLE_RATE
    speech_rate: int = 0
    loudness_rate: int = 0
    timeout: int = 180


def load_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw_line in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            values[key] = value
    return values


def first_value(*values: Optional[str]) -> str:
    return next((value for value in values if value), "")


def config_from_env(env_path: Path | str = ".env", **overrides: object) -> DoubaoTTSConfig:
    env = load_env_file(Path(env_path))
    api_key = first_value(
        str(overrides.get("api_key") or ""),
        os.environ.get("DOUBAO_API_KEY"),
        os.environ.get("VOLCENGINE_API_KEY"),
        os.environ.get("APIKey"),
        env.get("DOUBAO_API_KEY"),
        env.get("VOLCENGINE_API_KEY"),
        env.get("APIKey"),
    )
    speaker = first_value(
        str(overrides.get("speaker") or ""),
        os.environ.get("DOUBAO_SPEAKER"),
        os.environ.get("DOUBAO_TTS_SPEAKER"),
        os.environ.get("SPEAKER"),
        env.get("DOUBAO_SPEAKER"),
        env.get("DOUBAO_TTS_SPEAKER"),
        env.get("SPEAKER"),
    )
    if not api_key:
        raise DoubaoTTSError("Missing API key. Set APIKey or DOUBAO_API_KEY.")
    if not speaker:
        raise DoubaoTTSError("Missing speaker ID. Set DOUBAO_SPEAKER or SPEAKER.")
    return DoubaoTTSConfig(
        api_key=api_key,
        speaker=speaker,
        api_url=str(overrides.get("api_url") or env.get("DOUBAO_TTS_API_URL") or DEFAULT_API_URL),
        resource_id=str(overrides.get("resource_id") or env.get("DOUBAO_RESOURCE_ID") or DEFAULT_RESOURCE_ID),
        model=str(overrides.get("model") or env.get("DOUBAO_MODEL") or DEFAULT_MODEL),
        audio_format=str(overrides.get("audio_format") or env.get("DOUBAO_AUDIO_FORMAT") or DEFAULT_FORMAT),
        sample_rate=int(overrides.get("sample_rate") or env.get("DOUBAO_SAMPLE_RATE") or DEFAULT_SAMPLE_RATE),
        speech_rate=int(overrides.get("speech_rate") or env.get("DOUBAO_SPEECH_RATE") or 0),
        loudness_rate=int(overrides.get("loudness_rate") or env.get("DOUBAO_LOUDNESS_RATE") or 0),
        timeout=int(overrides.get("timeout") or env.get("DOUBAO_TIMEOUT") or 180),
    )


def parse_chunked_json_audio(body: bytes) -> bytes:
    decoder = json.JSONDecoder()
    text = body.decode("utf-8")
    audio_parts: list[bytes] = []
    index = 0
    while index < len(text):
        while index < len(text) and text[index].isspace():
            index += 1
        if index >= len(text):
            break
        result, next_index = decoder.raw_decode(text, index)
        index = next_index
        code = result.get("code", 0)
        if code is not None and code not in SUCCESS_CODES:
            raise DoubaoTTSError(f"Doubao API returned code={code} message={result.get('message')}")
        if result.get("data"):
            audio_parts.append(base64.b64decode(result["data"]))
    if not audio_parts:
        raise DoubaoTTSError("Doubao API response did not include audio data chunks")
    return b"".join(audio_parts)


def synthesize_audio(text: str, config: DoubaoTTSConfig) -> bytes:
    if not text.strip():
        raise ValueError("text must not be empty")
    payload = {
        "req_params": {
            "text": text,
            "model": config.model,
            "speaker": config.speaker,
            "audio_params": {
                "format": config.audio_format,
                "sample_rate": config.sample_rate,
                "speech_rate": config.speech_rate,
                "loudness_rate": config.loudness_rate,
            },
        },
    }
    headers = {
        "Content-Type": "application/json",
        "X-Api-Key": config.api_key,
        "X-Api-Resource-Id": config.resource_id,
        "X-Api-Request-Id": str(uuid.uuid4()),
    }
    request = urllib.request.Request(
        config.api_url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=config.timeout) as response:
            body = response.read()
            content_type = response.headers.get("Content-Type", "")
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        logid = error.headers.get("X-Tt-Logid") or error.headers.get("X-Tt-LogId") or ""
        raise DoubaoTTSError(f"HTTP {error.code} from Doubao API; logid={logid}; body={body[:500]}") from error
    if content_type.startswith("audio/"):
        return body
    return parse_chunked_json_audio(body)


def synthesize_to_file(text: str, output_path: Path | str, config: DoubaoTTSConfig) -> Path:
    target = Path(output_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = target.with_suffix(target.suffix + ".tmp")
    tmp_path.write_bytes(synthesize_audio(text, config))
    tmp_path.replace(target)
    return target


def validate_wav(path: Path | str) -> None:
    wav_path = Path(path)
    if not wav_path.exists() or wav_path.stat().st_size <= 44:
        raise DoubaoTTSError(f"Invalid WAV file size: {wav_path}")
    with wav_path.open("rb") as handle:
        header = handle.read(12)
    if len(header) < 12 or not header.startswith(b"RIFF") or header[8:12] != b"WAVE":
        raise DoubaoTTSError(f"Invalid WAV header: {wav_path}")
