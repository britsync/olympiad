import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Ticket, ArrowRight, Star, Music, Mic, Award, Wine, Camera, Sparkles, ShieldCheck, Mail, CheckCircle, Smartphone, Lock, Target, Globe2, Zap, BarChart3, Rocket, ChevronRight, X, FileCheck } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, size = 24, className }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.Target;
    return <IconComponent size={size} className={className} />;
};


export default function GalaRSVP({ onNavigate }) {
    const [selectedPillar, setSelectedPillar] = useState(null);
    const [unlockStatus, setUnlockStatus] = useState('idle'); // idle, decrypting, success
    const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, initiating, syncing, complete
    const [roadmap, setRoadmap] = useState([]);
    const [phases, setPhases] = useState([]);
    const [partners, setPartners] = useState([]);
    const [revenuePillars, setRevenuePillars] = useState([]);
    const [galaGoals, setGalaGoals] = useState([]);
    const [cmsContent, setCmsContent] = useState([]);

    const getContent = (key, fallback) => {
        const item = cmsContent.find(c => c.key === key);
        return item ? item.value : fallback;
    };

    useEffect(() => {
        const fetchGalaData = async () => {
            try {
                const [gatewayRes, contentRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/cms/gateway`),
                    axios.get(`${API_BASE_URL}/api/cms/content`)
                ]);
                const data = gatewayRes.data;
                setRoadmap(data.filter(i => i.category === 'ROADMAP').sort((a, b) => a.order - b.order));
                setPhases(data.filter(i => i.category === 'PHASE').sort((a, b) => a.order - b.order));
                setPartners(data.filter(i => i.category === 'PARTNER').sort((a, b) => a.order - b.order));
                setRevenuePillars(data.filter(i => i.category === 'STRATEGY_PILLAR').sort((a, b) => a.order - b.order));
                setGalaGoals(data.filter(i => i.category === 'GALA_GOAL').sort((a, b) => a.order - b.order));
                setCmsContent(contentRes.data.filter(c => c.sectionId === 'Gala'));
            } catch (err) {
                console.error('FAILED_TO_SYNC_GALA_DATA', err);
            }
        };
        fetchGalaData();
    }, []);

    const tabahiiVariants = {
        hidden: { opacity: 0, y: 100, rotateX: 45, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 1.2
            }
        },
        hover: {
            scale: 1.05,
            rotateY: 5,
            rotateX: -5,
            y: -20,
            boxShadow: "0 40px 80px rgba(197, 160, 89, 0.4)",
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "circOut" }
        }
    };

    const pulseGlow = {
        animate: {
            boxShadow: [
                "0 0 0px rgba(197, 160, 89, 0)",
                "0 0 40px rgba(197, 160, 89, 0.4)",
                "0 0 0px rgba(197, 160, 89, 0)"
            ],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <div className="bg-aether-bg text-white min-h-screen relative overflow-hidden perspective-1000">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-aether-gold/10 rounded-full blur-[150px] -z-10 animate-pulse opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[200px] -z-10"></div>

            {/* Moving scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(197,160,89,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline pointer-events-none opacity-20"></div>

            {/* HERO SECTION */}
            <section className="relative pt-48 pb-40 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                    >
                        <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-[12px] font-mono tracking-[1em] text-aether-gold uppercase font-black mb-12 block"
                        >
                            {getContent('hero_subheading', 'GLOBAL_STRATEGIC_ASSET // LONDON_2026')}
                        </motion.span>
                        <h1 className="text-8xl md:text-[14rem] font-black tracking-tighter mb-16 uppercase leading-[0.75] text-white">
                            {getContent('hero_title_part1', 'THE')} <motion.span
                                className="text-gradient inline-block"
                                animate={{
                                    textShadow: ["0 0 20px rgba(197,160,89,0)", "0 0 50px rgba(197,160,89,0.5)", "0 0 20px rgba(197,160,89,0)"]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >{getContent('hero_title_accent', 'GAIO')}</motion.span><br />{getContent('hero_title_part2', 'EXPERIENCE')}
                        </h1>
                        <p className="text-slate-400 text-2xl md:text-3xl font-light max-w-4xl mx-auto mb-20 uppercase tracking-[0.2em] leading-relaxed">
                            {getContent('hero_description_lead', 'A FLAGSHIP INTERNATIONAL AI ECOSYSTEM DESIGNED TO IDENTIFY, NURTURE, AND COMMERCIALIZE')} <motion.span
                                whileHover={{ scale: 1.1, color: "#fff" }}
                                className="text-white font-black cursor-crosshair transition-all"
                            >{getContent('hero_description_accent', 'FUTURE-READY TALENT')}</motion.span>.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.1, y: -10, boxShadow: "0 20px 40px rgba(197,160,89,0.3)" }}
                            whileTap={{ scale: 0.9 }}
                            disabled={unlockStatus !== 'idle'}
                            onClick={() => {
                                setUnlockStatus('decrypting');
                                setTimeout(() => setUnlockStatus('success'), 2000);
                                setTimeout(() => setUnlockStatus('idle'), 4500);
                            }}
                            className="btn-luxury px-20 py-10 bg-white text-slate-950 rounded-full font-black text-sm tracking-[0.4em] uppercase hover:bg-aether-gold hover:text-white transition-all shadow-2xl relative group overflow-hidden min-w-[400px]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-4">
                                {unlockStatus === 'idle' && getContent('cta_idle', 'SECURE ACCESS_COORDINATES')}
                                {unlockStatus === 'decrypting' && getContent('cta_decrypting', 'DECRYPTING_LOCATION...')}
                                {unlockStatus === 'success' && getContent('cta_success', 'LOCATION_LOCKED: LONDON_ROYAL')}
                                {unlockStatus === 'success' ? <Smartphone size={20} /> : <Lock size={20} />}
                            </span>

                            {unlockStatus === 'decrypting' && (
                                <motion.div
                                    className="absolute inset-0 bg-aether-gold/20"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* MISSION & VISION */}
            <section className="py-64 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="space-y-24"
                        >
                            <motion.div variants={itemVariants}>
                                <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter mb-12 leading-none">{getContent('vision_title_part1', 'OUR')}<br /><span className="text-gradient">{getContent('vision_title_accent', 'VISION_MATRIX')}</span></h2>
                                <p className="text-slate-400 text-2xl font-light leading-relaxed max-w-2xl bg-white/5 p-12 rounded-[3rem] border-white/5 border-l-4 border-l-aether-gold shadow-2xl">
                                    {getContent('vision_description', 'TO BECOME THE WORLD’S LEADING AI OLYMPIAD, SHAPING THE DIGITAL FRONTIER THROUGH SECURE GLOBAL NODES.')}
                                </p>
                            </motion.div>
                            <div className="space-y-12">
                                {[
                                    { title: 'DEMOCRATIZE ACCESS', desc: 'Removing barriers to AI education globally.', icon: Globe2, color: 'text-blue-400' },
                                    { title: 'BRIDGE THE GAP', desc: 'Connecting academia and tech giants.', icon: Zap, color: 'text-yellow-400' },
                                    { title: 'SUSTAINABLE IMPACT', desc: 'Creating measurable long-term AI infra.', icon: BarChart3, color: 'text-emerald-400' }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        variants={tabahiiVariants}
                                        whileHover="hover"
                                        className="flex gap-12 group cursor-none p-8 glass rounded-[3rem] border-white/5 transition-all"
                                    >
                                        <motion.div
                                            variants={pulseGlow}
                                            animate="animate"
                                            className={`w-24 h-24 rounded-[2rem] bg-slate-950 border border-white/10 flex items-center justify-center ${item.color} group-hover:bg-white group-hover:text-slate-950 transition-all duration-500 shadow-2xl shrink-0`}
                                        >
                                            <item.icon size={40} />
                                        </motion.div>
                                        <div className="pt-2">
                                            <h4 className="text-3xl font-black uppercase mb-4 tracking-tighter">{item.title}</h4>
                                            <p className="text-slate-500 text-base font-light uppercase tracking-[0.1em] leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, rotateY: 45, x: 100 }}
                            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                            className="glass p-20 md:p-32 rounded-[6rem] relative overflow-hidden group border-white/10 bg-slate-950 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.1)_0%,transparent_60%)]"></div>
                            <h3 className="text-4xl font-black uppercase mb-16 tracking-[0.3em] text-aether-gold flex items-center gap-6">
                                <Rocket className="animate-bounce" />
                                <span>GAIO_NODAL_GOALS</span>
                            </h3>
                            <ul className="space-y-12">
                                {(galaGoals.length > 0 ? galaGoals : [
                                    { title: 'ESTABLISH GAIO AS GLOBALLY RECOGNIZED BRAND' },
                                    { title: 'OPERATE CHAPTERS IN 50+ COUNTRIES' },
                                    { title: 'CREATE GAIO-BACKED STARTUPS & LABS' },
                                    { title: 'FEEDER PLATFORM FOR TECH GIANTS' }
                                ]).map((goal, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.2 }}
                                        whileHover={{ x: 20, scale: 1.1 }}
                                        className="flex items-center gap-8 text-white font-black text-lg tracking-widest uppercase cursor-pointer group/li"
                                    >
                                        <div className="w-4 h-4 rounded-sm rotate-45 bg-aether-gold group-hover/li:rotate-[225deg] transition-transform duration-700"></div>
                                        {goal.title}
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="mt-24 pt-16 border-t border-white/5">
                                <div className="text-[12px] font-mono text-slate-600 uppercase tracking-[0.8em] mb-8">SYSTEM_READINESS</div>
                                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '92%' }}
                                        transition={{ duration: 2.5, delay: 0.5, ease: "circOut" }}
                                        className="h-full bg-gradient-to-r from-aether-gold via-white to-aether-gold shadow-[0_0_30px_rgba(197,160,89,0.5)]"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EVENT STRUCTURE (PHASES) */}
            <section className="py-48 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-center mb-32"
                    >
                        <h2 className="text-8xl font-black uppercase tracking-tighter mb-8 leading-none">EVENT_ARCHITECTURE</h2>
                        <motion.div
                            animate={{ width: ["0%", "200px", "100px"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-2 bg-aether-gold mx-auto rounded-full"
                        ></motion.div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {(phases.length > 0 ? phases : [
                            { subtext: 'PHASE_01', icon: 'Cpu', title: 'GLOBAL VIRTUAL', description: 'Edge-computing challenges via distributed network nodes.' },
                            { subtext: 'PHASE_02', icon: 'Globe2', title: 'REGIONAL FINALS', description: 'Physical execution at tier-1 university ecosystems.' },
                            { subtext: 'PHASE_03', icon: 'Award', title: 'CONTINENTAL', description: 'The elite London summit featuring tier-1 VCs.' }
                        ]).map((p, i) => (
                            <motion.div
                                key={i}
                                variants={tabahiiVariants}
                                whileHover="hover"
                                className="glass-luxury p-16 rounded-[4rem] group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-aether-gold/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="text-[12px] font-black text-aether-gold mb-8 tracking-[0.5em] font-mono">{p.subtext}</div>
                                <div className="w-24 h-24 rounded-[2rem] bg-white text-slate-950 flex items-center justify-center mb-10 group-hover:rotate-[360deg] transition-transform duration-1000 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                    <DynamicIcon name={p.icon} size={44} />
                                </div>
                                <h3 className="text-4xl font-black uppercase mb-6 tracking-tight">{p.title}</h3>
                                <p className="text-slate-400 text-lg font-light uppercase tracking-wide leading-relaxed">{p.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* REVENUE PILLARS */}
            <section className="py-48 px-6 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-aether-gold/5 rounded-full blur-[180px] -z-10"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-32 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/3"
                        >
                            <span className="text-[10px] font-mono tracking-[0.6em] text-aether-gold uppercase font-black mb-8 block">{getContent('strategy_label', 'FINANCIAL_STRUCTURE')}</span>
                            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">{getContent('strategy_title_part1', 'INVESTORS')}<br />{getContent('strategy_title_part2', 'PLACE')}</h2>
                            <p className="text-slate-400 font-light uppercase tracking-widest text-sm leading-relaxed mb-12">
                                {getContent('strategy_description', 'DIVERSIFIED, NON-EVENT-DEPENDENT INCOME STREAMS THAT ENSURE LONG-TERM SCALABILITY AND SUCCESS.')}
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="p-10 glass bg-slate-950/80 border-aether-gold/20 rounded-[3rem] shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-aether-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                                <span className="text-[10px] font-black text-aether-gold block mb-4 tracking-[0.4em] font-mono">PROJECTION_Y1_TOTAL</span>
                                <div className="text-5xl font-black text-white tracking-tighter">£1,010,000</div>
                                <p className="text-slate-500 text-[10px] font-mono uppercase mt-4 tracking-widest">ECOSYSTEM_LIQUIDITY_FOUNDATION</p>
                            </motion.div>
                        </motion.div>

                        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {revenuePillars.map((pillar, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 15, scale: 1.02 }}
                                    onClick={() => setSelectedPillar(pillar)}
                                    className="p-10 glass bg-slate-950/40 flex flex-col gap-6 rounded-[2.5rem] group border-white/5 hover:border-aether-gold/30 hover:bg-slate-900/60 transition-all duration-500 cursor-pointer shadow-xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-aether-gold group-hover:scale-110 transition-transform duration-700 shadow-2xl border border-white/5">
                                            <DynamicIcon name={pillar.icon || 'Target'} size={24} />
                                        </div>
                                        <ChevronRight size={16} className="text-slate-700 group-hover:text-aether-gold transition-colors" />
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-sm mb-2 group-hover:text-aether-gold transition-colors">{pillar.title}</h4>
                                        <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">{pillar.subtext}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
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
                                className="fixed right-0 top-0 h-full w-full max-w-2xl bg-slate-900 border-l border-white/5 z-[101] shadow-[ -50px_0_100px_rgba(0,0,0,0.5)] overflow-y-auto"
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
                                        {selectedPillar.description}
                                    </p>

                                    <div className="space-y-12 mb-20">
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] border-b border-white/5 pb-4">FINANCIAL_PROJECTIONS</h3>
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
                                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] border-b border-white/5 pb-4">STRATEGIC_KPIs</h3>
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
                                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] border-b border-white/5 pb-4">ECONOMIC_MOAT</h3>
                                            <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-tight">
                                                {selectedPillar.payload?.strategy}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        disabled={downloadStatus !== 'idle'}
                                        onClick={() => {
                                            if (downloadStatus !== 'idle') return;
                                            setDownloadStatus('initiating');

                                            const dynamicPath = selectedPillar.downloadLink;
                                            const fileName = dynamicPath ? dynamicPath.split('/').pop() : 'GAIO_Strategic_Intel.pdf';
                                            const downloadUrl = dynamicPath ? `${API_BASE_URL}/${dynamicPath}` : null;

                                            setTimeout(() => {
                                                setDownloadStatus('syncing');
                                                if (downloadUrl) {
                                                    const link = document.createElement('a');
                                                    link.href = downloadUrl;
                                                    link.setAttribute('download', fileName);
                                                    link.setAttribute('target', '_blank');
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }
                                            }, 1000);

                                            setTimeout(() => {
                                                setDownloadStatus('complete');
                                            }, 3500);
                                            setTimeout(() => setDownloadStatus('idle'), 6000);
                                        }}
                                        className={`w-full py-8 font-black rounded-3xl text-sm tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-6 relative overflow-hidden ${downloadStatus === 'complete' ? 'bg-emerald-500 text-white' :
                                            downloadStatus === 'idle' ? 'bg-white text-slate-950 hover:bg-aether-gold hover:text-white' :
                                                'bg-slate-900 text-white border border-white/10'
                                            }`}
                                    >
                                        <span className="relative z-10">
                                            {downloadStatus === 'idle' && 'DOWNLOAD_FULL_INTEL_PACK'}
                                            {downloadStatus === 'initiating' && 'INITIATING_TRANSFER...'}
                                            {downloadStatus === 'syncing' && 'SYNCING_PROTOCOL...'}
                                            {downloadStatus === 'complete' && 'TRANSFER_SUCCESS'}
                                        </span>
                                        {downloadStatus === 'idle' && <ArrowRight size={20} className="relative z-10" />}
                                        {downloadStatus === 'complete' && <FileCheck size={20} className="relative z-10" />}

                                        {(downloadStatus === 'initiating' || downloadStatus === 'syncing') && (
                                            <motion.div
                                                className="absolute inset-0 bg-aether-gold/10"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '0%' }}
                                                transition={{ duration: downloadStatus === 'initiating' ? 1 : 2.5 }}
                                            />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {downloadStatus === 'syncing' && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="text-center mt-4"
                                            >
                                                <span className="text-[10px] font-mono text-aether-gold font-black tracking-[0.2em] animate-pulse">
                                                    ESTABLISHING_ENCRYPTED_TUNNEL...
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </section>

            {/* ROADMAP SECTION */}
            <section className="py-32 px-6 bg-slate-950/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">EXPANSION_VISION</h2>
                        <p className="text-slate-500 font-mono text-[10px] tracking-[0.5em] uppercase">MAPPING THE FUTURE OF GLOBAL AI INTELLIGENCE</p>
                    </div>

                    <div className="space-y-4">
                        {(roadmap.length > 0 ? roadmap : [
                            { subtext: 'SHORT-TERM (1-2Y)', title: 'GAIO ACADEMY LAUNCH', description: 'Expand to 15 countries, Strengthen sponsor pipeline, Launch educational portals' },
                            { subtext: 'MID-TERM (3-5Y)', title: 'GLOBAL FINALS & FUNDING', description: 'Establish permanent London finals, Launch incubation platform, Build research partnerships' },
                            { subtext: 'LONG-TERM (5Y+)', title: 'THE VENTURE FUND', description: 'GAIO Venture Fund activation, Global AI policy advisory, UN-level collaborations' }
                        ]).map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="glass p-12 rounded-[2rem] flex flex-col md:flex-row gap-12 items-start md:items-center relative"
                            >
                                <div className="md:w-1/4">
                                    <div className="text-[10px] font-black text-aether-gold mb-2 tracking-[0.4em]">{step.subtext}</div>
                                    <div className="text-xl font-black uppercase tracking-tighter leading-tight">{step.title}</div>
                                </div>
                                <div className="md:w-3/4 flex flex-wrap gap-4">
                                    {step.description.split(',').map((g, j) => (
                                        <span key={j} className="px-5 py-2 glass-gold bg-aether-gold/5 rounded-full text-[10px] font-black uppercase text-aether-gold/80 tracking-widest">
                                            {g.trim()}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STRATEGIC PARTNERS SECTION */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-black uppercase mb-16 tracking-widest text-white/40">STRATEGIC_PARTNERS</h2>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-1000">
                        {partners.length > 0 ? partners.map((partner, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="text-2xl font-black uppercase tracking-tighter text-white">{partner.title}</div>
                                <div className="text-[10px] font-mono text-aether-gold uppercase tracking-widest">{partner.subtext}</div>
                            </motion.div>
                        )) : (
                            ['NEURAL_SYSTEMS', 'GLOBAL_SYNC', 'AETHER_VAULT', 'TECH_SYNDICATE'].map((p, i) => (
                                <div key={i} className="text-2xl font-black text-white/20 uppercase tracking-tighter">{p}</div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
