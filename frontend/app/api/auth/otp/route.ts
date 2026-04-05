import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import nodemailer from 'nodemailer';

// Helper to send email via custom SMTP
async function sendCustomSmtpEmail(to: string, code: string) {
    const host = process.env.SMTP_HOST || 'smtp.resend.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
        // Adding connection timeout for WebContainer environments
        connectionTimeout: 5000,
        greetingTimeout: 5000,
    });

    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Verification Code</h2>
            <p>Your 6-digit verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; padding: 20px 0;">
                ${code}
            </div>
            <p>This code will expire in 10 minutes.</p>
        </div>
    `;

    try {
        return await transporter.sendMail({
            from: `"${process.env.SMTP_SENDER_NAME || 'PDPL Compliance'}" <${process.env.SMTP_SENDER_EMAIL || 'onboarding@resend.dev'}>`,
            to,
            subject: `${code} is your verification code`,
            html,
        });
    } catch (error) {
        console.error('SMTP send error (potentially port 465/587 blocked in WebContainer):', error);
        // Do not throw, allow the app to continue (Supabase fallback might still work)
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const isCustomSmtpEnabled = !!(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_SENDER_EMAIL);

        if (isCustomSmtpEnabled) {
            console.log('Using Custom SMTP flow via Nodemailer to bypass Supabase SMTP issues');

            // 1. Generate a 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // 2. Store in our custom OTPS table (admin bypass)
            await supabaseAdmin
                .from('otps')
                .delete()
                .eq('email', email); // Clear old ones

            const { error: dbError } = await supabaseAdmin
                .from('otps')
                .insert({ email, code });

            if (dbError) throw dbError;

            // 3. Send the email
            await sendCustomSmtpEmail(email, code);

            return NextResponse.json({ message: 'OTP sent via custom SMTP' });
        }

        // Default Supabase Path (if no custom SMTP configured)
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: true }
        });

        if (error) throw error;

        return NextResponse.json({ message: 'OTP sent via Supabase' });
    } catch (error: any) {
        console.error('OTP send error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { email, token, assessment_id } = await req.json();

        if (!email || !token) {
            return NextResponse.json({ error: 'Email and token are required' }, { status: 400 });
        }

        // 1. Check our CUSTOM OTPS table first
        const { data: customOtp, error: customError } = await supabaseAdmin
            .from('otps')
            .select('*')
            .eq('email', email)
            .eq('code', token)
            .gt('expires_at', new Date().toISOString())
            .single();

        let userId: string;

        if (customOtp) {
            console.log('Custom OTP verified!');
            // Delete the used OTP
            await supabaseAdmin.from('otps').delete().eq('id', customOtp.id);

            // Ensure user exists in Supabase Auth
            const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
            if (userError) throw userError;
            const existingUser = users?.find((u: any) => u.email === email);

            if (!existingUser) {
                // Create user if not exists
                const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                    email,
                    email_confirm: true,
                    user_metadata: { full_name: 'Verified User' }
                });
                if (createError) throw createError;
                userId = newUser.user.id;
            } else {
                userId = existingUser.id;
            }
        } else {
            // Fallback to regular Supabase verify
            const { data: authData, error: authError } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email',
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('Invalid code or expired.');
            userId = authData.user.id;
        }

        // 2. Link assessment
        if (assessment_id && userId) {
            await supabaseAdmin
                .from('assessments')
                .update({ user_id: userId })
                .eq('id', assessment_id);
        }

        // 3. Generate a temporary "magic link" token for the client to sign in
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email,
        });

        if (linkError) throw linkError;

        // Extract the token from the generated link URL
        const actionLink = (linkData.properties as any)?.action_link || (linkData.properties as any)?.link;

        if (!actionLink) {
            console.error('Magic link properties:', linkData.properties);
            throw new Error('Failed to generate magic link');
        }

        const linkUrl = new URL(actionLink);
        const magicToken = linkData.properties.email_otp || linkUrl.searchParams.get('token') || linkUrl.searchParams.get('code');

        console.log('--- DEBUG: generateLink result ---');
        console.log('Properties:', JSON.stringify(linkData.properties, null, 2));
        console.log('Extracted Token:', magicToken);
        console.log('--- END DEBUG ---');

        return NextResponse.json({
            user_id: userId,
            email: email,
            token: magicToken,
            verification_type: linkData.properties.email_otp ? 'email' : 'magiclink'
        });
    } catch (error: any) {
        console.error('OTP verify error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
