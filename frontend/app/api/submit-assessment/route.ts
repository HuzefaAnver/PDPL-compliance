import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateAIReport } from '@/lib/groq';
import { calculateRiskScore, extractKeyGaps } from '@/lib/scoring';

export async function POST(req: Request) {
    try {
        const responses = await req.json();

        // 1. Validation
        if (!responses || typeof responses !== 'object') {
            return NextResponse.json({ error: 'Invalid assessment data' }, { status: 400 });
        }

        // 2. Calculate Score & Get Gaps
        const { score, level } = calculateRiskScore(responses);
        const gaps = extractKeyGaps(responses);

        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '')
        const { data: { user } } = await supabaseAdmin.auth.getUser(token ?? '')

        // 3. Store Assessment in Supabase
        const { data: assessment, error: assessmentError } = await supabaseAdmin
            .from('assessments')
            .insert({
                user_id: user?.id,
                responses: responses,
                risk_score: score,
                risk_level: level,
            })
            .select()
            .single();

        if (assessmentError) throw assessmentError;

        // 4. Trigger AI Report Generation
        const aiSummary = await generateAIReport(responses, score, level);

        // 5. Store AI Report
        const { error: reportError } = await supabaseAdmin
            .from('reports')
            .insert({
                assessment_id: assessment.id,
                ai_summary: aiSummary,
                key_gaps: gaps,
            });

        if (reportError) throw reportError;

        return NextResponse.json({
            assessment_id: assessment.id,
            score,
            level,
            gaps,
        });
    } catch (error: any) {
        console.error('Submit assessment error:', error);
        return NextResponse.json({
            error: 'An internal error occurred while processing your assessment.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
