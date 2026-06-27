#!/usr/bin/env python3
"""Generate bundled San Zi Jing WAV audio with the Doubao TTS streaming API."""

import argparse
import base64
import json
import os
import re
import shutil
import sys
import time
import urllib.error
import urllib.request
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


API_URL = "https://openspeech.bytedance.com/api/v3/tts/unidirectional"
DEFAULT_MODEL = "seed-tts-2.0-standard"
DEFAULT_RESOURCE_ID = "seed-tts-2.0"
DEFAULT_SAMPLE_RATE = 24000
SUCCESS_CODES = {0, 20000000}


@dataclass
class Page:
    number: int
    verse: str
    story: str
    moral: str


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def decode_java_string(value: str) -> str:
    return json.loads('"' + value + '"')


def load_pages(content_path: Path) -> list[Page]:
    source = content_path.read_text(encoding="utf-8")
    pattern = re.compile(
        r'new ClassicPage\("((?:\\.|[^"\\])*)",\s*'
        r'"((?:\\.|[^"\\])*)",\s*'
        r'"((?:\\.|[^"\\])*)",\s*'
        r'"((?:\\.|[^"\\])*)",',
        re.S,
    )
    pages: list[Page] = []
    for index, match in enumerate(pattern.finditer(source), start=1):
        pages.append(
            Page(
                number=index,
                verse=decode_java_string(match.group(1)),
                story=decode_java_string(match.group(3)),
                moral=decode_java_string(match.group(4)),
            )
        )
    if not pages:
        raise RuntimeError(f"No ClassicPage entries found in {content_path}")
    return pages


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


def load_credentials(root: Path) -> dict[str, str]:
    root_env = load_env_file(root / ".env")
    docs_env = load_env_file(root / "docs" / ".env")

    def first_value(*values: Optional[str]) -> str:
        return next((value for value in values if value), "")

    credentials = {
        "api_key": first_value(
            os.environ.get("DOUBAO_API_KEY"),
            os.environ.get("VOLCENGINE_API_KEY"),
            os.environ.get("APIKey"),
            root_env.get("DOUBAO_API_KEY"),
            root_env.get("VOLCENGINE_API_KEY"),
            root_env.get("APIKey"),
            docs_env.get("DOUBAO_API_KEY"),
            docs_env.get("VOLCENGINE_API_KEY"),
            docs_env.get("APIKey"),
        ),
        "app_id": first_value(
            os.environ.get("X_API_APP_ID"),
            root_env.get("X_API_APP_ID"),
            root_env.get("X-Api-App-Id"),
            docs_env.get("X_API_APP_ID"),
            docs_env.get("X-Api-App-Id"),
        ),
        "access_key": first_value(
            os.environ.get("X_API_ACCESS_KEY"),
            root_env.get("X_API_ACCESS_KEY"),
            root_env.get("X-Api-Access-Key"),
            docs_env.get("X_API_ACCESS_KEY"),
            docs_env.get("X-Api-Access-Key"),
        ),
        "speaker": first_value(
            os.environ.get("DOUBAO_SPEAKER"),
            os.environ.get("DOUBAO_TTS_SPEAKER"),
            os.environ.get("SPEAKER"),
            root_env.get("DOUBAO_SPEAKER"),
            root_env.get("DOUBAO_TTS_SPEAKER"),
            root_env.get("SPEAKER"),
            docs_env.get("DOUBAO_SPEAKER"),
            docs_env.get("DOUBAO_TTS_SPEAKER"),
            docs_env.get("SPEAKER"),
        ),
    }
    if credentials["api_key"] or (credentials["app_id"] and credentials["access_key"]):
        return credentials
    raise RuntimeError(
        "Missing credentials. Set APIKey for the new console, or X_API_APP_ID and X_API_ACCESS_KEY for the old console."
    )


def audio_jobs(pages: list[Page], start: int, end: int) -> list[tuple[str, int, str]]:
    jobs: list[tuple[str, int, str]] = []
    for page in pages:
        if page.number < start or page.number > end:
            continue
        story_text = f"{page.story}。{page.moral}"
        jobs.append(("verse", page.number, page.verse))
        jobs.append(("story", page.number, story_text))
    return jobs


def output_name(kind: str, page_number: int) -> str:
    return f"{kind}_{page_number:03d}.wav"


def validate_wav(path: Path) -> None:
    if not path.exists() or path.stat().st_size <= 44:
        raise RuntimeError(f"Invalid WAV file size: {path}")
    with path.open("rb") as handle:
        header = handle.read(12)
    if len(header) < 12 or not header.startswith(b"RIFF") or header[8:12] != b"WAVE":
        raise RuntimeError(f"Invalid WAV header: {path}")


def parse_stream_response(body: bytes) -> bytes:
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
            raise RuntimeError(f"Doubao API returned code={code} message={result.get('message')}")
        if result.get("data"):
            audio_parts.append(base64.b64decode(result["data"]))
    if not audio_parts:
        raise RuntimeError("Doubao API response did not include any audio data chunks")
    return b"".join(audio_parts)


def doubao_request(credentials: dict[str, str], text: str, timeout: int, model: str, resource_id: str, speaker: str) -> bytes:
    payload = {
        "req_params": {
            "text": text,
            "model": model,
            "speaker": speaker,
            "audio_params": {
                "format": "wav",
                "sample_rate": DEFAULT_SAMPLE_RATE,
                "speech_rate": 0,
                "loudness_rate": 0,
            },
        },
    }
    headers = {
        "Content-Type": "application/json",
        "X-Api-Resource-Id": resource_id,
        "X-Api-Request-Id": str(uuid.uuid4()),
    }
    if credentials["api_key"]:
        headers["X-Api-Key"] = credentials["api_key"]
    else:
        headers["X-Api-App-Id"] = credentials["app_id"]
        headers["X-Api-Access-Key"] = credentials["access_key"]
    request = urllib.request.Request(
        API_URL,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = response.read()
            content_type = response.headers.get("Content-Type", "")
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        logid = error.headers.get("X-Tt-Logid") or error.headers.get("X-Tt-LogId") or ""
        raise RuntimeError(f"HTTP {error.code} from Doubao API; logid={logid}; body={body[:500]}") from error
    if content_type.startswith("audio/"):
        return body
    return parse_stream_response(body)


def generate_job(credentials: dict[str, str], kind: str, page_number: int, text: str, target: Path, args: argparse.Namespace) -> None:
    if target.exists() and target.stat().st_size > 44 and not args.force:
        validate_wav(target)
        print(f"skip existing {target.name}")
        return
    last_error: Exception | None = None
    for attempt in range(1, args.retries + 2):
        try:
            audio = doubao_request(credentials, text, args.timeout, args.model, args.resource_id, args.speaker)
            target.parent.mkdir(parents=True, exist_ok=True)
            tmp_path = target.with_suffix(".tmp")
            tmp_path.write_bytes(audio)
            validate_wav(tmp_path)
            tmp_path.replace(target)
            print(f"generated {target.name} ({target.stat().st_size} bytes)")
            if args.sleep > 0:
                time.sleep(args.sleep)
            return
        except (urllib.error.URLError, TimeoutError, RuntimeError, json.JSONDecodeError) as error:
            last_error = error
            if attempt <= args.retries:
                wait_seconds = min(30, 2 * attempt)
                print(f"retry {attempt}/{args.retries} for {kind}_{page_number:03d}: {error}", file=sys.stderr)
                time.sleep(wait_seconds)
    raise RuntimeError(f"Failed to generate {kind}_{page_number:03d}: {last_error}")


def copy_to_assets(output_dir: Path, assets_dir: Path, expected_jobs: list[tuple[str, int, str]]) -> None:
    for kind, page_number, _text in expected_jobs:
        source = output_dir / output_name(kind, page_number)
        validate_wav(source)
    assets_dir.mkdir(parents=True, exist_ok=True)
    for kind, page_number, _text in expected_jobs:
        source = output_dir / output_name(kind, page_number)
        shutil.copy2(source, assets_dir / source.name)


def verify_outputs(directory: Path, expected_jobs: list[tuple[str, int, str]]) -> None:
    missing: list[str] = []
    for kind, page_number, _text in expected_jobs:
        path = directory / output_name(kind, page_number)
        if not path.exists():
            missing.append(path.name)
            continue
        validate_wav(path)
    extras = sorted(path.name for path in directory.glob("*.wav") if path.name not in {output_name(kind, page_number) for kind, page_number, _text in expected_jobs})
    if missing:
        raise RuntimeError(f"Missing WAV files in {directory}: {missing[:20]}")
    if extras:
        raise RuntimeError(f"Unexpected WAV files in {directory}: {extras[:20]}")
    print(f"verified {len(expected_jobs)} WAV files in {directory}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="Only parse content and print planned outputs.")
    parser.add_argument("--verify-only", action="store_true", help="Only verify expected WAV files in --output-dir.")
    parser.add_argument("--start", type=int, default=1, help="First page number to generate.")
    parser.add_argument("--end", type=int, default=197, help="Last page number to generate.")
    parser.add_argument("--output-dir", default="tmp/doubao-audio", help="Directory for generated WAV files.")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Doubao model value for the JSON request body.")
    parser.add_argument("--resource-id", default=DEFAULT_RESOURCE_ID, help="Doubao X-Api-Resource-Id header value.")
    parser.add_argument("--speaker", default="", help="Doubao speaker ID. Defaults to DOUBAO_SPEAKER/SPEAKER in .env.")
    parser.add_argument("--apply", action="store_true", help="Copy generated WAV files into Android assets after validation.")
    parser.add_argument("--force", action="store_true", help="Regenerate files even when valid outputs already exist.")
    parser.add_argument("--timeout", type=int, default=180, help="HTTP timeout in seconds.")
    parser.add_argument("--retries", type=int, default=2, help="Retries per audio file after the first attempt.")
    parser.add_argument("--sleep", type=float, default=0.2, help="Pause between successful requests.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    root = repo_root()
    content_path = root / "android" / "app" / "src" / "main" / "java" / "com" / "foreverni" / "sanzijing" / "ContentRepository.java"
    assets_dir = root / "android" / "app" / "src" / "main" / "assets" / "audio"
    output_dir = (root / args.output_dir).resolve()
    pages = load_pages(content_path)
    if len(pages) != 197:
        raise RuntimeError(f"Expected 197 pages, found {len(pages)}")
    jobs = audio_jobs(pages, args.start, args.end)
    if not jobs:
        raise RuntimeError(f"No jobs selected for page range {args.start}-{args.end}")
    print(f"pages={len(pages)} selected_jobs={len(jobs)} output_dir={output_dir}")
    if args.dry_run:
        for kind, page_number, text in jobs[:10]:
            print(f"{output_name(kind, page_number)} chars={len(text)}")
        if len(jobs) > 10:
            print(f"... {len(jobs) - 10} more")
        return 0
    if args.verify_only:
        verify_outputs(output_dir, jobs)
        return 0
    credentials = load_credentials(root)
    if not args.speaker:
        args.speaker = credentials["speaker"]
    if not args.speaker:
        raise RuntimeError("Missing speaker ID. Set DOUBAO_SPEAKER or SPEAKER in .env, or pass --speaker.")
    for kind, page_number, text in jobs:
        generate_job(credentials, kind, page_number, text, output_dir / output_name(kind, page_number), args)
    if args.apply:
        copy_to_assets(output_dir, assets_dir, jobs)
        print(f"copied {len(jobs)} files to {assets_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
