import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Activity, Cpu, Zap, ShieldCheck, MapPin, Globe, Sparkles, Network, ArrowRight, X, Users } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const THEME = {
    GOLD: '#c5a059',
    GOLD_LITE: '#e5c07b',
    GOLD_GLOW: 'rgba(197, 160, 89, 0.4)',
    DEEP: '#010306',
    WHITE: '#ffffff',
    EMERALD: '#10b981',
    BLUE: '#3b82f6',
    GRID: 'rgba(255, 255, 255, 0.03)'
};

// --- Helper Components ---

const SharedFilters = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <style>
            {`
                @keyframes flow {
                    from { stroke-dashoffset: 400; }
                    to { stroke-dashoffset: 0; }
                }
                .flow-line {
                    stroke-dasharray: 60, 340;
                    animation: flow 3s linear infinite;
                    will-change: stroke-dashoffset;
                }
                .flow-line-intensify {
                    stroke-dasharray: 80, 320;
                    animation: flow 1.5s linear infinite;
                    will-change: stroke-dashoffset;
                }
                .connection-svg {
                    overflow: visible !important;
                    pointer-events: none;
                }
            `}
        </style>
    </svg>
);

const FlowLine = memo(({ d, delay = 0, color = THEME.GOLD, intensify = false }) => (
    <g className="pointer-events-none">
        {/* Solid Visible Base Line */}
        <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="1"
            className="opacity-20"
        />
        {/* Animated Glow Segment */}
        <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={intensify ? "3" : "2"}
            strokeLinecap="round"
            className={intensify ? "flow-line-intensify" : "flow-line"}
            style={{
                animationDelay: `${delay}s`,
                filter: `drop-shadow(0 0 3px ${color})`
            }}
        />
    </g>
));

const ConnectionSystem = memo(({ nodes, hasNext, isCore }) => {
    if (!nodes || nodes.length === 0) return null;
    const count = nodes.length;

    // Fixed layout params for perfect pixel mapping
    const P = 40; // px-10 (padding: 40px)
    const G = 64; // gap-16 (gap: 64px)
    const W_c = isCore ? 320 : 256; // card width: w-80 or w-64

    // Calculate total layout width strictly matching the flex container
    const W_total = (P * 2) + (count * W_c) + ((count - 1) * G);
    const midX = W_total / 2;

    const getX = (i) => P + (i * (W_c + G)) + (W_c / 2);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Bridging from Above (Parent -> This Level) */}
            <svg
                viewBox={`0 0 ${W_total} 128`}
                className="absolute top-[-128px] left-0 w-full h-[128px] connection-svg"
                preserveAspectRatio="none"
            >
                {count === 1 ? (
                    <FlowLine d={`M ${midX} 0 L ${midX} 128`} />
                ) : (
                    <>
                        {/* Parent Drop */}
                        <FlowLine d={`M ${midX} 0 L ${midX} 40`} />
                        {/* Horizontal Split (Left & Right) */}
                        <FlowLine d={`M ${midX} 40 L ${getX(0)} 40`} delay={0.1} />
                        <FlowLine d={`M ${midX} 40 L ${getX(count - 1)} 40`} delay={0.1} />
                        {/* Drops to nodes */}
                        {nodes.map((_, i) => (
                            <FlowLine key={`in-${i}`} d={`M ${getX(i)} 40 L ${getX(i)} 128`} delay={0.2 + (i * 0.1)} />
                        ))}
                    </>
                )}
            </svg>

            {/* Bridging to Below (This Level -> Next Level) */}
            {hasNext && (
                <svg
                    viewBox={`0 0 ${W_total} 128`}
                    className="absolute top-[100%] left-0 w-full h-[128px] connection-svg"
                    preserveAspectRatio="none"
                >
                    {count === 1 ? (
                        <FlowLine d={`M ${midX} 0 L ${midX} 128`} delay={0.5} />
                    ) : (
                        <>
                            {/* Exits from nodes */}
                            {nodes.map((_, i) => (
                                <FlowLine key={`out-${i}`} d={`M ${getX(i)} 0 L ${getX(i)} 60`} delay={i * 0.1} />
                            ))}
                            {/* Horizontal Merge (Left & Right) */}
                            <FlowLine d={`M ${getX(0)} 60 L ${midX} 60`} delay={0.5} />
                            <FlowLine d={`M ${getX(count - 1)} 60 L ${midX} 60`} delay={0.5} />
                            {/* Unified Drop */}
                            <FlowLine d={`M ${midX} 60 L ${midX} 128`} delay={0.8} intensify={true} />
                            <circle cx={midX} cy="60" r="3" fill={THEME.GOLD} style={{ filter: `drop-shadow(0 0 6px ${THEME.GOLD})` }} />
                        </>
                    )}
                </svg>
            )}
        </div>
    );
});


const StaffCard = memo(({ member, delay, isCore, onClick }) => {
    const levelCfg = {
        'Britsync': { color: '#fbbf24', icon: Globe, label: 'CORE_SYNAPSE' },
        'Continental_Coordinator': { color: '#10b981', icon: ShieldCheck, label: 'CONTINENTAL_HUB' },
        'Regional_Coordinator': { color: '#3b82f6', icon: Activity, label: 'REGIONAL_RELAY' },
        'Ground_Team': { color: '#94a3b8', icon: Cpu, label: 'FIELD_NODE' }
    };
    const cfg = levelCfg[member.level] || levelCfg.Ground_Team;

    return (
        <motion.div
            onClick={() => onClick(member)}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative group cursor-pointer ${isCore ? 'w-80' : 'w-64'}`}
        >
            <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl overflow-hidden transition-all duration-500 group-hover:border-aether-gold/40 group-hover:bg-aether-gold/[0.03]">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <cfg.icon size={isCore ? 48 : 32} style={{ color: cfg.color }} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: cfg.color, boxShadow: `0 0 10px ${cfg.color}` }}
                        />
                        <span className="text-[9px] font-mono text-white/30 tracking-[0.4em] uppercase font-bold">{cfg.label}</span>
                    </div>
                    <h3 className={`font-black text-white uppercase tracking-tight mb-1 transition-colors group-hover:text-aether-gold ${isCore ? 'text-2xl' : 'text-lg'}`}>
                        {member.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-6 text-white/50">
                        <MapPin size={10} />
                        <span className="text-[10px] font-mono uppercase tracking-widest">{member.location || 'GLOBAL_ZONE'}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <Network size={12} className="text-aether-gold/40" />
                            <span className="text-[9px] font-mono text-white/30 uppercase tracking-tighter">PROTO_SYNC_OK</span>
                        </div>
                        <ArrowRight size={14} className="text-aether-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default function Team2() {
    const [staff, setStaff] = useState([]);
    const [founders, setFounders] = useState([]);
    const [cmsContent, setCmsContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedFounder, setSelectedFounder] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [staffRes, expertsRes, contentRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/staff`),
                axios.get(`${API_BASE_URL}/api/cms/experts`),
                axios.get(`${API_BASE_URL}/api/cms/content`)
            ]);
            setStaff(Array.isArray(staffRes.data) ? staffRes.data : []);
            setFounders(Array.isArray(expertsRes.data) ? expertsRes.data.filter(e => e.category === 'FOUNDER') : []);
            setCmsContent(Array.isArray(contentRes.data) ? contentRes.data.filter(c => c.sectionId === 'Gala') : []);
        } catch (e) {
            console.error("MATRIX_SYNC_ERROR");
        } finally {
            setTimeout(() => setLoading(false), 800);
        }
    };

    const hierarchy = useMemo(() => {
        return {
            Britsync: staff.filter(m => m.level === 'Britsync'),
            Continental_Coordinator: staff.filter(m => m.level === 'Continental_Coordinator'),
            Regional_Coordinator: staff.filter(m => m.level === 'Regional_Coordinator'),
            Ground_Team: staff.filter(m => m.level === 'Ground_Team')
        };
    }, [staff]);

    const renderLevel = (levelKey, tierNodes, delayOffset, hasNext) => {
        if (!tierNodes || tierNodes.length === 0) return null;
        const isCore = levelKey === 'Britsync';

        return (
            <div className="relative mb-64 w-full flex justify-center">
                {/* The card container - inline-flex ensures it only takes the width of the cards */}
                <div className="inline-flex justify-center gap-16 relative px-10">
                    {/* Connection Layer - now perfectly matched to the width of this card row! */}
                    <ConnectionSystem nodes={tierNodes} hasNext={hasNext} isCore={isCore} />

                    {tierNodes.map((member, i) => (
                        <StaffCard
                            key={member._id}
                            member={member}
                            delay={delayOffset + (i * 0.1)}
                            isCore={isCore}
                            onClick={setSelectedMember}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden pt-40 pb-64 selection:bg-aether-gold/20 selection:text-aether-gold font-sans antialiased">
            {/* Optimized Filters */}
            <SharedFilters />

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(197,160,89,0.05)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[#010306]" style={{ backgroundImage: `linear-gradient(${THEME.GRID} 1px, transparent 1px), linear-gradient(90deg, ${THEME.GRID} 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />
            </div>

            <div className="relative z-10 max-w-[1800px] mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-48 relative"
                >
                    <span className="text-[10px] font-mono tracking-[1em] text-aether-gold uppercase font-black block mb-6">Strategic_Intelligence_Sync</span>
                    <h1 className="text-7xl md:text-10xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-2xl">
                        Operational_<span className="text-aether-gold">Network_Hub</span>
                    </h1>
                </motion.div>

                {/* Founding Partners - MOVED TO TOP */}
                <div className="mb-48 flex flex-col items-center">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <span className="text-aether-gold font-mono text-[10px] tracking-[0.6em] uppercase mb-4 opacity-50"># STRATEGIC_COUNCIL</span>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Founding Partners</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-10 max-w-7xl">
                        {founders.map((founder, i) => (
                            <motion.div
                                key={founder._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setSelectedFounder(founder)}
                                className="w-64 glass p-8 rounded-[3rem] bg-white/[0.02] border border-white/10 hover:border-aether-gold/40 hover:bg-aether-gold/[0.03] transition-all cursor-pointer group shadow-2xl"
                            >
                                <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 mb-8 bg-slate-900 shadow-inner group-hover:scale-105 transition-transform duration-700">
                                    {founder.photo ? (
                                        <img
                                            src={founder.photo.startsWith('http') ? founder.photo : `${API_BASE_URL}/${founder.photo}`}
                                            className="w-full h-full object-cover transition-all duration-700"
                                            alt={founder.name}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/10"><Users size={48} /></div>
                                    )}
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1 group-hover:text-aether-gold transition-colors">{founder.name}</h4>
                                <p className="text-[10px] font-mono text-aether-gold/60 uppercase tracking-widest">{founder.company}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Matrix Hierarchy Heading + Connection */}
                <div className="relative mb-32 text-center">
                    <span className="text-aether-gold font-mono text-[10px] tracking-[0.6em] uppercase mb-4 opacity-50 block"># NETWORK_HIERARCHY</span>
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Chain Of Command</h2>
                    <svg viewBox="0 0 100 192" className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[100px] h-[192px] connection-svg" preserveAspectRatio="none">
                        <FlowLine d="M 50 0 L 50 192" />
                    </svg>
                </div>

                {/* Matrix Content */}
                <div className="flex flex-col items-center">
                    {renderLevel('Britsync', hierarchy.Britsync, 0.2, true)}
                    {renderLevel('Continental_Coordinator', hierarchy.Continental_Coordinator, 0.4, true)}
                    {renderLevel('Regional_Coordinator', hierarchy.Regional_Coordinator, 0.6, true)}
                    {renderLevel('Ground_Team', hierarchy.Ground_Team, 0.8, false)}
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {selectedMember && (
                    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl" onClick={() => setSelectedMember(null)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-6xl bg-[#010204] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Left Side - Profile HUD */}
                            <div className="w-full md:w-1/3 p-12 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative bg-[radial-gradient(circle_at_20%_20%,rgba(197,160,89,0.03)_0%,transparent_50%)]">
                                <div className="space-y-8">
                                    <div className="inline-flex px-3 py-1 bg-aether-gold/10 border border-aether-gold/20 rounded-md text-[9px] font-mono text-aether-gold tracking-[0.4em] uppercase">
                                        # ACTIVE_NODE_SESSION
                                    </div>

                                    <h2 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white uppercase tracking-tighter leading-[0.75] mt-2 overflow-hidden break-words">
                                        {(selectedMember.name || '').split(' ').map((word, i) => (
                                            <React.Fragment key={i}>
                                                {word}<br />
                                            </React.Fragment>
                                        ))}
                                    </h2>
                                </div>

                                <div className="space-y-6 mt-12 md:mt-24">
                                    <div className="flex items-center gap-6 text-white/40 border-t border-white/5 pt-6 group">
                                        <div className="w-8 h-px bg-white/10 shrink-0 group-hover:w-12 transition-all duration-500 bg-aether-gold/50" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] font-mono text-aether-gold/40 uppercase tracking-widest">RANK_TYPE</span>
                                            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/60 font-black">{selectedMember.level?.replace(/_/g, ' ')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-white/40 border-t border-white/5 pt-6 group">
                                        <div className="w-8 h-px bg-white/10 shrink-0 group-hover:w-12 transition-all duration-500" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">ZONE_LOC</span>
                                            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/60 font-black">{selectedMember.location || 'GLOBAL_ZONE'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Operational Grid */}
                            <div className="w-full md:w-2/3 p-10 lg:p-12 flex flex-col max-h-[85vh]">
                                <div className="flex justify-between items-center mb-8 shrink-0 border-b border-white/5 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-aether-gold/10 border border-aether-gold/20 flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.1)]">
                                            <Sparkles className="text-aether-gold" size={20} />
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Operational Sectors</h3>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase hidden sm:inline-block border-l border-white/10 pl-8">NODE_COUNT: {selectedMember.industries?.length || 0}</span>
                                        <button
                                            onClick={() => setSelectedMember(null)}
                                            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-500 group"
                                        >
                                            <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar pr-6 pb-4">
                                    {(selectedMember.industries || []).length > 0 ? (
                                        (selectedMember.industries || []).map((ind, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 + (idx * 0.05) }}
                                                className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-5 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 flex flex-col group/card"
                                            >
                                                <div className="aspect-[2/1] bg-slate-900 rounded-2xl mb-5 overflow-hidden flex-shrink-0 relative shadow-2xl border border-white/5">
                                                    {ind.image ? (
                                                        <img
                                                            src={ind.image.startsWith('http') ? ind.image : `${API_BASE_URL}/${ind.image}`}
                                                            className="w-full h-full object-cover opacity-90 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-700 ease-out"
                                                            alt={ind.title}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white/5">
                                                            <Activity size={40} />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#010204] to-transparent opacity-60" />
                                                </div>
                                                <h4 className="text-lg font-black text-white uppercase tracking-tight mb-3 flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-aether-gold rotate-45 shrink-0 shadow-[0_0_10px_rgba(197,160,89,0.5)] group-hover/card:scale-125 transition-transform" />
                                                    {ind.title}
                                                </h4>
                                                <p className="text-[10px] text-white/30 leading-relaxed font-mono uppercase tracking-[0.1em] flex-grow group-hover/card:text-white/50 transition-colors uppercase font-bold">{ind.info}</p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white/[0.01] border border-white/5 border-dashed rounded-[3rem] text-center">
                                            <ShieldCheck size={48} className="text-white/5 mb-6" />
                                            <p className="text-[11px] font-mono text-white/20 tracking-[0.5em] uppercase font-black">NO_OPERATIONAL_DATA_INDEXED</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-mono tracking-widest text-white/10 uppercase font-black shrink-0">
                                    <span>gaio_node_integrity_nominal</span>
                                    <div className="flex gap-4">
                                        <span className="text-emerald-500/30">system_v.2.8.4</span>
                                        <span>latency: 0.04ms</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {selectedFounder && (
                    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl" onClick={() => setSelectedFounder(null)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-2xl bg-[#010204] border border-white/10 rounded-[4rem] p-16 relative shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-aether-gold/5 to-transparent pointer-events-none" />
                            <button
                                onClick={() => setSelectedFounder(null)}
                                className="absolute top-10 right-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white transition-all z-10"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex flex-col items-center text-center relative z-10">
                                <span className="text-aether-gold font-mono text-[9px] tracking-[1em] uppercase mb-8 opacity-40">FOUNDING_COUNCIL_MEMBER</span>
                                <div className="w-48 h-48 rounded-[3.5rem] overflow-hidden border-2 border-aether-gold/30 mb-10 bg-slate-950 shadow-[0_0_40px_rgba(197,160,89,0.1)]">
                                    {selectedFounder.photo ? (
                                        <img
                                            src={selectedFounder.photo.startsWith('http') ? selectedFounder.photo : `${API_BASE_URL}/${selectedFounder.photo}`}
                                            className="w-full h-full object-cover transition-all duration-700"
                                            alt={selectedFounder.name}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/10"><Users size={64} /></div>
                                    )}
                                </div>
                                <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">{selectedFounder.name}</h3>
                                <p className="text-aether-gold font-mono uppercase tracking-[0.4em] text-xs font-black mb-10">{selectedFounder.company}</p>
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] mb-12 relative group">
                                    <Sparkles className="absolute -top-3 -left-3 text-aether-gold/20" size={32} />
                                    <p className="text-slate-400 italic font-light leading-relaxed text-lg">"{selectedFounder.bio}"</p>
                                </div>
                                {selectedFounder.linkedin && (
                                    <a
                                        href={selectedFounder.linkedin}
                                        target="_blank"
                                        className="px-10 py-5 bg-aether-gold/10 border border-aether-gold/30 rounded-full text-aether-gold font-black uppercase text-xs tracking-[0.3em] hover:bg-aether-gold hover:text-slate-950 transition-all shadow-[0_0_30px_rgba(197,160,89,0.1)]"
                                    >
                                        NETWORK_DOSSIER
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* HUD */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
                <div className="bg-[#020610]/80 backdrop-blur-3xl border border-white/5 p-4 px-12 rounded-full flex items-center gap-16 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <Activity size={14} className="text-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] font-black uppercase">SYSTEM_INTEGRITY: 100%</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex gap-8 text-[9px] font-mono text-white/20 tracking-widest font-bold uppercase">
                        <span>TOTAL_NODES: {staff.length}</span>
                        <span>LATENCY: 14ms</span>
                    </div>
                </div>
            </div>

            {/* Initial Loading */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-32 h-32 border border-aether-gold/20 border-t-aether-gold rounded-full mb-12 shadow-[0_0_100px_rgba(197,160,89,0.1)]"
                        />
                        <span className="text-[12px] font-mono text-aether-gold font-black uppercase tracking-[0.8em] animate-pulse">Initializing_Sovereign_Matrix...</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
