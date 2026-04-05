-- PDPL Compliance Platform - Supabase Schema
-- This script is idempotent (can be run multiple times)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    company_name TEXT,
    work_email TEXT,
    industry TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
    CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
    CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
    CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
END $$;

-- 2. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    responses JSONB NOT NULL,
    risk_score FLOAT,
    risk_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own assessments." ON public.assessments;
    CREATE POLICY "Users can view their own assessments." ON public.assessments FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Anyone can insert an assessment." ON public.assessments;
    CREATE POLICY "Anyone can insert an assessment." ON public.assessments FOR INSERT WITH CHECK (true);
    DROP POLICY IF EXISTS "Users can update their own assessment." ON public.assessments;
    CREATE POLICY "Users can update their own assessment." ON public.assessments FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- 3. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
    ai_summary TEXT,
    key_gaps JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view reports for their own assessments." ON public.reports;
    CREATE POLICY "Users can view reports for their own assessments." ON public.reports FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.assessments 
        WHERE assessments.id = reports.assessment_id AND assessments.user_id = auth.uid()
    ));
END $$;

-- 4. Custom OTPS Table (For SMTP Bypass)
CREATE TABLE IF NOT EXISTS public.otps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '10 minutes'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;
-- No public policies needed (Admin only)

-- 5. Automations
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, work_email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
