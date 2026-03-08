import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FileText, Database, Code2 as Code, Users, Calendar, Clock, ArrowRight, CheckCircle2 as CheckCircle, BookOpen, Video, Terminal, Cpu, Globe, Shield, Zap, ArrowUpRight, Search, Layout, X, Download, FileCheck, PenTool, Briefcase, Target, Lock } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
import axios from 'axios';


export default function Workshops({ onNavigate }) {
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedHubResource, setSelectedHubResource] = useState(null);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadStatus, setDownloadStatus] = useState('idle');
    const [protocolHandshake, setProtocolHandshake] = useState(null);
    const [dynamicResources, setDynamicResources] = useState([]);
    const [dynamicModules, setDynamicModules] = useState([]);
    const [certificationNodes, setCertificationNodes] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        setIsRegistered(!!localStorage.getItem('gaio_registered_id'));
    }, []);

    useEffect(() => {
        const fetchCmsData = async () => {
            try {
                const [resourcesRes, gatewayRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/cms/academy`),
                    axios.get(`${API_BASE_URL}/api/cms/gateway`)
                ]);
                setDynamicResources(resourcesRes.data);
                setDynamicModules(gatewayRes.data.filter(g => g.category === 'ACADEMY_MODULE'));
                setCertificationNodes(gatewayRes.data.filter(g => g.category === 'ACADEMY_CERT'));
            } catch (error) {
                console.error('FAILED_TO_SYNC_ACADEMY_DATA');
            }
        };
        fetchCmsData();
    }, []);

    const mergedResources = dynamicResources;
    const iconMap = { Cpu, PenTool, Briefcase, Code, Globe, BookOpen, Zap, Target, Database };

    const schedule = dynamicModules.length > 0 ? dynamicModules.map((m, i) => ({
        week: i + 1,
        title: m.title,
        desc: m.description,
        icon: iconMap[m.icon] || Cpu,
        color: 'text-aether-accent bg-aether-soft',
        details: m.details || m.description,
        topics: m.topics || []
    })) : [
        {
            week: 1,
            title: 'AI TOOLS & INFRASTRUCTURE',
            desc: 'Introduction to LLMs, stable diffusion, and edge computing for community impact.',
            icon: Cpu,
            color: 'text-aether-accent bg-aether-soft',
            details: 'Deep dive into the neural core. Learn to deploy specialized LLMs for localized data processing. Includes workshops on API integration, GPU optimization, and secure node deployment.',
            topics: ['Edge Computing', 'Model Quantization', 'Neural Architecture']
        },
        {
            week: 2,
            title: 'STRATEGIC BRANDING',
            desc: 'Crafting a global identity for local community projects.',
            icon: PenTool,
            color: 'text-aether-accent bg-aether-soft',
            details: 'Design systems for the new epoch. Establish a visual syndicate identity that resonates globally while maintaining local cultural integrity. Master the art of tech-strategic storytelling.',
            topics: ['Visual Identity', 'Narrative Design', 'Global Consistency']
        },
        {
            week: 3,
            title: 'FINANCIAL ARCHITECTURE',
            desc: 'Building sustainable revenue models for social AI ventures.',
            icon: Briefcase,
            color: 'text-aether-accent bg-aether-soft',
            details: 'The economics of intelligence. Develop robust financial structures for AI initiatives. Covers tokenomics, grant synchronization, and sustainable scaling strategies.',
            topics: ['Tokenomics', 'Grant Frameworks', 'Revenue Operations']
        },
        {
            week: 4,
            title: 'TECHNICAL DEPLOYMENT',
            desc: 'Hands-on coding for scalable AI solutions.',
            icon: Code,
            color: 'text-aether-accent bg-aether-soft',
            details: 'Code to production. Transition from prototype to global deployment. Includes CI/CD pipelines for AI models, distributed cloud infrastructure, and load balancing.',
            topics: ['Distributed Systems', 'CI/CD Pipelines', 'Cloud Scaling']
        },
        {
            week: 5,
            title: 'LOCAL MARKET SYNC',
            desc: 'Adapting global technology for diverse micro-communities.',
            icon: Globe,
            color: 'text-aether-accent bg-aether-soft',
            details: 'Synchronizing intelligence. Learn adaptive strategies for deploying global technical standards into micro-local markets. Focuses on localization and community-led development.',
            topics: ['Market Adaption', 'Hyper-Localization', 'Feedback Loops']
        },
        {
            week: 6,
            title: 'LEADERSHIP & SCALE',
            desc: 'Preparing for the final pitch and global scaling strategies.',
            icon: BookOpen,
            color: 'text-aether-accent bg-aether-soft',
            details: 'The final ascendancy. Refining the syndicate pitch for global stakeholders. Develop multi-year scaling roadmaps and leadership structures for long-term impact.',
            topics: ['Stakeholder Pitching', 'Scaling Roadmaps', 'Governance Models']
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto py-32 px-6 min-h-screen relative overflow-hidden">
            {/* Ambient Multi-Layered Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-aether-gold/5 rounded-full blur-[150px] -z-10 animate-float opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-aether-soft/20 rounded-full blur-[200px] -z-10" style={{ animationDelay: '5s' }}></div>

            <div className="text-center mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-slate-950/60 backdrop-blur-2xl border border-white/10 mb-12 shadow-2xl"
                >
                    <span className="text-[10px] md:text-[11px] font-mono tracking-[0.5em] text-aether-gold uppercase font-black">CURRICULUM_V2 // ACCELERATOR_NODE</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-8xl font-black tracking-tighter mb-10 text-white uppercase leading-[0.85]"
                >
                    THE <span className="text-gradient">ACADEMY</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-light leading-snug mb-16"
                >
                    A 6-week intensive high-performance curriculum designed to bridge <span className="text-white font-black">advanced AI research</span> with <span className="text-aether-gold font-black italic">hyper-local community scaling.</span>
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 px-4">
                {schedule.map((item, i) => (
                    <motion.div
                        key={item.week}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        whileHover={{ y: -12 }}
                        onClick={() => setSelectedModule(item)}
                        className="glass p-10 md:p-14 rounded-[3.5rem] md:rounded-[4rem] border-white/5 relative group transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(197,160,89,0.1)] hover:bg-slate-900/60 cursor-pointer overflow-hidden"
                    >
                        <div className="absolute top-12 right-12 text-[6rem] md:text-[8rem] font-black opacity-[0.02] group-hover:opacity-[0.1] group-hover:scale-125 transition-all duration-700 font-display -z-10 text-white">
                            0{item.week}
                        </div>

                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-slate-950/80 border border-white/10 flex items-center justify-center mb-12 group-hover:rotate-[360deg] transition-all duration-1000 shadow-2xl relative">
                            <div className="absolute inset-0 bg-aether-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <item.icon size={36} className="text-aether-gold relative z-10" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-black mb-6 tracking-tighter text-white uppercase leading-none">
                            <span className="text-[10px] font-mono tracking-[0.5em] text-slate-500 block mb-2 font-black">MODULE_0{item.week}</span>
                            {item.title}
                        </h3>

                        <p className="text-slate-400 text-base leading-relaxed mb-10 font-light group-hover:text-slate-300 transition-colors uppercase tracking-tight">{item.desc}</p>

                        <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-aether-gold animate-pulse"></div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">SYNCHRONOUS_READY</span>
                            </div>
                            <div className="group/btn flex items-center gap-3 text-[10px] font-black text-aether-gold uppercase tracking-[0.3em] transition-all">
                                <span>ACCESS_NODE</span>
                                <ArrowUpRight size={16} className="group-hover/btn:rotate-45 transition-transform duration-500" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Resource Portal for Recorded Sessions */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mt-48 glass p-16 rounded-[4rem] border-white/5 bg-slate-950/40 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-aether-accent/5 rounded-full blur-[100px] -z-10"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
                    <div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-4">
                            <BookOpen className="text-aether-gold" /> RESOURCE_HUB
                        </h3>
                        <p className="text-slate-400 font-light max-w-xl uppercase tracking-widest text-xs">Access all past workshop recordings, technical documentation, and project blueprints.</p>
                    </div>
                    <button
                        onClick={() => setIsArchiveOpen(true)}
                        className="btn-luxury px-12 py-6 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black tracking-[0.3em] text-slate-400 hover:text-white transition-all uppercase flex items-center gap-4 group"
                    >
                        <Search size={14} className="group-hover:text-aether-gold" />
                        SEARCH_LIBRARY
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {mergedResources.slice(0, 4).map((resource, i) => {
                        const isLocked = resource.isPreviewable === false && !isRegistered;
                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    if (isLocked) {
                                        alert('PARTICIPANT_AUTHORIZATION_REQUIRED: Please complete registration to unlock this resource node.');
                                        return;
                                    }
                                    setSelectedHubResource(resource);
                                }}
                                className={`p-8 rounded-[2.5rem] border group transition-all duration-500 cursor-pointer relative overflow-hidden active:scale-95 ${isLocked ? 'bg-slate-900/40 opacity-80 border-white/5 grayscale' : 'bg-slate-900/60 border-white/5 hover:border-aether-gold/30'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-aether-gold/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <span className="text-[9px] font-mono text-aether-gold block font-black">{resource.type}</span>
                                    {isLocked && <Lock size={14} className="text-slate-500" />}
                                </div>

                                <h4 className="text-sm font-black text-white uppercase mb-4 tracking-tight relative z-10">{resource.title}</h4>

                                <div className="flex justify-between items-center text-slate-500 relative z-10">
                                    <span className="text-[10px] font-bold">
                                        {isLocked ? 'ACCESS_LOCKED' : resource.date}
                                    </span>
                                    {!isLocked && <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                </div>

                                {isLocked && (
                                    <div className="absolute top-2 right-2 px-3 py-1 bg-slate-950/60 border border-white/5 rounded-full z-20">
                                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">LOCKED_NODE</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Certification Node */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mt-48 glass p-16 rounded-[4rem] border-aether-gold/20 bg-slate-950/60 relative overflow-hidden border"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8">
                            <Shield size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">INSTITUTIONAL_VALIDATION</span>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                            {certificationNodes.find(n => n.subtext === 'TITLE')?.title || 'GAIO CERTIFICATION'}
                        </h3>
                        <p className="text-lg text-slate-400 font-light leading-relaxed mb-12 uppercase tracking-tight">
                            {certificationNodes.find(n => n.subtext === 'DESCRIPTION')?.description || 'The industry standard for Community AI Leadership. Validated certificates of participation and expertise.'}
                        </p>
                        <div className="space-y-6 mb-12">
                            {(certificationNodes.filter(n => n.subtext === 'FEATURE').length > 0 ? certificationNodes.filter(n => n.subtext === 'FEATURE') : [
                                { title: 'Global Accreditation Registry' },
                                { title: 'Direct Partner Visibility' },
                                { title: 'Post-Event Mentorship Access' }
                            ]).map((feat, i) => (
                                <div key={i} className="flex items-center gap-4 text-sm font-bold text-slate-300">
                                    <FileCheck size={18} className="text-aether-gold" />
                                    {feat.title}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => onNavigate && onNavigate('register')}
                            className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-[10px] tracking-[0.4em] uppercase hover:bg-aether-gold hover:text-white transition-all shadow-2xl"
                        >
                            ENROLL_FOR_CERTIFICATION
                        </button>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-aether-gold/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative glass p-4 rounded-[3rem] border-white/5 bg-slate-900/40 rotate-2 group-hover:rotate-0 transition-transform duration-700">
                            <div className="aspect-[1.414/1] bg-slate-950 rounded-[2rem] border border-white/10 flex flex-col p-12 overflow-hidden relative">
                                <div className="flex justify-between items-start mb-20">
                                    <div className="w-16 h-16 border border-white/20 rounded-xl flex items-center justify-center">
                                        <Zap size={32} className="text-aether-gold/20" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest">CERT_ID: GAIO-2026-X89</div>
                                        <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest mt-1">SECURED_BY_GAIO_NODES</div>
                                    </div>
                                </div>
                                <div className="text-center flex-1">
                                    <div className="text-[10px] font-mono text-aether-gold tracking-[0.5em] mb-4 font-black">CERTIFICATE_OF_EXCELLENCE</div>
                                    <div className="text-3xl font-black text-white/10 uppercase tracking-tighter mb-4 italic">YOUR_NAME_HERE</div>
                                    <div className="h-px w-24 bg-white/5 mx-auto mb-8"></div>
                                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest max-w-[200px] mx-auto opacity-40">
                                        Demonstrating elite proficiency in global AI ecosystem architecture and community-led technical scaling.
                                    </p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-2">
                                        <div className="h-px w-16 bg-white/10"></div>
                                        <div className="text-[6px] font-black text-slate-700 uppercase tracking-widest">DIRECTOR_GAIO</div>
                                    </div>
                                    <FileCheck size={40} className="text-aether-gold/10" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Premium Module Drawer */}
            <AnimatePresence>
                {selectedModule && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedModule(null)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-screen w-full lg:w-[550px] bg-slate-950/95 backdrop-blur-3xl shadow-[-40px_0_80px_rgba(0,0,0,0.8)] z-[101] border-l border-white/10 overflow-y-auto custom-scrollbar flex flex-col"
                        >
                            <div className="p-10 md:p-14 pt-24 md:pt-28 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-slate-900 border border-aether-gold/30 rounded-3xl flex items-center justify-center shadow-2xl group">
                                        <div className="absolute inset-0 bg-aether-gold/10 blur-2xl animate-pulse group-hover:bg-aether-gold/20 transition-all"></div>
                                        <selectedModule.icon size={40} className="text-aether-gold relative z-10" />
                                    </div>
                                    <button
                                        onClick={() => setSelectedModule(null)}
                                        className="p-4 md:p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-aether-gold/40 rounded-3xl transition-all text-slate-400 hover:text-white group"
                                    >
                                        <X size={26} className="group-hover:rotate-90 transition-transform duration-500" />
                                    </button>
                                </div>

                                <div className="mb-8">
                                    <h4 className="font-mono text-[10px] font-black tracking-[0.5em] uppercase mb-4 text-aether-gold/60">CURRICULUM_PROTOCOL // SEQ_0{selectedModule.week}</h4>
                                    <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight uppercase text-white mb-4 drop-shadow-2xl">{selectedModule.title}</h3>
                                    <p className="text-lg text-slate-400 font-light leading-relaxed max-w-lg">
                                        Strategic implementation of <span className="text-white font-bold">{selectedModule.desc}</span>
                                    </p>
                                </div>

                                <div className="space-y-12 flex-1">
                                    <section className="relative">
                                        <div className="absolute -left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-aether-gold via-transparent to-transparent opacity-30"></div>
                                        <h5 className="flex items-center gap-4 text-[10px] font-black tracking-[.5em] text-slate-500 uppercase mb-4">
                                            <Shield size={16} className="text-aether-gold" /> EXECUTIVE_SYNOPSIS
                                        </h5>
                                        <p className="text-lg text-slate-300 font-light leading-relaxed">
                                            {selectedModule.details}
                                        </p>
                                    </section>

                                    <section>
                                        <h5 className="flex items-center gap-4 text-[10px] font-black tracking-[.5em] text-slate-500 uppercase mb-4">
                                            <Zap size={16} className="text-aether-gold" /> CRITICAL_NODES
                                        </h5>
                                        <div className="grid grid-cols-1 gap-4">
                                            {(selectedModule.topics || []).map((topic, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 bg-slate-900/60 rounded-2xl border border-white/5 group/node hover:border-aether-gold/20 transition-all duration-500">
                                                    <div className="flex items-center gap-5">
                                                        <div className="text-[10px] font-mono text-aether-gold/30 font-black">0{i + 1}</div>
                                                        <span className="text-sm font-bold text-slate-300 uppercase tracking-widest">{topic}</span>
                                                    </div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-aether-gold/20 group-hover/node:bg-aether-gold group-hover/node:scale-150 transition-all" />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-20 flex flex-col gap-4">
                                    <button
                                        onClick={() => { setSelectedModule(null); onNavigate && onNavigate('register'); }}
                                        className="w-full relative overflow-hidden group bg-aether-gold p-6 rounded-2xl transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(197,160,89,0.4)] active:scale-[0.98]"
                                    >
                                        <div className="relative flex items-center justify-center gap-6">
                                            <Target size={20} className="text-slate-950" />
                                            <span className="text-[11px] font-black text-slate-950 tracking-[0.4em] uppercase">INITIALIZE_APPLICATION</span>
                                            <ArrowUpRight size={18} className="text-slate-950/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setSelectedModule(null)}
                                        className="w-full py-6 bg-white/5 border border-white/5 text-slate-500 font-black text-[10px] tracking-[0.3em] rounded-2xl uppercase hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        DISMISS_OPERATIONS
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Academy Library Archive Drawer */}
            <AnimatePresence>
                {isArchiveOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsArchiveOpen(false)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-slate-900 border-l border-white/5 z-[111] shadow-[ -50px_0_100px_rgba(0,0,0,0.5)] flex flex-col"
                        >
                            <div className="p-12 md:p-20 flex-1 overflow-y-auto">
                                <button
                                    onClick={() => setIsArchiveOpen(false)}
                                    className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors mb-16"
                                >
                                    <X size={24} />
                                </button>

                                <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-aether-gold/20 bg-aether-gold/5 mb-8">
                                    <Database size={14} className="text-aether-gold" />
                                    <span className="text-[10px] font-black text-aether-gold uppercase tracking-[0.3em]">ACADEMY_ARCHIVE_CORE</span>
                                </div>

                                <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-12 leading-none">
                                    LIBRARY_SEARCH
                                </h2>

                                <div className="relative mb-16">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="SEARCH_BY_MODULE_OR_KEYWORD..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 pl-16 text-white text-xs font-black tracking-widest outline-none focus:border-aether-gold/40 transition-all placeholder:text-slate-700"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] border-b border-white/5 pb-4">ARCHIVED_SESSIONS</h3>
                                    {dynamicResources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                        dynamicResources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
                                            const isLocked = item.isPreviewable === false && !isRegistered;
                                            return (
                                                <div
                                                    key={item._id || item.id}
                                                    onClick={() => {
                                                        if (isLocked) {
                                                            alert('PARTICIPANT_AUTHORIZATION_REQUIRED: Please complete registration to unlock this resource node.');
                                                            return;
                                                        }
                                                        setProtocolHandshake(item._id || item.id);
                                                        setTimeout(() => {
                                                            setProtocolHandshake(null);
                                                            setSelectedHubResource(item);
                                                            setIsArchiveOpen(false);
                                                        }, 1500);
                                                    }}
                                                    className={`glass p-8 rounded-3xl border group transition-all cursor-pointer relative overflow-hidden ${isLocked ? 'bg-slate-950/40 opacity-80 border-white/5 grayscale' : 'border-white/5 hover:border-aether-gold/20'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-mono text-aether-gold font-black bg-aether-gold/5 px-3 py-1 rounded-full">{item.type}</span>
                                                                {isLocked && <Lock size={12} className="text-slate-500" />}
                                                            </div>
                                                            <h4 className="text-lg font-black text-white mt-4 uppercase tracking-tighter">{item.title}</h4>
                                                        </div>
                                                        <div className="text-[10px] font-black text-slate-500 font-mono">
                                                            {isLocked ? 'LOCKED' : item.size}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-tight leading-relaxed mb-6 italic">
                                                        "{isLocked ? 'CONFIDENTIAL_PARTICIPANT_DATA' : item.desc}"
                                                    </p>
                                                    <div className="flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{isLocked ? 'ACCESS_DENIED' : (item.duration || item.pages || item.format)}</span>
                                                        <div className="flex items-center gap-2 text-aether-gold text-[10px] font-black tracking-[0.2em]">
                                                            {isLocked ? 'DATA_LOCKED' : (protocolHandshake === item.id ? 'HANDSHAKE_INIT...' : 'FETCH_PROTO')}
                                                            {!isLocked && <ArrowUpRight size={14} className={protocolHandshake === item.id ? 'animate-spin' : ''} />}
                                                        </div>
                                                    </div>
                                                    {protocolHandshake === item.id && (
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: '100%' }}
                                                            className="absolute bottom-0 left-0 h-1 bg-aether-gold/40 shadow-[0_0_10px_rgba(197,160,89,0.5)]"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-20 text-center glass rounded-3xl border-white/5 bg-white/5">
                                            <div className="text-aether-gold/20 mb-4 flex justify-center">
                                                <Search size={40} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">NO_RECORDS_FOUND_IN_ACTIVE_ARCHIVE</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Resource Preview Drawer */}
            <AnimatePresence>
                {selectedHubResource && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedHubResource(null)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[120]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-xl bg-slate-900 border-l border-white/5 z-[121] shadow-[ -50px_0_100px_rgba(0,0,0,0.5)] overflow-y-auto"
                        >
                            <div className="p-12 md:p-20">
                                <button
                                    onClick={() => setSelectedHubResource(null)}
                                    className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors mb-16"
                                >
                                    <X size={24} />
                                </button>

                                <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-aether-gold/20 bg-aether-gold/5 mb-8">
                                    <Layout size={14} className="text-aether-gold" />
                                    <span className="text-[10px] font-black text-aether-gold uppercase tracking-[0.3em]">RESOURCE_SPEC_SHEET</span>
                                </div>

                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                                    {selectedHubResource.title}
                                </h2>

                                <div className="flex gap-8 mb-12">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">FORMAT</span>
                                        <span className="text-xs font-black text-white">{selectedHubResource.type}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">FILE_SIZE</span>
                                        <span className="text-xs font-black text-white">{selectedHubResource.size || 'DEPENDS_ON_NODE'}</span>
                                    </div>
                                    {selectedHubResource.duration && (
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">RUN_TIME</span>
                                            <span className="text-xs font-black text-white">{selectedHubResource.duration}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-12 mb-20">
                                    <section>
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] border-b border-white/5 pb-4 mb-6">SESSION_OVERVIEW</h3>
                                        <p className="text-base text-slate-300 font-light leading-relaxed">
                                            {selectedHubResource.description || selectedHubResource.overview || 'NO_OVERVIEW_AVAILABLE_SYNC_NODE_TO_PROCEED'}
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] border-b border-white/5 pb-4 mb-6">TECHNICAL_SPECIFICATIONS</h3>
                                        <div className="space-y-4">
                                            {(selectedHubResource.specs || ['NVIDIA_OPTIMIZED', 'SECURE_TRANSIT', 'GAIO_VALIDATED']).map((spec, i) => (
                                                <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-aether-gold" />
                                                    {spec}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        disabled={downloadStatus !== 'idle'}
                                        onClick={() => {
                                            if (downloadStatus !== 'idle') return;
                                            setDownloadStatus('initiating');

                                            const dynamicPath = selectedHubResource.downloadLink;
                                            const fileName = dynamicPath ? dynamicPath.split('/').pop() : `${selectedHubResource.title}.pdf`;
                                            const downloadUrl = dynamicPath ? (dynamicPath.startsWith('http') ? dynamicPath : `${API_BASE_URL}/${dynamicPath}`) : null;

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

                                            setTimeout(() => setDownloadStatus('complete'), 3500);
                                            setTimeout(() => setDownloadStatus('idle'), 5000);
                                        }}
                                        className={`w-full py-8 font-black rounded-3xl text-sm tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-6 relative overflow-hidden ${downloadStatus === 'complete' ? 'bg-emerald-500 text-white' :
                                            downloadStatus === 'idle' ? 'bg-white text-slate-950 hover:bg-aether-gold hover:text-white' :
                                                'bg-slate-900 text-white border border-white/10'
                                            }`}
                                    >
                                        <span className="relative z-10">
                                            {downloadStatus === 'idle' && 'DOWNLOAD_RESOURCE'}
                                            {downloadStatus === 'initiating' && 'INITIATING_TRANSFER...'}
                                            {downloadStatus === 'syncing' && 'SYNCING_PROTOCOL...'}
                                            {downloadStatus === 'complete' && 'TRANSFER_SUCCESS'}
                                        </span>
                                        {downloadStatus === 'idle' && <Download size={20} className="relative z-10" />}
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
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-center"
                                            >
                                                <span className="text-[10px] font-mono text-aether-gold font-black tracking-[0.2em] animate-pulse">
                                                    ESTABLISHING_ENCRYPTED_TUNNEL...
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
        </div>
    );
}
