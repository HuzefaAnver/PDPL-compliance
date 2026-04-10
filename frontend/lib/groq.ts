export async function generateAIReport(assessmentData: any, score: number, level: string) {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-specdec';

    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not defined');
    }

    const riskColor = level === 'High' ? '#E24B4A' : level === 'Moderate' ? '#EF9F27' : '#639922';

    const prompt = `
    ### Task
    Review the following compliance assessment data and generate a structured HTML compliance report — not plain text.
    
    ### Context
    Score: ${score} / 100
    Risk Level: ${level}
    Data: ${JSON.stringify(assessmentData, null, 2)}

    ### Requirements
    1. **Output ONLY valid HTML**. Do not include markdown, no backticks, no preamble, no explanation.
    2. **Inline Styles Only**. Use inline CSS for all styling.
    3. **Tone**: Professional, authoritative, and direct. Reference specific PDPL articles where relevant (Articles 5, 7, 13, 19, 21).

    ### Structure Sections
    1. **Executive Summary Block**: A 2-3 sentence paragraph. User a <div> with a left border accent (border-left: 4px solid ${riskColor}). Include a large score number "${score} / 100" in a bold <span> with font-size 36px.
    2. **Risk Status Banner**: A full-width colored <div> labeled "${level.toUpperCase()} RISK". Background: ${riskColor}. White bold text. Font size 20px. Padding 12px.
    3. **Critical Gaps — Numbered List**: Each gap as a <div> card with: red left border, bold gap title, one-line PDPL article reference, and a "Priority: Critical / High / Medium" badge. Max 4 gaps.
    4. **30/60/90 Day Action Plan**: A 3-column <table>. Day 30 header (Red), Day 60 (Amber), Day 90 (Green). Under each, 2-3 specific actionable steps. Direct language (e.g., "You must...").
    5. **Positive Signals**: A <div> with green left border. Explain what they are doing well. Start with "Strengths Identified:".
    6. **Next Step CTA**: Centered <div> with "Book your free 20-minute PDPL consultation..." and a styled <a> button (dark background, white text, padding 12px 24px, border-radius 6px).
    `;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are a Senior PDPL Compliance expert. Return ONLY raw HTML with inline styles. No markdown. No explanation. No backticks. No conversational filler.' 
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
                max_tokens: 2500,
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

        let html = data.choices[0].message.content;
        
        // Final cleaning in case the model ignores the "no backticks" instruction
        html = html.replace(/```html/g, '').replace(/```/g, '').trim();

        return html;
    } catch (error: any) {
        console.error('AI Report Generation Error:', error);
        return null; // Return null so the frontend can handle fallback
    }
}
