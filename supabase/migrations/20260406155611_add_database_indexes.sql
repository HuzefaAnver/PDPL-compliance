/*
  # Database Performance Optimization

  1. Indexes Added
    - `assessments(user_id)` - for user assessment queries
    - `assessments(created_at)` - for chronological queries
    - `reports(assessment_id)` - for report retrieval
    - `otps(email, expires_at)` - for OTP lookup and cleanup
    - `profiles(email)` - for user lookup

  2. Benefits
    - Faster user data retrieval
    - Efficient time-based queries
    - Optimized email verification flow
    - Reduced table scans
*/

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_assessment_id ON public.reports(assessment_id);
CREATE INDEX IF NOT EXISTS idx_otps_email_expires ON public.otps(email, expires_at);
CREATE INDEX IF NOT EXISTS idx_profiles_work_email ON public.profiles(work_email);
