# Environment Variables Setup Guide

## Required Environment Variables for Deployment

Before deploying on Bolt Cloud, you MUST set these environment variables in the Bolt Cloud dashboard.

### Step 1: Go to Bolt Cloud Dashboard
1. Open your project in [bolt.new](https://bolt.new)
2. Click **Settings** → **Environment Variables**

### Step 2: Add Each Variable

Copy and paste each variable name and value below:

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL
```
**Value**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
**Where to find**: Supabase Dashboard → Project Settings → API → Project URL

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value**: Your Supabase anonymous key (starts with `eyJ...`)
**Where to find**: Supabase Dashboard → Project Settings → API → anon/public

```
SUPABASE_SERVICE_ROLE_KEY
```
**Value**: Your Supabase service role key (starts with `eyJ...`)
**Where to find**: Supabase Dashboard → Project Settings → API → Service Role (secret)
**Important**: This is a SECRET key - keep it safe!

#### Groq API Configuration
```
GROQ_API_KEY
```
**Value**: Your Groq API key (starts with `gsk_`)
**Where to find**: [console.groq.com](https://console.groq.com) → API Keys

```
GROQ_MODEL
```
**Value**: `llama-3.3-70b-versatile`
**Note**: Do not change this value

#### Email Configuration (Resend)
```
SMTP_HOST
```
**Value**: `smtp.resend.com`

```
SMTP_PORT
```
**Value**: `465`

```
SMTP_USER
```
**Value**: `resend`

```
SMTP_PASS
```
**Value**: Your Resend API key
**Where to find**: [resend.com](https://resend.com) → API Keys → Copy your key

```
SMTP_SENDER_EMAIL
```
**Value**: Your verified sender email (e.g., `noreply@yourdomain.com`)
**Important**: This email must be verified in Resend dashboard

```
SMTP_SENDER_NAME
```
**Value**: `PDPL Compliance`
**Or**: Your company name

```
SMTP_SECURE
```
**Value**: `true`

### Step 3: Verify All Variables Are Set

After adding all variables, you should have 11 environment variables in Bolt Cloud:

1. ✓ NEXT_PUBLIC_SUPABASE_URL
2. ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
3. ✓ SUPABASE_SERVICE_ROLE_KEY
4. ✓ GROQ_API_KEY
5. ✓ GROQ_MODEL
6. ✓ SMTP_HOST
7. ✓ SMTP_PORT
8. ✓ SMTP_USER
9. ✓ SMTP_PASS
10. ✓ SMTP_SENDER_EMAIL
11. ✓ SMTP_SENDER_NAME
12. ✓ SMTP_SECURE

### Step 4: Deploy

Once all variables are set, click **Deploy** in Bolt Cloud dashboard.

---

## Getting Each Credential

### Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Create a new project (if not done yet)
4. Wait for project to initialize (~1 minute)
5. Go to **Project Settings** (bottom left) → **API**
6. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign in or create account
3. Click **API Keys** on the left
4. Click **Create API Key**
5. Copy the key → `GROQ_API_KEY`

### Resend Email Service

1. Go to [resend.com](https://resend.com)
2. Sign in or create account
3. Click **API Keys** on the left
4. Copy the API key → `SMTP_PASS`
5. Add your sender email under **Senders**
   - Use this email → `SMTP_SENDER_EMAIL`

---

## Common Issues

### Build Error: "Missing required Supabase environment variables"
- Make sure you added both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check that keys start with correct prefixes (NEXT_PUBLIC_ for client keys)
- Redeploy after setting variables

### Emails Not Sending
- Verify `SMTP_SENDER_EMAIL` is verified in Resend dashboard
- Check `RESEND_API_KEY` is correct
- Ensure `SMTP_PASS` is set to your Resend API key (not a different value)

### AI Reports Not Generating
- Verify `GROQ_API_KEY` is correct
- Check [console.groq.com](https://console.groq.com) for API rate limits
- Ensure `GROQ_MODEL` is set to `llama-3.3-70b-versatile`

### Database Errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check both Supabase keys are valid
- Ensure Supabase project is active and not paused

---

## Safety Tips

1. **Never commit .env files** - They are already in .gitignore
2. **Keep secret keys safe** - Don't share SUPABASE_SERVICE_ROLE_KEY or GROQ_API_KEY
3. **Use strong passwords** - For Supabase and Resend accounts
4. **Rotate keys periodically** - Generate new API keys every 90 days
5. **Monitor API usage** - Check Groq and Resend dashboards for unusual activity

---

## After Deployment

Once deployed, test these features:

✓ Visit the app URL
✓ Complete an assessment
✓ Verify OTP email arrives
✓ Check risk score displays
✓ Confirm AI report generates
✓ View results page

---

**Need help?**
- Bolt Cloud: [docs.bolt.new](https://docs.bolt.new)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Groq: [console.groq.com/docs](https://console.groq.com/docs)
- Resend: [resend.com/docs](https://resend.com/docs)
