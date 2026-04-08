# Deploy Now - 20 Minute Quick Start

Your app is fixed and ready. Follow this exact guide to deploy in 20 minutes.

## 5 Minutes: Gather Credentials

### 1. Supabase (2 min)
- Go to https://supabase.com → Sign in
- Open your project → Click "Settings" (bottom left) → "API"
- Copy these values:
  ```
  NEXT_PUBLIC_SUPABASE_URL = (Project URL)
  NEXT_PUBLIC_SUPABASE_ANON_KEY = (anon public key)
  SUPABASE_SERVICE_ROLE_KEY = (service_role secret key)
  ```

### 2. Groq (1 min)
- Go to https://console.groq.com → Sign in
- Click "API Keys"
- Copy key:
  ```
  GROQ_API_KEY = (your API key)
  ```

### 3. Resend (2 min)
- Go to https://resend.com → Sign in
- Click "API Keys" → Copy key:
  ```
  SMTP_PASS = (your API key)
  SMTP_SENDER_EMAIL = (your verified sender email)
  ```

## 5 Minutes: Deploy on Bolt Cloud

1. **Go to Bolt Cloud**
   - https://bolt.new

2. **Create New Project**
   - Upload this repo or import from Git

3. **Add Environment Variables**
   - Click Settings → Environment Variables
   - Add these 12 variables:

```
NEXT_PUBLIC_SUPABASE_URL = (from step 1)
NEXT_PUBLIC_SUPABASE_ANON_KEY = (from step 1)
SUPABASE_SERVICE_ROLE_KEY = (from step 1)
GROQ_API_KEY = (from step 2)
GROQ_MODEL = llama-3.3-70b-versatile
SMTP_HOST = smtp.resend.com
SMTP_PORT = 465
SMTP_USER = resend
SMTP_PASS = (from step 3)
SMTP_SENDER_EMAIL = (from step 3)
SMTP_SENDER_NAME = PDPL Compliance
SMTP_SECURE = true
```

4. **Deploy**
   - Click "Deploy" button
   - Wait 2-3 minutes
   - Get your URL

## 10 Minutes: Test

1. Open your deployment URL
2. Click "Start Free Assessment"
3. Complete 10 questions (~1 min)
4. Enter email → Click "Send Code"
5. Check email for OTP code
6. Enter code → Click "Verify"
7. See risk score (Red/Amber/Green)
8. See AI compliance report

## Done! 🎉

Your PDPL Shield assessment app is live!

---

## Issues?

**Emails not arriving?**
- Verify sender email in Resend dashboard

**AI reports not generating?**
- Check Groq API key is correct
- Check rate limits (100/min free tier)

**Database errors?**
- Verify Supabase credentials
- Check Supabase project is active

**Build won't deploy?**
- Check all 12 environment variable names are exact
- No extra spaces or typos
- Case-sensitive!

---

For detailed setup: See ENV_SETUP_GUIDE.md
For more details: See READY_FOR_DEPLOYMENT.md

**Ready?** → Go to https://bolt.new
