import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, MessageSquare, Send, MapPin, Globe, Phone, Clock, ArrowRight, Github, Twitter, Linkedin, Youtube, Disc as Discord, Shield, CheckCircle2 as CheckCircle, AlertCircle,
    Target, Palette, Award, FileText, Database, ShieldCheck, Settings, X, Save, Trash2, TrendingUp, Users, Cpu, Globe2, ShieldAlert,
    PenTool, Briefcase, GraduationCap, Rocket, BarChart3, Wine, Landmark, Coins, Lock, FileCheck, Unlock, Smartphone, Calendar
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const DynamicIcon = ({ name, ...props }) => {
    const Icons = {
        Mail, MessageSquare, Twitter, Linkedin, Github, MapPin, Calendar, Clock, Target,
        Palette, Award, FileText, Database, ShieldCheck, Settings, X, Save, Trash2,
        TrendingUp, Users, Cpu, Globe2, ShieldAlert, Send, CheckCircle, ArrowRight,
        PenTool, Briefcase, GraduationCap, Rocket, BarChart3, Wine, Globe,
        Landmark, Coins, Lock, FileCheck, Unlock, Smartphone
    };
    const IconComponent = Icons[name] || Mail;
    return <IconComponent {...props} />;
};

export default function Contact() {
    const [formData, setFormData] = useState({
        guestName: '',
        email: '',
        teamId: '',
        dietaryPreferences: 'None',
        specialRequirements: '',
        guestCount: 1
    });
    const [transmissionStatus, setTransmissionStatus] = useState('idle'); // idle, sending, success
    const [rsvpStatus, setRsvpStatus] = useState('idle'); // idle, loading, success
    const [contactNodes, setContactNodes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [cmsContent, setCmsContent] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contactRes, gatewayRes, contentRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/cms/contact`),
                    axios.get(`${API_BASE_URL}/api/cms/gateway`),
                    axios.get(`${API_BASE_URL}/api/cms/content?sectionId=Contact`)
                ]);

                setContactNodes(contactRes.data);
                setLocations(gatewayRes.data.filter(g => g.category === 'LOCATION'));

                const contentMap = {};
                contentRes.data.forEach(item => {
                    contentMap[item.key] = item.value;
                });
                setCmsContent(contentMap);
            } catch (error) {
                console.error('FAILED_TO_SYNC_CONTACT_DATA');
            }
        };
        fetchData();
    }, []);

    const getContent = (key, fallback) => cmsContent[key] || fallback;

    const directNodes = contactNodes.filter(n => n.type === 'LINK');
    const socialNodes = contactNodes.filter(n => n.type === 'SOCIAL');

    const handleRsvpSubmit = async (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            teamId: formData.teamId.trim()
        };
        setRsvpStatus('loading');
        try {
            await axios.post(`${API_BASE_URL}/api/gala/rsvp`, submissionData);
            setRsvpStatus('success');
        } catch (error) {
            const msg = error.response?.data?.message || 'Security Sync Error: Verify your connection.';
            alert(msg);
            setRsvpStatus('idle');
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-sm font-black tracking-[0.5em] text-aether-gold uppercase mb-4">{getContent('page_subheading', 'Comms_Terminal')}</h2>
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
                    {getContent('hero_title', 'ESTABLISH LINK')}
                </h1>
                <p className="text-slate-400 mt-4 max-w-2xl mx-auto uppercase tracking-widest text-[10px] font-mono">
                    {getContent('hero_description', 'Initiate a secure neural connection.')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                <div className="glass p-12 rounded-[3.5rem] border-white/5">
                    <h3 className="text-2xl font-black text-white uppercase mb-8 tracking-tight">{getContent('form_title', 'Send Transmission')}</h3>
                    <AnimatePresence mode="wait">
                        {transmissionStatus === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-[400px] flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-500">
                                    <CheckCircle size={40} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-[0.3em]">{getContent('form_success_heading', 'Transmission_Stored')}</h4>
                                <p className="text-slate-500 text-xs font-mono tracking-widest leading-relaxed uppercase">
                                    PROTOCOL_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}<br />
                                    SIGNAL_STRENGTH: 100%
                                </p>
                                <button
                                    onClick={() => setTransmissionStatus('idle')}
                                    className="px-8 py-3 bg-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                                >
                                    NEW_UPLINK
                                </button>
                            </motion.div>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setTransmissionStatus('sending');
                                    setTimeout(() => setTransmissionStatus('success'), 2500);
                                }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{getContent('label_name', 'Identifier')}</label>
                                        <input type="text" placeholder={getContent('placeholder_name', 'Full Name')} required className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-aether-gold transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{getContent('label_email', 'Neural_Address')}</label>
                                        <input type="email" placeholder={getContent('placeholder_email', 'email@domain.com')} required className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-aether-gold transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{getContent('label_message', 'Payload')}</label>
                                    <textarea rows="5" placeholder={getContent('placeholder_message', 'Your message...')} required className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-aether-gold transition-colors resize-none"></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={transmissionStatus === 'sending'}
                                    className="w-full py-6 bg-white text-slate-950 font-black text-[11px] tracking-[0.4em] uppercase rounded-2xl hover:bg-aether-gold hover:text-white transition-all flex items-center justify-center gap-4 relative overflow-hidden group"
                                >
                                    {transmissionStatus === 'sending' ? (
                                        <span className="flex items-center gap-3">
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                                <Send size={16} />
                                            </motion.div>
                                            UPLINKING...
                                        </span>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            <span>{getContent('btn_submit_text', 'EXECUTE_SEND')}</span>
                                        </>
                                    )}
                                    {transmissionStatus === 'sending' && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-1 bg-aether-gold"
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 2.5 }}
                                        />
                                    )}
                                </button>
                            </form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-col gap-12">
                    <div className="glass p-12 rounded-[3.5rem] border-white/5 flex-1">
                        <h3 className="text-2xl font-black text-white uppercase mb-8 tracking-tight">{getContent('direct_connect_heading', 'Direct Connect')}</h3>
                        <div className="space-y-8">
                            {(directNodes.length > 0 ? directNodes : [
                                { label: 'Protocol', value: 'ops@britsync.com', icon: 'Mail', redirectUrl: 'mailto:ops@britsync.com' },
                                { label: 'Support', value: 'Discord_Syndicate', icon: 'MessageSquare', redirectUrl: 'https://discord.gg/' }
                            ]).map((node, i) => (
                                <div
                                    key={i}
                                    onClick={() => node.redirectUrl && window.open(node.redirectUrl, '_blank')}
                                    className="flex items-center gap-6 group cursor-pointer hover:bg-white/5 p-4 -m-4 rounded-2xl transition-all"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-aether-gold transition-all">
                                        <DynamicIcon name={node.icon} className="text-aether-gold" />
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">{node.label}</div>
                                        <div className="text-lg font-black text-white group-hover:text-aether-gold transition-colors">{node.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-12 rounded-[3.5rem] border-white/5">
                        <h3 className="text-2xl font-black text-white uppercase mb-8 tracking-tight">{getContent('social_net_heading', 'Social Net')}</h3>
                        <div className="flex gap-4">
                            {(socialNodes.length > 0 ? socialNodes : [
                                { icon: 'Twitter', redirectUrl: 'https://twitter.com' },
                                { icon: 'Linkedin', redirectUrl: 'https://linkedin.com' },
                                { icon: 'Github', redirectUrl: 'https://github.com' }
                            ]).map((node, i) => (
                                <button
                                    key={i}
                                    onClick={() => node.redirectUrl && window.open(node.redirectUrl, '_blank')}
                                    className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:border-aether-gold hover:bg-white/10 transition-all group"
                                >
                                    <DynamicIcon name={node.icon} className="text-white group-hover:scale-110 transition-transform" size={24} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Geospatial Nodes Section */}
            <div className="mt-32">
                <div className="text-center mb-20">
                    <h2 className="text-[10px] font-black tracking-[0.4em] text-aether-gold uppercase mb-4">{getContent('geospatial_subheading', 'Global_Relay_Infrastructure')}</h2>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">GEOSPATIAL <span className="text-gradient">NODES</span></h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(locations.length > 0 ? locations : [
                        { title: 'LONDON_HUB', subtext: 'COORDINATION_CENTER', description: 'Central nexus for global AI syndicate operations.', icon: 'MapPin', color: 'text-aether-gold' },
                        { title: 'SINGAPORE_NODE', subtext: 'APAC_GATEWAY', description: 'Primary technical infrastructure for Southeast Asian markets.', icon: 'Globe', color: 'text-blue-400' },
                        { title: 'NEW_YORK_GATEWAY', subtext: 'AMERICAS_SYNDICATE', description: 'Strategic coordination for North American partnerships.', icon: 'Zap', color: 'text-rose-400' }
                    ]).map((node, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-10 rounded-[3rem] border-white/5 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all">
                                <DynamicIcon name={node.icon} size={120} />
                            </div>
                            <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-8 ${node.color || 'text-aether-gold'} group-hover:border-white/20 transition-all`}>
                                <DynamicIcon name={node.icon} size={28} />
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">{node.subtext}</div>
                            <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">{node.title}</h3>
                            <p className="text-sm text-slate-400 font-light leading-relaxed uppercase tracking-tight">
                                {node.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Centered Grand Finale Section */}
            <div className="mt-40 border-t border-white/5 pt-32">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-slate-950/60 border border-white/5 mb-8"
                    >
                        <span className="text-[10px] font-mono tracking-[0.4em] text-aether-gold uppercase font-black">{getContent('gala_strip_text', 'PRIME_INTAKE // THE_ROYAL_GALA')}</span>
                    </motion.div>
                    <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-none">{getContent('gala_heading', 'THE GRAND FINALE')}</h2>
                    <p className="text-slate-400 font-light text-xl max-w-2xl mx-auto uppercase tracking-wider">{getContent('gala_description', 'Join the global syndicate for an immersive evening of celebration and tech-strategy.')}</p>
                </div>

                {/* Centered Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-5xl mx-auto">
                    {[
                        { icon: MapPin, label: getContent('gala_label_territory', 'TERRITORY'), val: getContent('event_location', 'Royal Museum, London') },
                        { icon: Calendar, label: getContent('gala_label_temporal', 'TEMPORAL'), val: getContent('event_date', 'SEPT 12, 2026') },
                        { icon: Clock, label: getContent('gala_label_protocol', 'PROTOCOL_X'), val: getContent('event_time', '19:00 GMT') },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-10 rounded-[3rem] border-white/5 text-center flex flex-col items-center gap-6 group hover:border-aether-gold/30 transition-all"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-white/10 flex items-center justify-center text-aether-gold group-hover:bg-aether-gold group-hover:text-white transition-all">
                                <item.icon size={32} />
                            </div>
                            <div>
                                <div className="text-[9px] font-mono text-slate-600 uppercase font-black tracking-[0.4em] mb-2">{item.label}</div>
                                <div className="text-xl font-black text-white uppercase tracking-tight">{item.val}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* RSVP Form Card - Centered */}
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {rsvpStatus !== 'success' ? (
                            <motion.form
                                key="rsvp-form"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                onSubmit={handleRsvpSubmit}
                                className="glass-luxury p-12 md:p-20 rounded-[4rem] border-white/10 space-y-12 bg-slate-950/80 shadow-2xl"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-500 ml-2 uppercase tracking-[0.3em] font-mono">{getContent('rsvp_label_id', 'IDENTITY_HANDLE')}</label>
                                        <input
                                            type="text"
                                            value={formData.guestName}
                                            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                            className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:border-aether-gold outline-none transition-all text-lg font-black text-white"
                                            placeholder={getContent('rsvp_placeholder_name', 'FULL NAME')}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-500 ml-2 uppercase tracking-[0.3em] font-mono">{getContent('rsvp_label_email', 'NETWORK_EPILOGUE')}</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:border-aether-gold outline-none transition-all text-lg font-black text-white"
                                            placeholder={getContent('rsvp_placeholder_email', 'EMAIL ADDRESS')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-slate-500 ml-2 uppercase tracking-[0.3em] font-mono">{getContent('rsvp_label_coord', 'ACCESS_COORDINATE (TEAM_ID / NAME)')}</label>
                                    <input
                                        type="text"
                                        placeholder={getContent('rsvp_placeholder_coord', 'REQUIRED_FOR_ENTRY')}
                                        value={formData.teamId}
                                        onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                                        className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:border-aether-gold outline-none transition-all text-lg font-black text-white"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-500 ml-2 uppercase tracking-[0.3em] font-mono">{getContent('rsvp_label_diet', 'DIETARY_SYNERGY')}</label>
                                        <select
                                            value={formData.dietaryPreferences}
                                            onChange={(e) => setFormData({ ...formData, dietaryPreferences: e.target.value })}
                                            className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:border-aether-gold outline-none transition-all text-base font-black text-white appearance-none uppercase"
                                        >
                                            <option value="None">DEFAULT_PROTOCOL</option>
                                            <option value="Vegetarian">VEGETARIAN_NODE</option>
                                            <option value="Vegan">VEGAN_NODE</option>
                                            <option value="Halal">HALAL_NODE</option>
                                            <option value="Gluten-Free">GLUTEN_FREE_NODE</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-500 ml-2 uppercase tracking-[0.3em] font-mono">{getContent('rsvp_label_capacity', 'NODE_CAPACITY (MAX_05)')}</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={formData.guestCount}
                                            onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 1 })}
                                            className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-8 py-5 focus:border-aether-gold outline-none transition-all text-lg font-black text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={rsvpStatus === 'loading'}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-white text-slate-950 py-8 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase shadow-2xl hover:bg-aether-gold hover:text-white transition-all flex items-center justify-center gap-4"
                                >
                                    {rsvpStatus === 'loading' ? 'ESTABLISHING_SYNC...' : <><Send size={18} /> {getContent('rsvp_btn_text', 'REQUEST_GALA_CREDENTIAL')}</>}
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success-rsvp"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass p-16 rounded-[4rem] border-white/10 bg-slate-900/60 text-center flex flex-col items-center justify-center shadow-2xl min-h-[500px]"
                            >
                                <div className="w-24 h-24 bg-emerald-500 text-slate-950 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                                    <CheckCircle size={48} />
                                </div>
                                <h3 className="text-4xl font-black text-white uppercase mb-6 tracking-tighter">{getContent('rsvp_success_heading', 'PROTOCOL SYNCHRONIZED')}</h3>
                                <p className="text-slate-400 font-light text-lg max-w-md mb-12 uppercase tracking-tight">{getContent('rsvp_success_text', 'Your reservation for the Royal Gala is logged. Digital credentials pending.')}</p>
                                <button
                                    onClick={() => setRsvpStatus('idle')}
                                    className="px-12 py-6 bg-slate-950 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all"
                                >
                                    NEW_SYNC_REQUEST
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

