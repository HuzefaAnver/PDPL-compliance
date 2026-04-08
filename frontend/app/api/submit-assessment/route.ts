import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateAIReport } from '@/lib/groq';
import { calculateRiskScore, extractKeyGaps } from '@/lib/scoring';

export async function POST(req: Request) {
    try {
        let responses
        try {
            responses = await req.json();
        } catch (parseErr) {
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }

        // 1. Validation
        if (!responses || typeof responses !== 'object') {
            return NextResponse.json({ error: 'Invalid assessment data' }, { status: 400 });
        }

        // 2. Calculate Score & Get Gaps
        let score, level, gaps
        try {
            const scoreData = calculateRiskScore(responses);
            score = scoreData.score;
            level = scoreData.level;
            gaps = extractKeyGaps(responses);
        } catch (calcErr) {
            console.error('Scoring calculation error:', calcErr);
            return NextResponse.json({ error: 'Failed to calculate risk score' }, { status: 400 });
        }

        // 3. Store Assessment in Supabase
        const { data: assessment, error: assessmentError } = await supabaseAdmin
            .from('assessments')
            .insert({
                responses: responses,
                risk_score: score,
                risk_level: level,
            })
            .select()
            .maybeSingle();

        if (assessmentError || !assessment) {
            throw assessmentError || new Error('Failed to create assessment');
        }

        // 4. Trigger AI Report Generation
        let aiSummary
        try {
            aiSummary = await generateAIReport(responses);
        } catch (aiErr) {
            console.error('AI report generation error:', aiErr);
            aiSummary = 'Report generation failed. Please try again later.';
        }

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
