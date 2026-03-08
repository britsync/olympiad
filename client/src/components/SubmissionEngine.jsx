import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2 as CheckCircle, AlertCircle, Loader2, Play, Globe, Shield, ArrowUp } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

export default function SubmissionEngine() {
    const [file, setFile] = useState(null);
    const [videoLink, setVideoLink] = useState('');
    const [teamId, setTeamId] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [serverStatus, setServerStatus] = useState('checking'); // checking, online, offline
    const [results, setResults] = useState(null);

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

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            alert('Please upload a PDF document.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanTeamId = teamId.trim();
        if (!file || !cleanTeamId) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('teamId', cleanTeamId);
        formData.append('videoLink', videoLink);
        formData.append('category', category);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/submissions/submit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResults(response.data);
            setStatus('success');
        } catch (error) {
            console.error(error);
            let msg = 'Error submitting project';
            if (!error.response && error.code === 'ERR_NETWORK') {
                msg = 'SERVER_OFFLINE: Could not reach the transmission node.';
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            }
            setResults({ error: msg });
            setStatus('error');
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto py-32 px-6 min-h-screen relative overflow-hidden">
            {/* Ambient Multi-Layered Glows */}
            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-aether-gold/5 rounded-full blur-[180px] -z-10 animate-float opacity-30"></div>
            <div className="absolute -bottom-40 -left-40 w-[1200px] h-[1200px] bg-aether-soft/10 rounded-full blur-[200px] -z-10"></div>

            <div className="text-center mb-32 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: 'circOut' }}
                    className="inline-block p-1 bg-gradient-to-br from-aether-gold/40 via-transparent to-aether-gold/40 rounded-[3rem] mb-12 shadow-[0_0_50px_rgba(197,160,89,0.1)]"
                >
                    <div className="bg-slate-950 p-8 rounded-[2.8rem] text-aether-gold relative group">
                        <div className="absolute inset-0 bg-aether-gold/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Upload size={48} strokeWidth={1.5} className="relative z-10" />
                    </div>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-7xl md:text-9xl font-black tracking-tighter mb-10 text-white leading-[0.8] uppercase select-none"
                >
                    PROJECT<br /><span className="text-gradient">TRANSMISSION</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-500 font-mono text-[10px] tracking-[0.8em] uppercase font-black px-12 py-4 bg-slate-950/80 border border-white/5 inline-block rounded-full shadow-2xl"
                >
                    NODAL_INTAKE_MODULE_v4.2.0
                </motion.p>
            </div>

            <div className="glass p-2 rounded-[5.5rem] border-white/5 relative bg-slate-950/40 shadow-[0_120px_200px_-60px_rgba(0,0,0,0.8)]">
                <div className="absolute top-16 right-16 hidden lg:flex items-center gap-6 text-[11px] font-black tracking-[0.6em] font-mono group">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                className={`w-1.5 h-1.5 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500' : serverStatus === 'offline' ? 'bg-red-500' : 'bg-amber-500'}`}
                            />
                        ))}
                    </div>
                    <span className={serverStatus === 'online' ? 'text-emerald-500' : serverStatus === 'offline' ? 'text-red-500' : 'text-amber-500'}>
                        {serverStatus === 'online' ? 'SECURE_CHANNELS_ENGAGED' : serverStatus === 'offline' ? 'CHANNELS_OFFLINE' : 'ESTABLISHING_SYNC'}
                    </span>
                </div>

                <div className="p-10 md:p-20">
                    <AnimatePresence mode="wait">
                        {status === 'idle' || status === 'error' ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                onSubmit={handleSubmit}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start"
                            >
                                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="group relative"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-aether-gold/0 via-aether-gold/5 to-aether-gold/0 rounded-3xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-700"></div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="ENTER_SYNDICATE_HANDLE (e.g. 65b1...)"
                                                value={teamId}
                                                onChange={(e) => setTeamId(e.target.value)}
                                                className="w-full bg-slate-900/60 border border-white/5 rounded-[2.5rem] px-12 py-10 focus:border-aether-gold outline-none transition-all text-2xl font-black text-white shadow-inner placeholder:text-slate-800 uppercase tracking-tight"
                                                required
                                            />
                                            <label className="absolute -top-4 left-10 px-4 bg-slate-950 text-[9px] font-black tracking-[0.5em] text-aether-gold uppercase font-mono group-focus-within:scale-110 transition-transform origin-left">NODE_ID_STAMP (SYNDICATE_HANDLE)</label>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="group relative"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-aether-gold/0 via-aether-gold/5 to-aether-gold/0 rounded-3xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-700"></div>
                                        <div className="relative">
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-slate-900/60 border border-white/5 rounded-[2.5rem] px-12 py-10 focus:border-aether-gold outline-none transition-all text-2xl font-black text-white shadow-inner appearance-none cursor-pointer uppercase tracking-tight"
                                                required
                                            >
                                                <option value="" disabled className="bg-slate-900 text-slate-700">SELECT_CATEGORY</option>
                                                <option value="Startup" className="bg-slate-900">STARTUP_CORE</option>
                                                <option value="Project" className="bg-slate-900">GENERAL_PROJECT</option>
                                            </select>
                                            <label className="absolute -top-4 left-10 px-4 bg-slate-950 text-[9px] font-black tracking-[0.5em] text-aether-gold uppercase font-mono group-focus-within:scale-110 transition-transform origin-left">PAYLOAD_CLASS</label>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="group relative md:col-span-2"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-aether-gold/0 via-aether-gold/5 to-aether-gold/0 rounded-3xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-700"></div>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                placeholder="PITCH_VIDEO_EXTERNAL_STREAM"
                                                value={videoLink}
                                                onChange={(e) => setVideoLink(e.target.value)}
                                                className="w-full bg-slate-900/60 border border-white/5 rounded-[2.5rem] px-12 py-10 focus:border-aether-gold outline-none transition-all text-2xl font-black text-white shadow-inner placeholder:text-slate-800 uppercase tracking-tight"
                                            />
                                            <label className="absolute -top-4 left-10 px-4 bg-slate-950 text-[9px] font-black tracking-[0.5em] text-aether-gold uppercase font-mono group-focus-within:scale-110 transition-transform origin-left">MEDIA_EPILOGUE_URI</label>
                                        </div>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="lg:col-span-8 group"
                                >
                                    <div
                                        className={`border-4 border-dashed rounded-[5rem] p-20 md:p-40 flex flex-col items-center justify-center transition-all duration-1000 group-hover:bg-slate-900/60 relative overflow-hidden bg-slate-950/20 ${file ? 'border-aether-gold bg-slate-900/80 shadow-[0_60px_150px_-30px_rgba(0,0,0,1)]' : 'border-slate-800 hover:border-aether-gold/40'}`}
                                    >
                                        {/* Scanning Animation for selected file */}
                                        <AnimatePresence>
                                            {file && (
                                                <motion.div
                                                    initial={{ top: '-10%' }}
                                                    animate={{ top: '110%' }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                                    className="absolute left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-aether-gold to-transparent shadow-[0_0_40px_rgba(197,160,89,1)] z-10"
                                                />
                                            )}
                                        </AnimatePresence>

                                        {/* Background Grid for tech feel */}
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                            <div className="h-full w-full bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:40px_40px]"></div>
                                        </div>

                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="pdf-upload"
                                        />
                                        <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center group/label z-20">
                                            <motion.div
                                                className={`p-14 rounded-[3.5rem] mb-12 transition-all duration-1000 ${file ? 'bg-aether-gold text-white scale-110 shadow-[0_0_60px_rgba(197,160,89,0.3)]' : 'bg-slate-900 border border-white/5 text-slate-700 hover:text-aether-gold hover:scale-105'}`}
                                                animate={file ? {
                                                    boxShadow: ["0 0 40px rgba(197,160,89,0.2)", "0 0 80px rgba(197,160,89,0.5)", "0 0 40px rgba(197,160,89,0.2)"]
                                                } : {}}
                                                transition={{ repeat: Infinity, duration: 4 }}
                                            >
                                                <FileText size={80} strokeWidth={0.5} />
                                            </motion.div>
                                            <span className="text-3xl md:text-5xl font-black text-white tracking-tighter text-center uppercase leading-none mb-8 group-hover/label:text-aether-gold transition-colors block max-w-xl truncate">
                                                {file ? file.name : 'UPLOAD_PAYLOAD_CORE'}
                                            </span>
                                            <div className="flex items-center gap-6">
                                                <span className="text-[11px] text-slate-500 font-mono font-black tracking-[0.6em] uppercase flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div> PDF_ONLY_ENCODING
                                                </span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                                                <span className="text-[11px] text-slate-500 font-mono font-black tracking-[0.6em] uppercase">50MB_MAX</span>
                                            </div>
                                        </label>
                                    </div>
                                </motion.div>

                                <div className="lg:col-span-4 self-stretch flex flex-col gap-12">
                                    <div className="glass bg-slate-950/80 p-14 rounded-[4rem] border border-white/5 flex-1 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-aether-gold rotate-12">
                                            <Shield size={180} />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-12 tracking-tighter uppercase relative z-10">TRANSMISSION_METRICS</h3>
                                        <div className="space-y-12 relative z-10">
                                            {[
                                                { label: 'BANDWIDTH', val: '98.2%', color: 'bg-aether-gold' },
                                                { label: 'INTEGRITY', val: 'SECURE', color: 'bg-emerald-500' },
                                                { label: 'LATENCY', val: '12ms', color: 'bg-sky-500' }
                                            ].map((stat, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-[11px] font-mono mb-4 font-black">
                                                        <span className="text-slate-500 tracking-[0.4em]">{stat.label}</span>
                                                        <span className="text-white">{stat.val}</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner border border-white/5">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: i === 0 ? '98%' : i === 1 ? '100%' : '15%' }}
                                                            className={`h-full ${stat.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={!file || !teamId}
                                        whileHover={file ? { scale: 1.02, y: -5 } : {}}
                                        whileTap={file ? { scale: 0.98 } : {}}
                                        className="btn-luxury w-full bg-white text-slate-950 font-black py-12 rounded-[4.5rem] tracking-[0.8em] text-2xl shadow-[0_60px_100px_-30px_rgba(0,0,0,0.8)] transition-all disabled:opacity-30 disabled:grayscale uppercase flex flex-col items-center justify-center gap-2 group hover:bg-aether-gold hover:text-white"
                                    >
                                        <span className="text-[10px] tracking-[0.5em] opacity-40 mb-2">ENGAGE_PROTOCOL</span>
                                        <div className="flex items-center gap-6">
                                            INITIATE <ArrowUp size={28} className="group-hover:-translate-y-2 transition-transform duration-700" />
                                        </div>
                                    </motion.button>
                                </div>

                                {status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="lg:col-span-12 p-12 rounded-[3.5rem] bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[12px] font-black font-mono text-center tracking-[0.5em] uppercase shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-rose-500/5 animate-pulse"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-6">
                                            <AlertCircle size={24} /> VAL_FAILURE: {results?.error || 'INTEGRITY_CHECK_FAILED'}
                                        </span>
                                    </motion.div>
                                )}
                            </motion.form>
                        ) : status === 'uploading' ? (
                            <motion.div
                                key="uploading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-32 flex flex-col items-center justify-center space-y-16"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-aether-gold/20 blur-3xl animate-pulse"></div>
                                    <Loader2 className="animate-spin text-aether-gold relative z-10" size={100} strokeWidth={1} />
                                </div>
                                <div className="text-center space-y-6">
                                    <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">STRATEGIC_SYNC_PENDING</h3>
                                    <p className="text-[12px] text-slate-500 font-mono font-black tracking-[0.6em] animate-pulse">EXTRACTING_SEMANTIC_MARKERS // AUDITING...</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <motion.div
                                    className="inline-flex p-12 rounded-[4rem] bg-slate-950 border border-emerald-500/30 text-emerald-500 mb-16 shadow-2xl relative group"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                >
                                    <div className="absolute inset-0 bg-emerald-500/10 blur-3xl opacity-50"></div>
                                    <CheckCircle size={80} className="relative z-10" />
                                </motion.div>
                                <h3 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter text-white uppercase leading-[0.8] select-none">VALIDATION<br /><span className="text-emerald-500">SYNCHRONIZED</span></h3>

                                <div className="inline-block px-12 py-4 rounded-full text-[12px] font-black tracking-[0.5em] mb-20 shadow-2xl bg-emerald-500 text-white uppercase border border-emerald-400/50">
                                    STATUS: {results?.validationStatus?.toUpperCase() || 'ACCEPTED'}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 text-left">
                                    <div className="bg-slate-950/60 p-12 md:p-16 rounded-[4rem] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                                            <Globe size={160} />
                                        </div>
                                        <h4 className="text-[11px] font-black font-mono text-slate-500 uppercase mb-10 tracking-[0.5em] flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-aether-gold animate-pulse"></div> SEMANTIC_MARKERS
                                        </h4>
                                        <div className="flex flex-wrap gap-4 relative z-10">
                                            {results?.foundKeywords?.map(kw => (
                                                <span key={kw} className="px-6 py-3 bg-slate-900 border border-white/5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-[0.3em] text-aether-gold shadow-2xl hover:bg-aether-gold hover:text-white transition-all cursor-default">
                                                    {kw}
                                                </span>
                                            )) || <span className="text-xl text-slate-600 font-light italic">NO SEMANTIC MARKERS DETECTED...</span>}
                                        </div>
                                    </div>
                                    <div className="bg-slate-950/60 p-12 md:p-16 rounded-[4rem] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                                            <Shield size={160} />
                                        </div>
                                        <h4 className="text-[11px] font-black font-mono text-slate-500 uppercase mb-10 tracking-[0.5em] flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> EXECUTIVE_AUDIT_LOG
                                        </h4>
                                        <p className="text-xl font-light leading-relaxed uppercase tracking-tight text-slate-400 relative z-10">
                                            {results?.validationStatus === 'Validated'
                                                ? 'PAYLOAD PASSES ALL STRUCTURAL INTEGRITY MARKERS. SYNCHRONIZED WITH GLOBAL SYNDICATE LEDGER.'
                                                : 'STRATEGIC MARKERS BELOW PEER-REVIEW THRESHOLD. PHASE-02 MANUAL OVERRIDE PROTOCOL ACTIVATED.'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStatus('idle')}
                                    className="px-20 py-8 bg-slate-950 border border-white/10 rounded-[2.5rem] text-[11px] font-black text-slate-500 hover:text-white hover:border-white/30 transition-all uppercase tracking-[0.5em] shadow-2xl"
                                >
                                    REPLICATE_INTAKE_PROTOCOL
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
