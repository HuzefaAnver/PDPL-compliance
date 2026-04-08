'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, Mail, ArrowRight, Loader as Loader2, CircleCheck as CheckCircle, Key } from 'lucide-react'
import { api } from '@/lib/api'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()

  // State
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  useEffect(() => {
    const id = sessionStorage.getItem('assessment_id')
    const savedEmail = sessionStorage.getItem('assessment_email')
    if (!id) {
      router.push('/assessment')
      return
    }
    setAssessmentId(id)
    if (savedEmail) setEmail(savedEmail)
  }, [router])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        try {
          const data = await res.json()
          throw new Error(data.error || 'Failed to send verification code')
        } catch (parseErr) {
          throw new Error('Failed to send verification code')
        }
      }
      setStep('otp')
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp, assessment_id: assessmentId }),
      })

      let data
      try {
        data = await res.json()
      } catch (parseErr) {
        throw new Error('Invalid server response')
      }
      if (!res.ok) throw new Error(data.error || 'Verification failed')

      console.log('Verification Success Response:', data)

      // CRITICAL: Sign in the user on the client side using the token
      if (data.token) {
        console.log('Performing silent sign-in with token:', data.token, 'type:', data.verification_type)
        const { error: signInError } = await api.auth.verifyOtp(data.email, data.token, data.verification_type || 'magiclink')
        if (signInError) {
          console.error('Auto-signin failed. Error details:', signInError)
          throw new Error('Failed to establish session: ' + (signInError.message || 'Unknown error'))
        } else {
          console.log('Silent sign-in successful!')

          // Wait for session to be established
          let session = null
          for (let i = 0; i < 5; i++) {
            const { data: { session: s } } = await supabase.auth.getSession()
            if (s) {
              session = s
              break
            }
            console.log(`Waiting for session after sign-in (Attempt ${i + 1}/5)...`)
            await new Promise(r => setTimeout(r, 200))
          }

          if (!session) {
            throw new Error('Session not established after sign-in')
          }
        }
      }

      const userId = String(data.user_id)
      if (!userId || userId === 'NaN' || userId === 'undefined') {
        throw new Error(`Technical Error: Received invalid User ID (${userId})`)
      }

      sessionStorage.setItem('user_id', userId)
      router.push(`/results/${userId}?verified=true`)
    } catch (err: any) {
      console.error('Verify OTP Error:', err)
      setError(err.message || 'Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const BENEFITS = [
    'Your full compliance risk report',
    'AI-generated action plan (personalised)',
    'Key gaps & how to close them',
    'Access your results anytime',
  ]

  if (loading && step === 'email') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-white">Sending Code...</h1>
        <p className="text-slate-400 text-sm">We are sending a 6-digit code to {email}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-900/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/5 shadow-2xl">
          {step === 'email' ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-full mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Final Step</h1>
                <p className="text-slate-400 text-sm">Verify your business email to unlock your compliance report</p>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-5 mb-8 border border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">You will receive:</h3>
                <div className="space-y-3">
                  {BENEFITS.map(b => (
                    <div key={b} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-1 h-1 rounded-full bg-brand-400" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Business Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 focus:border-brand-500 outline-none transition-all text-sm placeholder:text-slate-600 focus:ring-4 focus:ring-brand-500/10"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">{error}</div>}

                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] glow"
                >
                  Confirm & Send Code <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-500/10 rounded-full mb-4">
                  <Key className="w-6 h-6 text-brand-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Verify Email</h1>
                <p className="text-slate-400 text-sm">We've sent a 6-digit code to <span className="text-white font-medium">{email}</span></p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Enter 6-Digit Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-5 text-center text-3xl font-black tracking-[0.5em] focus:border-brand-500 outline-none transition-all placeholder:text-slate-800"
                    placeholder="000000"
                    autoFocus
                  />
                </div>

                {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">{error}</div>}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-xl shadow-brand-900/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Unlock My Report'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="w-full text-slate-500 hover:text-slate-300 text-xs font-medium py-2 transition-colors"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="flex items-center gap-2 justify-center mt-8 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            <Lock className="w-3 h-3" />
            Secure Enterprise Encryption
          </div>
        </div>
      </div>
    </div>
  )
}
