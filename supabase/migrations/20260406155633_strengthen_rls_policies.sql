/*
  # Strengthen RLS Policies for Production

  1. Security Changes
    - Restrict assessments INSERT to authenticated users only
    - Add UPDATE policy with proper ownership checks for assessments
    - Profile public viewing remains permissive (for analytics), but update restricted to owner
    - OTPs remain admin-only (no policies needed)

  2. Rationale
    - Prevent unauthenticated assessment insertion (data integrity)
    - Enforce user ownership for updates
    - Balance public profile visibility with data protection
*/

DO $$ BEGIN
    DROP POLICY IF EXISTS "Anyone can insert an assessment." ON public.assessments;
    CREATE POLICY "Authenticated users can insert assessments"
        ON public.assessments FOR INSERT
        TO authenticated
        WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Users can update their own assessment." ON public.assessments;
    CREATE POLICY "Users can update their own assessment"
        ON public.assessments FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
    CREATE POLICY "Users can update own profile"
        ON public.profiles FOR UPDATE
        TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
END $$;
