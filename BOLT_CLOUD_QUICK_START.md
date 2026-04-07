# Bolt Cloud Deployment - Quick Start

## Status: Ready for Deployment ✓

Your PDPL Shield application is fully configured and ready to deploy on Bolt Cloud.

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Supabase project created and database schema applied
- [ ] Groq API key (from [console.groq.com](https://console.groq.com))
- [ ] Resend API key (from [resend.com](https://resend.com))
- [ ] GitHub repository (optional, for CI/CD)

## 5-Minute Deployment

### Step 1: Gather Credentials
Collect these values:
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
GROQ_API_KEY = gsk_xxxxx
SMTP_PASS = your_resend_api_key
```

### Step 2: Create Bolt Project
1. Open [bolt.new](https://bolt.new)
2. Click **New Project**
3. Select **Import from Git** or upload files
4. Choose this repository

### Step 3: Set Environment Variables
In Bolt Cloud dashboard:
1. Click **Settings** → **Environment Variables**
2. Add each variable from Step 1:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GROQ_API_KEY`
   - `GROQ_MODEL` = `llama-3.3-70b-versatile`
   - `SMTP_HOST` = `smtp.resend.com`
   - `SMTP_PORT` = `465`
   - `SMTP_USER` = `resend`
   - `SMTP_PASS` = `your_resend_api_key`
   - `SMTP_SENDER_EMAIL` = `noreply@yourdomain.com`
   - `SMTP_SENDER_NAME` = `PDPL Compliance`
   - `SMTP_SECURE` = `true`

### Step 4: Deploy
1. Click **Deploy** button
2. Wait for build to complete (~2 minutes)
3. Your app is live!

## After Deployment

### Test the Application
- Open the deployment URL
- Complete the assessment flow
- Verify email OTP verification works
- Check that risk scores calculate correctly
- Confirm AI reports generate

### Configure Custom Domain (Optional)
1. In Bolt: **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records as shown
4. SSL automatically provisioned

### Monitor Performance
Check these metrics in Bolt dashboard:
- Deployment status
- Error logs
- API response times
- Database connections

## Troubleshooting

### App won't start
- Check all environment variables are set
- Verify Supabase credentials are correct
- Review logs in Bolt dashboard

### Email not sending
- Verify Resend API key is correct
- Check SMTP_SENDER_EMAIL is verified in Resend
- Ensure SMTP_PORT is 465 and SMTP_SECURE is true

### AI reports not generating
- Verify Groq API key is valid
- Check API rate limits (100 req/min on free tier)
- Review Groq model name is correct

### Database errors
- Verify Supabase URL and keys
- Check RLS policies aren't blocking operations
- Ensure database schema is initialized

## Build Info

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Bundle Size**: 206 KB
- **Node Version**: 20 LTS
- **Build Time**: ~10 seconds

## What's Pre-Configured

✓ Production security headers
✓ Database schema with RLS
✓ Email authentication flow
✓ Assessment scoring algorithm
✓ AI report generation
✓ Static page optimization
✓ Error handling & logging

## Support

For Bolt Cloud issues: [support.bolt.new](https://support.bolt.new)
For Supabase issues: [supabase.com/docs](https://supabase.com/docs)

---

**Ready to deploy?** [Go to bolt.new →](https://bolt.new)

Estimated deployment time: 5-10 minutes
