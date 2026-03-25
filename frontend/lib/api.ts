const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface CompanyCreate {
  name: string
  industry: string
  data_types: string[]
  tools_used: string[]
  third_party_vendors: string[]
  processing_activities: string
  employee_count: string
  country: string
}

export interface Company extends CompanyCreate {
  id: number
  created_at: string
}

export interface ComplianceScore {
  company_id: number
  overall_score: number
  risk_level: 'Low' | 'Medium' | 'High'
  gaps: Gap[]
  recommendations: string[]
}

export interface Gap {
  severity: 'high' | 'medium' | 'low'
  code: string
  title: string
  description: string
  article: string
}

export interface GeneratedDocument {
  id: number
  company_id: number
  doc_type: string
  content: string
  created_at: string
}

export interface Dashboard {
  company: Company
  compliance_score: ComplianceScore | null
  documents: GeneratedDocument[]
}

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

export const api = {
  createCompany: (data: CompanyCreate) =>
    apiFetch<Company>('/companies/', { method: 'POST', body: JSON.stringify(data) }),

  getDashboard: (id: number) =>
    apiFetch<Dashboard>(`/companies/${id}/dashboard`),

  generateAll: (company_id: number) =>
    apiFetch<any>('/generate/all', { method: 'POST', body: JSON.stringify({ company_id }) }),

  generateDoc: (type: string, company_id: number) =>
    apiFetch<GeneratedDocument>(`/generate/${type}`, {
      method: 'POST',
      body: JSON.stringify({ company_id }),
    }),

  chat: (company_id: number, message: string) =>
    apiFetch<{ answer: string }>('/chat/', {
      method: 'POST',
      body: JSON.stringify({ company_id, message }),
    }),

  downloadUrl: (company_id: number, doc_type: string) =>
    `${BASE}/generate/${company_id}/download/${doc_type}`,
}
