'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Shield, AlertCircle, CheckCircle, FileText, Calendar, ArrowRight, Download, Share2, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { api, ResultsResponse } from '@/lib/api'
import { supabase } from '@/lib/supabase'

export default function ResultsDashboard() {
    const router = useRouter()
    const params = useParams()

    const userId = params.userId as string

    const [data, setData] = useState<ResultsResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchData() {
            if (!userId || userId === 'NaN' || userId === 'undefined') {
                return
            }

            try {
                setLoading(true)
                setError('')

                // 1. Wait for session (handles race condition between signup and redirect)
                let session = null
                for (let i = 0; i < 6; i++) {
                    const { data: { session: s } } = await supabase.auth.getSession()
                    if (s) {
                        session = s
                        break
                    }
                    console.log(`Waiting for session (Attempt ${i + 1}/6)...`)
                    await new Promise(r => setTimeout(r, 600))
                }

                if (!session) {
                    console.log('No session found after multiple retries, redirecting to signup')
                    router.push('/signup')
                    return
                }

                // 2. Fetch results
                const res = await api.getResults(userId)
                setData(res)
            } catch (err: any) {
                console.error('Fetch Error Detail:', err)
                setError(err.message || 'Failed to load results')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [userId, router])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white">Loading your report...</h2>
                <p className="text-slate-500 text-sm mt-2">Connecting to secure server...</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-white">Error Loading Data</h2>
                <p className="text-slate-400 mt-2">{error || 'Could not find report'}</p>
                <button onClick={() => router.push('/')} className="mt-6 text-brand-400 hover:text-brand-300 flex items-center gap-2">
                    Return Home <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        )
    }

    const isHigh = data.risk_level === 'High'
    const isModerate = data.risk_level === 'Moderate'
    const statusColor = isHigh ? 'text-red-500' : isModerate ? 'text-amber-500' : 'text-green-500'
    const statusBg = isHigh ? 'bg-red-500/10 border-red-500/20' : isModerate ? 'bg-amber-500/10 border-amber-500/20' : 'bg-green-500/10 border-green-500/20'

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Header */}
            <header className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-20 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white leading-none">Compliance Dashboard</h1>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">PDPL Readiness Report</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium hover:bg-slate-800 transition-colors">
                            <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-all hover:scale-105 shadow-lg shadow-brand-900/20">
                            <Calendar className="w-4 h-4" /> Book Consultation
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-8">
                {/* Top Summary Card */}
                <section className={`rounded-2xl border p-8 flex flex-col md:flex-row gap-8 items-center ${statusBg}`}>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Compliance Risk: <span className={statusColor}>{data.risk_level}</span>
                        </h2>
                        <p className="text-slate-400 max-w-lg">
                            Based on your assessment for <span className="text-white font-medium">{data.company_name}</span> in the <span className="text-white font-medium">{data.industry}</span> industry.
                        </p>
                    </div>
                    <div className="shrink-0 relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent"
                                strokeDasharray={364} strokeDashoffset={364 - (364 * data.score) / 100}
                                className={`${statusColor} transition-all duration-1000`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white">{data.score}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Score</span>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* AI Insights & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="glass rounded-2xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="w-5 h-5 text-brand-400" />
                                <h3 className="text-xl font-bold text-white">AI Compliance Summary</h3>
                            </div>
                            <div className="prose prose-invert prose-brand max-w-none prose-sm">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {data.ai_summary || 'Analysis pending...'}
                                </ReactMarkdown>
                            </div>
                        </section>

                        <section className="glass rounded-2xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                <h3 className="text-xl font-bold text-white">Critical Gaps Detected</h3>
                            </div>
                            <div className="grid gap-3">
                                {data.gaps && data.gaps.length > 0 ? (
                                    data.gaps.map((gap: string, i: number) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900 border border-slate-700/50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                            <p className="text-sm text-slate-300">{gap}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-3 text-green-400">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">No critical rule-based gaps identified.</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar CTA */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white shadow-xl shadow-brand-900/30">
                            <h3 className="text-lg font-bold mb-3">Free PDPL Consultation</h3>
                            <p className="text-brand-100 text-sm mb-6">
                                Schedule a complimentary 20-minute strategy session with our compliance experts to review your results.
                            </p>
                            <a
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="block w-full text-center bg-white text-brand-700 font-bold py-3 rounded-xl hover:bg-brand-50 transition-all flex items-center justify-center gap-2"
                            >
                                Book My Slot <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
