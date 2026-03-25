"""
Structured AI prompts for PDPL compliance document generation.
Saudi Arabia Personal Data Protection Law (PDPL) — Royal Decree M/19, 2021.
"""


def build_company_context(company: dict) -> str:
    return f"""
Company Name: {company['name']}
Industry: {company['industry']}
Country: {company.get('country', 'Saudi Arabia')}
Employee Count: {company.get('employee_count', 'Not specified')}
Data Types Collected: {', '.join(company.get('data_types', [])) or 'Not specified'}
Tools Used: {', '.join(company.get('tools_used', [])) or 'Not specified'}
Third-Party Vendors: {', '.join(company.get('third_party_vendors', [])) or 'None listed'}
Processing Activities: {company.get('processing_activities', 'Not specified')}
""".strip()


def ropa_prompt(company: dict) -> str:
    ctx = build_company_context(company)
    return f"""You are a Saudi Arabia PDPL (Personal Data Protection Law) compliance expert.

Generate a formal Record of Processing Activities (ROPA) document for the following company. 
The ROPA must align with Saudi Arabia's PDPL requirements (Royal Decree M/19, 2021 and its amendments).

{ctx}

Structure the ROPA with these sections:
1. Document Header (Company info, date, version)
2. Data Controller Information
3. Processing Activities Table (for each data type: purpose, legal basis under PDPL, categories of data subjects, data categories, retention period, security measures, third-party transfers)
4. International Data Transfers (if applicable)
5. Data Subject Rights Procedures
6. Data Retention Schedule
7. Review & Approval

Use formal, legal language. Reference specific PDPL articles where relevant (e.g., Article 5 for lawful basis, Article 13 for sensitive data, Article 29 for cross-border transfers).
Format with clear headers and structured tables where appropriate.
"""


def dpia_prompt(company: dict) -> str:
    ctx = build_company_context(company)
    return f"""You are a Saudi Arabia PDPL compliance expert.

Generate a Data Protection Impact Assessment (DPIA-Lite) for the following company.
This should align with PDPL requirements for high-risk processing activities.

{ctx}

Structure the DPIA with these sections:
1. Executive Summary
2. Processing Description & Necessity
3. Risk Assessment Matrix
   - Identify 4-6 key risks based on their data types and tools
   - Rate each: Likelihood (1-5) × Impact (1-5) = Risk Score
   - Risk Level: Low (<9), Medium (9-16), High (>16)
4. Consultation Requirements (Data subjects, DPA notification needs)
5. Mitigation Measures
6. Residual Risk Evaluation
7. Decision & Sign-off

Reference PDPL Article 14 (DPIA requirements) and SDAIA guidelines.
Be specific to their industry ({company['industry']}) and actual data types used.
"""


def policy_prompt(company: dict) -> str:
    ctx = build_company_context(company)
    return f"""You are a Saudi Arabia PDPL compliance expert.

Generate a comprehensive Privacy Policy for the following company that fully complies with 
Saudi Arabia's Personal Data Protection Law (PDPL).

{ctx}

The Privacy Policy must include:
1. Introduction & Identity of Data Controller
2. Data We Collect (specific to their data types)
3. How We Use Your Data (lawful bases per PDPL Article 5)
4. Sensitive Data Handling (if applicable — PDPL Article 13)
5. Data Sharing & Third Parties (name their actual vendors/tools)
6. International Data Transfers (PDPL Article 29)
7. Data Retention Periods
8. Your Rights as a Data Subject (PDPL Chapter 3: access, correction, deletion, objection, portability)
9. Cookies & Tracking (if applicable)
10. Security Measures
11. Children's Data (PDPL protections)
12. How to Contact Us / Lodge Complaints (SDAIA)
13. Updates to This Policy

Write in clear, plain language appropriate for end users. 
Include specific contact mechanisms for data subject requests.
"""


def risk_register_prompt(company: dict) -> str:
    ctx = build_company_context(company)
    return f"""You are a Saudi Arabia PDPL compliance expert.

Generate a comprehensive PDPL Compliance Risk Register for the following company.

{ctx}

Structure the Risk Register with:
1. Document Header & Risk Management Framework
2. Risk Register Table with 8-12 risks covering:
   - Risk ID, Risk Description, PDPL Article Reference
   - Category (Legal, Technical, Operational, Reputational)
   - Likelihood (1-5), Impact (1-5), Risk Score, Risk Level
   - Current Controls in Place
   - Recommended Actions
   - Owner (role), Target Date, Status
3. Priority Action Plan (Top 3 critical risks)
4. Risk Appetite Statement
5. Review Schedule

Focus risks on their specific context: {company['industry']} company using {', '.join(company.get('tools_used', ['various tools']))}.
Include risks around: data breaches, consent management, vendor due diligence, cross-border transfers, 
data subject rights, retention compliance, and regulatory penalties (up to 5M SAR per PDPL).
"""


def chat_prompt(company: dict, question: str) -> str:
    ctx = build_company_context(company)
    return f"""You are a friendly PDPL (Saudi Arabia Personal Data Protection Law) compliance advisor 
helping an SME understand their compliance status.

Company Context:
{ctx}

User Question: {question}

Provide a helpful, specific answer based on their company data. 
- Be concise but thorough (2-4 paragraphs max)
- Reference specific PDPL articles when relevant
- Give actionable advice
- If they ask about compliance status, assess based on what they've told you
- Mention SDAIA (Saudi Data & AI Authority) as the regulator when relevant
- Use a friendly, consultant tone — not overly legalistic
"""
