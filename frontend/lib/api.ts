import { supabase } from '@/lib/supabase'
const BASE = '/api'

// ── Types ─────────────────────────────────────────────────────

export interface AssessmentCreate {
  [key: string]: any; // Flexibly handle all assessment fields
}

export interface AssessmentResponse {
  assessment_id: string
  score: number
  risk_level: 'Low' | 'Moderate' | 'High'
  gaps: string[]
  ai_summary: string
}

export interface SignupRequest {
  email: string
  password: string
  assessment_id: string
}

export interface SignupResponse {
  user_id: string
  email: string
  assessment_id: string
}

export interface ResultsResponse {
  user_id: string
  email: string
  company_name: string
  industry: string
  score: number
  risk_level: 'Low' | 'Moderate' | 'High'
  gaps: string[]
  ai_summary: string | null
  assessment_id: string
}

// ── Fetch helper ─────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `API error ${res.status}`)
  }
  return res.json()
}

// ── API calls ────────────────────────────────────────────────

export const api = {
  submitAssessment: async (data: AssessmentCreate) => {
    const { data: { session } } = await supabase.auth.getSession()
    return apiFetch<AssessmentResponse>('/submit-assessment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token ?? ''}`,
      },
      body: JSON.stringify(data),
    })
  },

  signup: (data: SignupRequest) =>
    apiFetch<SignupResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  auth: {
    verifyOtp: (email: string, token: string, type: 'email' | 'magiclink' = 'email') =>
      supabase.auth.verifyOtp({ email, token, type }),
  },
  getResults: (userId: string) =>
    apiFetch<ResultsResponse>(`/results?userId=${userId}`),
}

