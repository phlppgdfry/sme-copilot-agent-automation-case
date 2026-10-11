#!/usr/bin/env python3
"""Convert the fictional HR documents in knowledge/ to .docx for upload to SharePoint (macOS: uses textutil).

Copilot Studio reads Word files from a SharePoint library; Markdown is not a supported knowledge file type.
Usage: python3 scripts/make-docx.py   → copilot-studio/kennis-voor-sharepoint/<scope>/<name>.docx
"""
import html
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "copilot-studio" / "kennis-voor-sharepoint"


def to_html(markdown: str) -> str:
    lines = []
    for line in markdown.splitlines():
        text = html.escape(line.strip())
        text = re.sub(r"\*(.+?)\*", r"<i>\1</i>", text)
        if line.startswith("# "):
            lines.append(f"<h1>{text[2:]}</h1>")
        elif line.startswith("## "):
            lines.append(f"<h2>{text[3:]}</h2>")
        elif text:
            lines.append(f"<p>{text}</p>")
    return "<html><head><meta charset='utf-8'></head><body>" + "\n".join(lines) + "</body></html>"


def main() -> None:
    for md in sorted((ROOT / "knowledge").glob("*/*.md")):
        target = OUT / md.parent.name / f"{md.stem}.docx"
        target.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as tmp:
            tmp.write(to_html(md.read_text(encoding="utf-8")))
        subprocess.run(["textutil", "-convert", "docx", tmp.name, "-output", str(target)], check=True)
        Path(tmp.name).unlink()
        print(target.relative_to(ROOT))


if __name__ == "__main__":
    main()
