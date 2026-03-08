import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ShieldCheck, Target, Globe, Landmark, Coins, Rocket, ArrowRight, Lock, ShieldAlert, X, ChevronRight, BarChart3, Users, Zap, FileCheck, Smartphone, Award, Star, Shield, ShieldQuestion, Database, Mail, Settings, Save, Trash2, Layout, BookOpen, Clock, Wine, Send, MapPin, Cpu, Globe2, Palette, PenTool, Briefcase, GraduationCap, FileText } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const DynamicIcon = ({ name, ...props }) => {
    const Icons = {
        TrendingUp, ShieldCheck, Target, Globe, Landmark, Coins, Rocket, ArrowRight, Lock, ShieldAlert, X, ChevronRight, BarChart3, Users, Zap, FileCheck, Smartphone, Award, Star, Shield, ShieldQuestion, Database, Mail, Settings, Save, Trash2, Layout, BookOpen, Clock, Wine, Send, MapPin, Cpu, Globe2, Palette, PenTool, Briefcase, GraduationCap, FileText
    };
    const IconComponent = Icons[name] || ShieldQuestion;
    return <IconComponent {...props} />;
};

// Data will be fetched from CMS

export default function SponsorPortal() {
    const [cmsContent, setCmsContent] = useState([]);
    const [strategyPillars, setStrategyPillars] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Interaction state
    const [selectedPillar, setSelectedPillar] = useState(null);
    const [downloadStatus, setDownloadStatus] = useState('idle');

    const getContent = (key, fallback) => {
        const item = cmsContent.find(c => c.key === key);
        return item ? item.value : fallback;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contentRes, gatewayRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/cms/content`),
                    axios.get(`${API_BASE_URL}/api/cms/gateway`)
                ]);
                setCmsContent(Array.isArray(contentRes.data) ? contentRes.data : []);
                const gatewayData = Array.isArray(gatewayRes.data) ? gatewayRes.data : [];
                setStrategyPillars(gatewayData.filter(g => g.category === 'STRATEGY_PILLAR'));
            } catch (err) {
                console.error('Portal sync error:', err);
                setCmsContent([]); // Fallback to empty array
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const timelineData = Array.isArray(cmsContent) ? cmsContent
        .filter(c => c.sectionId === 'Sponsor_Timeline')
        .map(item => {
            const [year, goal, revenue, margin] = item.value.split('|').map(s => s.trim());
            return { year, goal, revenue, margin };
        }) : [];

    const termSheetData = Array.isArray(cmsContent) ? cmsContent
        .filter(c => c.sectionId === 'Sponsor_TermSheet')
        .sort((a, b) => a.key.localeCompare(b.key))
        .map((item, idx) => ({
            id: (idx + 1).toString().padStart(2, '0'),
            label: item.key.replace(/_/g, ' '),
            value: item.value
        })) : [];

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/settings/verify`, {
                key: 'sponsor_password',
                password: password
            });
            if (res.data.success) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            setError('ACCESS_DENIED: INVALID PROTOCOL KEY');
            setTimeout(() => setError(''), 3000);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)]"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-12 md:p-20 rounded-[4rem] border-white/5 bg-slate-900/40 w-full max-w-xl text-center relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
                >
                    <div className="w-24 h-24 bg-slate-950 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-aether-gold animate-pulse">
                        <Lock size={40} />
                    </div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{getContent('auth_title', 'PROTOCOL')} <span className="text-gradient">{getContent('auth_title_accent', 'LOCKED')}</span></h2>
                    <p className="text-slate-400 font-light mb-12 uppercase tracking-widest text-sm">{getContent('auth_subtitle', 'ENCRYPTED SPONSOR TERMINAL. ENTER ACCESS_KEY TO DECODE.')}</p>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={getContent('auth_placeholder', 'ENTER_PROTOCOL_KEY')}
                                className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-8 py-6 text-white focus:outline-none focus:border-aether-gold transition-all text-center tracking-[0.5em] font-black"
                            />
                        </div>
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center justify-center gap-3 text-rose-500 text-[10px] font-black tracking-widest uppercase"
                                >
                                    <ShieldAlert size={14} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            type="submit"
                            className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:bg-aether-gold hover:text-white transition-all flex items-center justify-center gap-4 group"
                        >
                            <span>{getContent('auth_button_text', 'INITIATE_DECODING')}</span>
                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto py-32 px-6 min-h-screen relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-aether-gold/5 rounded-full blur-[200px] -z-10"></div>

            <div className="text-center mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-slate-950/60 border border-white/10 mb-12 shadow-2xl"
                >
                    <span className="text-[10px] font-mono tracking-[0.5em] text-aether-gold uppercase font-black">{getContent('portal_tag', 'PRIVATE_OFFERING // SPONSOR_SYNDICATE')}</span>
                </motion.div>
                <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 text-white uppercase leading-none">
                    {getContent('portal_title', 'SPONSOR')} <span className="text-gradient">{getContent('portal_title_accent', 'PORTAL')}</span>
                </h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                    {getContent('portal_description', 'GAIO represents a scalable, multi-revenue, low-risk, high-impact platform positioned at the intersection of AI education and global talent.')}
                </p>
            </div>

            {/* 7 Revenue Pillars Grid */}
            <div className="mb-48">
                <h3 className="text-3xl font-black text-white mb-16 uppercase tracking-tighter flex items-center gap-6">
                    <div className="h-px flex-1 bg-white/10"></div>
                    {getContent('pillar_heading', 'INVESTORS_PLACE')}
                    <div className="h-px flex-1 bg-white/10"></div>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {strategyPillars.map((pillar) => (
                        <motion.div
                            key={pillar._id}
                            whileHover={{ y: -10 }}
                            onClick={() => setSelectedPillar(pillar)}
                            className="glass p-10 rounded-[3rem] border-white/5 bg-slate-900/40 relative group overflow-hidden cursor-pointer active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-aether-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <DynamicIcon name={pillar.icon} className="text-aether-gold mb-8 group-hover:scale-110 transition-transform" size={40} />
                            <h4 className="text-lg font-black text-white mb-4 uppercase tracking-tighter">{pillar.title}</h4>
                            <div className="text-aether-gold font-mono text-sm font-black mb-6">{pillar.payload?.value || pillar.subtext}</div>
                            <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed tracking-tight line-clamp-3">{pillar.description}</p>
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                                <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">VIEW_INTEL</span>
                                <ChevronRight size={14} className="text-aether-gold" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Investor Intelligence Drawer */}
            <AnimatePresence>
                {selectedPillar && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPillar(null)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-slate-950 border-l border-white/5 z-[101] shadow-[ -50px_0_100px_rgba(0,0,0,0.5)] overflow-y-auto"
                        >
                            <div className="p-12 md:p-20">
                                <button
                                    onClick={() => setSelectedPillar(null)}
                                    className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors mb-16"
                                >
                                    <X size={24} />
                                </button>

                                <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-aether-gold/20 bg-aether-gold/5 mb-8">
                                    <Zap size={14} className="text-aether-gold" />
                                    <span className="text-[10px] font-black text-aether-gold uppercase tracking-[0.3em]">STRATEGIC_ASSET_INTEL</span>
                                </div>

                                <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                                    {selectedPillar.title}
                                </h2>
                                <p className="text-xl text-slate-400 font-light leading-relaxed mb-16">
                                    {selectedPillar.payload?.mission || selectedPillar.description}
                                </p>

                                <div className="space-y-12 mb-20">
                                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] border-b border-white/5 pb-4">{getContent('drawer_projection_heading', 'FINANCIAL_PROJECTIONS')}</h3>
                                    <div className="grid gap-6">
                                        {(selectedPillar.payload?.projections || []).map((proj, idx) => (
                                            <div key={idx} className="glass p-8 rounded-3xl border-white/5 flex justify-between items-center group hover:border-aether-gold/30 transition-all">
                                                <div>
                                                    <div className="text-[10px] font-mono text-aether-gold mb-2 font-black">{proj.year}</div>
                                                    <div className="text-sm font-black text-white uppercase tracking-wider">{proj.label}</div>
                                                </div>
                                                <div className="text-3xl font-black text-white tracking-tighter">{proj.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                                    <div className="space-y-8">
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] border-b border-white/5 pb-4">{getContent('drawer_kpi_heading', 'STRATEGIC_KPIs')}</h3>
                                        <ul className="space-y-4">
                                            {(selectedPillar.payload?.kpis || []).map((kpi, idx) => (
                                                <li key={idx} className="flex items-center gap-4 text-sm font-bold text-slate-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-aether-gold" />
                                                    {kpi}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-8">
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] border-b border-white/5 pb-4">{getContent('drawer_strategy_heading', 'ECONOMIC_MOAT')}</h3>
                                        <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-tight">
                                            {selectedPillar.payload?.strategy}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        disabled={downloadStatus !== 'idle'}
                                        onClick={() => {
                                            if (downloadStatus !== 'idle') return;

                                            const dynamicPath = selectedPillar.downloadLink;
                                            const fileName = dynamicPath ? dynamicPath.split('/').pop() : getContent('intel_pdf_path', 'GAIO_Investor_Profile.pdf');
                                            const downloadUrl = dynamicPath ? `${API_BASE_URL}/${dynamicPath}` : `/documents/${fileName}`;

                                            setDownloadStatus('initiating');
                                            setTimeout(() => setDownloadStatus('syncing'), 1000);
                                            setTimeout(() => {
                                                setDownloadStatus('complete');
                                                const link = document.createElement('a');
                                                link.href = downloadUrl;
                                                link.setAttribute('download', fileName);
                                                link.setAttribute('target', '_blank');
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }, 3500);
                                            setTimeout(() => setDownloadStatus('idle'), 5000);
                                        }}
                                        className={`w-full py-8 font-black rounded-3xl text-sm tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-6 relative overflow-hidden ${downloadStatus === 'complete' ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]' :
                                            downloadStatus === 'idle' ? 'bg-white text-slate-950 hover:bg-aether-gold hover:text-white' :
                                                'bg-slate-950 text-white border border-white/10'
                                            }`}
                                    >
                                        <span className="relative z-10">
                                            {downloadStatus === 'idle' && getContent('intel_pack_download_label', 'DOWNLOAD_FULL_INTEL_PACK')}
                                            {downloadStatus === 'initiating' && getContent('intel_pack_initiating', 'INITIATING_DEEP_DIVE...')}
                                            {downloadStatus === 'syncing' && getContent('intel_pack_syncing', 'DECODING_INTEL_PACK...')}
                                            {downloadStatus === 'complete' && getContent('intel_pack_complete', 'INTEL_DECRYPTED')}
                                        </span>
                                        {downloadStatus === 'idle' && <ArrowRight size={20} className="relative z-10" />}
                                        {downloadStatus === 'complete' && <ShieldCheck size={20} className="relative z-10" />}

                                        {(downloadStatus === 'initiating' || downloadStatus === 'syncing') && (
                                            <motion.div
                                                className="absolute inset-0 bg-aether-gold/20"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '0%' }}
                                                transition={{ duration: downloadStatus === 'initiating' ? 1 : 2.5 }}
                                            />
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {downloadStatus === 'syncing' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-center"
                                            >
                                                <span className="text-[10px] font-mono text-aether-gold font-black tracking-[0.2em] animate-pulse uppercase">
                                                    {getContent('extraction_node_text', 'Establishing_Secure_Extraction_Node...')}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Financial Projections Table */}
            <div className="mb-48 grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="glass p-16 rounded-[4rem] border-white/5">
                    <h3 className="text-3xl font-black text-white mb-12 uppercase tracking-tighter">{getContent('model_heading', 'FINANCIAL_MODEL')}</h3>
                    <div className="space-y-12">
                        {timelineData.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center group">
                                <div>
                                    <div className="text-[10px] font-mono text-aether-gold mb-2 font-black tracking-widest">{item.year}</div>
                                    <div className="text-2xl font-black text-white uppercase">{item.goal}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-white tracking-tighter">{item.revenue}</div>
                                    <div className="text-[10px] font-mono text-emerald-500 font-black mt-1">MARGIN: {item.margin}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <h3 className="text-4xl font-black text-white mb-10 uppercase tracking-tighter" dangerouslySetInnerHTML={{
                        __html: (() => {
                            const val = getContent('termsheet_heading', 'SPONSOR_SYNDICATE <br /><span class="text-aether-gold">TERM_SHEET</span>');
                            const txt = document.createElement("textarea");
                            txt.innerHTML = val;
                            return txt.value;
                        })()
                    }} />
                    <div className="space-y-8 mb-16">
                        {termSheetData.map((clause) => (
                            <div key={clause.id} className="flex gap-8 p-8 bg-slate-950/60 rounded-[2.5rem] border border-white/5">
                                <div className="text-aether-gold font-mono text-2xl font-black">{clause.id}</div>
                                <div>
                                    <div className="text-sm font-black text-white uppercase tracking-widest mb-2">{clause.label}</div>
                                    <div className="text-2xl font-black text-white">{clause.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <button
                            disabled={downloadStatus !== 'idle'}
                            onClick={() => {
                                if (downloadStatus !== 'idle') return;

                                const fileName = getContent('nda_pdf_path', 'GAIO_Structure_Strategy.pdf');
                                const downloadUrl = fileName.startsWith('uploads/') ? `${API_BASE_URL}/${fileName}` : `/documents/${fileName}`;

                                setDownloadStatus('initiating');
                                setTimeout(() => setDownloadStatus('syncing'), 1000);
                                setTimeout(() => {
                                    setDownloadStatus('complete');
                                    const link = document.createElement('a');
                                    link.href = downloadUrl;
                                    link.setAttribute('download', fileName.split('/').pop());
                                    link.setAttribute('target', '_blank');
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }, 3500);
                                setTimeout(() => setDownloadStatus('idle'), 5000);
                            }}
                            className={`btn-luxury w-full py-8 font-black rounded-3xl text-[11px] tracking-[0.4em] flex items-center justify-center gap-6 group uppercase transition-all relative overflow-hidden ${downloadStatus === 'complete' ? 'bg-emerald-500 text-white' :
                                downloadStatus === 'idle' ? 'bg-white text-slate-950 hover:bg-aether-gold hover:text-white' :
                                    'bg-slate-950 text-white border border-white/10'
                                }`}
                        >
                            <span className="relative z-10">
                                {downloadStatus === 'idle' && getContent('nda_pack_download_label', 'DOWNLOAD_SPONSOR_NDA_PACK')}
                                {downloadStatus === 'initiating' && getContent('nda_pack_initiating', 'SYNCING_NDA_PROTOCOL...')}
                                {downloadStatus === 'syncing' && getContent('nda_pack_syncing', 'GENERATING_ENCRYPTED_PDF...')}
                                {downloadStatus === 'complete' && getContent('nda_pack_complete', 'NDA_PACK_READY')}
                            </span>
                            {downloadStatus === 'idle' && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />}
                            {downloadStatus === 'complete' && <FileCheck size={20} className="relative z-10" />}

                            {(downloadStatus === 'initiating' || downloadStatus === 'syncing') && (
                                <motion.div
                                    className="absolute inset-0 bg-aether-gold/10 shadow-[0_0_20px_rgba(197,160,89,0.2)]"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '0%' }}
                                    transition={{ duration: downloadStatus === 'initiating' ? 1 : 2.5 }}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

