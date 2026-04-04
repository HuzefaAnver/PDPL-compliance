const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ── Types ─────────────────────────────────────────────────────

export interface AssessmentCreate {
  // Section A
  company_name: string
  user_name: string
  email: string
  industry: string
  // Section B
  data_volume: string
  data_types: string[]
  stores_regularly: string
  // Section C
  knows_data_location: string
  shares_third_party: string
  vendor_list: string
  privacy_policy: string
  internal_rules: string
  breach_plan: string
  user_rights: string
}

export interface AssessmentResponse {
  id: number
  score: number
  risk_level: 'RED' | 'AMBER' | 'GREEN'
  gaps: string[]
  created_at: string
}

export interface SignupRequest {
  email: string
  password: string
  assessment_id: number
}

export interface SignupResponse {
  user_id: number
  email: string
  assessment_id: number
}

export interface ResultsResponse {
  user_id: number
  email: string
  company_name: string
  industry: string
  score: number
  risk_level: 'RED' | 'AMBER' | 'GREEN'
  gaps: string[]
  ai_summary: string | null
  assessment_id: number
}

// ── Fetch helper ─────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `API error ${res.status}`)
  }
  return res.json()
}

// ── API calls ────────────────────────────────────────────────

export const api = {
  submitAssessment: (data: AssessmentCreate) =>
    apiFetch<AssessmentResponse>('/submit-assessment/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  signup: (data: SignupRequest) =>
    apiFetch<SignupResponse>('/signup/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getResults: (userId: number) =>
    apiFetch<ResultsResponse>(`/results/${userId}`),

  generateSummary: (userId: number) =>
    apiFetch<{ summary: string }>('/generate-summary', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),
}
