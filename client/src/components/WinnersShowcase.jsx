import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, ChevronRight, Crown } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const WinnersShowcase = () => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWinners = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/submissions/winners`);
                setWinners(res.data);
            } catch (error) {
                console.error('Failed to fetch winners', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWinners();
    }, []);

    if (loading || winners.length === 0) return null;

    const medals = [
        { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', label: 'GOLD_NODE', glow: 'shadow-yellow-400/20' },
        { color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/20', label: 'SILVER_NODE', glow: 'shadow-slate-300/20' },
        { color: 'text-amber-700', bg: 'bg-amber-700/10', border: 'border-amber-700/20', label: 'BRONZE_NODE', glow: 'shadow-amber-700/20' }
    ];

    return (
        <section className="relative py-32 px-6 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-aether-gold/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-aether-gold/10 border border-aether-gold/20 mb-6">
                        <Crown size={14} className="text-aether-gold" />
                        <span className="text-[10px] font-black tracking-[0.3em] text-aether-gold uppercase">Hall of Fame</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 uppercase">
                        Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-aether-gold to-white">Champions</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto font-light text-lg">
                        Recognizing the elite nodes that have demonstrated superior innovation, impact, and technical feasibility in the Global AI Olympiad.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                    {winners.map((winner, index) => {
                        // Reorder for visual hierarchy: 2nd (Silver), 1st (Gold), 3rd (Bronze)
                        // This logic is handled by the grid placement if we want 2-1-3, but for simplicity in mapping:
                        // Let's just map them 1-2-3 and use CSS order if needed, or simple direct mapping.
                        // Actually, a simple 1-2-3 list is fine, but let's highlight the 1st one.

                        const medal = medals[index] || medals[2];
                        const isFirst = index === 0;

                        return (
                            <motion.div
                                key={winner._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className={`relative group ${isFirst ? 'md:-mt-12 md:mb-12 z-20' : 'z-10'}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-950/80 backdrop-blur-xl rounded-[2.5rem] border ${medal.border} transition-all duration-500 group-hover:bg-slate-800/80 group-hover:scale-[1.02] ${isFirst ? 'shadow-2xl ' + medal.glow : ''}`}></div>

                                <div className="relative p-10 flex flex-col items-center text-center h-full">
                                    <div className={`w-20 h-20 rounded-2xl ${medal.bg} ${medal.border} flex items-center justify-center mb-8 border rotate-3 shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                                        <Trophy size={32} className={medal.color} />
                                    </div>

                                    <div className={`text-[10px] font-black tracking-[0.3em] uppercase mb-4 px-3 py-1 rounded-full ${medal.bg} ${medal.color}`}>
                                        {medal.label}
                                    </div>

                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-aether-gold transition-colors">
                                        {winner.teamId?.name || 'Unknown Node'}
                                    </h3>

                                    <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-6">
                                        {winner.teamId?.department || 'Participant'}
                                    </p>

                                    <div className="w-full h-px bg-white/5 mb-6"></div>

                                    <p className="text-slate-400 text-sm font-light leading-relaxed mb-8 line-clamp-3">
                                        {winner.projectIdea || 'No description available'}
                                    </p>

                                    <div className="mt-auto flex items-center gap-2 text-white/50 group-hover:text-white transition-colors">
                                        <span className="text-[10px] font-black tracking-[0.2em] uppercase">Score: {winner.averageScore?.toFixed(1)}</span>
                                        <Star size={12} className="text-aether-gold" fill="currentColor" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WinnersShowcase;
