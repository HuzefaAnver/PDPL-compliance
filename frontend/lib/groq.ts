// export async function generateAIReport(assessmentData: any, score: number, level: string) {
//     const apiKey = process.env.GROQ_API_KEY;
//     const model = process.env.GROQ_MODEL || 'llama-3.3-70b-specdec';

//     if (!apiKey) {
//         throw new Error('GROQ_API_KEY is not defined');
//     }

//     const riskColor = level === 'High' ? '#E24B4A' : level === 'Moderate' ? '#EF9F27' : '#639922';

//     const prompt = `
//     ### Task
//     Review the following compliance assessment data and generate a high-end, structured HTML compliance report — not plain text.

//     ### Context
//     Score: ${score} / 100
//     Risk Level: ${level}
//     Data: ${JSON.stringify(assessmentData, null, 2)}

//     ### Aesthetic Requirements (CRITICAL)
//     - **Color Palette**: Midnight (#0a0f1e), Gold (#c4a254), Eggshell (#e8e4d8).
//     - **Vibe**: Luxury, professional, authoritative.
//     - **UI Elements**: Use glassmorphism (semi-transparent backgrounds), gold borders (1px solid rgba(196, 162, 84, 0.2)), and soft shadows.

//     ### Requirements
//     1. **Output ONLY valid HTML**. Do not include markdown, no backticks, no preamble, no explanation.
//     2. **Inline Styles Only**. Use inline CSS for all styling.
//     3. **Tone**: Senior Compliance Partner. Direct, objective, and strategic. Reference specific PDPL articles where relevant (Articles 5, 7, 13, 19, 21).

//     ### Structure Sections
//     1. **Executive Insight**: A refined summary. Use a <div> with background: rgba(10, 15, 30, 0.4); border: 1px solid rgba(196, 162, 84, 0.1); padding: 24px; border-radius: 12px. Include the score "${score} / 100" in a gold, bold <span> with font-size 42px.
//     2. **Risk Posture Banner**: A sophisticated banner. Background: linear-gradient(90deg, ${riskColor} 0%, rgba(10, 15, 30, 0.1) 100%); color: #e8e4d8; font-family: sans-serif; letter-spacing: 2px; padding: 16px; border-left: 4px solid ${riskColor}; margin-top: 24px;
//     3. **Key Strategic Gaps**: Each gap as a luxury card (background: rgba(196, 162, 84, 0.03); border: 1px solid rgba(196, 162, 84, 0.1); padding: 16px; margin-bottom: 12px; border-radius: 8px). Include bold titles and small, gold-colored PDPL article tags.
//     4. **Implementation Roadmap**: A clean 3-column table or flex layout for 30/60/90 day actions. 
//     5. **Compliance Strengths**: A section highlighting positive findings with a soft gold left border.

//     ### DO NOT INCLUDE
//     - Any "Book a consultation" or "Schedule a call" buttons or links.
//     - Any conversational filler (e.g., "Certainly, here is your report").
//     `;

//     try {
//         const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${apiKey}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 model: model,
//                 messages: [
//                     {
//                         role: 'system',
//                         content: 'You are a Senior PDPL Compliance expert. Return ONLY raw HTML with inline styles. No markdown. No explanation. No backticks. No conversational filler.'
//                     },
//                     { role: 'user', content: prompt }
//                 ],
//                 temperature: 0.2,
//                 max_tokens: 2500,
//                 top_p: 1,
//             }),
//         });

//         if (!response.ok) {
//             const errorBody = await response.text();
//             console.error('Groq Error Body:', errorBody);
//             throw new Error(`AI Service Unavailable (${response.status})`);
//         }

//         const data = await response.json();
//         if (!data.choices || data.choices.length === 0) {
//             throw new Error('AI Generation failed: No response from model');
//         }

//         let html = data.choices[0].message.content;

//         // Final cleaning in case the model ignores the "no backticks" instruction
//         html = html.replace(/```html/g, '').replace(/```/g, '').trim();

//         return html;
//     } catch (error: any) {
//         console.error('AI Report Generation Error:', error);
//         return null; // Return null so the frontend can handle fallback
//     }
// }

export async function generateAIReport(assessmentData: any, score: number, level: string) {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';

    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not defined');
    }

    const riskColor =
        level === 'High' ? '#C0392B' :
            level === 'Moderate' ? '#D4880A' :
                '#2E7D32';

    const riskBg =
        level === 'High' ? 'rgba(192,57,43,0.15)' :
            level === 'Moderate' ? 'rgba(212,136,10,0.15)' :
                'rgba(46,125,50,0.15)';

    const scoreColor = score >= 70 ? '#2E7D32' : score >= 40 ? '#D4880A' : '#C0392B';

    // ─── DESIGN SYSTEM (single source of truth for the model) ───────────────────
    const designSystem = `
DESIGN SYSTEM — apply every rule to every element, no exceptions:

Page wrapper  : background:#0a0f1e; padding:32px; font-family:'Segoe UI',sans-serif; color:#e8e4d8;
Card          : background:rgba(196,162,84,0.05); border:1px solid rgba(196,162,84,0.15); border-radius:12px; padding:24px; margin-bottom:20px;
Section title : color:#c4a254; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin:0 0 16px;
Body text     : color:#c9c4b8; font-size:14px; line-height:1.75;
Score widget  : font-size:52px; font-weight:800; color:${scoreColor}; letter-spacing:-1px;
Risk banner   : background:${riskBg}; border-left:4px solid ${riskColor}; border-radius:0 8px 8px 0; padding:14px 20px; color:${riskColor}; font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:20px;
Gap card      : background:rgba(196,162,84,0.03); border:1px solid rgba(196,162,84,0.12); border-radius:8px; padding:16px 20px; margin-bottom:12px;
Gap title     : color:#e8e4d8; font-size:15px; font-weight:600; margin:0 0 6px;
Article tag   : display:inline-block; background:rgba(196,162,84,0.1); border:1px solid rgba(196,162,84,0.25); color:#c4a254; font-size:11px; font-weight:600; padding:2px 10px; border-radius:20px; margin-right:6px; margin-bottom:8px;
Priority badge (Critical) : background:#4a0808; color:#f87171; font-size:11px; font-weight:700; padding:2px 10px; border-radius:20px; display:inline-block;
Priority badge (High)     : background:#4a2a00; color:#fbbf24; font-size:11px; font-weight:700; padding:2px 10px; border-radius:20px; display:inline-block;
Priority badge (Medium)   : background:#003a38; color:#34d399; font-size:11px; font-weight:700; padding:2px 10px; border-radius:20px; display:inline-block;
Roadmap grid  : display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-top:12px;
Roadmap col   : background:rgba(196,162,84,0.04); border:1px solid rgba(196,162,84,0.12); border-radius:8px; padding:16px;
Roadmap header: font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin:0 0 12px; padding-bottom:10px; border-bottom:1px solid rgba(196,162,84,0.12);
Day 30 header : color:#f87171;
Day 60 header : color:#fbbf24;
Day 90 header : color:#34d399;
Roadmap item  : color:#c9c4b8; font-size:13px; line-height:1.6; margin-bottom:8px; padding-left:12px; border-left:2px solid rgba(196,162,84,0.2);
Strengths card: border-left:3px solid #c4a254; padding-left:20px;
Strengths text: color:#c9c4b8; font-size:14px; line-height:1.75;
`;

    const prompt = `
${designSystem}

### INPUT DATA
Score       : ${score} / 100
Risk Level  : ${level}
Assessment  : ${JSON.stringify(assessmentData, null, 2)}

### OUTPUT REQUIREMENTS
Return ONE self-contained HTML <div>. No markdown, no backticks, no explanation, no preamble.
Start your output with: <div style="background:#0a0f1e;
End your output with: </div>
Every element MUST use inline styles matching the DESIGN SYSTEM above exactly.

### SECTIONS TO INCLUDE (in this order)

1. EXECUTIVE INSIGHT
   - Outer wrapper: Card style
   - Section title: "Executive Insight" (Section title style)
   - Score on its own line: show "${score} / 100" using Score widget style, then on the next line show "Compliance Score" in body text
   - Below that: 2–3 sentence summary. Reference specific PDPL articles (5, 7, 13, 19, 21) where relevant.

2. RISK POSTURE
   - Use Risk banner style
   - Text: "Risk Posture: ${level}"

3. STRATEGIC COMPLIANCE GAPS
   - Section title: "Strategic Compliance Gaps"
   - For each gap identified in the assessment data, render a Gap card containing:
     * Gap title (Gap title style)
     * Article tag showing relevant PDPL article
     * Priority badge (choose Critical / High / Medium based on severity)
     * 1–2 sentence description of the gap

4. IMPLEMENTATION ROADMAP
   - Section title: "Implementation Roadmap"
   - Roadmap grid with 3 columns
   - Day 30 column: immediate critical actions (Day 30 header style)
   - Day 60 column: mid-term technical actions (Day 60 header style)
   - Day 90 column: long-term policy & governance actions (Day 90 header style)
   - Each action as a Roadmap item

5. COMPLIANCE STRENGTHS
   - Section title: "Compliance Strengths"
   - Strengths card + Strengths text style
   - List the positive findings from the assessment

### FINAL REMINDER
Output ONLY HTML. Start with <div. End with </div>.
No backticks. No markdown. No explanation. No "Book a consultation" buttons.
Apply EVERY inline style from the DESIGN SYSTEM exactly as specified.
`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a Senior PDPL Compliance expert and expert HTML developer. ' +
                            'Return ONLY raw HTML with inline styles — exactly as specified in the DESIGN SYSTEM. ' +
                            'NO markdown. NO backticks. NO explanation. NO preamble. ' +
                            'NEVER simplify, skip, or alter any style property. ' +
                            'Output starts with <div and ends with </div> — nothing else.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.1,
                max_tokens: 4000,
                top_p: 1,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Groq Error Body:', errorBody);
            throw new Error(`AI Service Unavailable (${response.status})`);
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
            throw new Error('AI Generation failed: No response from model');
        }

        let html: string = data.choices[0].message.content;

        // Strip any markdown fences the model might sneak in
        html = html
            .replace(/```html/gi, '')
            .replace(/```/g, '')
            .trim();

        // Ensure output starts at the root <div> — discard any leading prose
        const divIndex = html.indexOf('<div');
        if (divIndex > 0) {
            html = html.slice(divIndex);
        }

        return html;
    } catch (error: any) {
        console.error('AI Report Generation Error:', error);
        return null;
    }
}