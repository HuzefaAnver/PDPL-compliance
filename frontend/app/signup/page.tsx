'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [assessmentId, setAssessmentId] = useState<number | null>(null)

  useEffect(() => {
    const id = sessionStorage.getItem('assessment_id')
    const savedEmail = sessionStorage.getItem('assessment_email')
    if (!id) {
      // No assessment — redirect back
      router.push('/assessment')
      return
    }
    setAssessmentId(Number(id))
    if (savedEmail) setEmail(savedEmail)
  }, [router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assessmentId) return
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await api.signup({ email, password, assessment_id: assessmentId })
      sessionStorage.setItem('user_id', String(res.user_id))
      router.push(`/results/${res.user_id}`)
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.')
      setLoading(false)
    }
  }

  const BENEFITS = [
    'Your full compliance risk report',
    'AI-generated action plan (personalised)',
    'Key gaps & how to close them',
    'Access your results anytime',
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-8 animate-pulse">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-white">Creating your account...</h1>
        <p className="text-slate-400">One moment while we prepare your compliance report.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-full mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Your Compliance Report is Ready</h1>
            <p className="text-slate-400 text-sm">Create a free account to view your results and detailed recommendations</p>
          </div>

          {/* Benefits */}
          <div className="bg-slate-800/40 rounded-xl p-4 mb-6 space-y-2">
            {BENEFITS.map(b => (
              <div key={b} className="flex items-center gap-2.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-brand-400 shrink-0" />
                {b}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium mb-1.5 text-slate-300">Email</label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-brand-500 outline-none transition-colors text-sm"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium mb-1.5 text-slate-300">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-10 focus:border-brand-500 outline-none transition-colors text-sm"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              id="signup-submit"
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2 glow"
            >
              View My Compliance Report <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center gap-2 justify-center mt-4 text-xs text-slate-500">
            <Lock className="w-3 h-3" />
            No credit card required. Your data stays private.
          </div>
        </div>
      </div>
    </div>
  )
}
