import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Crown, Star, Sparkles, Target, Zap, Gift, Shield, Rocket, Flame, Coins, Briefcase, GraduationCap, ShieldCheck, Globe, MapPin, Globe2, ShieldAlert, Palette, FileText, Database, Mail, Settings, X, Save, Trash2, TrendingUp, Users, PenTool, BarChart3, CheckCircle2 as CheckCircle, Clock, Wine, Send, Landmark, Lock, FileCheck, Unlock, Smartphone, Loader2, Linkedin, Cpu } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

export default function Prizes({ onNavigate }) {
    const [judges, setJudges] = useState([]);
    const [awardTiers, setAwardTiers] = useState([]);
    const [cmsContent, setCmsContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const getContent = (key, fallback) => {
        const item = cmsContent.find(c => c.key === key);
        return item ? item.value : fallback;
    };

    const fallbackTiers = [
        { tierName: 'GRAND AWARD', reward: '$100,000 Equity-Free Seed', description: 'The absolute pinnacle of synthetic coordination.', icon: 'Star', color: 'text-aether-gold' },
        { tierName: 'CONTINENTAL CHAMPIONS', reward: '$25,000 + Deployment Grant', description: 'Regional supremacy in decentralized AI.', icon: 'Globe', color: 'text-blue-400' },
        { tierName: 'REGIONAL NODE LEADERS', reward: '$10,000 + Ecosystem Access', description: 'Scaling localized intelligence nodes.', icon: 'MapPin', color: 'text-emerald-400' },
    ];

    useEffect(() => {
        const fetchAwardTiers = async () => {
            try {
                const [awardsRes, expertsRes, contentRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/cms/awards`),
                    axios.get(`${API_BASE_URL}/api/cms/experts`),
                    axios.get(`${API_BASE_URL}/api/cms/content`)
                ]);

                setAwardTiers(awardsRes.data);

                if (expertsRes.data.length > 0) {
                    setJudges(expertsRes.data);
                } else {
                    setJudges([
                        { name: 'Dr. Sarah Chen', expertise: ['AI Strategy'], company: 'Neural Systems', bio: 'Expert in scalable AI ethics and community development.' },
                        { name: 'Marcus Vault', expertise: ['Venture Capital'], company: 'Tech Capital', bio: 'Venture capitalist focusing on local emerging markets.' },
                        { name: 'Elena Rodriguez', expertise: ['Global Branding'], company: 'Global Sync', bio: 'Architect of some of the world’s most impactful social brands.' },
                    ]);
                }

                setCmsContent(contentRes.data.filter(c => c.sectionId === 'Prizes'));
            } catch (error) {
                console.error('PRIZES_DATA_SYNC_FAILED', error);
                setJudges([
                    { name: 'Dr. Sarah Chen', expertise: ['AI Strategy'], company: 'Neural Systems', bio: 'Expert in scalable AI ethics and community development.' },
                    { name: 'Marcus Vault', expertise: ['Venture Capital'], company: 'Tech Capital', bio: 'Venture capitalist focusing on local emerging markets.' },
                    { name: 'Elena Rodriguez', expertise: ['Global Branding'], company: 'Global Sync', bio: 'Architect of some of the world’s most impactful social brands.' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchAwardTiers();
    }, []);

    const DynamicIcon = ({ name, ...props }) => {
        const Icons = {
            Award, Star, ShieldCheck, Rocket, Globe, MapPin, Zap, Cpu, Target,
            Globe2, ShieldAlert, Palette, FileText, Database, Mail, Settings, X,
            Save, Trash2, TrendingUp, Users, PenTool, Briefcase, GraduationCap,
            BarChart3, CheckCircle, Clock, Wine, Send, Landmark, Coins, Lock,
            FileCheck, Unlock, Smartphone
        };
        const IconComponent = Icons[name] || Award;
        return <IconComponent {...props} />;
    };

    return (
        <div className="max-w-[1600px] mx-auto py-32 px-6 min-h-screen relative overflow-hidden">
            {/* Ambient Multi-Layered Glows */}
            <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-aether-gold/5 rounded-full blur-[150px] -z-10 animate-float opacity-50"></div>
            <div className="absolute bottom-1/4 -right-20 w-[800px] h-[800px] bg-aether-soft/20 rounded-full blur-[200px] -z-10" style={{ animationDelay: '5s' }}></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 px-4">
                <section>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="mb-16 md:mb-24"
                    >
                        <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-white select-none">
                            {getContent('header_title_part1', 'REWARD')}<br /><span className="text-gradient">{getContent('header_title_accent', 'TIERS')}</span>
                        </h2>
                        <div className="w-20 md:w-32 h-1 bg-aether-gold mt-6 md:mt-10 rounded-full"></div>
                    </motion.div>

                    <div className="space-y-8 md:space-y-12">
                        {(awardTiers.length > 0 ? awardTiers : fallbackTiers).map((tier, i) => (
                            <motion.div
                                key={tier._id || tier.tierName}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                whileHover={{ x: 15 }}
                                className="glass p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] group transition-all duration-700 hover:bg-slate-900/60 hover:shadow-[0_40px_80px_-20px_rgba(197,160,89,0.1)] border-white/5"
                            >
                                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 md:gap-10 text-center sm:text-left">
                                    <div className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-950/80 border border-aether-gold/20 ${tier.color || 'text-aether-gold'} group-hover:bg-aether-gold group-hover:text-white transition-all duration-700 shadow-2xl relative shrink-0`}>
                                        <div className="absolute inset-0 bg-aether-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <DynamicIcon name={tier.icon || 'Award'} size={44} className="relative z-10" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white mb-2 leading-none group-hover:text-aether-gold transition-colors">{tier.tierName}</h3>
                                        <div className="flex items-center justify-center sm:justify-start gap-4 mb-3 md:mb-4">
                                            <div className="h-[1px] w-6 md:w-8 bg-aether-gold/40"></div>
                                            <span className="text-[8px] md:text-[10px] font-mono tracking-[0.4em] text-slate-500 uppercase font-black group-hover:text-slate-300 transition-colors">ALLOCATION_ESTIMATE</span>
                                        </div>
                                        <p className="text-aether-gold font-mono text-xs md:text-lg tracking-widest font-black uppercase">{tier.reward}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="mt-20 lg:mt-0">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="mb-16 md:mb-24 lg:text-right"
                    >
                        <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-white select-none">
                            {getContent('panel_title_part1', 'EXPERT')}<br /><span className="text-slate-800">{getContent('panel_title_part2', 'PANEL')}</span>
                        </h2>
                        <div className="w-20 md:w-32 h-1 bg-slate-800 mt-6 md:mt-10 lg:ml-auto rounded-full"></div>
                    </motion.div>

                    {loading ? (
                        <div className="h-96 flex items-center justify-center">
                            <Loader2 className="animate-spin text-aether-gold" size={60} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:gap-10">
                            {judges.map((judge, i) => (
                                <motion.div
                                    key={judge.name}
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    className="glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] group hover:shadow-[0_40px_80px_-20px_rgba(255,255,255,0.05)] transition-all duration-700 border-white/5 relative overflow-hidden"
                                >
                                    <div className="absolute top-8 right-8 md:top-12 md:right-12 text-slate-700 group-hover:text-aether-gold transition-all duration-500">
                                        <Linkedin size={24} className="md:w-7 md:h-7" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-8 md:gap-10">
                                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-[2rem] md:rounded-[3rem] bg-slate-950 border border-white/10 shrink-0 overflow-hidden relative group-hover:border-aether-gold/40 transition-all duration-1000 shadow-2xl mx-auto sm:mx-0">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-aether-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-800 group-hover:scale-110 transition-transform duration-1000">
                                                <Rocket size={32} className="md:w-12 md:h-12" />
                                            </div>
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-white mb-3 md:mb-4 group-hover:text-aether-gold transition-colors">{judge.name}</h3>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 md:gap-3 mb-5 md:mb-6">
                                                <span className="text-[8px] md:text-[9px] font-mono font-black tracking-widest text-aether-gold uppercase py-1.5 md:py-2 px-4 md:px-6 bg-aether-gold/5 border border-aether-gold/20 rounded-full">{judge.company}</span>
                                                {judge.expertise?.map(ext => (
                                                    <span key={ext} className="text-[8px] md:text-[9px] font-mono font-black tracking-widest text-slate-500 uppercase py-1.5 md:py-2 px-4 md:px-6 bg-white/5 border border-white/10 rounded-full">{ext}</span>
                                                ))}
                                            </div>
                                            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg font-light italic">"{judge.bio}"</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mt-32 md:mt-60 p-10 md:p-20 glass rounded-[3rem] md:rounded-[6rem] border-white/5 text-center bg-gradient-to-b from-slate-900/40 to-slate-950/80 relative overflow-hidden group shadow-[0_100px_150px_-50px_rgba(0,0,0,0.5)]"
            >
                <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-aether-gold/10 blur-[150px] rounded-full opacity-50 -z-10 animate-pulse"></div>
                <div className="mb-8 md:mb-14 inline-flex p-6 md:p-10 rounded-[1.5rem] md:rounded-[3rem] bg-white text-slate-950 shadow-2xl shadow-white/10 transition-transform duration-1000 group-hover:rotate-[360deg]">
                    <Rocket size={32} className="md:w-[50px] md:h-[50px]" />
                </div>
                <div className="relative z-10">
                    <span className="text-[10px] md:text-[12px] font-mono tracking-[0.5em] md:tracking-[0.8em] text-aether-gold uppercase font-black mb-6 md:mb-8 block">{getContent('gala_badge', 'PRIME_EVENT_2026 // LONDON')}</span>
                    <h3 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-8 md:mb-12 uppercase text-white leading-[0.85] select-none">
                        {getContent('gala_title_part1', 'LONDON ROYAL')}<br />
                        <span className="text-gradient">{getContent('gala_title_accent', 'GALA CEREMONY')}</span>
                    </h3>
                    <p className="text-slate-400 max-w-4xl mx-auto text-sm sm:text-xl md:text-2xl leading-snug font-light mb-10 md:mb-16 px-4 md:px-6">
                        {getContent('gala_description', 'The ultimate convergence of synthetic intelligence and sovereign community evolution.')}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate('gala')}
                        className="btn-luxury px-10 py-5 md:px-24 md:py-10 bg-white text-slate-950 font-black text-[10px] md:text-[12px] tracking-[0.2em] md:tracking-[0.4em] rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl hover:bg-aether-gold hover:text-white transition-all uppercase"
                    >
                        REQUEST_ACCREDITATION
                    </motion.button>
                </div>
            </motion.div>

            {/* Sponsor CTA Section - NEW SECTION */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mt-32 max-w-5xl mx-auto glass p-12 md:p-20 rounded-[4rem] border-white/5 border-t-4 border-t-aether-gold relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                    <Target size={200} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                    <div className="flex-1">
                        <span className="text-[10px] font-mono tracking-[0.5em] text-aether-gold uppercase font-black mb-6 block">{getContent('partnership_label', 'STRATEGIC_PARTNERSHIPS')}</span>
                        <h3 className="text-3xl font-black text-white uppercase mb-6 tracking-tighter">{getContent('partnership_title', 'Become a Global Title Sponsor')}</h3>
                        <p className="text-slate-400 text-sm font-light uppercase tracking-widest leading-relaxed max-w-xl">
                            {getContent('partnership_description', "Gain exclusive naming rights, internal talent pipeline access, and global policy visibility.")}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate('contact')}
                        className="px-12 py-6 bg-transparent border border-aether-gold/40 text-aether-gold rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:bg-aether-gold hover:text-white transition-all"
                    >
                        ACCESS_SPONSOR_DECK
                    </motion.button>
                </div>
            </motion.section>
        </div>
    );
}
