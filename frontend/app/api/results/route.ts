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
            .single();

        if (assessmentError) throw assessmentError;

        // 2. Get Report linked to assessment
        const { data: report, error: reportError } = await supabaseAdmin
            .from('reports')
            .select('*')
            .eq('assessment_id', assessment.id)
            .single();

        if (reportError) throw reportError;

        // 3. Get User Profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        // Profile might not exist if handling_new_user trigger failed, but we can fallback
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
