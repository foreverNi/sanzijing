#!/usr/bin/env python3
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "ios/SanZijing/Resources/ContentData.json"
AUDIO = ROOT / "android/app/src/main/assets/audio"
ILLUSTRATIONS = ROOT / "android/app/src/main/assets/illustrations"


def main() -> None:
    pages = json.loads(CONTENT.read_text(encoding="utf-8"))
    errors = []
    if len(pages) != 197:
        errors.append(f"expected 197 pages, got {len(pages)}")
    for page in pages:
        number = page["number"]
        for field in ("verse", "pinyin", "story", "moral"):
            if not page.get(field):
                errors.append(f"page {number:03d} missing {field}")
        for kind in ("verse", "story"):
            path = AUDIO / f"{kind}_{number:03d}.wav"
            if not path.is_file():
                errors.append(f"missing {path.relative_to(ROOT)}")
        illustration = ILLUSTRATIONS / f"page_{number:03d}.png"
        if not illustration.is_file():
            errors.append(f"missing {illustration.relative_to(ROOT)}")

    if errors:
        for error in errors:
            print(error)
        raise SystemExit(1)

    print(f"ios resources ok: pages={len(pages)} audio={len(pages) * 2} illustrations={len(pages)}")


if __name__ == "__main__":
    main()
