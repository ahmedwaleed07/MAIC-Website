#!/usr/bin/env python3
"""Render a 12-section MAIC Markdown study manuscript into an exactly 12-page PDF.

This renderer prepares a candidate PDF, NOT an academically approved publication.
It uses the repository's original MAIC crest and local Tinos fonts.
"""
import argparse
import html
import io
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageOps
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


NAVY = colors.HexColor("#071F32")
GOLD = colors.HexColor("#B08D4F")
INK = colors.HexColor("#101010")
W, H = letter
PAGE_MARKER = "<!-- MAIC-PAGE -->"


def find_tinos(style):
    name = "Tinos:style=" + style
    try:
        result = subprocess.check_output(
            ["fc-match", "-f", "%{file}", name], text=True
        ).strip()
        if result and Path(result).is_file() and "tinos" in result.lower():
            return result
    except (OSError, subprocess.CalledProcessError):
        pass
    possible = (
        "/usr/share/fonts/truetype/croscore/Tinos-" + style + ".ttf",
        "/usr/share/fonts/truetype/msttcorefonts/Tinos-" + style + ".ttf",
    )
    for f in possible:
        if Path(f).is_file():
            return f
    raise FileNotFoundError("Tinos " + style + " font is required")


def inline_markup(text):
    text = html.escape(text.strip(), quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    return text


def cover(c, crest, montage, title, hours):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    if montage and Path(montage).is_file():
        with Image.open(montage).convert("RGB") as src:
            fitted = ImageOps.fit(src, (850, 1100), method=Image.Resampling.LANCZOS)
            navy_img = Image.new("RGB", fitted.size, (7, 31, 50))
            blended = Image.blend(navy_img, fitted, 0.12)
            buffer = io.BytesIO()
            # The background is a soft-focus atmospheric montage: embed a high-quality JPEG
            # rather than a large lossless PNG. This preserves 12pt body text and
            # the original crest (embedded separately with transparency), while
            # keeping every review PDF below the MAIC 1.25 MB upload limit.
            blended.save(buffer, format="JPEG", quality=82, optimize=True, subsampling=0)
            buffer.seek(0)
            c.drawImage(ImageReader(buffer), 0, 0, W, H)

    c.setStrokeColor(GOLD)
    c.setLineWidth(1.3)
    c.rect(27, 27, W-54, H-54, fill=0, stroke=1)
    c.setFillColor(GOLD)
    c.setFont("MAIC-Tinos-Bold", 12.5)
    c.drawCentredString(W/2, 689, "MICHIGAN ACADEMY OF")
    c.drawCentredString(W/2, 672, "INNOVATION AND CREATIVITY")

    with Image.open(crest) as image:
        logo = image.convert("RGBA")
        buffer = io.BytesIO()
        logo.save(buffer, format="PNG")
        buffer.seek(0)
        c.drawImage(ImageReader(buffer), W/2-83, 447, 166, 166, mask="auto", preserveAspectRatio=True, anchor="c")

    c.setFont("MAIC-Tinos", 13)
    c.setFillColor(GOLD)
    c.drawCentredString(W/2, 425, "Innovate. Create. Lead.")

    c.setFillColor(colors.white)
    c.setFont("MAIC-Tinos-Bold", 25)
    title_style = ParagraphStyle("CoverCourseTitle", fontName="MAIC-Tinos-Bold", fontSize=25, leading=30, textColor=colors.white, alignment=1)
    title_paragraph = Paragraph(html.escape(title), title_style)
    _, title_height = title_paragraph.wrap(W-105, 100)
    # Anchor the title by its top, and move metadata below multiline headings.
    title_lines = max(1, round(title_height / title_style.leading))
    title_paragraph.drawOn(c, 52, 378-title_height)
    subtitle_y = 298 - 16 * (title_lines - 1)

    c.setFont("MAIC-Tinos", 12)
    c.drawCentredString(W/2, subtitle_y, "COURSE STUDY MANUAL")
    c.drawCentredString(W/2, subtitle_y-20, "Course language: English")
    c.drawCentredString(W/2, subtitle_y-40, "Estimated guided study: " + str(hours) + " hours")
    c.setFillColor(GOLD)
    c.setFont("MAIC-Tinos", 10)
    c.drawCentredString(W/2, 107, "Copyright 2026 MAIC. All rights reserved.")


def paragraphs_of(section):
    blocks = [b.strip() for b in section.strip().split("\n\n") if b.strip()]
    for block in blocks:
        if block.startswith("# "):
            continue
        if block.startswith("## "):
            yield ("heading", block[3:].strip())
        else:
            yield ("body", " ".join(line.strip() for line in block.splitlines()))


def body(c, section, page_number):
    c.setFillColor(colors.white)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.line(44, 755, W-44, 755)
    c.setFillColor(NAVY)
    c.setFont("MAIC-Tinos-Bold", 8)
    c.drawString(45, 762, "MAIC  |  COURSE STUDY MANUAL")

    body_style = ParagraphStyle(
        "MAICBody", fontName="MAIC-Tinos", fontSize=12, leading=16,
        textColor=INK, spaceAfter=8, allowWidows=0, allowOrphans=0,
    )
    heading_style = ParagraphStyle(
        "MAICHeading", fontName="MAIC-Tinos-Bold", fontSize=16, leading=21,
        textColor=NAVY, spaceAfter=15,
    )

    y = 725
    for kind, content in paragraphs_of(section):
        style = heading_style if kind == "heading" else body_style
        paragraph = Paragraph(inline_markup(content), style)
        width, height = paragraph.wrap(W-94, H)
        required_gap = 15 if kind == "heading" else 10
        if y-height < 66:
            raise ValueError(
                "Page {} overflows by {:.1f} pt; edit the substance without "
                "shrinking the approved 12pt body or padding pages".format(
                    page_number, 66-(y-height)
                )
            )
        paragraph.drawOn(c, 47, y-height)
        y -= height + required_gap

    c.setStrokeColor(GOLD)
    c.line(44, 51, W-44, 51)
    c.setFillColor(INK)
    c.setFont("MAIC-Tinos", 9)
    c.drawString(45, 37, "Copyright 2026 MAIC | Original course text")
    c.drawRightString(W-45, 37, "Page {}".format(page_number))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--crest", required=True)
    parser.add_argument("--montage", default="")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    source = Path(args.input).read_text(encoding="utf-8")
    title_match = re.search(r"^#\s+(.+)$", source, re.M)
    hours_match = re.search(r"^Estimated guided study:\s*(\d+)\s*hours\b", source, re.M)
    if not title_match or not hours_match:
        raise ValueError("Manual must declare course title and study hours")
    title = title_match.group(1).strip()
    hours = int(hours_match.group(1))
    if not (1 <= hours <= 100):
        raise ValueError("Invalid estimated study hours")
    pages = source.split(PAGE_MARKER)
    if len(pages) != 12:
        raise ValueError("12 substantive manuscript pages required; got {}".format(len(pages)))
    pdfmetrics.registerFont(TTFont("MAIC-Tinos", find_tinos("Regular")))
    pdfmetrics.registerFont(TTFont("MAIC-Tinos-Bold", find_tinos("Bold")))
    pdfmetrics.registerFontFamily("MAIC-Tinos", normal="MAIC-Tinos", bold="MAIC-Tinos-Bold")

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(out), pagesize=letter, pageCompression=1)
    c.setAuthor("Michigan Academy of Innovation and Creativity")
    c.setTitle("MAIC — " + title)
    cover(c, args.crest, args.montage, title, hours)
    c.showPage()
    for number, section in enumerate(pages[1:], start=2):
        body(c, section, number)
        c.showPage()
    c.save()

    from pypdf import PdfReader
    reader = PdfReader(str(out))
    if len(reader.pages) != 12:
        out.unlink(missing_ok=True)
        raise ValueError("Expected 12 pages; got {}".format(len(reader.pages)))
    print("Prepared candidate PDF: {} (12 pages)".format(out))


if __name__ == "__main__":
    main()
