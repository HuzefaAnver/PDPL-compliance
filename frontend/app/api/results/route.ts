import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // 1. Get Assessment linked to user
        const { data: assessment, error: assessmentError } = await supabaseAdmin
            .from('assessments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (assessmentError || !assessment) {
            throw new Error('No assessments found for this user');
        }

        // 2. Get Report linked to assessment
        const { data: report, error: reportError } = await supabaseAdmin
            .from('reports')
            .select('*')
            .eq('assessment_id', assessment.id)
            .maybeSingle();

        if (reportError || !report) {
            throw new Error('No report found for this assessment');
        }

        // 3. Get User Profile
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        // Profile might not exist if trigger failed, use fallback
        const company = profile?.company_name || assessment.responses?.company_name || 'Your Company';
        const industry = profile?.industry || assessment.responses?.industry || 'Unknown Sector';

        return NextResponse.json({
            user_id: userId,
            email: profile?.work_email || '',
            company_name: company,
            industry: industry,
            score: assessment.risk_score,
            risk_level: assessment.risk_level,
            gaps: report.key_gaps,
            ai_summary: report.ai_summary,
            assessment_id: assessment.id,
        });
    } catch (error: any) {
        console.error('Get results error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
