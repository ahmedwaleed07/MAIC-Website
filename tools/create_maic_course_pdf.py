#!/usr/bin/env python3
"""Render an academically reviewed MAIC course manual as grayscale PDF.

Requires licensed Times New Roman regular/bold and MAIC brand heading font
from the operator's local system. Font binaries are never bundled in GitHub.
This script does NOT produce or fact-check educational text itself.
"""
import argparse
import io
import json
from pathlib import Path
from xml.sax.saxutils import escape
from PIL import Image as PILImage, ImageOps
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak, Spacer, Image, KeepTogether, ListFlowable, ListItem


def font(name, file_path):
    path = Path(file_path)
    if not path.is_file() or path.suffix.lower() not in {".ttf", ".otf"}:
        raise ValueError(f"Missing licensed font file for {name}")
    pdfmetrics.registerFont(TTFont(name, str(path)))


def grayscale_logo(filepath):
    path = Path(filepath)
    if not path.is_file():
        raise ValueError("Original MAIC crest is required")
    with PILImage.open(path) as original:
        png = ImageOps.grayscale(original.convert("RGB"))
        stream = io.BytesIO()
        png.save(stream, format="PNG")
    stream.seek(0)
    return stream


def parse_input(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    title = data.get("title")
    units = data.get("units")
    if not isinstance(title, str) or len(title.strip()) < 5:
        raise ValueError("Reviewed course title is required")
    if not isinstance(units, list) or not units:
        raise ValueError("Reviewed course units must be provided")
    for i, unit in enumerate(units, 1):
        if not isinstance(unit, dict) or not isinstance(unit.get("heading"), str):
            raise ValueError(f"Unit {i} has no heading")
        if not isinstance(unit.get("paragraphs"), list) or not all(isinstance(p,str) and p.strip() for p in unit["paragraphs"]):
            raise ValueError(f"Unit {i} requires real paragraph content")
    return data


def build(args):
    font("MAIC-TNR", args.times_regular)
    font("MAIC-TNR-Bold", args.times_bold)
    font("MAIC-Brand", args.brand_font)
    data = parse_input(args.input)
    body = ParagraphStyle("TNR12", fontName="MAIC-TNR", fontSize=12, leading=17,
                          textColor=colors.black, spaceAfter=10, alignment=TA_LEFT)
    heading = ParagraphStyle("Heading", parent=body, fontName="MAIC-TNR-Bold",
                             fontSize=15, leading=19, spaceBefore=18, spaceAfter=9)
    cover_title = ParagraphStyle("CoverTitle", parent=body, fontName="MAIC-Brand",
                                 fontSize=22, leading=28, alignment=TA_CENTER)
    academy = ParagraphStyle("Academy", parent=body, fontName="MAIC-Brand",
                             fontSize=13, leading=18, alignment=TA_CENTER)
    sub = ParagraphStyle("Sub", parent=body, fontName="MAIC-TNR",
                         fontSize=12, leading=18, alignment=TA_CENTER)
    story = []
    logo = grayscale_logo(args.crest)
    img = Image(logo, width=136, height=136, kind="proportional", hAlign="CENTER")
    story.extend([Spacer(1,55),img,Spacer(1,23),
                  Paragraph("MICHIGAN ACADEMY OF INNOVATION AND CREATIVITY", academy),
                  Spacer(1,13),Paragraph("Innovate. Create. Lead.", sub),
                  Spacer(1,58),Paragraph(escape(data["title"]), cover_title),
                  Spacer(1,34),Paragraph("OFFICIAL COURSE STUDY MANUAL", sub),
                  Spacer(1,10),Paragraph("Course language: English", sub),
                  Spacer(1,64),Paragraph("Copyright MAIC. All rights reserved.", sub),
                  PageBreak()])
    for unit in data["units"]:
        story.append(Paragraph(escape(unit["heading"]), heading))
        for paragraph in unit["paragraphs"]:
            story.append(Paragraph(escape(paragraph).replace("\n","<br/>"),body))
        for label,entries in (("Key points",unit.get("bullets",[])),("Applied examples",unit.get("examples",[])),("Practice questions",unit.get("practiceQuestions",[]))):
            if entries:
                story.append(Paragraph(label,heading))
                for entry in entries:
                    story.append(Paragraph("• "+escape(str(entry)),body))
    def footer(c,doc):
        c.saveState()
        c.setFont("MAIC-TNR", 9)
        c.setFillColor(colors.black)
        c.line(50,45,562,45)
        c.drawString(50,31,"MAIC — Academic course manual")
        c.drawRightString(562,31,f"Page {doc.page}")
        c.restoreState()
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(out),pagesize=letter,topMargin=55,bottomMargin=62,leftMargin=57,rightMargin=57,
                            title=f"MAIC — {data['title']}",author="Michigan Academy of Innovation and Creativity")
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    if args.expect_pages:
        from pypdf import PdfReader
        pages=len(PdfReader(str(out)).pages)
        if pages!=args.expect_pages:
            out.unlink(missing_ok=True)
            raise ValueError(f"Manual rendered {pages} pages; expected {args.expect_pages}. Revise substance/layout, never pad.")
    print(f"Created: {out}")


if __name__=="__main__":
    ap=argparse.ArgumentParser()
    ap.add_argument("--input",required=True,help="Academic-reviewed course source JSON")
    ap.add_argument("--output",required=True,help="Output PDF path")
    ap.add_argument("--crest",required=True,help="MAIC approved original crest PNG/JPG")
    ap.add_argument("--times-regular",required=True,help="Licensed Times New Roman regular TTF/OTF")
    ap.add_argument("--times-bold",required=True,help="Licensed Times New Roman bold TTF/OTF")
    ap.add_argument("--brand-font",required=True,help="MAIC approved original logo-heading font")
    ap.add_argument("--expect-pages",type=int,default=12,help="Expected substantive page count (default 12)")
    build(ap.parse_args())
