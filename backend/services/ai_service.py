"""
AI service wrapping OpenAI. Falls back to rich mock output when no API key is set.
Set OPENAI_API_KEY in .env to use real OpenAI; leave unset for demo mock mode.
"""

import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
USE_MOCK = not OPENAI_API_KEY or OPENAI_API_KEY == "sk-mock"


async def call_ai(prompt: str, max_tokens: int = 2000) -> str:
    if USE_MOCK:
        return await _mock_response(prompt)

    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=max_tokens,
        temperature=0.3,
    )
    return response.choices[0].message.content


# ── Mock responses (demo-quality, realistic content) ─────────────────────────

async def _mock_response(prompt: str) -> str:
    prompt_lower = prompt.lower()

    if "record of processing" in prompt_lower or "ropa" in prompt_lower:
        return _mock_ropa()
    elif "impact assessment" in prompt_lower or "dpia" in prompt_lower:
        return _mock_dpia()
    elif "privacy policy" in prompt_lower:
        return _mock_privacy_policy()
    elif "risk register" in prompt_lower:
        return _mock_risk_register()
    elif "compliance advisor" in prompt_lower or "question" in prompt_lower:
        return _mock_chat(prompt)
    return "Document generated successfully. (Mock mode — set OPENAI_API_KEY for real AI output)"


def _mock_ropa() -> str:
    return """# Record of Processing Activities (ROPA)
**Document Version:** 1.0 | **Classification:** Confidential | **Date:** 2024-01-15
**Review Cycle:** Annual | **Document Owner:** Data Protection Officer

---

## 1. Data Controller Information

| Field | Details |
|-------|---------|
| Controller Name | Acme SaaS Co. Ltd. |
| Commercial Registration | CR-1234567890 |
| Registered Address | King Fahd Road, Riyadh 12345, Saudi Arabia |
| DPO Contact | dpo@acmesaas.com / +966-11-000-0000 |
| SDAIA Registration | Pending / Ref: REG-2024-XXXX |

---

## 2. Processing Activities Register

### Activity 1: Customer Account Management

| Field | Details |
|-------|---------|
| **Purpose** | Create and manage user accounts for SaaS platform access |
| **Legal Basis (PDPL Art. 5)** | Contractual necessity; Performance of contract |
| **Data Categories** | Full name, email address, phone number, job title |
| **Data Subjects** | Customers (B2B users), Employees of client organizations |
| **Retention Period** | Duration of contract + 3 years (per VAT obligations) |
| **Storage Location** | AWS servers (Bahrain region — ap-south-1) |
| **Third-Party Processors** | Salesforce CRM, Stripe (payment processing) |
| **Security Measures** | AES-256 encryption at rest, TLS 1.3 in transit, MFA |
| **Cross-Border Transfer** | Salesforce US servers — SCCs + SDAIA approval required |
| **PDPL Article References** | Art. 5 (lawful basis), Art. 10 (data minimization), Art. 17 (security) |

### Activity 2: Payment Processing

| Field | Details |
|-------|---------|
| **Purpose** | Process subscription payments and issue invoices |
| **Legal Basis (PDPL Art. 5)** | Contractual necessity; Legal obligation |
| **Data Categories** | Billing address, payment card data (tokenized), transaction history |
| **Data Subjects** | Paying customers, Billing contacts |
| **Retention Period** | 7 years (per ZATCA financial record requirements) |
| **Storage Location** | Stripe PCI-DSS compliant vaults (not stored locally) |
| **Third-Party Processors** | Stripe Payments, ZATCA e-invoicing system |
| **Security Measures** | PCI-DSS Level 1 compliance via Stripe; no raw card data stored |
| **Cross-Border Transfer** | Stripe EU/US — Standard Contractual Clauses in place |
| **PDPL Article References** | Art. 5, Art. 29 (cross-border transfers), Art. 17 |

### Activity 3: Analytics & Product Improvement

| Field | Details |
|-------|---------|
| **Purpose** | Understand usage patterns, improve product features |
| **Legal Basis (PDPL Art. 5)** | Legitimate interests (balanced against data subject rights) |
| **Data Categories** | Usage logs, feature clicks, session duration, device/browser info |
| **Data Subjects** | All platform users |
| **Retention Period** | 13 months (rolling) |
| **Storage Location** | Mixpanel (US-based) |
| **Third-Party Processors** | Mixpanel, Google Analytics 4 |
| **Security Measures** | IP anonymization enabled; pseudonymization of user IDs |
| **Cross-Border Transfer** | US servers — requires SDAIA cross-border transfer notification |
| **PDPL Article References** | Art. 5(e), Art. 29, Art. 8 (consent for non-essential tracking) |

---

## 3. Data Retention Schedule

| Data Type | Retention Period | Legal Basis | Deletion Method |
|-----------|-----------------|-------------|-----------------|
| Account data | Contract + 3 years | PDPL Art. 5 / ZATCA | Secure wipe + audit log |
| Financial records | 7 years | ZATCA Law | Archive then delete |
| Analytics data | 13 months | Legitimate interests | Automated purge |
| Support tickets | 2 years | Legitimate interests | Soft delete |
| Marketing consent records | Until withdrawn + 3 years | Art. 8 | Immutable audit log |

---

## 4. Data Subject Rights Procedures

Per PDPL Chapter 3 (Articles 18–25), data subjects may exercise:
- **Right of Access** — Response within 30 days via privacy@acmesaas.com
- **Right to Correction** — In-app self-service + email request
- **Right to Deletion** — Processed within 30 days; retention obligations may delay
- **Right to Objection** — For legitimate interest processing
- **Right to Data Portability** — Export in CSV/JSON format

---

## 5. Review & Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Data Protection Officer | [DPO Name] | _________ | _____ |
| Legal Counsel | [Legal Name] | _________ | _____ |
| CEO / Management | [CEO Name] | _________ | _____ |

*Next Scheduled Review: January 2025*
"""


def _mock_dpia() -> str:
    return """# Data Protection Impact Assessment (DPIA-Lite)
**Reference:** DPIA-2024-001 | **Classification:** Confidential
**Prepared by:** Data Protection Officer | **Date:** 2024-01-15

---

## 1. Executive Summary

This DPIA-Lite has been conducted in accordance with Saudi Arabia's Personal Data Protection Law (PDPL), specifically Article 14, which requires a DPIA for processing activities likely to result in high risk to individuals' rights and freedoms.

**Assessment Outcome:** MEDIUM risk — Processing may proceed with recommended mitigations implemented within 90 days.

---

## 2. Processing Description & Necessity

**Processing Activity:** Multi-channel customer data collection and analytics for SaaS platform operations.

**Necessity Assessment:** The processing is necessary for contractual performance and legitimate business operations. Data minimization principles applied — only data required for stated purposes is collected.

**Proportionality:** ✅ Data collected is proportionate to business needs. Analytics data is pseudonymized.

---

## 3. Risk Assessment Matrix

| # | Risk Description | PDPL Ref | Likelihood | Impact | Score | Level | Mitigation |
|---|----------------|---------|-----------|--------|-------|-------|------------|
| R01 | Unauthorized access to customer PII via credential compromise | Art. 17 | 3 | 5 | **15** | 🟡 MEDIUM | MFA enforcement, privileged access management |
| R02 | Third-party vendor data breach (Salesforce/Stripe) | Art. 29 | 2 | 5 | **10** | 🟡 MEDIUM | Vendor DPAs, SOC2 certification review quarterly |
| R03 | Cross-border transfer without SDAIA approval | Art. 29 | 4 | 4 | **16** | 🔴 HIGH | Immediate SDAIA notification filing; SCCs in place |
| R04 | Failure to honor data subject deletion requests within 30 days | Art. 21 | 3 | 3 | **9** | 🟡 MEDIUM | Automated DSR workflow; tracking system |
| R05 | Retention of data beyond specified periods | Art. 10 | 3 | 3 | **9** | 🟡 MEDIUM | Automated deletion policies; quarterly audits |
| R06 | Inadequate consent mechanism for analytics tracking | Art. 8 | 4 | 3 | **12** | 🟡 MEDIUM | Implement granular consent management (OneTrust/equivalent) |

**Risk Score Formula:** Likelihood (1–5) × Impact (1–5)
- 🟢 **Low:** < 9 | 🟡 **Medium:** 9–16 | 🔴 **High:** > 16

---

## 4. Priority Mitigation Actions

### 🔴 CRITICAL — Cross-Border Transfer Approval (R03)
- **Action:** File SDAIA cross-border data transfer notification immediately
- **Owner:** DPO / Legal Counsel
- **Deadline:** 30 days
- **Cost Estimate:** SAR 5,000–15,000 (legal fees)

### 🟡 HIGH PRIORITY — MFA & Access Controls (R01)
- **Action:** Mandate MFA for all admin accounts; implement RBAC audit
- **Owner:** CTO / IT Security
- **Deadline:** 45 days
- **Cost Estimate:** SAR 2,000–8,000 (tooling)

### 🟡 HIGH PRIORITY — Consent Management (R06)
- **Action:** Deploy consent management platform; update cookie banner
- **Owner:** Product Team + Legal
- **Deadline:** 60 days
- **Cost Estimate:** SAR 3,000–12,000/year

---

## 5. Residual Risk Evaluation

After implementing all recommended mitigations:
- Overall residual risk: **LOW-MEDIUM**
- Acceptable for business operations: **YES**, subject to quarterly review

---

## 6. Consultation Requirements

Per PDPL and SDAIA guidelines:
- [x] Internal DPO consultation completed
- [ ] SDAIA prior consultation — **Required for cross-border transfers (R03)**
- [ ] Data subject consultation — Not required for this processing

---

## 7. Decision & Sign-off

**Decision:** ✅ Processing may proceed with mitigations

| Approver | Role | Date |
|---------|------|------|
| [Name] | Data Protection Officer | _____ |
| [Name] | Chief Technology Officer | _____ |
| [Name] | Chief Executive Officer | _____ |
"""


def _mock_privacy_policy() -> str:
    return """# Privacy Policy
**Effective Date:** January 15, 2024 | **Last Updated:** January 15, 2024
**Version:** 1.0

---

## 1. Introduction

Welcome to Acme SaaS Co. Ltd. ("we," "us," or "our"). We are committed to protecting your personal data in accordance with Saudi Arabia's **Personal Data Protection Law (PDPL)** — Royal Decree M/19 dated 09/02/1443H (corresponding to September 16, 2021), and its implementing regulations issued by the **Saudi Data & AI Authority (SDAIA)**.

This Privacy Policy explains how we collect, use, share, and protect your personal data when you use our services.

**Data Controller:** Acme SaaS Co. Ltd.
**Contact:** privacy@acmesaas.com | +966-11-000-0000
**DPO Email:** dpo@acmesaas.com

---

## 2. Data We Collect

We collect the following categories of personal data:

### 2.1 Information You Provide
- **Identity Data:** Full name, job title, company name
- **Contact Data:** Email address, phone number, billing address
- **Account Data:** Username, password (hashed), subscription tier
- **Financial Data:** Billing information (processed via Stripe — we do not store card numbers)

### 2.2 Data Collected Automatically
- **Usage Data:** Pages visited, features used, session duration, click patterns
- **Technical Data:** IP address (anonymized), browser type, device information, cookies
- **Log Data:** Access logs, error logs, API call records

### 2.3 Data from Third Parties
- Information provided by your employer (if your account is part of a corporate subscription)
- Public business information for account verification

---

## 3. How We Use Your Data

We use your personal data only for the following purposes with corresponding legal bases under **PDPL Article 5**:

| Purpose | Legal Basis (PDPL Art. 5) |
|---------|--------------------------|
| Provide and manage your account | Performance of contract |
| Process payments and invoicing | Performance of contract; Legal obligation |
| Send service notifications | Legitimate interests |
| Improve our product features | Legitimate interests (anonymized analytics) |
| Send marketing communications | Your consent (Art. 8) |
| Comply with legal obligations | Legal obligation |
| Prevent fraud and abuse | Legitimate interests; Legal obligation |

---

## 4. Sensitive Personal Data

We do **not** intentionally collect sensitive personal data as defined under **PDPL Article 13** (including health, biometric, religious, or financial credit data). If you voluntarily provide such information in support tickets or communications, it will be handled with enhanced security measures and deleted as soon as the matter is resolved.

---

## 5. Data Sharing & Third Parties

We share your data with the following categories of third parties, all bound by Data Processing Agreements (DPAs):

| Third Party | Purpose | Location | Safeguards |
|------------|---------|----------|-----------|
| Salesforce | CRM & customer management | USA | SCCs + DPA |
| Stripe | Payment processing | USA/EU | PCI-DSS + DPA |
| Mixpanel | Product analytics | USA | SCCs + DPA; IP anonymized |
| AWS | Cloud infrastructure | Bahrain (primary) | ISO 27001 + DPA |
| Google Analytics | Website analytics | USA | SCCs; IP anonymized |

We **never** sell your personal data to third parties.

---

## 6. International Data Transfers

Some of our service providers are located outside Saudi Arabia. Where we transfer your data internationally, we ensure:
- Adequate level of protection exists in the destination country, OR
- Appropriate safeguards are in place (Standard Contractual Clauses), AND
- We have notified **SDAIA** as required under **PDPL Article 29**

---

## 7. Data Retention

We retain your personal data only as long as necessary:

| Data Type | Retention Period |
|-----------|-----------------|
| Account data | Duration of contract + 3 years |
| Financial records | 7 years (ZATCA requirement) |
| Analytics data | 13 months (rolling) |
| Marketing preferences | Until you withdraw consent + 3 years |
| Support communications | 2 years |

---

## 8. Your Rights as a Data Subject

Under **PDPL Chapter 3**, you have the following rights:

- **Right of Access (Art. 18):** Request a copy of your personal data
- **Right to Correction (Art. 19):** Request correction of inaccurate data
- **Right to Deletion (Art. 21):** Request deletion of your data (subject to legal retention obligations)
- **Right to Objection (Art. 22):** Object to processing based on legitimate interests
- **Right to Data Portability:** Receive your data in a structured, machine-readable format

**To exercise your rights:** Email privacy@acmesaas.com with subject "Data Subject Request"
We will respond within **30 days** (extendable by 30 days for complex requests).

---

## 9. Cookies & Tracking

We use cookies and similar technologies. By using our service, you consent to our use of:
- **Essential Cookies:** Required for the platform to function (no consent needed)
- **Analytics Cookies:** Help us improve our service (consent required)
- **Marketing Cookies:** Personalized communications (consent required)

You can manage cookie preferences in your account settings or browser.

---

## 10. Security Measures

We implement appropriate technical and organizational measures per **PDPL Article 17**:
- AES-256 encryption for data at rest
- TLS 1.3 for data in transit
- Multi-factor authentication for all employee accounts
- Annual penetration testing
- ISO 27001-aligned information security management

---

## 11. Children's Privacy

Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected such data, contact us immediately at privacy@acmesaas.com.

---

## 12. How to Lodge a Complaint

If you are unsatisfied with our response to your privacy request, you have the right to lodge a complaint with **SDAIA**:

**Saudi Data & AI Authority (SDAIA)**
Website: www.sdaia.gov.sa
Email: pdpl@sdaia.gov.sa

---

## 13. Updates to This Policy

We may update this Privacy Policy periodically. Material changes will be notified via email or prominent notice on our platform at least 30 days before taking effect.
"""


def _mock_risk_register() -> str:
    return """# PDPL Compliance Risk Register
**Document ID:** RR-2024-001 | **Version:** 1.0 | **Date:** January 15, 2024
**Review Frequency:** Quarterly | **Owner:** Data Protection Officer
**Risk Appetite:** LOW — We aim to maintain all PDPL compliance risks below MEDIUM level

---

## 1. Risk Management Framework

Risks are scored using: **Risk Score = Likelihood × Impact**
- 🟢 **Low Risk:** 1–8
- 🟡 **Medium Risk:** 9–16
- 🔴 **High Risk:** 17–25

---

## 2. Risk Register

| ID | Risk Description | PDPL Art. | Category | Likelihood | Impact | Score | Level | Current Controls | Recommended Actions | Owner | Target | Status |
|----|-----------------|-----------|----------|-----------|--------|-------|-------|-----------------|--------------------|----|-------|--------|
| R01 | No documented ROPA maintained | Art. 12 | Legal | 4 | 4 | **16** | 🟡 MEDIUM | None identified | Complete ROPA immediately; assign DPO responsibility | DPO | 30 days | 🔴 Open |
| R02 | Cross-border data transfers to Salesforce/Mixpanel without SDAIA notification | Art. 29 | Legal | 5 | 5 | **25** | 🔴 HIGH | SCCs referenced | File SDAIA transfer notification immediately; obtain legal opinion | DPO + Legal | 14 days | 🔴 Open |
| R03 | Inadequate consent mechanism for analytics cookies | Art. 8 | Legal | 4 | 3 | **12** | 🟡 MEDIUM | Basic cookie banner | Deploy compliant CMP; granular consent options | Product + Legal | 45 days | 🟡 In Progress |
| R04 | No formal process for handling Data Subject Rights requests | Art. 18–25 | Operational | 3 | 4 | **12** | 🟡 MEDIUM | Ad-hoc email handling | Implement DSR tracking system; define 30-day SLA | DPO + Support | 45 days | 🔴 Open |
| R05 | Vendor due diligence not completed for all third parties | Art. 29 | Legal | 4 | 4 | **16** | 🟡 MEDIUM | Some DPAs in place | Complete DPA review for all vendors; quarterly re-assessment | Legal | 60 days | 🟡 In Progress |
| R06 | Data breach response plan not formally documented | Art. 17 | Operational | 3 | 5 | **15** | 🟡 MEDIUM | Informal procedures | Create incident response plan; 72-hour SDAIA notification procedure | CTO + DPO | 30 days | 🔴 Open |
| R07 | Staff not trained on PDPL obligations | Art. 32 | Operational | 4 | 3 | **12** | 🟡 MEDIUM | No formal training | Conduct PDPL awareness training; annual refresher | HR + DPO | 60 days | 🔴 Open |
| R08 | Data retention policies not enforced automatically | Art. 10 | Technical | 3 | 3 | **9** | 🟡 MEDIUM | Manual review | Implement automated data lifecycle management | CTO | 90 days | 🔴 Open |
| R09 | Privacy Policy not PDPL-compliant | Art. 11 | Legal | 3 | 4 | **12** | 🟡 MEDIUM | Outdated policy exists | Update privacy policy; legal review + publish | Legal | 30 days | 🟡 In Progress |
| R10 | PDPL regulatory penalty risk (up to 5M SAR) | Art. 35 | Reputational | 2 | 5 | **10** | 🟡 MEDIUM | No mitigation | Complete compliance program; engage SDAIA proactively | CEO + DPO | 90 days | 🔴 Open |
| R11 | Sensitive data (health info) collected without enhanced controls | Art. 13 | Legal | 2 | 5 | **10** | 🟡 MEDIUM | None identified | Audit data collection; implement Art. 13 controls if applicable | DPO + CTO | 30 days | 🔴 Open |
| R12 | No DPO formally appointed | Art. 32 | Legal | 3 | 3 | **9** | 🟡 MEDIUM | Owner acting as DPO | Formally appoint DPO; register with SDAIA | CEO | 30 days | 🔴 Open |

---

## 3. Priority Action Plan

### 🚨 IMMEDIATE (0–14 days)
**R02 — SDAIA Cross-Border Transfer Notification**
Cross-border transfer violations carry the highest regulatory risk. File notification immediately with SDAIA portal.
*Responsible: DPO + Legal Counsel*

### ⚡ SHORT-TERM (15–30 days)
**R01 — Complete ROPA Documentation**
A documented ROPA is foundational to all PDPL compliance. Complete and get management sign-off.
*Responsible: DPO*

**R06 — Data Breach Response Plan**
PDPL requires SDAIA notification within 72 hours of becoming aware of a breach. Plan must be ready.
*Responsible: CTO + DPO*

---

## 4. Risk Summary Dashboard

| Risk Level | Count | % of Total |
|-----------|-------|-----------|
| 🔴 High | 1 | 8% |
| 🟡 Medium | 11 | 92% |
| 🟢 Low | 0 | 0% |

**Overall PDPL Compliance Maturity:** ⚠️ Developing (Score: 35/100)
**Recommended Focus:** Legal documentation, vendor management, and staff training

---

## 5. Review Schedule

| Review Type | Frequency | Next Date | Responsible |
|------------|-----------|-----------|-------------|
| Risk Register Update | Quarterly | April 15, 2024 | DPO |
| Control Effectiveness Review | Semi-annual | July 15, 2024 | DPO + CTO |
| Full PDPL Audit | Annual | January 2025 | External Auditor |
| Incident-triggered Review | As needed | — | DPO |
"""


def _mock_chat(prompt: str) -> str:
    if "compliant" in prompt.lower():
        return """Based on the information you've provided, your company is currently in an **early compliance stage** with Saudi Arabia's PDPL.

**What's working:** You've identified your data types and key vendors, which is a great starting point.

**Key gaps to address:**
1. **SDAIA Cross-Border Transfer Notification** — If you're using US-based tools like Salesforce or Mixpanel, you likely need to file with SDAIA under Article 29. This is your most urgent item.
2. **Formal ROPA documentation** — Required under Article 12. Without it, you have no documented evidence of compliance.
3. **Privacy Policy update** — Must explicitly cover all rights under PDPL Chapter 3.

My estimate: you're approximately **35–45% compliant** today. With focused effort over 60–90 days, you could reach 80%+ with the documents we generate here.

**Next step:** Download your generated ROPA and Privacy Policy, have them reviewed by a legal counsel familiar with PDPL, and file the SDAIA cross-border transfer notification as soon as possible."""

    return """Great question! Based on your company profile, here's my advice:

Your highest priority right now is ensuring your **vendor contracts include proper Data Processing Agreements (DPAs)**. Under PDPL Article 29, you're responsible for ensuring third parties handling your customers' data maintain equivalent protection standards.

For your specific tools (CRM, payment gateway, analytics), I'd recommend:
1. Request the latest DPA from each vendor
2. Verify they have adequate security certifications (SOC 2, ISO 27001)
3. Check whether they offer data residency in the GCC region to simplify cross-border compliance

The Saudi Data & AI Authority (SDAIA) has published detailed guidelines on vendor management that are worth reviewing. Would you like me to explain any specific PDPL article in more detail?"""
