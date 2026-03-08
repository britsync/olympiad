
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Shield, Zap, ChevronRight, Cpu, Terminal, Sparkles, Users, Lock, ChevronDown, Play, Code2, ArrowUpRight, ShieldCheck, Mail, Settings, X, Save, Trash2, TrendingUp, PenTool, Briefcase, GraduationCap, Rocket, BarChart3, MapPin, CheckCircle2 as CheckCircle, Clock, Wine, Send, Landmark, Coins, FileCheck, Unlock, Smartphone } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
import axios from 'axios';

const DynamicIcon = ({ name, ...props }) => {
    const Icons = {
        ShieldCheck, Mail, Settings, X, Save, Trash2, TrendingUp, Users,
        PenTool, Briefcase, GraduationCap, Rocket, BarChart3, MapPin,
        CheckCircle, Clock, Wine, Send, Globe, Landmark, Coins, Lock,
        FileCheck, Unlock, Smartphone
    };
    const IconComponent = Icons[name] || Cpu;
    return <IconComponent {...props} />;
};

export default function Hero({ onNavigate }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    const [features, setFeatures] = useState([]);
    const [partners, setPartners] = useState([]);
    const [targetDate, setTargetDate] = useState('2026-06-15T00:00:00');
    const [heroContent, setHeroContent] = useState({
        main_title: 'GLOBAL AI OLYMPIAD',
        subtitle: 'The ultimate convergence of community-driven artificial intelligence and decentralized infrastructure.'
    });

    useEffect(() => {
        const fetchCmsData = async () => {
            try {
                // 1. Track Visitor (Increment)
                await axios.post(`${API_BASE_URL}/api/analytics/visitor`);

                // 2. Fetch Global Stats
                const statsRes = await axios.get(`${API_BASE_URL}/api/analytics`);
                const stats = statsRes.data;

                // 3. Fetch CMS Content
                const gatewayRes = await axios.get(`${API_BASE_URL}/api/cms/gateway`);
                setFeatures(gatewayRes.data.filter(f => f.category === 'HERO_FEATURE'));
                setPartners(gatewayRes.data.filter(f => f.category === 'PARTNER'));

                const contentRes = await axios.get(`${API_BASE_URL}/api/cms/content`);
                const heroItems = contentRes.data.filter(c => c.sectionId === 'Hero');

                const newContent = {
                    main_title: 'GLOBAL AI OLYMPIAD',
                    subtitle: 'The ultimate convergence of community-driven artificial intelligence and decentralized infrastructure.',
                    countries: stats.countries,
                    startups: stats.startups,
                    visitors: stats.visitors,
                    ministryInvolvement: stats.ministryInvolvement
                };

                heroItems.forEach(item => {
                    if (item.key === 'target_date_iso') {
                        setTargetDate(item.value);
                    } else if (newContent.hasOwnProperty(item.key)) {
                        newContent[item.key] = item.value;
                    }
                });
                setHeroContent(newContent);
            } catch (error) {
                console.error('FAILED_TO_SYNC_HERO_DATA', error);
            }
        };

        const calculateTimeLeft = () => {
            const target = new Date(targetDate);
            const now = new Date();
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        fetchCmsData();
        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Initial call
        return () => clearInterval(timer);
    }, [targetDate]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-32 pb-20">
            {/* Ambient Multi-Layered Glows */}
            <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-aether-gold/5 rounded-full blur-[150px] -z-10 animate-float opacity-50"></div>
            <div className="absolute bottom-1/4 -right-20 w-[800px] h-[800px] bg-aether-soft/40 rounded-full blur-[200px] -z-10" style={{ animationDelay: '5s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] pointer-events-none -z-5"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="z-10 max-w-[1600px] w-full text-center"
            >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-slate-950/60 backdrop-blur-2xl border border-white/10 mb-12 shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <Sparkles className="text-aether-gold animate-pulse" size={16} />
                    <span className="text-[10px] md:text-[11px] font-mono tracking-[0.5em] text-slate-300 uppercase font-black">PROTOCOL_CONNECTED // PHASE_01_ACTIVE</span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-6xl sm:text-7xl md:text-[8rem] lg:text-[12rem] font-black mb-10 tracking-tighter leading-[0.85] text-white uppercase select-none"
                >
                    <span className="block opacity-90">{heroContent.main_title.split(' ').slice(0, -2).join(' ') || 'GLOBAL'}</span>
                    <span className="text-gradient drop-shadow-[0_20px_50px_rgba(197,160,89,0.3)]">{heroContent.main_title.split(' ').slice(-2).join(' ') || 'AI OLYMPIAD'}</span>
                </motion.h1>

                <motion.div variants={itemVariants} className="relative h-1 w-24 bg-aether-gold/30 mx-auto mb-16 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="absolute inset-0 bg-aether-gold shadow-[0_0_15px_rgba(197,160,89,0.8)]"
                    />
                </motion.div>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-2xl text-slate-400 mb-24 max-w-4xl mx-auto font-light leading-snug px-6"
                >
                    {heroContent.subtitle}
                </motion.p>

                {/* Ultra-Luxury Countdown Grid - Enhanced */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mb-32 max-w-7xl mx-auto px-6">
                    {Object.entries(timeLeft).map(([unit, value], i) => (
                        <div key={unit} className="glass group relative p-12 md:p-16 rounded-[4rem] overflow-hidden border-white/5 hover:border-aether-gold/30 transition-all duration-700">
                            {/* Detailed Tech Accents */}
                            <div className="absolute top-6 left-10 text-[8px] font-mono text-aether-gold/30 font-black tracking-widest uppercase">NODE_0{i + 1}</div>
                            <div className="absolute bottom-6 right-10 w-2 h-2 bg-aether-gold/20 rounded-full animate-pulse"></div>

                            <div className="absolute inset-0 bg-gradient-to-br from-aether-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative z-10 text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter transition-all duration-1000 group-hover:scale-110 group-hover:text-gradient">
                                {value < 10 ? `0${value} ` : value}
                            </div>
                            <div className="relative z-10 text-[9px] uppercase font-mono tracking-[0.5em] text-slate-500 font-black group-hover:text-aether-gold transition-colors">{unit}</div>
                        </div>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8 justify-center items-center pb-24 px-6">
                    <motion.button
                        whileHover={{ scale: 1.05, y: -8 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate('register')}
                        className="btn-luxury w-full sm:w-auto px-16 md:px-24 py-8 md:py-10 bg-white text-slate-950 font-black text-[11px] tracking-[0.4em] rounded-[3rem] shadow-[0_30px_60px_-12px_rgba(255,255,255,0.1)] flex items-center justify-center gap-6 group uppercase transition-all hover:bg-aether-gold hover:text-white"
                    >
                        <span>ACTIVATE_ACCESS</span>
                        <ChevronRight className="group-hover:translate-x-2 transition-transform duration-500" size={18} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, y: -8 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate('submission')}
                        className="btn-luxury w-full sm:w-auto px-16 md:px-24 py-8 md:py-10 bg-slate-950 border border-white/10 text-slate-400 font-black text-[11px] tracking-[0.4em] rounded-[3rem] shadow-2xl flex items-center justify-center gap-6 group uppercase transition-all hover:border-aether-gold/50 hover:text-white"
                    >
                        <span>SUBMIT_PROJECT</span>
                        <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                    </motion.button>
                </motion.div>


                {/* Strategy Partners - Ultra Sleek & Animated */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap justify-center items-center gap-12 md:gap-24 px-10 relative"
                >
                    {(partners.length > 0 ? partners : [
                        { subtext: 'COMPUTE_NODE', title: 'NVIDIA_QUANTUM' },
                        { subtext: 'RESEARCH_HUB', title: 'MIT_REACTION_LABS' },
                        { subtext: 'PROTOCOL_AUTH', title: 'IEEE_STANDARD' }
                    ]).map((partner, i) => (
                        <motion.div
                            key={partner.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 0.4, y: 0 }}
                            whileHover={{ opacity: 1, scale: 1.05, y: -5 }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                            className="flex flex-col items-center group cursor-pointer relative"
                        >
                            <span className="text-[9px] font-mono tracking-[0.5em] uppercase mb-2 font-black text-slate-500 group-hover:text-aether-gold transition-colors duration-500">
                                {partner.subtext}
                            </span>
                            <span className="text-xl md:text-2xl font-black tracking-tighter text-white group-hover:text-gradient transition-all duration-500">
                                {partner.title}
                            </span>

                            <motion.div
                                className="absolute -bottom-2 left-0 w-0 h-[1px] bg-aether-gold group-hover:w-full transition-all duration-700"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
