export async function generateAIReport(assessmentData: any) {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-specdec';

    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not defined');
    }

    const prompt = `
    ### Role
    You are a Senior Data Privacy Consultant specializing in the Saudi Arabian Personal Data Protection Law (PDPL).

    ### Task
    Review the following compliance assessment data and generate a high-impact "Executive Compliance Roadmap". 

    ### Assessment Context
    ${JSON.stringify(assessmentData, null, 2)}

    ### Requirements
    1. **Professional Tone**: Use authoritative, expert language suitable for a C-suite executive.
    2. **Structure**:
       - # Executive Summary: A 2-3 sentence overview of their current posture.
       - # Critical Risk Analysis: Identify the top 3 most significant legal or operational risks based on their answers. Reference PDPL principles (e.g., Transparency, Limitation of Purpose, Security).
       - # Immediate Action Plan (30/60/90 Days): Provide clear, bulleted steps to achieve compliance.
    3. **formatting**: Use clean Markdown with bolding for emphasis. No preamble or conversational filler.

    ### Tone Note
    Be direct about the implications of non-compliance (potential fines/penalties under PDPL) while offering a clear path forward.
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
                    { role: 'system', content: 'You are a PDPL compliance expert. You provide precise, legal-grade advice.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3, // Lower temperature for more consistent, professional output
                max_tokens: 1500,
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

        return data.choices[0].message.content;
    } catch (error: any) {
        console.error('AI Report Generation Error:', error);
        return `### Compliance Report (Basic)
Your assessment indicates several areas of potential PDPL risk. 
- Ensure you have a Data Privacy Policy.
- Evaluate your cross-border data transfer mechanisms.
- Appoint or designate a Data Protection Officer.

*Note: The detailed AI-generated analysis is temporarily unavailable, but your rule-based gaps are listed below.*`;
    }
}
