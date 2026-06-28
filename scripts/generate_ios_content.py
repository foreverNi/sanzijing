#!/usr/bin/env python3
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "android/app/src/main/java/com/foreverni/sanzijing/ContentRepository.java"
TARGET = ROOT / "ios/SanZijing/Resources/ContentData.json"


def split_args(call: str) -> list[str]:
    values = []
    current = []
    quoted = False
    escaped = False
    for char in call:
        if escaped:
            current.append(char)
            escaped = False
            continue
        if char == "\\":
            current.append(char)
            escaped = True
            continue
        if char == '"':
            current.append(char)
            quoted = not quoted
            continue
        if char == "," and not quoted:
            values.append("".join(current).strip())
            current = []
            continue
        current.append(char)
    if current:
        values.append("".join(current).strip())
    return values


def java_string(value: str) -> str:
    return json.loads(value)


def parse_pages() -> list[dict]:
    source = SOURCE.read_text(encoding="utf-8")
    pattern = re.compile(r"new ClassicPage\((.*?)\)(?:,|\n)", re.DOTALL)
    pages = []
    for index, match in enumerate(pattern.finditer(source), start=1):
        args = split_args(match.group(1))
        if len(args) != 7:
            raise ValueError(f"ClassicPage #{index} has {len(args)} args")
        pages.append(
            {
                "number": index,
                "verse": java_string(args[0]),
                "pinyin": java_string(args[1]),
                "story": java_string(args[2]),
                "moral": java_string(args[3]),
                "animation": java_string(args[4]),
                "backgroundColor": args[5].replace("0x", "#"),
                "accentColor": args[6].replace("0x", "#"),
            }
        )
    if len(pages) != 197:
        raise ValueError(f"Expected 197 pages, got {len(pages)}")
    return pages


def main() -> None:
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    pages = parse_pages()
    TARGET.write_text(
        json.dumps(pages, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Generated {TARGET} with {len(pages)} pages")


if __name__ == "__main__":
    main()
