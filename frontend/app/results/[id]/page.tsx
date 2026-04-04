'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Shield, AlertTriangle, CheckCircle, ArrowLeft, Loader2,
  Calendar, Sparkles, ExternalLink, ChevronRight, TrendingUp,
  BookOpen, PhoneCall
} from 'lucide-react'
import { api, ResultsResponse } from '@/lib/api'

// ── Risk config ────────────────────────────────────────────────
const RISK_CONFIG = {
  RED: {
    emoji: '🔴',
    label: 'High Risk',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: 'shadow-red-900/30',
    bar: 'bg-red-500',
    description: 'Your business has significant PDPL compliance gaps that need immediate attention. Non-compliance can lead to fines up to SAR 5 million.',
  },
  AMBER: {
    emoji: '🟡',
    label: 'Moderate Risk',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-900/30',
    bar: 'bg-amber-500',
    description: 'You have a partial compliance foundation but several important gaps remain. Focused action over 30-60 days will bring you to a safe position.',
  },
  GREEN: {
    emoji: '🟢',
    label: 'Low Risk',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-900/30',
    bar: 'bg-emerald-500',
    description: 'Great work! Your compliance posture is strong. Continue maintaining your current practices and stay updated as PDPL regulations evolve.',
  },
}

// ── Simple donut chart ─────────────────────────────────────────
function ScoreRing({ score, risk_level }: { score: number; risk_level: 'RED' | 'AMBER' | 'GREEN' }) {
  const cfg = RISK_CONFIG[risk_level]
  const pct = (score / 20) * 100
  const r = 54
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={risk_level === 'RED' ? '#ef4444' : risk_level === 'AMBER' ? '#f59e0b' : '#10b981'}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute text-center">
        <div className={`text-3xl font-black ${cfg.color}`}>{score}</div>
        <div className="text-xs text-slate-500">/ 20</div>
      </div>
    </div>
  )
}

// ── AI Summary renderer (markdown-lite) ──────────────────────
function AISummary({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />
        // Bold text **...**
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
            )}
          </p>
        )
      })}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function ResultsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<ResultsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryText, setSummaryText] = useState<string | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getResults(Number(id))
        setData(res)
        if (res.ai_summary) setSummaryText(res.ai_summary)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleGenerateSummary = async () => {
    setSummaryLoading(true)
    try {
      const res = await api.generateSummary(Number(id))
      setSummaryText(res.summary)
      setTimeout(() => summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setSummaryText('Failed to generate summary. Please try again.')
    } finally {
      setSummaryLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
      Results not found. <button onClick={() => router.push('/')} className="ml-2 text-brand-400 underline">Go home</button>
    </div>
  )

  const cfg = RISK_CONFIG[data.risk_level as 'RED' | 'AMBER' | 'GREEN'] || RISK_CONFIG.RED

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <header className="border-b border-slate-800/60 px-6 py-4 flex items-center justify-between sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-white">PDPL Shield</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:block">{data.company_name} · {data.email}</span>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Exit
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12 space-y-10">

        {/* ── Risk Status Hero ── */}
        <section className={`glass rounded-2xl p-8 border ${cfg.border}`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Ring */}
            <div className="shrink-0">
              <ScoreRing score={data.score} risk_level={data.risk_level as any} />
            </div>
            {/* Text */}
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your PDPL Risk Level</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-3 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                {cfg.emoji} {cfg.label}
              </div>
              <h1 className="text-3xl font-black text-white mb-2">{data.company_name}</h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">{cfg.description}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                Assessment completed · {new Date().toLocaleDateString('en-SA')}
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Compliance Score</span>
              <span>{data.score}/20</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${cfg.bar} rounded-full transition-all duration-1000`}
                style={{ width: `${(data.score / 20) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
              <span>0 — High Risk</span>
              <span>10</span>
              <span>16</span>
              <span>20 — Low Risk</span>
            </div>
          </div>
        </section>

        {/* ── Key Gaps ── */}
        {data.gaps && data.gaps.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Key Compliance Gaps
            </h2>
            <div className="space-y-3">
              {data.gaps.map((gap, i) => (
                <div key={i} className="glass rounded-xl px-5 py-4 flex items-start gap-3 border-l-4 border-l-red-500/60">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{gap}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── AI Summary ── */}
        <section ref={summaryRef}>
          <div className="glass rounded-2xl p-6 border border-brand-800/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-brand-400" /> AI Compliance Summary
              </h2>
              {summaryText && (
                <button
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
                >
                  {summaryLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrendingUp className="w-3 h-3" />}
                  Regenerate
                </button>
              )}
            </div>

            {summaryText ? (
              <AISummary text={summaryText} />
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🤖</div>
                <p className="text-slate-400 text-sm mb-4">
                  Get a personalised, plain-English summary of your compliance status, key risks, and what to do next.
                </p>
                <button
                  id="generate-summary-btn"
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {summaryLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate AI Summary</>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div className="glass rounded-2xl p-8 text-center border border-slate-700/30">
            <h2 className="text-2xl font-bold text-white mb-2">Need help fixing this?</h2>
            <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
              Our team can help you close these gaps fast — from privacy policies to vendor agreements and staff training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                id="cta-starter-kit"
                href="https://cal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:scale-105 glow"
              >
                <BookOpen className="w-4 h-4" />
                Get PDPL Starter Kit
              </a>
              <a
                id="cta-book-call"
                href="https://cal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 glass glass-hover text-slate-200 font-semibold px-6 py-3.5 rounded-xl transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                Book Setup Call
              </a>
            </div>
            <p className="text-xs text-slate-600 mt-4">No obligation. 30-minute discovery call.</p>
          </div>
        </section>

        {/* ── What's covered ── */}
        <section className="glass rounded-2xl p-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4 font-semibold">Assessment covers</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['Data inventory', 'Third-party vendors', 'Privacy policy', 'Breach response plan', 'Data subject rights', 'Sensitive data controls'].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
