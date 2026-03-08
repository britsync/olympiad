
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Zap, Globe, Cpu, Trophy, Clock, CheckCircle2 as CheckCircle, Award, Target as TargetIcon, ShieldCheck, Zap as ZapIcon } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
import axios from 'axios';

const DynamicIcon = ({ name, ...props }) => {
    const Icons = {
        Shield, Target, Users, Zap, Globe, Cpu, Trophy, Clock, CheckCircle, Award, ShieldCheck
    };
    const IconComponent = Icons[name] || Target;
    return <IconComponent {...props} />;
};

export default function About() {
    const [content, setContent] = useState({
        mission_title: 'Harnessing AI for Local Evolution',
        mission_statement: 'Our vision is to become the world’s leading AI Olympiad, shaping the next generation of AI leaders, innovators, and entrepreneurs.',
        organizer_title: 'Organizer: Britsync',
        organizer_desc: 'Britsync is an AI-based digital marketing solution provider dedicated to bridging the gap between advanced technology and community needs. Our mission is to accelerate global connectivity through synthetic intelligence.'
    });

    const [aboutCards, setAboutCards] = useState([]);
    const [aboutStrengths, setAboutStrengths] = useState([]);
    const [heading, setHeading] = useState('INTERNAL_MISSION_PROTOCOL');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [contentRes, gatewayRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/cms/content`),
                    axios.get(`${API_BASE_URL}/api/cms/gateway`)
                ]);

                const aboutItems = contentRes.data.filter(c => c.sectionId === 'About');
                const newContent = { ...content };
                aboutItems.forEach(item => {
                    if (item.key === 'mission_protocol_heading') setHeading(item.value);
                    else if (newContent.hasOwnProperty(item.key)) newContent[item.key] = item.value;
                });
                setContent(newContent);
                setAboutCards(gatewayRes.data.filter(g => g.category === 'ABOUT_CARD'));
                setAboutStrengths(gatewayRes.data.filter(g => g.category === 'ABOUT_STRENGTH'));
            } catch (error) {
                console.error('FAILED_TO_SYNC_ABOUT_CONTENT');
            }
        };
        fetchContent();
    }, []);

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={sectionVariants}
                className="text-center mb-20"
            >
                <h2 className="text-sm font-black tracking-[0.5em] text-aether-gold uppercase mb-4">{heading}</h2>
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
                    {(content.mission_title?.split(' ').slice(0, -2).join(' ')) || 'Harnessing AI for'} <span className="text-gradient">{(content.mission_title?.split(' ').slice(-2).join(' ')) || 'Local Evolution'}</span>
                </h1>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
                {(aboutCards.length > 0 ? aboutCards : [
                    { title: 'Mission & Vision', description: 'Our vision is to become the world’s leading AI Olympiad, shaping the next generation of AI leaders.', icon: 'Target', color: 'text-aether-gold', subtext: '01' },
                    { title: 'Long-Term Goals', description: 'We are building a scalable, multi-revenue, high-impact platform positioned at the intersection of technology.', icon: 'Globe', color: 'text-blue-400', subtext: '02' },
                    { title: 'Core Experience', description: 'Decades of combined technical and strategic expertise in global intelligence markets.', icon: 'ShieldCheck', color: 'text-emerald-400', subtext: '03' }
                ]).sort((a, b) => (a.order || 0) - (b.order || 0)).map((card, i) => (
                    <motion.div
                        key={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={sectionVariants}
                        className="glass p-12 rounded-[3rem] border-white/5 relative group hover:border-white/10 transition-all"
                    >
                        <div className="absolute top-8 right-8 text-[4rem] font-black opacity-[0.03] group-hover:opacity-[0.08] transition-all uppercase">{card.subtext}</div>
                        <div className={`mb - 6 ${card.color || 'text-aether-gold'} `}>
                            <DynamicIcon name={card.icon} size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">{card.title}</h3>
                        <p className="text-slate-400 leading-relaxed font-light text-sm uppercase tracking-tight">
                            {card.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={sectionVariants}
                className="glass p-16 rounded-[4rem] border-white/5 mb-32 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <DynamicIcon name={content.organizer_icon || 'Cpu'} size={200} />
                </div>
                <h3 className="text-3xl font-black text-white uppercase mb-8 tracking-tighter">{content.organizer_title}</h3>
                <p className="text-slate-400 leading-relaxed font-light mb-10 max-w-3xl">
                    {content.organizer_desc}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {(aboutStrengths.length > 0 ? aboutStrengths : [
                        { title: 'Impact', description: 'Solving tangible problems in local infrastructures.' },
                        { title: 'Innovation', description: 'Pushing the boundaries of what AI can achieve locally.' },
                        { title: 'Collaboration', description: 'Uniting tech, finance, and marketing expertise.' }
                    ]).sort((a, b) => (a.order || 0) - (b.order || 0)).map((item, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div className="w-12 h-1 bg-aether-gold/30 rounded-full"></div>
                            <h4 className="font-black text-white uppercase tracking-widest text-xs">{item.title}</h4>
                            <p className="text-slate-500 text-sm font-light leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
