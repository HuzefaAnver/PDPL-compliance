'use client'
import { useRouter } from 'next/navigation'
import { Shield, Clock, TrendingUp, Lock, ArrowRight, CheckCircle, Zap, Star } from 'lucide-react'

const TRUST_POINTS = [
  { icon: Clock, text: 'Takes only 2 minutes' },
  { icon: Shield, text: 'Based on Saudi PDPL law' },
  { icon: Lock, text: 'Your data stays private' },
  { icon: TrendingUp, text: 'Instant RAG risk rating' },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Complete Assessment', sub: 'Answer 10 questions about your practices' },
  { n: '02', title: 'Create Free Account', sub: 'Securely link your results to your profile' },
  { n: '03', title: 'View Risk Report', sub: 'Get your RAG score and AI summary' },
  { n: '04', title: 'Start Improving', sub: 'Follow your personalized action plan' },
]

const TESTIMONIALS = [
  { quote: "We had no idea we were failing on 6 out of 10 PDPL requirements. This caught it in minutes.", name: "Sara A.", role: "COO, Riyadh Fintech" },
  { quote: "The AI summary was so clear even our non-technical board understood our compliance gaps.", name: "Mohammed K.", role: "CEO, Healthcare SaaS" },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Nav */}
      <nav className="border-b border-slate-800/60 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10 bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg">PDPL Shield</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full hidden sm:block">Saudi Arabia PDPL</span>
          <button
            id="nav-cta"
            onClick={() => router.push('/assessment')}
            className="text-sm font-medium bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg transition-colors"
          >
            Start Free Assessment
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 text-center max-w-4xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-brand-950/60 border border-brand-800/40 rounded-full px-4 py-1.5 mb-6 text-sm text-brand-300">
            <Zap className="w-3.5 h-3.5" />
            Saudi Arabia PDPL Compliance — Free Assessment
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Check Your PDPL Compliance{' '}
            <span className="text-gradient">in 2 Minutes</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Answer 10 simple questions and instantly discover your compliance risk rating —
            Red, Amber, or Green — plus an AI-generated action plan tailored to your business.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button
              id="hero-cta-main"
              onClick={() => router.push('/assessment')}
              className="flex items-center gap-2 justify-center bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 glow text-lg"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              id="hero-cta-demo"
              onClick={() => router.push('/assessment?demo=true')}
              className="flex items-center gap-2 justify-center glass glass-hover text-slate-300 font-medium px-8 py-4 rounded-xl transition-all"
            >
              Load Demo Data
            </button>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center">
            {TRUST_POINTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
                <Icon className="w-4 h-4 text-brand-400" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk indicator preview */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <div className="glass rounded-2xl p-8">
          <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-6">Your result will look like this</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { color: 'red', label: 'High Risk', emoji: '🔴', desc: 'Immediate action needed' },
              { color: 'amber', label: 'Moderate Risk', emoji: '🟡', desc: 'Several gaps to close' },
              { color: 'green', label: 'Low Risk', emoji: '🟢', desc: 'Strong compliance posture' },
            ].map(({ color, label, emoji, desc }) => (
              <div
                key={color}
                className={`rounded-xl p-4 text-center border ${color === 'amber'
                    ? 'border-amber-500/40 bg-amber-500/10 scale-105'
                    : 'border-slate-700/40 bg-slate-800/30 opacity-60'
                  }`}
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <p className={`font-bold text-sm mb-1 ${color === 'amber' ? 'text-amber-400' : 'text-slate-300'}`}>{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-center mb-12 text-slate-200">How it works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map(({ n, title, sub }) => (
            <div key={n} className="text-center">
              <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center mx-auto mb-3 text-white font-bold font-display text-sm">
                {n}
              </div>
              <p className="text-sm font-semibold text-slate-200 mb-1">{title}</p>
              <p className="text-xs text-slate-500">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map(({ quote, name, role }) => (
            <div key={name} className="glass rounded-2xl p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">"{quote}"</p>
              <div>
                <p className="font-semibold text-sm text-white">{name}</p>
                <p className="text-xs text-slate-500">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16 max-w-2xl mx-auto text-center">
        <div className="glass rounded-2xl p-10">
          <h2 className="font-display text-2xl font-bold mb-3">Ready to know your PDPL risk?</h2>
          <p className="text-slate-400 mb-6">Free. No credit card. Results in 2 minutes.</p>
          <button
            id="bottom-cta"
            onClick={() => router.push('/assessment')}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 glow"
          >
            Start Free Assessment <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            {['✓ No credit card', '✓ Takes 2 minutes', '✓ Instant results'].map(t => (
              <span key={t} className="text-xs text-slate-500">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 px-6 py-8 text-center text-sm text-slate-600">
        PDPL Shield — Saudi Arabia Personal Data Protection Law (Royal Decree M/19, 2021)
        <br />Not a substitute for legal advice. Consult a qualified legal professional.
      </footer>
    </div>
  )
}
