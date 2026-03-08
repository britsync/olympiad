import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, HelpCircle, Search, Zap, Shield, BookOpen, UserCheck, Terminal, AlertTriangle, FileText, Cpu } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
import axios from 'axios';

const faqs = [
    {
        q: "WHAT IS THE GLOBAL AI OLYMPIAD (GAIO)?",
        a: "A flagship international ecosystem combining virtual challenges, regional physical finals, and a grand London gala. We identify and commercialize future-ready AI talent."
    },
    {
        q: "HOW DO TEAMS REGISTER?",
        a: "Teams of 3-5 members (mixing technical and strategic expertise) can register via our 'ACTIVATE_ACCESS' portal. Individual pioneers can also register to be matched with a syndicate."
    },
    {
        q: "ARE THERE PARTICIPATION FEES?",
        a: "The core challenge is accessible to all selected teams. Premium 'Fast-Track' nodes and specialized masterclasses may have associated ecosystem fees."
    },
    {
        q: "WHAT ARE THE PROJECT EVALUATION PHASES?",
        a: "Evaluation follows a multi-tier protocol: Initial submission audit, technical feasibility assessment, and final presentation to our Global Syndicate jury in London."
    },
    {
        q: "DO PARTICIPANTS OWN THE IP?",
        a: "Yes. All participants retain 100% of their IP rights. GAIO retains the rights for showcase, broadcast, and anonymized analytics for ecosystem benchmarking."
    }
];

export default function FAQs() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [dynamicFaqs, setDynamicFaqs] = useState([]);
    const [content, setContent] = useState({
        page_subheading: 'Knowledge_Base',
        page_heading_main: 'FREQUENTLY ASKED',
        page_heading_accent: 'PROTOCOLS'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [faqsRes, contentRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/cms/faqs`),
                    axios.get(`${API_BASE_URL}/api/cms/content`)
                ]);
                setDynamicFaqs(faqsRes.data);

                const faqItems = contentRes.data.filter(c => c.sectionId === 'FAQ');
                const newContent = { ...content };
                faqItems.forEach(item => {
                    if (newContent.hasOwnProperty(item.key)) newContent[item.key] = item.value;
                });
                setContent(newContent);
            } catch (error) {
                console.error('FAILED_TO_SYNC_FAQS');
            }
        };
        fetchData();
    }, []);

    const displayFaqs = dynamicFaqs.length > 0 ? dynamicFaqs : faqs.map(f => ({ question: f.q, answer: f.a }));

    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-sm font-black tracking-[0.5em] text-aether-gold uppercase mb-4">{content.page_subheading}</h2>
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
                    {content.page_heading_main} <span className="text-gradient">{content.page_heading_accent}</span>
                </h1>
            </div>

            <div className="space-y-4">
                {displayFaqs.map((faq, i) => (
                    <div key={i} className="glass rounded-3xl border-white/5 overflow-hidden">
                        <button
                            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                            className="w-full p-8 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                        >
                            <span className="text-lg font-black text-white tracking-tight uppercase">{faq.question}</span>
                            <ChevronDown className={`text-aether-gold transition-transform duration-500 ${activeIndex === i ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {activeIndex === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-8 pb-8"
                                >
                                    <p className="text-slate-400 font-light leading-relaxed border-t border-white/5 pt-6 text-base">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
