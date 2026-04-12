'use client'
import { useRouter } from 'next/navigation'
import { ArrowRight, Zap } from 'lucide-react'

const BADGES = [
  {
    icon: (
      <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 opacity-50">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 4v3.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    text: 'Rapid 2-Minute Diagnostic'
  },
  {
    icon: (
      <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 opacity-50">
        <path d="M7 1l1.5 4.5H13L9.5 8l1.5 4.5L7 10l-4 2.5L4.5 8 1 5.5h4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    text: 'Aligned with Saudi PDPL Framework'
  },
  {
    icon: (
      <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 opacity-50">
        <rect x="2" y="5" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4.5 5V3.5a2.5 2.5 0 015 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    text: 'Secure & Private Assessment'
  },
  {
    icon: (
      <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 opacity-50">
        <polyline points="1,10 4,6 7,8 10,4 13,2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: 'Instant RAG Risk Analysis'
  },
]

const STRIP_CARDS = [
  { num: '2min', label: 'Assessment Time', desc: 'Complete your full compliance diagnostic in under two minutes.' },
  { num: '100%', label: 'PDPL Aligned', desc: 'Framework mapped directly to KSA Personal Data Protection Law.' },
  { num: 'AI', label: 'Powered Reports', desc: 'Receive a prioritized action plan with RAG risk classification.' },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen selection:bg-gold selection:text-midnight">
      {/* Background Layers */}
      <div className="noise" />
      <div className="grid-bg" />
      <div className="glow-header" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 h-[80px] border-b border-gold/15 bg-midnight/80 backdrop-blur-md">
        <div className="flex items-center">
          <img src="/logo.jpeg" alt="DataLoom" className="h-[72px] w-auto brightness-110 contrast-125 mix-blend-screen" />
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:block font-display text-xs tracking-[2px] text-gold px-4 py-1.5 border border-gold/35 bg-gold/5 uppercase">
            Regulatory Compliance Framework
          </div>
          <button
            onClick={() => router.push('/assessment')}
            className="font-display text-sm tracking-[2px] bg-gold text-midnight px-6 py-2.5 hover:bg-gold-light transition-colors uppercase font-bold"
          >
            Start Assessment
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-[2] flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2.5 font-display text-[10px] tracking-[2.5px] text-gold uppercase px-4 py-1.5 border border-gold/25 bg-gold/5 rounded-full mb-10 transition-transform hover:scale-105 cursor-default">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-gold" />
          Saudi Arabia PDPL — Precision Assessment
        </div>

        <h1 className="font-display text-[64px] sm:text-[80px] md:text-[110px] leading-[0.92] tracking-[2px] text-eggshell max-w-[900px] mb-8 select-none">
          PDPL Compliance
          <span className="block text-gold text-glow">Readiness Audit</span>
        </h1>

        <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent my-10" />

        <p className="text-eggshell/60 text-base md:text-lg font-light leading-relaxed max-w-[520px] mb-12">
          A Robust diagnostic tool to assess data protection alignment with
          KSA and receive a prioritized AI-powered action plan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => router.push('/assessment')}
            className="btn-gold group"
          >
            Start Assessment
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
          {/* <button
            onClick={() => router.push('/assessment?demo=true')}
            className="btn-outline-gold"
          >
            Reference Data
          </button> */}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-x-10 gap-y-6 justify-center w-full max-w-[750px] pt-8 border-t border-gold/10">
          {BADGES.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-[11px] font-light text-eggshell/40 tracking-[0.5px]">
              <span className="text-gold">{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>
      </section>

      {/* Card Strip Section */}
      <div className="card-strip-wrap">
        {STRIP_CARDS.map((card, idx) => (
          <div key={idx} className="strip-card group hover:bg-midnight transition-colors cursor-default">
            <div className="font-display text-[42px] leading-none text-gold mb-2 group-hover:scale-110 transition-transform origin-left">
              {card.num}
            </div>
            <div className="text-xs font-bold tracking-[1.5px] text-eggshell uppercase mb-1">
              {card.label}
            </div>
            <p className="text-xs font-light leading-relaxed text-eggshell/40">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gold/5 text-center">
        <p className="text-[10px] font-light tracking-[2px] text-eggshell/20 uppercase">
          DataLoom Compliance Intelligence — KSA Royal Decree M/19
        </p>
      </footer>
    </div>
  )
}
