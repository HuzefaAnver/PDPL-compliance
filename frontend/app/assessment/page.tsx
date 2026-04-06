'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { api, AssessmentCreate } from '@/lib/api'

// ── Demo data ──────────────────────────────────────────────────
const DEMO_DATA: AssessmentCreate = {
  company_name: 'Riyadh Tech Solutions',
  user_name: 'Ahmed Al-Rashid',
  email: 'ahmed@riyadhtech.sa',
  industry: 'Technology / SaaS',
  data_volume: '100-10000',
  data_types: ['basic', 'financial'],
  stores_regularly: 'yes',
  knows_data_location: 'partially',
  shares_third_party: 'not_documented',
  vendor_list: 'partial',
  privacy_policy: 'basic',
  internal_rules: 'informal',
  breach_plan: 'no',
  user_rights: 'informal',
}

const INDUSTRIES = [
  'Retail & E-commerce',
  'Healthcare',
  'Financial Services / Fintech',
  'Technology / SaaS',
  'Real Estate',
  'Education',
  'Hospitality & Tourism',
  'Manufacturing',
  'Legal & Professional Services',
  'Other',
]

const DATA_TYPE_OPTIONS = [
  { id: 'basic', label: 'Basic Data', desc: 'Name, email, phone number' },
  { id: 'financial', label: 'Financial Data', desc: 'Payment info, salary, banking' },
  { id: 'sensitive', label: 'Sensitive Data', desc: 'Health records, ID, biometrics' },
]

type RadioOption = { value: string; label: string; hint?: string }

// ── Reusable radio card ────────────────────────────────────────
function RadioCard({ options, value, onChange }: { options: RadioOption[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid gap-2.5">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl border text-left transition-all ${value === opt.value
            ? 'border-brand-500 bg-brand-500/10 text-white'
            : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
            }`}
        >
          <div>
            <span className="font-medium text-sm">{opt.label}</span>
            {opt.hint && <p className="text-xs text-slate-500 mt-0.5">{opt.hint}</p>}
          </div>
          {value === opt.value && <CheckCircle className="w-4 h-4 text-brand-400 shrink-0 ml-2" />}
        </button>
      ))}
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────
function SectionHeader({ step, title, subtitle }: { step: string; title: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">{step}</p>
      <h2 className="text-2xl font-bold text-white mb-1.5">{title}</h2>
      <p className="text-sm text-slate-400">{subtitle}</p>
    </header>
  )
}

// ── Assessment Form Component ──────────────────────────────────
function AssessmentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<AssessmentCreate>({
    company_name: '',
    user_name: '',
    email: '',
    industry: '',
    data_volume: '',
    data_types: [],
    stores_regularly: '',
    knows_data_location: '',
    shares_third_party: '',
    vendor_list: '',
    privacy_policy: '',
    internal_rules: '',
    breach_plan: '',
    user_rights: '',
  })

  useEffect(() => {
    if (isDemo) setFormData(DEMO_DATA)
  }, [isDemo])

  const set = (key: keyof AssessmentCreate, val: string) =>
    setFormData(prev => ({ ...prev, [key]: val }))

  const toggleDataType = (id: string) => {
    const cur = formData.data_types as string[]
    setFormData(prev => ({
      ...prev,
      data_types: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id],
    }))
  }

  const canProceedRisk = formData.data_volume && formData.data_types.length > 0 && formData.stores_regularly

  const canProceedMaturity = formData.knows_data_location && formData.shares_third_party
    && formData.vendor_list && formData.privacy_policy && formData.internal_rules
    && formData.breach_plan && formData.user_rights

  const canSubmit = canProceedRisk && canProceedMaturity && formData.company_name.trim().length >= 2
    && formData.user_name.trim().length >= 2 && formData.email.trim().includes('@') && formData.industry

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    try {
      const result = await api.submitAssessment(formData)
      sessionStorage.setItem('assessment_id', result.assessment_id)
      sessionStorage.setItem('assessment_email', formData.email)
      router.push('/signup')
    } catch (err) {
      console.error(err)
      alert('Failed to submit. Please check your connection.')
      setLoading(false)
    }
  }

  const TOTAL_STEPS = 3
  const progress = ((step + 1) / TOTAL_STEPS) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-8 animate-pulse">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-white">Generating Your AI Compliance Report...</h1>
        <p className="text-slate-400 max-w-sm">Analysing your answers against PDPL requirements to generate a custom roadmap.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-200">PDPL Assessment</span>
            </div>
            <span className="text-xs text-slate-500">Step {step + 1} of {TOTAL_STEPS}</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center p-6 pt-10">
        <div className="w-full max-w-xl">
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-7">
              <SectionHeader
                step="Step 1"
                title="Your data & risk profile"
                subtitle="Help us understand the scale and type of data you handle."
              />

              <div>
                <p className="text-sm font-semibold text-slate-200 mb-3">Q1. How many individuals' data do you handle?</p>
                <RadioCard
                  value={formData.data_volume}
                  onChange={v => set('data_volume', v)}
                  options={[
                    { value: '<100', label: 'Fewer than 100 people' },
                    { value: '100-10000', label: '100 – 10,000 people' },
                    { value: '>10000', label: 'More than 10,000 people' },
                  ]}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200 mb-3">Q2. What types of data do you collect? <span className="font-normal text-slate-500">(select all that apply)</span></p>
                <div className="grid gap-2.5">
                  {DATA_TYPE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleDataType(opt.id)}
                      className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl border text-left transition-all ${formData.data_types.includes(opt.id)
                        ? 'border-brand-500 bg-brand-500/10 text-white'
                        : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
                        }`}
                    >
                      <div>
                        <span className="font-medium text-sm">{opt.label}</span>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                      {formData.data_types.includes(opt.id) && <CheckCircle className="w-4 h-4 text-brand-400 shrink-0 ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200 mb-3">Q3. Do you store or process personal data on a regular basis?</p>
                <RadioCard
                  value={formData.stores_regularly}
                  onChange={v => set('stores_regularly', v)}
                  options={[
                    { value: 'yes', label: 'Yes', hint: 'We regularly store/process data' },
                    { value: 'sometimes', label: 'Sometimes', hint: 'Occasional data processing' },
                    { value: 'no', label: 'No', hint: 'We rarely handle personal data' },
                  ]}
                />
              </div>

              <button
                id="step-risk-next"
                disabled={!canProceedRisk}
                onClick={() => setStep(1)}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2 transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-7">
              <SectionHeader
                step="Step 2"
                title="Compliance maturity"
                subtitle="Quick questions about your current privacy practices."
              />

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-3">Q4. Do you know what data you collect and where it is stored?</p>
                  <RadioCard
                    value={formData.knows_data_location}
                    onChange={v => set('knows_data_location', v)}
                    options={[
                      { value: 'yes', label: 'Yes — fully documented' },
                      { value: 'partially', label: 'Partially — some idea, not documented' },
                      { value: 'no', label: 'No — not sure' },
                    ]}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-3">Q5. Do you share data with third-party tools or vendors?</p>
                  <RadioCard
                    value={formData.shares_third_party}
                    onChange={v => set('shares_third_party', v)}
                    options={[
                      { value: 'documented', label: 'Yes — and it\'s documented with agreements' },
                      { value: 'not_documented', label: 'Yes — but without formal agreements' },
                      { value: 'not_sure', label: 'Not sure / No' },
                    ]}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-3">Q6. Do you maintain a vendor and tools list?</p>
                  <RadioCard
                    value={formData.vendor_list}
                    onChange={v => set('vendor_list', v)}
                    options={[
                      { value: 'yes', label: 'Yes — up to date' },
                      { value: 'partial', label: 'Partial — some vendors listed' },
                      { value: 'no', label: 'No — not tracked' },
                    ]}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-3">Q7. Do you have a privacy policy?</p>
                  <RadioCard
                    value={formData.privacy_policy}
                    onChange={v => set('privacy_policy', v)}
                    options={[
                      { value: 'yes', label: 'Yes — PDPL-compliant policy published' },
                      { value: 'basic', label: 'Basic — simple/generic policy exists' },
                      { value: 'no', label: 'No — none exists' },
                    ]}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-3">Q8. Do you have internal data handling rules?</p>
                  <RadioCard
                    value={formData.internal_rules}
                    onChange={v => set('internal_rules', v)}
                    options={[
                      { value: 'yes', label: 'Yes — written policies in place' },
                      { value: 'informal', label: 'Informal — team knows but nothing written' },
                      { value: 'no', label: 'No — no rules' },
                    ]}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-3">Q9. Do you have a data breach response plan?</p>
                  <RadioCard
                    value={formData.breach_plan}
                    onChange={v => set('breach_plan', v)}
                    options={[
                      { value: 'yes', label: 'Yes — documented with 72-hr SDAIA procedure' },
                      { value: 'basic', label: 'Basic — informal plan exists' },
                      { value: 'no', label: 'No — nothing in place' },
                    ]}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200 mb-3">Q10. Can individuals request access or deletion of their data?</p>
                  <RadioCard
                    value={formData.user_rights}
                    onChange={v => set('user_rights', v)}
                    options={[
                      { value: 'yes', label: 'Yes — formal process exists' },
                      { value: 'informal', label: 'Informal — handled case by case' },
                      { value: 'no', label: 'No — no process' },
                    ]}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  id="step-maturity-next"
                  disabled={!canProceedMaturity}
                  onClick={() => setStep(2)}
                  className="flex-[2] bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-5">
              <SectionHeader
                step="Step 3"
                title="Final Details"
                subtitle="Where should we send your results?"
              />
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Company Name</label>
                <input
                  id="company_name"
                  type="text"
                  value={formData.company_name}
                  onChange={e => set('company_name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-brand-500 outline-none transition-colors text-sm"
                  placeholder="e.g. Riyadh Tech Solutions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Your Name</label>
                <input
                  id="user_name"
                  type="text"
                  value={formData.user_name}
                  onChange={e => set('user_name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-brand-500 outline-none transition-colors text-sm"
                  placeholder="e.g. Ahmed Al-Rashid"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Work Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => set('email', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-brand-500 outline-none transition-colors text-sm"
                  placeholder="e.g. ahmed@company.sa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-300">Industry</label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={e => set('industry', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-brand-500 outline-none transition-colors text-sm"
                >
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  id="submit-assessment"
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  className="flex-[2] bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-900/40"
                >
                  Get My Results <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Layout with Suspense (Next.js 15 Requirement) ────────────────
export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white">Initializing Assessment...</h2>
      </div>
    }>
      <AssessmentForm />
    </Suspense>
  )
}
