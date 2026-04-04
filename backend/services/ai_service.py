"""
AI service for PDPL compliance summary generation.
Falls back to rich mock output when no API key is set.
"""
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
USE_MOCK = not OPENAI_API_KEY or OPENAI_API_KEY in ("", "sk-mock")


def build_summary_prompt(assessment: dict) -> str:
    gaps_text = "\n".join(f"- {g}" for g in assessment.get("gaps", []))
    data_types = ", ".join(assessment.get("data_types", [])) or "Not specified"
    return f"""You are a plain-language PDPL compliance advisor. A company has completed a compliance assessment.

Company Profile:
- Company: {assessment.get('company_name', 'Unknown')}
- Industry: {assessment.get('industry', 'Unknown')}
- Data volume handled: {assessment.get('data_volume', 'Unknown')}
- Data types collected: {data_types}
- Risk score: {assessment.get('score', 0)}/20 → {assessment.get('risk_level', 'RED')}

Identified Compliance Gaps:
{gaps_text if gaps_text else "- No major gaps identified"}

Based on this profile, write a concise (200-250 words) PDPL compliance summary that includes:
1. A simple, non-technical explanation of their current risk level
2. The 2-3 most critical gaps they must fix immediately
3. Three concrete, actionable next steps they can take this week

Keep the tone friendly, non-legal, and actionable. No jargon. End with an encouraging note."""


async def generate_compliance_summary(assessment: dict) -> str:
    prompt = build_summary_prompt(assessment)

    if USE_MOCK:
        return _mock_summary(assessment)

    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.4,
    )
    return response.choices[0].message.content


def _mock_summary(assessment: dict) -> str:
    risk = assessment.get("risk_level", "RED")
    company = assessment.get("company_name", "Your company")
    score = assessment.get("score", 0)
    gaps = assessment.get("gaps", [])

    if risk == "RED":
        level_text = "at high risk of PDPL non-compliance"
        urgency = "**Immediate action is required.**"
    elif risk == "AMBER":
        level_text = "at moderate risk — a good foundation exists but key gaps remain"
        urgency = "**Focused effort over the next 30-60 days will get you on track.**"
    else:
        level_text = "in a strong compliance position — just a few refinements needed"
        urgency = "**Great work! Maintain and document your current practices.**"

    top_gaps = gaps[:3] if gaps else ["Review your data handling practices"]
    gap_bullets = "\n".join(f"• {g}" for g in top_gaps)

    return f"""**{company} — PDPL Compliance Summary**

Based on your assessment (score: {score}/20), {company} is currently {level_text}. {urgency}

**Your biggest risks right now:**
{gap_bullets}

**Three things to do this week:**
1. **Document what you have** — List every type of personal data you collect and where it's stored. This takes one afternoon and is the foundation of PDPL compliance.
2. **Review your vendor relationships** — Check whether the tools and apps you use have signed Data Processing Agreements. If not, request them immediately.
3. **Create a simple privacy notice** — Even a one-page document explaining what data you collect, why, and how people can request its deletion puts you ahead of most SMEs.

Saudi Arabia's PDPL enforcement is ramping up. Even small steps today dramatically reduce your exposure to fines of up to SAR 5 million. You've already taken the first step by completing this assessment — keep going! 🚀"""
