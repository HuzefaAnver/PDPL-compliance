'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Shield, AlertCircle, FileText, Calendar, ArrowRight, Download, Loader2 } from 'lucide-react'
import DOMPurify from 'dompurify'
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
            if (!userId || userId === 'NaN' || userId === 'undefined') return

            try {
                setLoading(true)
                setError('')

                // Wait for session
                let session = null
                for (let i = 0; i < 6; i++) {
                    const { data: { session: s } } = await supabase.auth.getSession()
                    if (s) { session = s; break }
                    await new Promise(r => setTimeout(r, 600))
                }

                if (!session) {
                    router.push('/signup')
                    return
                }

                const res = await api.getResults(userId)
                setData(res)
            } catch (err: any) {
                console.error('Fetch Error:', err)
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
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold italic">Error Loading Report</h2>
                <p className="text-slate-400 mt-2">{error || 'Could not find report content.'}</p>
                <button onClick={() => router.push('/')} className="mt-6 text-brand-400 flex items-center gap-2">
                    Return Home <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        )
    }

    // --- Guardrail: Fallback Renderer ---
    const renderContent = () => {
        const hasValidAI = data.ai_summary && data.ai_summary.length > 200;
        
        if (hasValidAI) {
            return (
                <div 
                    className="ai-report-container"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.ai_summary!) }} 
                />
            );
        }

        // Deterministic Fallback Template
        const riskColor = data.risk_level === 'High' ? '#E24B4A' : data.risk_level === 'Moderate' ? '#EF9F27' : '#639922';
        return (
            <div className="space-y-8 animate-pulse-slow">
                <div style={{ borderLeft: `4px solid ${riskColor}`, paddingLeft: '20px', marginBottom: '30px' }}>
                    <p className="text-xl font-medium text-slate-300">Executive Summary (Standard)</p>
                    <p className="text-slate-400 mt-2">Your organization has a compliance score of <span className="text-white font-bold">{data.score}/100</span>. Immediate action is recommended to align with PDPL Articles 5 and 19 regarding data transparency and breach notification.</p>
                </div>
                
                <div style={{ backgroundColor: riskColor, padding: '12px', color: 'white', fontWeight: 'bold', fontSize: '20px', borderRadius: '4px' }}>
                    {data.risk_level.toUpperCase()} RISK POSTURE
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Critical Gaps</h3>
                    {data.gaps.map((gap, i) => (
                        <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-white">{gap}</p>
                                <p className="text-xs text-slate-500 italic mt-1">Requires immediate remediation under PDPL framework.</p>
                            </div>
                            <span className="px-2 py-1 rounded text-[10px] bg-red-500/10 text-red-500 font-bold border border-red-500/20">CRITICAL</span>
                        </div>
                    ))}
                </div>

                <div className="p-6 rounded-2xl bg-brand-500/5 border border-brand-500/10 text-center">
                    <p className="text-slate-300 mb-4">A custom AI roadmap is being refined. In the meantime, you can schedule a call to review these deterministic gaps.</p>
                    <button className="px-6 py-2 bg-brand-600 rounded-lg text-sm font-bold">Request Manual Review</button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
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
                <section className="bg-slate-900/40 border border-slate-800/60 rounded-[32px] p-8 md:p-12 luxury-glass overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Shield className="w-64 h-64 text-brand-500" />
                    </div>
                    <div className="relative z-10">
                        {renderContent()}
                    </div>
                </section>

                <footer className="py-12 text-center border-t border-slate-800/40">
                    <p className="text-slate-600 text-[10px] uppercase tracking-[3px]">
                        DataLoom Compliance Intelligence — Confidential Report
                    </p>
                </footer>
            </main>
        </div>
    )
}
