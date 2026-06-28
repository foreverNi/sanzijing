#!/usr/bin/env python3
"""Command-line wrapper around doubao_tts_api.py."""

from __future__ import annotations

import argparse
from pathlib import Path

from doubao_tts_api import config_from_env, synthesize_to_file, validate_wav


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--text", required=True, help="Text to synthesize.")
    parser.add_argument("--output", required=True, help="Output audio path, for example output.wav.")
    parser.add_argument("--env", default=".env", help="Path to .env containing APIKey and DOUBAO_SPEAKER.")
    parser.add_argument("--format", default="wav", choices=["wav", "mp3", "pcm", "ogg_opus"])
    parser.add_argument("--sample-rate", type=int, default=24000)
    parser.add_argument("--model", default="")
    parser.add_argument("--resource-id", default="")
    parser.add_argument("--speaker", default="")
    parser.add_argument("--timeout", type=int, default=180)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    config = config_from_env(
        args.env,
        speaker=args.speaker,
        model=args.model,
        resource_id=args.resource_id,
        audio_format=args.format,
        sample_rate=args.sample_rate,
        timeout=args.timeout,
    )
    output = synthesize_to_file(args.text, args.output, config)
    if args.format == "wav":
        validate_wav(output)
    print(f"generated {Path(output)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
