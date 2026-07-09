"""
Report Service
==============
Generates PDF and CSV exports of prediction results using ReportLab.
"""

from __future__ import annotations

import csv
import io
import json
from datetime import datetime
from typing import Any, Dict, List

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OCEAN_DARK   = colors.HexColor("#03045e")
OCEAN_MID    = colors.HexColor("#0077b6")
OCEAN_LIGHT  = colors.HexColor("#00b4d8")
OCEAN_PALE   = colors.HexColor("#caf0f8")
OCEAN_WHITE  = colors.HexColor("#f0f9ff")


# ── PDF ───────────────────────────────────────────────────────────────────────

def generate_pdf(data: Dict[str, Any]) -> bytes:
    """Build a styled PDF report and return the raw bytes."""
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4,
        leftMargin=0.75 * inch, rightMargin=0.75 * inch,
        topMargin=0.75 * inch,  bottomMargin=0.75 * inch,
    )

    styles = getSampleStyleSheet()

    title_s = ParagraphStyle("Title2", parent=styles["Title"],
                             fontSize=22, textColor=OCEAN_MID,
                             spaceAfter=4, alignment=TA_CENTER)
    sub_s   = ParagraphStyle("Sub", parent=styles["Normal"],
                             fontSize=11, textColor=OCEAN_DARK,
                             spaceAfter=14, alignment=TA_CENTER)
    h2_s    = ParagraphStyle("H2", parent=styles["Heading2"],
                             fontSize=13, textColor=OCEAN_MID,
                             spaceBefore=14, spaceAfter=6)
    body_s  = ParagraphStyle("Body", parent=styles["Normal"],
                             fontSize=11, spaceAfter=5, leading=16)

    elems: list = []

    # ── Header ────────────────────────────────────────────────────────────────
    elems.append(Paragraph("🌊  Marine Life Recognition Report", title_s))
    elems.append(Paragraph(
        f"Generated: {datetime.now().strftime('%B %d, %Y  •  %H:%M UTC')}", sub_s
    ))
    elems.append(HRFlowable(width="100%", thickness=2, color=OCEAN_MID))
    elems.append(Spacer(1, 0.2 * inch))

    # ── Summary table ─────────────────────────────────────────────────────────
    elems.append(Paragraph("Prediction Summary", h2_s))

    conf_pct = f"{data.get('confidence', 0) * 100:.1f}%"
    ts = str(data.get("created_at", ""))[:19].replace("T", "  ")
    summary_rows = [
        ["Field", "Value"],
        ["Predicted Species",   data.get("predicted_class", "—")],
        ["Confidence Score",    conf_pct],
        ["Scientific Name",     data.get("scientific_name") or "—"],
        ["Conservation Status", data.get("conservation_status") or "—"],
        ["Average Lifespan",    data.get("lifespan") or "—"],
        ["Analysis Date",       ts or "—"],
    ]
    t = Table(summary_rows, colWidths=[2.5 * inch, 4.5 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",  (0, 0), (-1, 0),  OCEAN_MID),
        ("TEXTCOLOR",   (0, 0), (-1, 0),  colors.white),
        ("FONTNAME",    (0, 0), (-1, 0),  "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, 0),  12),
        ("BACKGROUND",  (0, 1), (-1, -1), OCEAN_WHITE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [OCEAN_WHITE, colors.white]),
        ("FONTNAME",    (0, 1), (0, -1),  "Helvetica-Bold"),
        ("FONTSIZE",    (0, 1), (-1, -1), 11),
        ("GRID",        (0, 0), (-1, -1), 0.5, OCEAN_PALE),
        ("ROWHEIGHT",   (0, 0), (-1, -1), 24),
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        ("PADDING",     (0, 0), (-1, -1), 8),
    ]))
    elems.append(t)
    elems.append(Spacer(1, 0.2 * inch))

    # ── Top-3 predictions ─────────────────────────────────────────────────────
    raw_top3 = data.get("top3_predictions", [])
    if isinstance(raw_top3, str):
        try:
            raw_top3 = json.loads(raw_top3)
        except Exception:
            raw_top3 = []

    if raw_top3:
        elems.append(Paragraph("Top-3 Predictions", h2_s))
        top3_rows = [["Rank", "Species", "Confidence"]]
        bg_palette = [OCEAN_PALE, OCEAN_WHITE, colors.white]
        for i, item in enumerate(raw_top3[:3], 1):
            if isinstance(item, dict):
                top3_rows.append([
                    f"#{i}",
                    item.get("class_name", "—"),
                    f"{item.get('confidence', 0) * 100:.1f}%",
                ])
        t3 = Table(top3_rows, colWidths=[1 * inch, 4.5 * inch, 1.5 * inch])
        t3.setStyle(TableStyle([
            ("BACKGROUND",  (0, 0), (-1, 0), OCEAN_DARK),
            ("TEXTCOLOR",   (0, 0), (-1, 0), colors.white),
            ("FONTNAME",    (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ALIGN",       (0, 0), (-1, -1), "CENTER"),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), bg_palette),
            ("GRID",        (0, 0), (-1, -1), 0.5, OCEAN_LIGHT),
            ("ROWHEIGHT",   (0, 0), (-1, -1), 22),
            ("PADDING",     (0, 0), (-1, -1), 8),
        ]))
        elems.append(t3)
        elems.append(Spacer(1, 0.2 * inch))

    # ── Text sections ─────────────────────────────────────────────────────────
    def _section(title: str, content: Any) -> None:
        if not content:
            return
        elems.append(Paragraph(title, h2_s))
        if isinstance(content, str):
            try:
                content = json.loads(content)
            except Exception:
                pass
        if isinstance(content, list):
            for item in content:
                elems.append(Paragraph(f"• {item}", body_s))
        else:
            elems.append(Paragraph(str(content), body_s))

    _section("Description",              data.get("ai_description"))
    _section("Habitat",                  data.get("habitat"))
    _section("Diet & Feeding",           data.get("food"))
    _section("Interesting Facts",        data.get("interesting_facts"))
    _section("Threats",                  data.get("threats"))
    _section("Conservation & Protection",data.get("protection"))
    _section("Educational Summary",      data.get("educational_summary"))

    # ── Footer ────────────────────────────────────────────────────────────────
    elems.append(Spacer(1, 0.3 * inch))
    elems.append(HRFlowable(width="100%", thickness=1, color=OCEAN_MID))
    elems.append(Paragraph("Marine Life Recognition & Intelligent Marine Assistant", sub_s))
    elems.append(Paragraph("Powered by CNN Deep Learning + Gemini AI", sub_s))

    doc.build(elems)
    buf.seek(0)
    return buf.read()


# ── CSV ───────────────────────────────────────────────────────────────────────

def generate_csv(predictions: list) -> str:
    """Return a CSV string for a list of Prediction ORM objects."""
    out = io.StringIO()
    fields = [
        "id", "predicted_class", "confidence", "scientific_name",
        "habitat", "food", "lifespan", "conservation_status",
        "threats", "protection", "created_at",
    ]
    writer = csv.DictWriter(out, fieldnames=fields)
    writer.writeheader()
    for p in predictions:
        writer.writerow({
            "id":                  p.id,
            "predicted_class":     p.predicted_class,
            "confidence":          f"{p.confidence * 100:.1f}%",
            "scientific_name":     p.scientific_name or "",
            "habitat":             p.habitat or "",
            "food":                p.food or "",
            "lifespan":            p.lifespan or "",
            "conservation_status": p.conservation_status or "",
            "threats":             p.threats or "",
            "protection":          p.protection or "",
            "created_at":          str(p.created_at)[:19] if p.created_at else "",
        })
    return out.getvalue()
