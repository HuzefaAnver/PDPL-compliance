import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { email, password, assessment_id } = await req.json();

        // 1. Sign up the user with Supabase Auth (using Admin for bypass and auto-confirm)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: 'User' }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('User creation failed');

        // 2. Link assessment to the user
        const { error: linkError } = await supabaseAdmin
            .from('assessments')
            .update({ user_id: authData.user.id })
            .eq('id', assessment_id);

        if (linkError) throw linkError;

        return NextResponse.json({
            user_id: authData.user.id,
            email: authData.user.email,
            assessment_id,
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
