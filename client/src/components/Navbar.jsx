import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Globe, BookOpen, Star, Wine, LayoutDashboard, UploadCloud, Menu, X, Shield, ChevronRight, Target, Info, HelpCircle, Mail, Users, Network } from 'lucide-react';

export default function Navbar({ activeSection, setActiveSection }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    const navItems = [
        { id: 'hero', label: 'GATEWAY', icon: Globe },
        { id: 'about', label: 'ABOUT', icon: Info },
        { id: 'workshops', label: 'ACADEMY', icon: BookOpen },
        { id: 'register', label: 'REGISTRATION', icon: Trophy },
        { id: 'submission', label: 'SUBMISSION', icon: UploadCloud },
        { id: 'prizes', label: 'AWARDS', icon: Star },
        { id: 'team2', label: 'Team', icon: Network },
        { id: 'dashboard', label: 'TELEMETRY', icon: LayoutDashboard },
        { id: 'faqs', label: 'FAQs', icon: HelpCircle },
        { id: 'contact', label: 'CONTACT', icon: Mail },
        { id: 'gala', label: 'EXPERIENCE', icon: Wine },
    ];

    const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-1000 px-4 md:px-12 pt-3 md:pt-4 ${isScrolled ? 'translate-y-0' : 'translate-y-0'}`}>
            <div className={`max-w-[1600px] mx-auto transition-all duration-1000 ${isScrolled ? 'glass px-6 md:px-10 py-3 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-white/10' : 'px-6 md:px-10 py-2 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 bg-slate-950/90 md:bg-slate-950/70 backdrop-blur-3xl md:backdrop-blur-xl transition-colors duration-500'}`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setActiveSection('hero'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                        <div className="relative">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center p-0 group-hover:scale-110 transition-all duration-1000 overflow-hidden">
                                <img src="/logo_final.png" alt="GAIO" className="w-full h-full object-contain transition-opacity" />
                            </div>
                            <div className="absolute inset-0 bg-aether-gold blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-black tracking-[0.2em] text-gradient drop-shadow-[0_10px_20px_rgba(197,160,89,0.3)] uppercase leading-none">GAIO</span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden xl:flex items-center xl:gap-4 2xl:gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveSection(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className={`group relative py-2 text-[8px] 2xl:text-[10px] font-black tracking-[0.1em] 2xl:tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden ${activeSection === item.id ? 'text-aether-gold' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <span className="relative z-10">{item.label}</span>
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-aether-gold transition-transform duration-500 origin-left ${activeSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    }`}></span>
                            </button>
                        ))}
                    </div>


                    {/* Mobile Menu Button */}
                    <button
                        className="xl:hidden p-4 glass rounded-2xl border-white/5 text-aether-gold"
                        onClick={toggleMenu}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[-1] xl:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-slate-900 shadow-2xl z-50 xl:hidden flex flex-col p-12 md:p-16 border-l border-white/5 overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-16 px-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black text-white uppercase tracking-tighter">NAVNODE</span>
                                    <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase mt-1">Status: System_Online</span>
                                </div>
                                <button
                                    onClick={toggleMenu}
                                    className="p-4 bg-white/5 rounded-2xl text-slate-400"
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-8 px-4">
                                {navItems.map((item, i) => (
                                    <motion.button
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => {
                                            setActiveSection(item.id);
                                            setMobileMenuOpen(false);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="text-left group"
                                    >
                                        <h4 className={`text-4xl font-black transition-all uppercase tracking-tighter ${activeSection === item.id ? 'text-aether-gold' : 'text-white hover:text-aether-gold'}`}>
                                            {item.label}
                                        </h4>
                                        <div className={`h-1 bg-aether-gold mt-2 transition-all duration-500 ${activeSection === item.id ? 'w-24 opacity-100' : 'w-0 opacity-30 group-hover:w-12'}`}></div>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="mt-auto px-4">
                                <div className="mt-12 flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-600 tracking-[0.4em] uppercase font-black">GAIO_OS_v2</span>
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
