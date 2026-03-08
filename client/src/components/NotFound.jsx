import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Home } from 'lucide-react';

export default function NotFound({ onNavigate }) {
    return (
        <div className="min-h-screen bg-aether-bg flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-aether-gold/5 rounded-full blur-[150px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl"
            >
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-32 h-32 bg-slate-950 border border-white/10 rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-2xl text-aether-gold"
                >
                    <ShieldAlert size={64} />
                </motion.div>

                <h1 className="text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                    404<br /><span className="text-gradient">NODE_LOST</span>
                </h1>

                <p className="text-slate-400 text-xl font-light uppercase tracking-widest leading-relaxed mb-16">
                    The requested coordinate does not exist within the <span className="text-white font-black">GAIO Neural Network</span>. Access denied or link corrupted.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate('hero')}
                        className="btn-luxury px-12 py-6 bg-white text-slate-950 rounded-full font-black text-[10px] tracking-[0.4em] uppercase hover:bg-aether-gold hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4"
                    >
                        <Home size={18} /> RETURN_TO_GATEWAY
                    </motion.button>
                </div>

                <div className="mt-24 pt-12 border-t border-white/5 opacity-30">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.8em]">ERROR_CODE: SYNC_FAILURE_0X404</div>
                </div>
            </motion.div>

            {/* Decorative Scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(197,160,89,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline pointer-events-none opacity-20"></div>
        </div>
    );
}
