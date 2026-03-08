import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Globe2, Cpu, Zap, Target, Shield, Rocket, Activity } from 'lucide-react';
import axios from 'axios';
import * as LucideIcons from 'lucide-react';

import HeroScene from './components/HeroScene';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RegistrationForm from './components/RegistrationForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SubmissionEngine from './components/SubmissionEngine';
import Workshops from './components/Workshops';
import Prizes from './components/Prizes';
import GalaRSVP from './components/GalaRSVP';
import AdminPanel from './components/AdminPanel';
import SponsorPortal from './components/SponsorPortal';
import About from './components/About';
import FAQs from './components/FAQs';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import TeamTree from './components/TeamTree';
import Team2 from './components/Team2';
import WinnersShowcase from './components/WinnersShowcase';

import { API_BASE_URL } from './apiConfig';

const DynamicIcon = ({ name, ...props }) => {
    const IconComponent = LucideIcons[name] || Cpu;
    return <IconComponent {...props} />;
};

function App() {
    const [activeSection, setActiveSection] = useState('hero');

    const validSections = [
        'hero', 'workshops', 'about', 'register', 'submission',
        'prizes', 'gala', 'faqs', 'contact', 'dashboard', 'sponsor', 'admin', 'team', 'team2'
    ];

    const [features, setFeatures] = useState([]);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/cms/gateway`);
                const specs = res.data.filter(g => g.category === 'SPECIALIZED_FEATURE');
                if (specs.length > 0) setFeatures(specs);
            } catch (error) {
                console.error('Failed to sync features');
            }
        };
        fetchFeatures();

        const path = window.location.pathname.split('/').filter(Boolean)[0];
        if (path === 'admin') {
            setActiveSection('admin');
        } else if (path === 'sponsor') {
            setActiveSection('sponsor');
        } else if (path && !validSections.includes(path.toLowerCase())) {
            setActiveSection('notfound');
        }
    }, []);

    return (
        <div className="bg-aether-bg text-white min-h-screen selection:bg-aether-accent/20 selection:text-aether-accent overflow-x-hidden">
            <HeroScene />
            {activeSection !== 'admin' && (
                <div className="relative z-[2000]">
                    <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
                </div>
            )}

            <main className="relative">
                <AnimatePresence mode="wait">
                    {activeSection === 'hero' && (
                        <motion.section
                            key="hero-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Hero onNavigate={setActiveSection} />

                            <WinnersShowcase />

                            {/* Specialized Feature Grid - Fully Responsive Refinement */}
                            <div className="max-w-7xl mx-auto px-6 md:px-10 pb-48">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
                                    {(features.length > 0 ? features : [
                                        {
                                            title: 'NEURAL INFRASTRUCTURE',
                                            description: 'Deploying edge-computing nodes for real-time community data processing across distributed networks.',
                                            icon: 'Cpu',
                                            color: 'text-aether-gold',
                                            glow: 'rgba(197, 160, 89, 0.1)'
                                        },
                                        {
                                            title: 'GLOBAL SYNDICATE',
                                            description: 'A unified network of AI researchers and community developers from over 40 participating nations.',
                                            icon: 'Globe2',
                                            color: 'text-blue-400',
                                            glow: 'rgba(96, 165, 250, 0.1)'
                                        },
                                        {
                                            title: 'SECURE PROTOCOLS',
                                            description: 'End-to-end encrypted project submission and validation layers with AES-256 standard security.',
                                            icon: 'ShieldAlert',
                                            color: 'text-rose-400',
                                            glow: 'rgba(251, 113, 133, 0.1)'
                                        }
                                    ]).map((feature, i) => (
                                        <motion.div
                                            key={feature._id || i}
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{
                                                delay: i * 0.2,
                                                duration: 1,
                                                ease: [0.16, 1, 0.3, 1]
                                            }}
                                            whileHover={{ y: -12 }}
                                            className="group relative p-12 md:p-14 rounded-[3rem] bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-md border border-white/5 overflow-hidden transition-all duration-700 hover:border-aether-gold/30 hover:shadow-[0_20px_60px_-10px_rgba(197,160,89,0.1)]"
                                        >
                                            {/* Animated Spotlight Background */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                                                <div
                                                    className="absolute -inset-20 bg-radial-gradient from-transparent via-transparent to-transparent group-hover:from-aether-gold/[0.05] transition-all duration-1000"
                                                    style={{
                                                        background: `radial-gradient(circle at center, ${feature.glow || 'rgba(197,160,89,0.1)'} 0%, transparent 70%)`
                                                    }}
                                                />
                                            </div>

                                            {/* Icon Container with slow pulse */}
                                            <div className="relative mb-12 flex justify-between items-start">
                                                <motion.div
                                                    animate={{
                                                        rotate: [0, 5, -5, 0],
                                                        scale: [1, 1.02, 1]
                                                    }}
                                                    transition={{
                                                        duration: 6,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className={`w-20 h-20 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-aether-gold/40 transition-all duration-500 shadow-xl ${feature.color}`}
                                                >
                                                    <DynamicIcon name={feature.icon} size={36} strokeWidth={1.5} />
                                                </motion.div>
                                                <div className="text-[10px] font-mono text-white/20 font-black tracking-widest uppercase group-hover:text-aether-gold transition-colors duration-500">
                                                    0{i + 1}_SYS
                                                </div>
                                            </div>

                                            <div className="relative z-10">
                                                <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-6 text-white uppercase leading-none group-hover:text-aether-gold transition-all duration-500">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-slate-400 leading-relaxed font-light text-base group-hover:text-slate-300 transition-colors duration-500 border-l-2 border-white/5 pl-6 group-hover:border-aether-gold/30">
                                                    {feature.description || feature.desc}
                                                </p>
                                            </div>

                                            {/* Subtle corner tech details */}
                                            <div className="absolute bottom-6 right-8 text-[8px] font-mono text-white/10 tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center gap-2">
                                                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                                NODE_STABLE
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {activeSection === 'workshops' && (
                        <motion.section
                            key="workshops-section"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Workshops onNavigate={setActiveSection} />
                        </motion.section>
                    )}

                    {activeSection === 'about' && (
                        <motion.section
                            key="about-section"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            <About />
                        </motion.section>
                    )}

                    {activeSection === 'register' && (
                        <motion.section
                            key="register-section"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                        >
                            <RegistrationForm
                                onNavigate={setActiveSection}
                                onComplete={() => setTimeout(() => setActiveSection('dashboard'), 10000)}
                            />
                        </motion.section>
                    )}

                    {activeSection === 'submission' && (
                        <motion.section
                            key="submission-section"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            <SubmissionEngine onNavigate={setActiveSection} />
                        </motion.section>
                    )}

                    {activeSection === 'prizes' && (
                        <motion.section
                            key="prizes-section"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Prizes onNavigate={setActiveSection} />
                        </motion.section>
                    )}

                    {activeSection === 'gala' && (
                        <motion.section
                            key="gala-section"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6 }}
                        >
                            <GalaRSVP onNavigate={setActiveSection} />
                        </motion.section>
                    )}

                    {activeSection === 'faqs' && (
                        <motion.section
                            key="faqs-section"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            <FAQs />
                        </motion.section>
                    )}

                    {activeSection === 'contact' && (
                        <motion.section
                            key="contact-section"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Contact />
                        </motion.section>
                    )}

                    {activeSection === 'dashboard' && (
                        <motion.section
                            key="dashboard-section"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AnalyticsDashboard />
                        </motion.section>
                    )}

                    {activeSection === 'admin' && (
                        <motion.section
                            key="admin-section"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AdminPanel />
                        </motion.section>
                    )}

                    {activeSection === 'sponsor' && (
                        <motion.section
                            key="sponsor-section"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            <SponsorPortal />
                        </motion.section>
                    )}

                    {activeSection === 'team' && (
                        <motion.section
                            key="team-section"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            <TeamTree />
                        </motion.section>
                    )}
                    {activeSection === 'team2' && (
                        <motion.section
                            key="team2-section"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Team2 />
                        </motion.section>
                    )}

                    {activeSection === 'notfound' && (
                        <motion.section
                            key="notfound-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <NotFound onNavigate={setActiveSection} />
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>

            {activeSection !== 'admin' && (
                <footer className="relative z-10 pt-32 pb-16 mt-20 border-t border-white/5 bg-slate-950/40 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-6 md:px-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                            <div className="lg:col-span-2">
                                <span className="text-4xl font-black tracking-tighter mb-4 block text-aether-accent uppercase">GAIO_GLOBAL</span>
                                <p className="text-slate-400 max-w-sm text-sm font-light leading-relaxed">
                                    Empowering the next generation of AI pioneers through distributed community intelligence and cross-border collaboration.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase mb-4">Tactical Links</span>
                                <span
                                    onClick={() => { setActiveSection('faqs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="text-xs text-slate-400 hover:text-aether-accent cursor-pointer transition-colors font-bold uppercase tracking-widest"
                                >
                                    Privacy Lexicon
                                </span>
                                <span
                                    onClick={() => { setActiveSection('faqs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="text-xs text-slate-400 hover:text-aether-accent cursor-pointer transition-colors font-bold uppercase tracking-widest"
                                >
                                    Digital Protocol
                                </span>
                                <span
                                    onClick={() => { setActiveSection('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="text-xs text-slate-400 hover:text-aether-accent cursor-pointer transition-colors font-bold uppercase tracking-widest"
                                >
                                    Contact Terminal
                                </span>
                            </div>

                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase mb-4">Core Regions</span>
                                <span className="text-xs text-slate-400 uppercase tracking-widest">London_Hub</span>
                                <span className="text-xs text-slate-400 uppercase tracking-widest">Singapore_Node</span>
                                <span className="text-xs text-slate-400 uppercase tracking-widest">NewYork_Grid</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
                            <div className="text-[10px] font-mono text-slate-300 font-bold tracking-widest uppercase">
                                © 2026 GAIO GLOBAL AI OLYMPIAD. ALL SYSTEMS RUNNING_STABLE.
                            </div>
                            <div className="flex gap-8 items-center">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-mono text-emerald-500 font-black tracking-widest uppercase">Encryption_Active</span>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}

export default App;
