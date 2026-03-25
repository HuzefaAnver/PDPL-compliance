"""
Rule-based gap analysis for PDPL compliance.
Produces a score, risk level, gaps, and recommendations.
"""
from typing import Dict, List, Any


SENSITIVE_DATA_TYPES = {"health", "biometric", "financial", "children", "religious", "criminal"}

HIGH_RISK_TOOLS = {
    "analytics": "Cross-border analytics transfer (PDPL Art. 29)",
    "crm": "CRM vendor DPA verification required",
    "payment_gateway": "PCI-DSS + financial data under PDPL Art. 13",
    "hr_system": "Employee data processing obligations",
    "marketing_automation": "Consent management for marketing (PDPL Art. 8)",
}


def run_gap_analysis(company: dict) -> dict:
    score = 0
    max_score = 100
    gaps = []
    recommendations = []
    risk_points = 0

    data_types: list = company.get("data_types", [])
    tools: list = company.get("tools_used", [])
    vendors: list = company.get("third_party_vendors", [])
    activities: str = company.get("processing_activities", "")

    # ── Positive scoring ─────────────────────────────────────
    if data_types:
        score += 15
    else:
        gaps.append({
            "severity": "high",
            "code": "NO_DATA_TYPES",
            "title": "No data types identified",
            "description": "You must identify and classify all personal data categories you process (PDPL Art. 10).",
            "article": "Art. 10"
        })

    if vendors:
        score += 10
    else:
        gaps.append({
            "severity": "medium",
            "code": "NO_VENDORS",
            "title": "No third-party vendors listed",
            "description": "All data processors must be identified and have Data Processing Agreements (DPAs) in place (PDPL Art. 29).",
            "article": "Art. 29"
        })
        recommendations.append("List all third-party vendors and obtain signed DPAs from each.")
        risk_points += 10

    if activities and len(activities) > 20:
        score += 10
    else:
        gaps.append({
            "severity": "medium",
            "code": "NO_ACTIVITIES",
            "title": "Processing activities not described",
            "description": "Document all data processing activities for your ROPA (PDPL Art. 12).",
            "article": "Art. 12"
        })

    if tools:
        score += 10

    # ── Sensitive data checks ─────────────────────────────────
    sensitive_found = [d for d in data_types if d.lower() in SENSITIVE_DATA_TYPES]
    if sensitive_found:
        risk_points += 25
        score -= 10
        gaps.append({
            "severity": "high",
            "code": "SENSITIVE_DATA",
            "title": f"Sensitive data collected: {', '.join(sensitive_found)}",
            "description": "Sensitive personal data requires explicit consent and enhanced security under PDPL Article 13. A DPIA is mandatory.",
            "article": "Art. 13"
        })
        recommendations.append("Conduct a full DPIA for sensitive data processing.")
        recommendations.append("Obtain explicit written consent for all sensitive data (PDPL Art. 13).")

    # ── Tool-specific checks ──────────────────────────────────
    tools_lower = [t.lower() for t in tools]

    if any("crm" in t for t in tools_lower):
        risk_points += 5
        recommendations.append("Ensure your CRM vendor DPA covers PDPL Art. 29 cross-border transfer requirements.")

    if any("analytic" in t for t in tools_lower) or any("google" in t for t in tools_lower):
        risk_points += 10
        gaps.append({
            "severity": "medium",
            "code": "ANALYTICS_TRANSFER",
            "title": "Analytics tool may involve cross-border data transfers",
            "description": "Tools like Google Analytics transfer data outside Saudi Arabia. SDAIA notification required (PDPL Art. 29).",
            "article": "Art. 29"
        })
        recommendations.append("File SDAIA cross-border transfer notification for analytics tools.")

    if any("payment" in t for t in tools_lower):
        risk_points += 5
        recommendations.append("Ensure payment gateway is PCI-DSS compliant and financial data handling meets PDPL Art. 13 requirements.")

    # ── Document completion score (simulated) ─────────────────
    # These get added as documents are generated
    score += 15  # ROPA generated
    score += 10  # DPIA generated
    score += 15  # Privacy Policy generated
    score += 10  # Risk Register generated

    # ── Baseline PDPL gaps always present for SMEs ────────────
    gaps.append({
        "severity": "high",
        "code": "NO_DPO",
        "title": "Data Protection Officer (DPO) not confirmed",
        "description": "PDPL requires appointment of a DPO for companies processing significant personal data (Art. 32).",
        "article": "Art. 32"
    })
    recommendations.append("Formally appoint a DPO and register with SDAIA.")

    gaps.append({
        "severity": "medium",
        "code": "STAFF_TRAINING",
        "title": "Staff PDPL training not confirmed",
        "description": "All staff handling personal data must be trained on PDPL obligations (Art. 32).",
        "article": "Art. 32"
    })
    recommendations.append("Conduct PDPL awareness training for all staff within 60 days.")

    gaps.append({
        "severity": "medium",
        "code": "INCIDENT_PLAN",
        "title": "No data breach response plan",
        "description": "PDPL requires notification to SDAIA within 72 hours of a data breach. A response plan is essential.",
        "article": "Art. 17"
    })
    recommendations.append("Create an incident response plan with 72-hour SDAIA notification procedure.")

    # ── Finalize score ────────────────────────────────────────
    score = max(5, min(score, 100))

    if risk_points < 15:
        risk_level = "Low"
    elif risk_points < 35:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # Sort gaps: high → medium → low
    severity_order = {"high": 0, "medium": 1, "low": 2}
    gaps.sort(key=lambda g: severity_order.get(g["severity"], 2))

    return {
        "overall_score": round(score, 1),
        "risk_level": risk_level,
        "gaps": gaps,
        "recommendations": recommendations[:8],  # top 8
    }
