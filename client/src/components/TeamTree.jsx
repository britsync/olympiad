import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Globe, MapPin, ChevronRight, ChevronDown, User, Network, Layers, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const TreeCard = ({ member, depth, isExpanded, onToggle }) => {
    const levelColors = {
        'Britsync': 'border-aether-gold text-aether-gold bg-aether-gold/5 shadow-[0_0_20px_-10px_rgba(197,160,89,0.2)]',
        'Continental_Coordinator': 'border-emerald-500/50 text-emerald-400 bg-emerald-500/5',
        'Regional_Coordinator': 'border-blue-500/50 text-blue-400 bg-blue-500/5',
        'Ground_Team': 'border-slate-500/50 text-slate-400 bg-slate-500/5'
    };

    const levelLabels = {
        'Britsync': 'MAIN_TEAM',
        'Continental_Coordinator': 'CONTINENTAL_COORDINATOR',
        'Regional_Coordinator': 'REGIONAL_COORDINATOR',
        'Ground_Team': 'TEAM VOLUNTEER & UNI LEADERS'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${levelColors[member.level] || levelColors.Ground}`}
            style={{ marginLeft: `${depth * 2}rem` }}
        >
            {/* Connection Line */}
            {depth > 0 && (
                <div className="absolute -left-[1.1rem] top-1/2 -translate-y-1/2 w-4 h-[2px] bg-white/10" />
            )}

            <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-white/10 shrink-0">
                {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                    <User size={20} className="opacity-50" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-black text-white uppercase tracking-tight truncate">{member.name}</h4>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-widest opacity-80 whitespace-nowrap">
                        {levelLabels[member.level] || member.level.replace('_', ' ')}
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider truncate">{member.role}</span>
                    <div className="flex items-center gap-3">
                        {member.location && (
                            <div className="flex items-center gap-1.5 text-[9px] text-aether-gold font-mono uppercase bg-aether-gold/5 px-2 py-0.5 rounded-full border border-aether-gold/10 relative overflow-hidden group/badge">
                                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-aether-gold/30 animate-[ping_3s_infinite]" />
                                <MapPin size={8} className="animate-pulse" />
                                <span className="tracking-widest font-black">ACTIVE_NODE: {member.location}</span>
                            </div>
                        )}
                        {member.department !== 'Core' && (
                            <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono uppercase opacity-60">
                                <Network size={8} />
                                <span>DIV: {member.department}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {onToggle && (
                <button
                    onClick={onToggle}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
                >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
            )}
        </motion.div>
    );
};

export default function TeamTree() {
    const [staff, setStaff] = useState([]);
    const [founders, setFounders] = useState([]);
    const [cmsContent, setCmsContent] = useState([]);
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
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
            setStaff(staffRes.data);
            const roots = staffRes.data.filter(m => m.level === 'Britsync').map(m => m._id);
            setExpandedIds(new Set(roots));

            // Filter founders
            setFounders(expertsRes.data.filter(e => e.category === 'FOUNDER'));

            // Set content for section headings
            setCmsContent(contentRes.data.filter(c => c.sectionId === 'Gala'));
        } catch (error) {
            console.error('FAILED_TO_SYNC_DATA');
        } finally {
            setLoading(false);
        }
    };

    const getContent = (key, fallback) => {
        const item = cmsContent.find(c => c.key === key);
        return item ? item.value : fallback;
    };

    const toggleExpand = (id) => {
        const next = new Set(expandedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedIds(next);
    };

    const renderTree = (parentId = null, depth = 0) => {
        const children = staff.filter(m => m.parent === parentId || (parentId === null && m.level === 'Britsync'));

        return (
            <div className="relative space-y-8">
                {children.map((member, index) => {
                    const hasChildren = staff.some(m => m.parent === member._id);
                    const isExpanded = expandedIds.has(member._id);

                    return (
                        <div key={member._id} className="relative">
                            {/* Vertical Connector Line to Parent (starting from depth 1) */}
                            {depth > 0 && (
                                <div
                                    className="absolute -left-[1rem] top-[-2rem] w-[2px] h-[3rem] bg-gradient-to-b from-white/5 to-white/20"
                                    style={{ left: `${(depth - 1) * 2 + 1}rem` }}
                                />
                            )}

                            {/* Horizontal Connector Line to parent column */}
                            {depth > 0 && (
                                <div
                                    className="absolute top-10 w-4 h-[2px] bg-white/20"
                                    style={{ left: `${(depth - 1) * 2 + 1}rem` }}
                                />
                            )}

                            <TreeCard
                                member={member}
                                depth={depth}
                                isExpanded={isExpanded}
                                onToggle={hasChildren ? () => toggleExpand(member._id) : null}
                            />

                            <AnimatePresence>
                                {isExpanded && hasChildren && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden relative"
                                    >
                                        {/* Child Data-Flow Animation SVG */}
                                        <div className="absolute top-10 bottom-0 w-[2px] left-[5.1rem]"
                                            style={{ left: `${depth * 2 + 1}rem` }}>
                                            <svg className="h-full w-full overflow-visible">
                                                <line
                                                    x1="0" y1="0" x2="0" y2="100%"
                                                    className="stroke-white/5"
                                                    strokeWidth="2"
                                                />
                                                <motion.line
                                                    x1="0" y1="0" x2="0" y2="100%"
                                                    stroke="rgba(197, 160, 89, 0.3)"
                                                    strokeWidth="2"
                                                    initial={{ pathLength: 0, opacity: 0 }}
                                                    animate={{
                                                        pathLength: [0, 1],
                                                        opacity: [0, 1, 0]
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "linear"
                                                    }}
                                                />
                                            </svg>
                                        </div>
                                        <div className="pt-8">
                                            {renderTree(member._id, depth + 1)}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen relative">
            {/* Background Neural Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-20 -z-20">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:40px_40px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
            </div>

            {/* Header Section */}
            <div className="text-center mb-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-aether-gold/10 rounded-full blur-[100px] -z-10" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-aether-gold/50" />
                        <span className="text-[10px] font-mono text-aether-gold tracking-[0.4em] uppercase font-black">Topology_Protocol // v2.0</span>
                        <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-aether-gold/50" />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                        TEAM <span className="text-gradient">TREE</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest max-w-lg mx-auto leading-relaxed">
                        Visualizing the distributed neural nodes of the <span className="text-white">Global AI Olympiad</span>. Higher connectivity ensures protocol stability.
                    </p>
                </motion.div>
            </div>

            {/* Founding Partners Section */}
            {founders.length > 0 && (
                <div className="mb-24">
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="h-px w-12 bg-aether-gold/30"></div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">{getContent ? getContent('founder_heading', 'FOUNDING_PARTNERS') : 'FOUNDING_PARTNERS'}</h2>
                        <div className="h-px w-12 bg-aether-gold/30"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                        {founders.map((founder) => (
                            <motion.div
                                key={founder._id}
                                whileHover={{ y: -10 }}
                                onClick={() => setSelectedFounder(founder)}
                                className="glass p-6 rounded-[2.5rem] border-white/5 bg-slate-900/40 w-full max-w-[280px] group cursor-pointer transition-all hover:border-aether-gold/30 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-aether-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 mb-6 bg-slate-950">
                                    {founder.photo ? (
                                        <img src={founder.photo.startsWith('http') ? founder.photo : `${API_BASE_URL}/${founder.photo}`} alt={founder.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-700">
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1">{founder.name}</h4>
                                    <p className="text-[10px] font-mono text-aether-gold uppercase tracking-widest">{founder.company || 'PARTNER_ENTITY'}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tree Section */}
            <div className="glass p-8 md:p-20 rounded-[4rem] border-white/5 bg-slate-950/40 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-aether-gold/[0.03] to-transparent pointer-events-none" />

                {/* Decorative scanning line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-aether-gold/20 to-transparent animate-[scan_8s_linear_infinite]" />

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-2 border-aether-gold/20 rounded-full" />
                            <div className="absolute inset-0 border-b-2 border-aether-gold rounded-full animate-spin" />
                        </div>
                        <span className="text-[10px] font-mono text-aether-gold uppercase tracking-[0.3em] font-black animate-pulse">Hydrating_Neural_Net...</span>
                    </div>
                ) : staff.length > 0 ? (
                    <div className="relative z-10 transition-all duration-1000">
                        {renderTree()}
                    </div>
                ) : (
                    <div className="text-center py-20 space-y-6">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Layers size={32} className="text-slate-700" />
                        </div>
                        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">No nodes active in the current protocol.</p>
                    </div>
                )}
            </div>

            {/* Footer Stats / Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                {[
                    {
                        label: 'Britsync',
                        value: staff.filter(m => m.level === 'Britsync').length,
                        icon: ShieldCheck,
                        status: 'COMMAND_SECURE',
                        color: 'text-aether-gold',
                        bg: 'bg-aether-gold/5',
                        border: 'border-aether-gold/20'
                    },
                    {
                        label: 'Continental',
                        value: staff.filter(m => m.level === 'Continental_Coordinator').length,
                        icon: Globe,
                        status: 'NODES_ACTIVE',
                        color: 'text-emerald-400',
                        bg: 'bg-emerald-400/5',
                        border: 'border-emerald-400/20'
                    },
                    {
                        label: 'Regional',
                        value: staff.filter(m => m.level === 'Regional_Coordinator').length,
                        icon: MapPin,
                        status: 'REGION_SYNC',
                        color: 'text-blue-400',
                        bg: 'bg-blue-400/5',
                        border: 'border-blue-400/20'
                    },
                    {
                        label: 'Ground',
                        value: staff.filter(m => m.level === 'Ground_Team').length,
                        icon: Users,
                        status: 'FIELD_OPS_READY',
                        color: 'text-slate-400',
                        bg: 'bg-slate-400/5',
                        border: 'border-white/10'
                    }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group relative overflow-hidden glass p-6 rounded-[2.5rem] ${stat.border} hover:border-white/20 transition-all duration-500`}
                    >
                        {/* Status Bar */}
                        <div className="absolute top-0 inset-x-0 h-1 overflow-hidden opacity-30">
                            <motion.div
                                className={`h-full w-full ${stat.color.replace('text', 'bg')}`}
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border border-white/5`}>
                                <stat.icon size={18} />
                            </div>
                            <div className="text-right">
                                <div className="text-[7px] font-mono text-white/30 uppercase tracking-[0.2em]">Telemetry_Readout</div>
                                <div className={`text-[9px] font-mono ${stat.color} uppercase tracking-widest font-black`}>{stat.status}</div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-4xl font-black text-white tracking-tighter tabular-nums flex items-baseline gap-2">
                                {stat.value}
                                <span className="text-[10px] text-white/20 font-mono tracking-widest">N_ID</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black group-hover:text-white transition-colors">{stat.label}</div>
                            </div>
                        </div>

                        {/* Hover Decorative Element */}
                        <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-10 transition-opacity">
                            <stat.icon size={64} className={stat.color} />
                        </div>
                    </motion.div>
                ))}
            </div>
            {/* Founder Detail Modal */}
            <AnimatePresence>
                {selectedFounder && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedFounder(null)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[200]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass p-10 rounded-[3rem] bg-slate-900 z-[201] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
                        >
                            <button
                                onClick={() => setSelectedFounder(null)}
                                className="absolute top-6 right-6 p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-aether-gold/30 mb-8 bg-slate-950 p-1">
                                    <div className="w-full h-full rounded-[2.2rem] overflow-hidden">
                                        {selectedFounder.photo ? (
                                            <img src={selectedFounder.photo.startsWith('http') ? selectedFounder.photo : `${API_BASE_URL}/${selectedFounder.photo}`} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                <User size={64} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{selectedFounder.name}</h3>
                                <p className="text-xs font-mono text-aether-gold uppercase tracking-[0.3em] mb-8 font-black">{selectedFounder.company}</p>
                                <div className="w-12 h-px bg-white/10 mb-8" />
                                <p className="text-sm text-slate-400 font-light leading-relaxed mb-10 italic">
                                    "{selectedFounder.bio}"
                                </p>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="p-4 bg-white/5 rounded-2xl text-left border border-white/5">
                                        <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-2 font-black">Expertise</p>
                                        <p className="text-[10px] text-white font-bold uppercase tracking-tighter">{selectedFounder.expertise?.join(' // ') || 'STRATEGIC_NODES'}</p>
                                    </div>
                                    {selectedFounder.linkedin && (
                                        <a
                                            href={selectedFounder.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-aether-gold/10 rounded-2xl text-left border border-aether-gold/20 group hover:bg-aether-gold/20 transition-all flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="text-[8px] font-mono text-aether-gold uppercase tracking-widest mb-1 font-black">LinkedIn</p>
                                                <p className="text-[10px] text-white font-bold uppercase tracking-tighter">VIEW_PROFILE</p>
                                            </div>
                                            <ChevronRight size={14} className="text-aether-gold group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
