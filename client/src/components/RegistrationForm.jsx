import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Globe, Briefcase, CheckCircle2 as CheckCircle, Shield, ArrowRight, Copy, Check, Rocket } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
import confetti from 'canvas-confetti';
import axios from 'axios';

export default function RegistrationForm({ onComplete, onNavigate }) {
    const [step, setStep] = useState(1); // 1 = Form, 2 = Success
    const [registeredId, setRegisteredId] = useState(null);
    const [serverStatus, setServerStatus] = useState('checking'); // checking, online, offline
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNo: '',
        country: '',
        department: 'Individual' // Default
    });
    const [copied, setCopied] = useState(false);

    React.useEffect(() => {
        const checkStatus = async () => {
            try {
                await axios.get(`${API_BASE_URL}/`);
                setServerStatus('online');
            } catch (error) {
                setServerStatus('offline');
            }
        };
        checkStatus();
    }, []);

    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
        "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
        "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
        "Denmark", "Djibouti", "Dominica", "Dominican Republic",
        "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
        "Fiji", "Finland", "France",
        "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
        "Haiti", "Honduras", "Hungary",
        "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
        "Jamaica", "Japan", "Jordan",
        "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
        "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
        "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
        "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
        "Oman",
        "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
        "Qatar",
        "Romania", "Russia", "Rwanda",
        "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
        "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
        "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
        "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
        "Yemen",
        "Zambia", "Zimbabwe"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/teams/register`, formData);
            if (response.data.teamId) {
                setRegisteredId(response.data.teamId);
                localStorage.setItem('gaio_registered_id', response.data.teamId);
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#fbbf24', '#0f172a', '#ffffff']
                });
                setStep(2);
                if (onComplete) setTimeout(onComplete, 15000);
            }
        } catch (error) {
            let errorMsg = 'Registration system syncing. Please retry.';
            if (!error.response && error.code === 'ERR_NETWORK') {
                errorMsg = 'CRITICAL_FAILURE: Backend node unreachable. Please ensure the server is active.';
            } else if (error.response?.data?.message) {
                errorMsg = `REGISTRATION_REJECTED: ${error.response.data.message}`;
            }
            alert(errorMsg);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto pt-40 pb-12 md:py-32 px-4 md:px-6 min-h-screen relative overflow-hidden">
            {/* Ambient Multi-Layered Glows */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-aether-gold/5 rounded-full blur-[150px] -z-10 animate-float opacity-50"></div>
            <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-aether-soft/20 rounded-full blur-[200px] -z-10" style={{ animationDelay: '5s' }}></div>

            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-slate-950/60 backdrop-blur-2xl border border-white/10 mb-8 shadow-2xl"
                >
                    <span className="text-[10px] md:text-[11px] font-mono tracking-[0.6em] text-aether-gold uppercase font-black">INTAKE_NODE // GLOBAL_SYNDICATE_INIT</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white leading-[0.85] uppercase select-none"
                >
                    UNIT <span className="text-gradient">GENESIS</span>
                </motion.h2>
            </div>

            <div className="glass p-1 rounded-[3rem] relative overflow-hidden bg-slate-950/40 shadow-[0_100px_150px_-50px_rgba(0,0,0,0.5)] border-white/5 max-w-7xl mx-auto grid md:grid-cols-12 gap-0">

                {/* Visual Side Panel - Right on Desktop (or Left depending on preference, user said "right side of the form", usually meaning visuals are separate) */}
                {/* User said: "registration you remved dome styling which was one the right side of the form i want those back" */}
                {/* So Form is Left, Visuals are Right? Or Form is Right, Visuals are Left? */}
                {/* Standard layouts often have Form Left, Visuals Right. I will implement Form Left, Visuals Right. */}

                {/* Form Section */}
                <div className="md:col-span-7 p-4 sm:p-8 md:p-16 relative z-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                onSubmit={handleSubmit}
                                className="space-y-6 md:space-y-8 p-6 sm:p-10 bg-slate-900/40 backdrop-blur-md rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group/form"
                            >
                                <div className="space-y-2 mb-10 text-center md:text-left relative z-10">
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                                        Registration <span className="text-aether-gold">Form</span>
                                    </h3>
                                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Global AI Olympiad Participation Node.</p>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div className="group relative">
                                        <div className="relative overflow-hidden rounded-2xl group-within:shadow-[0_0_30px_rgba(197,160,89,0.1)] transition-shadow">
                                            <input
                                                type="text"
                                                className="peer w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-5 pl-14 focus:border-aether-gold/50 focus:ring-1 focus:ring-aether-gold/20 outline-none transition-all text-lg font-bold text-white placeholder-transparent uppercase tracking-tight"
                                                placeholder=" "
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                            <label
                                                htmlFor="name"
                                                className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs uppercase tracking-widest transition-all pointer-events-none
                                                peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-aether-gold
                                                peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-aether-gold"
                                            >
                                                FULL_NAME
                                            </label>
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-aether-gold transition-colors" size={20} />
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <div className="relative overflow-hidden rounded-2xl group-within:shadow-[0_0_30px_rgba(197,160,89,0.1)] transition-shadow">
                                            <input
                                                type="email"
                                                className="peer w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-5 pl-14 focus:border-aether-gold/50 focus:ring-1 focus:ring-aether-gold/20 outline-none transition-all text-lg font-bold text-white placeholder-transparent tracking-tight"
                                                placeholder=" "
                                                id="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                            <label
                                                htmlFor="email"
                                                className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs uppercase tracking-widest transition-all pointer-events-none
                                                peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-aether-gold
                                                peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-aether-gold"
                                            >
                                                EMAIL_ADDRESS
                                            </label>
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-aether-gold transition-colors" size={20} />
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <div className="relative overflow-hidden rounded-2xl group-within:shadow-[0_0_30px_rgba(197,160,89,0.1)] transition-shadow">
                                            <input
                                                type="text"
                                                className="peer w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-5 pl-14 focus:border-aether-gold/50 focus:ring-1 focus:ring-aether-gold/20 outline-none transition-all text-lg font-bold text-white placeholder-transparent uppercase tracking-tight"
                                                placeholder=" "
                                                id="contactNo"
                                                value={formData.contactNo}
                                                onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                                                required
                                            />
                                            <label
                                                htmlFor="contactNo"
                                                className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs uppercase tracking-widest transition-all pointer-events-none
                                                peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-aether-gold
                                                peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-aether-gold"
                                            >
                                                CONTACT_NUMBER
                                            </label>
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-aether-gold transition-colors" size={20} />
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <div className="relative overflow-hidden rounded-2xl group-within:shadow-[0_0_30px_rgba(197,160,89,0.1)] transition-shadow">
                                            <select
                                                className="peer w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-5 pl-14 focus:border-aether-gold focus:ring-1 focus:ring-aether-gold/50 outline-none transition-all text-lg font-bold text-white uppercase tracking-tight appearance-none cursor-pointer"
                                                id="country"
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                required
                                            >
                                                <option value="" className="text-slate-900 bg-slate-900" hidden></option>
                                                {countries.map(c => (
                                                    <option key={c} value={c} className="text-white bg-slate-900">{c.toUpperCase()}</option>
                                                ))}
                                            </select>
                                            <label
                                                htmlFor="country"
                                                className={`absolute left-14 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs uppercase tracking-widest transition-all pointer-events-none
                                                ${formData.country ? 'top-3 text-[10px] text-aether-gold' : 'peer-focus:top-3 peer-focus:text-[10px] peer-focus:text-aether-gold'}`}
                                            >
                                                SELECT_COUNTRY
                                            </label>
                                            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-aether-gold transition-colors" size={20} />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <ArrowRight size={16} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em] pl-2">Select Registration Tier</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                { id: 'Individual', label: 'INDIVIDUAL', icon: User, desc: 'Single Participant' },
                                                { id: 'Startup', label: 'STARTUP', icon: Rocket, desc: 'Team Participation' }
                                            ].map((tier) => (
                                                <motion.div
                                                    key={tier.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setFormData({ ...formData, department: tier.id })}
                                                    className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${formData.department === tier.id
                                                        ? 'bg-aether-gold/10 border-aether-gold shadow-[0_0_30px_-10px_rgba(197,160,89,0.3)]'
                                                        : 'bg-slate-950/40 border-white/5 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className={`p-3 rounded-2xl ${formData.department === tier.id ? 'bg-aether-gold text-slate-950' : 'bg-white/5 text-slate-400'}`}>
                                                            <tier.icon size={20} />
                                                        </div>
                                                        {formData.department === tier.id && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-6 h-6 bg-aether-gold rounded-full flex items-center justify-center"
                                                            >
                                                                <Check size={12} className="text-slate-950" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className={`font-black tracking-tight ${formData.department === tier.id ? 'text-white' : 'text-slate-400'}`}>
                                                            {tier.label}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none">
                                                            {tier.desc}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-luxury w-full bg-aether-gold text-slate-950 font-black py-6 rounded-2xl text-lg tracking-[0.3em] flex items-center justify-center gap-4 shadow-[0_0_40px_-10px_rgba(197,160,89,0.4)] hover:shadow-[0_0_60px_-10px_rgba(197,160,89,0.6)] transition-all uppercase group overflow-hidden"
                                    >
                                        <span className="relative z-10">SUBMIT APPLICATION</span>
                                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform duration-500" />
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <motion.div
                                    className="w-24 h-24 bg-slate-950 border border-aether-gold/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative group"
                                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                >
                                    <div className="absolute inset-0 bg-aether-gold/10 blur-3xl opacity-50"></div>
                                    <CheckCircle className="text-aether-gold w-12 h-12 relative z-10" />
                                </motion.div>

                                <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter text-white leading-[0.85] uppercase select-none">
                                    REGISTRATION<br /><span className="text-gradient">SUCCESSFUL</span>
                                </h3>

                                <p className="text-base text-slate-400 mb-8 max-w-lg mx-auto font-light leading-snug uppercase tracking-tight">
                                    Welcome <span className="text-white font-black">{formData.name}</span>. Node secured. Check transmission (email).
                                </p>

                                <div className="flex flex-col items-center justify-center mb-6 bg-slate-950/40 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden max-w-sm mx-auto">
                                    <div className="bg-white p-3 rounded-2xl shadow-2xl mb-6">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=OLYMPIAD-${formData.name}-${registeredId}`} alt="QR" className="w-32 h-32" />
                                    </div>
                                    <div className="w-full text-center space-y-2 font-mono text-[9px] font-black tracking-[0.2em] uppercase text-slate-500">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>NAME</span>
                                            <span className="text-white">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>DEPARTMENT</span>
                                            <span className="text-white">{formData.department}</span>
                                        </div>
                                        <div className="flex justify-between pt-2">
                                            <span>UNIT ID</span>
                                            <span className="text-emerald-500">{registeredId ? registeredId.slice(-6).toUpperCase() : 'PENDING'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Invitation Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 max-w-2xl mx-auto">
                                    <a
                                        href="https://discord.gg/WgAce8B9Gy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-6 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-2xl font-bold tracking-wide transition-colors w-full sm:w-auto justify-center shadow-lg hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3333-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3333-.946 2.4189-2.1568 2.4189z" /></svg>
                                        <div className="text-left leading-tight">
                                            <div className="text-[10px] text-white/70 uppercase">Join Community</div>
                                            <div>Discord</div>
                                        </div>
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/company/britsync"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-6 py-4 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-2xl font-bold tracking-wide transition-colors w-full sm:w-auto justify-center shadow-lg hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                        <div className="text-left leading-tight">
                                            <div className="text-[10px] text-white/70 uppercase">Follow us on</div>
                                            <div>LinkedIn</div>
                                        </div>
                                    </a>
                                </div>

                                <button onClick={() => window.location.reload()} className="text-xs font-mono text-slate-500 hover:text-white transition-colors uppercase tracking-widest mt-6 block mx-auto">
                                    Return to Gateway
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Visual Side Panel */}
                <div className="md:col-span-5 relative overflow-hidden bg-slate-950/80 hidden md:flex flex-col justify-between p-12 border-l border-white/5 group/visuals">
                    {/* Neural Connection SVG Overlay */}
                    <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 400 800" fill="none">
                            <motion.path
                                d="M 50 100 Q 200 400 350 700"
                                stroke="url(#goldGradient)"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.5 }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M 350 150 Q 100 400 50 650"
                                stroke="url(#goldGradient)"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.3 }}
                                transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#c5a059" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#c5a059" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#c5a059" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Neural Matrix Grid Background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(197,160,89,0.15) 1px, transparent 0)',
                            backgroundSize: '30px 30px'
                        }}
                    ></div>

                    {/* Animated Data Fragments (Telemetry) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: Math.random() * 100 + '%', y: '110%', opacity: 0 }}
                                animate={{
                                    y: '-10%',
                                    opacity: [0, 1, 1, 0],
                                    x: (Math.random() * 100 - 10) + '%'
                                }}
                                transition={{
                                    duration: 8 + Math.random() * 12,
                                    repeat: Infinity,
                                    delay: i * 1.5,
                                    ease: "linear"
                                }}
                                className="absolute font-mono text-[9px] text-aether-gold/40 whitespace-nowrap"
                            >
                                {`${Math.random().toString(36).substring(7).toUpperCase()} // CMD_${Math.floor(Math.random() * 999)}`}
                            </motion.div>
                        ))}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-aether-gold/10 via-transparent to-emerald-500/10 opacity-30"></div>

                    {/* Holographic Orbs */}
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 right-1/4 w-32 h-32 bg-aether-gold/20 rounded-full blur-[60px]"
                    ></motion.div>
                    <motion.div
                        animate={{
                            y: [0, 20, 0],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]"
                    ></motion.div>

                    {/* Decorative Elements */}
                    <div className="relative z-20 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-1.5 h-1.5 bg-aether-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,1)]"
                                ></motion.div>
                                <div className="text-[10px] uppercase tracking-[0.5em] text-aether-gold font-mono font-bold brightness-125">AETHER_LINK // ACTIVE</div>
                            </div>
                            <h4 className="text-4xl font-black text-white leading-[0.9] uppercase tracking-tighter">
                                Neural <br />
                                <span className="text-gradient brightness-110">Connection</span>
                            </h4>
                            <div className="w-16 h-1 bg-gradient-to-r from-aether-gold to-transparent mt-5 rounded-full"></div>
                        </motion.div>

                        <div className="space-y-7">
                            {[
                                { text: 'Global Recognition', icon: Globe, detail: 'NETWORK_ID_AUTH' },
                                { text: 'Startup Incubation', icon: Rocket, detail: 'SYNC_PRIORITY_HGH' },
                                { text: 'Ministry Access', icon: Shield, detail: 'SECURE_GATEWAY' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    whileHover={{ x: 10 }}
                                    className="flex items-center gap-6 group/item"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center group-hover/item:border-aether-gold/50 transition-all shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-aether-gold/15 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                                        <div className="absolute -inset-1 bg-aether-gold/5 blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                                        <item.icon size={24} className="text-slate-500 group-hover/item:text-aether-gold transition-colors relative z-10" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="block text-base text-slate-300 font-black uppercase tracking-wide group-hover/item:text-white transition-colors">{item.text}</span>
                                        <span className="block text-[10px] text-aether-gold/40 font-mono uppercase tracking-[0.2em]">{item.detail}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-20 space-y-6">
                        {/* Advanced Terminal Feed */}
                        <div className="p-6 rounded-[2rem] bg-black/60 backdrop-blur-xl border border-white/10 font-mono text-[9px] text-slate-400 relative overflow-hidden h-40 flex flex-col justify-end shadow-2xl">
                            <div className="absolute top-4 left-6 flex gap-1">
                                <div className="w-1 h-1 bg-red-500/50 rounded-full"></div>
                                <div className="w-1 h-1 bg-yellow-500/50 rounded-full"></div>
                                <div className="w-1 h-1 bg-green-500/50 rounded-full"></div>
                            </div>
                            <div className="absolute top-4 right-6 text-[8px] text-aether-gold/60 tracking-widest font-black">SYS_LOGS</div>

                            <div className="space-y-1.5 overflow-hidden">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2"
                                >
                                    <span className="text-aether-gold/70">&gt;</span>
                                    <span>AUTH: [HASH_SEC_772] verified.</span>
                                </motion.div>
                                <div className="flex gap-2 opacity-50">
                                    <span className="text-emerald-500/70">&gt;</span>
                                    <span>DATA: Core packet synchronization...</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-aether-gold/70">&gt;</span>
                                    <span>NET: Uplink established @ 44.2 Gbps</span>
                                </div>
                                <motion.div
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="flex gap-2 text-white font-bold"
                                >
                                    <span className="text-aether-gold/70">&gt;</span>
                                    <span>PENDING: Awaiting user credential input_</span>
                                </motion.div>
                            </div>
                        </div>

                        <div className="p-7 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md border border-white/10 relative group hover:border-aether-gold/40 transition-all duration-500 shadow-xl overflow-hidden">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-12 -right-12 w-24 h-24 border border-aether-gold/5 rounded-full"
                            ></motion.div>
                            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-aether-gold/30 rounded-tr-[2rem] group-hover:w-20 group-hover:h-20 transition-all"></div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-mono mb-3">Network Status</div>
                            <div className="flex items-center gap-3 text-emerald-400 text-sm font-black uppercase tracking-wider">
                                <div className="relative">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute inset-0"></div>
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full relative"></div>
                                </div>
                                <span>Optimization_Complete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}
