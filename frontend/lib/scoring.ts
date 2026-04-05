/**
 * Scoring logic for PDPL Compliance Assessment
 */

export interface AssessmentResponses {
    [key: string]: string | string[] | boolean;
}

export function calculateRiskScore(responses: AssessmentResponses) {
    // Simple rule-based scoring (dummy logic for demonstration)
    // Higher score = higher risk
    let score = 0;
    const weights: { [key: string]: number } = {
        'data_volume': 10,
        'sensitive_data': 20,
        'global_transfer': 15,
        'maturity_policy': -5,
        'maturity_training': -5,
    };

    for (const [key, value] of Object.entries(responses)) {
        if (weights[key]) {
            if (typeof value === 'boolean') {
                score += value ? weights[key] : 0;
            } else if (Array.isArray(value)) {
                score += value.length * (weights[key] / 5);
            } else if (typeof value === 'string' && value.toLowerCase().includes('high')) {
                score += weights[key];
            }
        }
    }

    // Normalize or cap
    score = Math.max(0, Math.min(100, score));

    let level: 'Low' | 'Moderate' | 'High' = 'Low';
    if (score > 60) level = 'High';
    else if (score > 30) level = 'Moderate';

    return { score, level };
}

export function extractKeyGaps(responses: AssessmentResponses) {
    const gaps: string[] = [];

    // Rule 1: Sensitive Data without explicit consent mechanism
    if (responses['sensitive_data'] && !responses['consent_policy']) {
        gaps.push('Collection of sensitive data without a formal consent management framework.');
    }

    // Rule 2: Global transfer without DPA
    if (responses['global_transfer'] && !responses['dpa_in_place']) {
        gaps.push('International data transfers occurring without Data Processing Agreements (DPAs).');
    }

    // Rule 3: No dedicated DPO
    if (!responses['dpo_assigned']) {
        gaps.push('Absence of a designated Data Protection Officer (DPO) or equivalent.');
    }

    return gaps;
}
