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

    const riskLabel =
        level === 'High'
            ? 'Significant gaps found — urgent action needed'
            : level === 'Moderate'
                ? 'Some gaps found — improvements required'
                : 'Good foundation — minor improvements needed';

    const scoreColor = score >= 70 ? '#2E7D32' : score >= 40 ? '#D4880A' : '#C0392B';

    const designSystem = `
DESIGN SYSTEM — apply every rule to every element, no exceptions:

Page wrapper   : background:#0a0f1e; padding:32px; font-family:'Segoe UI',sans-serif; color:#e8e4d8; max-width:860px; margin:0 auto;
Big Card       : background:rgba(196,162,84,0.06); border:1px solid rgba(196,162,84,0.2); border-radius:16px; padding:32px; margin-bottom:24px;
Card Label     : font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#c4a254; margin:0 0 12px;
Card Heading   : font-size:22px; font-weight:700; color:#e8e4d8; margin:0 0 14px; line-height:1.3;
Body text      : color:#c9c4b8; font-size:15px; line-height:1.8;
Outcome badge (yes)    : display:inline-block; background:rgba(46,125,50,0.2); border:1px solid #2E7D32; color:#4caf50; font-size:12px; font-weight:700; padding:4px 14px; border-radius:20px; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;
Outcome badge (review) : display:inline-block; background:rgba(212,136,10,0.2); border:1px solid #D4880A; color:#fbbf24; font-size:12px; font-weight:700; padding:4px 14px; border-radius:20px; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;
Score row      : display:flex; align-items:center; gap:24px; margin-bottom:20px;
Score circle   : width:90px; height:90px; border-radius:50%; background:conic-gradient(${scoreColor} 0deg ${score * 3.6}deg, rgba(196,162,84,0.1) ${score * 3.6}deg 360deg); display:flex; align-items:center; justify-content:center; flex-shrink:0;
Score inner    : width:70px; height:70px; border-radius:50%; background:#0a0f1e; display:flex; align-items:center; justify-content:center; flex-direction:column;
Score number   : font-size:22px; font-weight:800; color:${scoreColor}; line-height:1;
Score suffix   : font-size:10px; color:#c9c4b8; margin-top:2px;
Risk pill      : display:inline-block; background:${riskBg}; border:1px solid ${riskColor}; color:${riskColor}; font-size:12px; font-weight:700; padding:4px 14px; border-radius:20px; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;
Action list    : list-style:none; padding:0; margin:16px 0 0;
Action item    : color:#c9c4b8; font-size:14px; line-height:1.7; padding:10px 14px; border-left:3px solid rgba(196,162,84,0.3); margin-bottom:10px; background:rgba(196,162,84,0.03); border-radius:0 6px 6px 0;
Divider        : border:none; border-top:1px solid rgba(196,162,84,0.12); margin:0 0 24px;
CTA card       : background:linear-gradient(135deg, rgba(196,162,84,0.1) 0%, rgba(196,162,84,0.04) 100%); border:1px solid rgba(196,162,84,0.3); border-radius:16px; padding:32px; margin-bottom:24px; text-align:center;
CTA heading    : font-size:20px; font-weight:700; color:#e8e4d8; margin:0 0 12px;
CTA body       : color:#c9c4b8; font-size:15px; line-height:1.7; margin:0 0 24px;
CTA button     : display:inline-block; background:#c4a254; color:#0a0f1e; font-size:14px; font-weight:700; padding:14px 32px; border-radius:8px; text-decoration:none; letter-spacing:0.5px;
`;

    const prompt = `
\${designSystem}

### INPUT DATA
Score       : \${score} / 100
Risk Level  : \${level}
Assessment  : \${JSON.stringify(assessmentData, null, 2)}

### OUTPUT REQUIREMENTS
Return ONE self-contained HTML <div>. No markdown, no backticks, no explanation.
Start with: <div style="background:#0a0f1e; padding:32px; font-family:'Segoe UI',sans-serif; max-width:860px; margin:0 auto;"
End with: </div>
All text must be plain English a non-technical business owner understands immediately.
IMPORTANT: Output exactly 3 sections in this order: Box 1, Box 2, Box 3. No more, no less.

---

### BOX 1 — DOES PDPL APPLY TO YOU?

Render a card with: background:rgba(196,162,84,0.06); border:1px solid rgba(196,162,84,0.2); border-radius:16px; padding:28px; margin-bottom:24px;

Layout: Two columns side by side using display:flex; gap:24px; align-items:center;

LEFT SIDE (flex:0 0 140px): A large visual icon block.
- If PDPL applies: Draw an SVG shield icon (80x80) filled with rgba(46,125,50,0.15), with a checkmark inside in #4caf50. Below it center the text "APPLICABLE" in #4caf50, font-size:11px, font-weight:700, letter-spacing:2px.
- If unclear: Draw an SVG warning triangle (80x80) filled with rgba(212,136,10,0.15), exclamation mark inside in #fbbf24. Below it center the text "REVIEW NEEDED" in #fbbf24, font-size:11px, font-weight:700, letter-spacing:2px.

RIGHT SIDE: 
- Label: "IS PDPL APPLICABLE TO YOUR BUSINESS?" in color:#c4a254; font-size:10px; font-weight:700; letter-spacing:2px; margin-bottom:8px;
- Heading (font-size:18px; font-weight:700; color:#e8e4d8; margin:0 0 10px): Either "Yes — PDPL Applies to Your Business" or "A Quick Expert Check is Recommended"
- Body (color:#c9c4b8; font-size:14px; line-height:1.75): 2 sentences in plain English explaining why.

---

### BOX 2 — YOUR COMPLIANCE STATUS

Render a card with same card style as Box 1.

TOP SECTION: display:flex; gap:28px; align-items:center; margin-bottom:24px;

LEFT: A circular gauge (SVG, 130x130):
- Outer ring: full circle stroke rgba(196,162,84,0.1) strokeWidth=12
- Progress arc: stroke \${scoreColor} strokeWidth=12, strokeDasharray="\${score * 2.51} 251" strokeLinecap="round", transform="rotate(-90 65 65"
- Center text: "\${score}" in font-size:28px; font-weight:800; color:\${scoreColor}
- Below center: "/100" in font-size:11px; color:#c9c4b8

RIGHT SIDE:
- Label: "YOUR COMPLIANCE STATUS" in color:#c4a254; font-size:10px; font-weight:700; letter-spacing:2px; margin-bottom:8px;
- Risk pill: display:inline-block; background:\${riskBg}; border:1px solid \${riskColor}; color:\${riskColor}; font-size:11px; font-weight:700; padding:3px 14px; border-radius:20px; margin-bottom:12px; — Text: "\${level.toUpperCase()} RISK"
- Heading (font-size:17px; font-weight:700; color:#e8e4d8; margin:0 0 8px): One plain-English sentence describing what this score means.
- Body (color:#c9c4b8; font-size:13px): "Here is what needs your attention:"

BELOW TOP SECTION: 3 horizontal visual stat cards side by side using display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:20px;
Each stat card: background:rgba(196,162,84,0.04); border:1px solid rgba(196,162,84,0.12); border-radius:10px; padding:14px; text-align:center;
- Icon (SVG, 24x24, color:#c4a254): Use relevant icons — a document icon for Data Practices, a lock icon for Security, a person icon for Customer Rights
- Stat label: color:#c9c4b8; font-size:11px; margin:6px 0 4px: "Data Practices", "Security Setup", "Customer Rights"
- Stat value: font-size:20px; font-weight:800; color based on score: derive a realistic sub-score for each from assessment data — show as a percentage like "60%"
- Mini bar below: background:rgba(196,162,84,0.1); border-radius:4px; height:4px; width:100%; with inner div width equal to that percentage, background:#c4a254;

BELOW STAT CARDS: Action list — 3 items.
Each item: display:flex; align-items:flex-start; gap:12px; padding:12px 16px; background:rgba(196,162,84,0.03); border-radius:8px; margin-bottom:8px; border:1px solid rgba(196,162,84,0.1);
- Left: A colored circle (28x28, border-radius:50%) with a number inside — #1, #2, #3. Color the circle \${riskColor} with opacity 0.2, number in \${riskColor}, font-size:13px; font-weight:700;
- Right: Plain-English action item (color:#c9c4b8; font-size:13px; line-height:1.6). Real gap from assessment data written as something the business owner should do.

---

### BOX 3 — BOOK A FREE CALL CTA

Render a card with: background:linear-gradient(135deg, rgba(196,162,84,0.12), rgba(196,162,84,0.04)); border:1px solid rgba(196,162,84,0.3); border-radius:16px; padding:36px; text-align:center; margin-bottom:0;

- SVG calendar/phone icon centered (40x40) in #c4a254
- Heading (font-size:20px; font-weight:700; color:#e8e4d8; margin:12px 0 10px): "Not Sure What to Do Next?"
- Body (color:#c9c4b8; font-size:14px; line-height:1.75; max-width:480px; margin:0 auto 24px): "Speak with a certified PDPL expert — completely free. In just 30 minutes, we will walk you through exactly what applies to your business and the steps you need to take."
- 3 trust badges side by side (display:flex; justify-content:center; gap:24px; margin-bottom:24px):
  Each badge: display:flex; align-items:center; gap:6px; color:#c4a254; font-size:12px; font-weight:600;
  With a small SVG checkmark icon before each. Text: "Free of Charge", "Certified Expert", "No Obligation"
- Button (display:inline-block; background:#c4a254; color:#0a0f1e; font-size:14px; font-weight:700; padding:14px 36px; border-radius:8px; text-decoration:none; letter-spacing:0.5px; cursor:pointer;): "Book Your Free 30-Minute Call →" linking to href="#book-call"

---

### FINAL RULES
Exactly 3 boxes. Nothing else. No extra sections, no extra headings outside the boxes.
All SVG must be inline with xmlns="http://www.w3.org/2000/svg".
All styles must be inline. Output only raw HTML starting with <div and ending with </div>.
`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a compliance communication expert and skilled HTML developer. ' +
                            'Your job is to translate complex compliance data into clear, plain-English reports for business owners. ' +
                            'Return ONLY raw HTML with inline styles exactly as specified in the DESIGN SYSTEM. ' +
                            'NO markdown. NO backticks. NO explanation. NO preamble. ' +
                            'ALL visible text must be simple, jargon-free English that any business owner can understand. ' +
                            'Output starts with <div and ends with </div> — nothing else.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.2,
                max_tokens: 3000,
                top_p: 1,
            }),
        });
        clearTimeout(timeoutId);

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