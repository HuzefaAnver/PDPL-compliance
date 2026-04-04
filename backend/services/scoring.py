"""
PDPL Compliance Scoring Logic
RAG: Red/Amber/Green
Score: 0-20  →  0-10 RED, 11-16 AMBER, 17-20 GREEN
"""
from typing import Dict, List, Tuple


def score_answer(value: str, green: str, amber: str) -> int:
    """Map a 3-way answer to 2/1/0 points."""
    if value == green:
        return 2
    elif value == amber:
        return 1
    return 0


def compute_score(data: dict) -> Tuple[int, str, List[str]]:
    """
    Returns (score, risk_level, gaps).
    data must match AssessmentCreate fields.
    """
    score = 0
    gaps: List[str] = []

    # Q1: Data volume — no direct score but modifies risk
    volume = data.get("data_volume", "<100")

    # Q2: Data types — sensitive adds mandatory risk
    data_types = data.get("data_types", [])
    has_sensitive = "sensitive" in data_types
    has_financial = "financial" in data_types

    # Q3: Stores regularly
    s = score_answer(data.get("stores_regularly", "no"), "yes", "sometimes")
    score += s
    if s == 0:
        gaps.append("No regular data processing controls in place")

    # Q4: Knows data location
    s = score_answer(data.get("knows_data_location", "no"), "yes", "partially")
    score += s
    if s == 0:
        gaps.append("No visibility of what data is collected or where it is stored")

    # Q5: Third-party sharing
    s = score_answer(data.get("shares_third_party", "not_sure"), "documented", "not_documented")
    score += s
    if s < 2:
        gaps.append("Third-party data sharing is undocumented or unclear")

    # Q6: Vendor list
    s = score_answer(data.get("vendor_list", "no"), "yes", "partial")
    score += s
    if s == 0:
        gaps.append("No vendor / tools inventory maintained")

    # Q7: Privacy policy
    s = score_answer(data.get("privacy_policy", "no"), "yes", "basic")
    score += s
    if s == 0:
        gaps.append("No privacy policy exists")
    elif s == 1:
        gaps.append("Privacy policy exists but is not PDPL-compliant")

    # Q8: Internal rules
    s = score_answer(data.get("internal_rules", "no"), "yes", "informal")
    score += s
    if s == 0:
        gaps.append("No internal data handling rules or staff training")

    # Q9: Breach plan
    s = score_answer(data.get("breach_plan", "no"), "yes", "basic")
    score += s
    if s == 0:
        gaps.append("No data breach response plan (PDPL requires 72-hr SDAIA notification)")

    # Q10: User rights
    s = score_answer(data.get("user_rights", "no"), "yes", "informal")
    score += s
    if s == 0:
        gaps.append("No process to handle data subject access or deletion requests")

    # Max raw score from Q3-Q10 = 16. Q1 adds 2 if volume small, else penalty
    if volume == ">10000":
        score -= 2  # extra exposure for large volume — pushes toward red
    elif volume == "<100":
        score += 2  # small operator, lower baseline exposure

    # Q2 adjustments
    if has_sensitive:
        gaps.insert(0, "Sensitive data collected — enhanced PDPL Art. 13 controls mandatory")
        if volume == ">10000":
            # Force RED regardless of score
            score = min(score, 10)
        else:
            # Ensure at minimum Amber cap unless score already good
            score = min(score, 16)

    if not data.get("knows_data_location") or data.get("knows_data_location") == "no":
        # Cap: no visibility → can't be Green
        score = min(score, 16)

    # Clamp 0-20
    score = max(0, min(20, score))

    # RAG
    if score <= 10:
        risk_level = "RED"
    elif score <= 16:
        risk_level = "AMBER"
    else:
        risk_level = "GREEN"

    return score, risk_level, gaps
