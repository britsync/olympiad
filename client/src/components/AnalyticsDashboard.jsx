import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Users, Globe, Building2, Landmark, Zap, Activity, DollarSign, MessageSquare, Terminal, RefreshCw, AlertCircle, Target } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

export default function AnalyticsDashboard() {
    const [activeTab, setActiveTab] = useState('telemetry');
    const [chartData, setChartData] = useState(null);
    const [sponsors, setSponsors] = useState([]);
    const [botStatuses, setBotStatuses] = useState([]);
    const [liveStats, setLiveStats] = useState([
        { label: 'COUNTRIES', value: '0', icon: Globe, color: 'text-blue-500', bgColor: 'bg-blue-500/10', trend: 'GLOBAL' },
        { label: 'STARTUPS', value: '0', icon: Building2, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', trend: 'INCUBATED' },
        { label: 'VISITORS', value: '0', icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-500/10', trend: 'TRAFFIC' },
        { label: 'MINISTRIES', value: '0', icon: Landmark, color: 'text-rose-500', bgColor: 'bg-rose-500/10', trend: 'GOV_NODES' },
    ]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Fetch from the correct endpoint
                const response = await axios.get(`${API_BASE_URL}/api/analytics`);
                if (response.data) {
                    const { countries, startups, visitors, ministryInvolvement } = response.data;

                    // Generate dummy data for chart since backend doesn't provide it yet
                    // To keep the UI intact without errors
                    const labels = [];
                    for (let i = 6; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        labels.push(d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }));
                    }

                    setChartData({
                        engagement: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'ACTIVITY',
                                    data: [12, 19, 15, 25, 22, 30, visitors || 0], // Mock trend + current visitor count
                                    fill: true,
                                    backgroundColor: 'rgba(251, 191, 36, 0.05)',
                                    borderColor: '#fbbf24',
                                    borderWidth: 4,
                                    pointBackgroundColor: '#020617',
                                    pointBorderColor: '#fbbf24',
                                    pointBorderWidth: 2,
                                    tension: 0.4,
                                },
                            ]
                        }
                    });

                    setLiveStats([
                        { label: 'COUNTRIES', value: (countries || 0).toString(), icon: Globe, color: 'text-blue-500', bgColor: 'bg-blue-500/10', trend: 'GLOBAL' },
                        { label: 'STARTUPS', value: (startups || 0).toString(), icon: Building2, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', trend: 'INCUBATED' },
                        { label: 'VISITORS', value: (visitors || 0).toLocaleString(), icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-500/10', trend: 'TRAFFIC' },
                        { label: 'MINISTRIES', value: (ministryInvolvement || 0).toString(), icon: Landmark, color: 'text-rose-500', bgColor: 'bg-rose-500/10', trend: 'GOV_NODES' },
                    ]);
                }
            } catch (error) {
                console.error('Telemetric Sync Error', error);
            }
        };

        const fetchSponsors = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/sponsors`);
                setSponsors(response.data || []);
            } catch (e) {
                setSponsors([]);
            }
        };

        const fetchBotStatuses = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/bots/statuses`);
                setBotStatuses(response.data || []);
            } catch (e) {
                setBotStatuses([]);
            }
        };

        fetchAnalytics();
        fetchSponsors();
        fetchBotStatuses();

        const interval = setInterval(fetchBotStatuses, 10000); // Pulse check every 10s
        return () => clearInterval(interval);
    }, []);

    const handleExport = () => {
        if (!chartData || !liveStats) return;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `GAIO_Telemetry_Report_${timestamp}.csv`;

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'CATEGORY,METRIC,VALUE,TREND\n';

        liveStats.forEach(stat => {
            csvContent += `Live Metrics,${stat.label},"${stat.value}",${stat.trend}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto py-32 px-6 min-h-screen">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20">
                <div className="w-full lg:w-auto">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-white leading-none uppercase">STRATEGIC<br /><span className="text-aether-accent">TELEMETRY</span></h2>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex bg-slate-900 border border-white/5 p-1.5 rounded-2xl">
                            <button
                                onClick={() => setActiveTab('telemetry')}
                                className={`px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black tracking-[0.2em] transition-all uppercase ${activeTab === 'telemetry' ? 'bg-aether-accent text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                TELEMETRY
                            </button>
                            <button
                                onClick={() => setActiveTab('sponsorship')}
                                className={`px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black tracking-[0.2em] transition-all uppercase ${activeTab === 'sponsorship' ? 'bg-aether-accent text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                SPONSORSHIP
                            </button>
                            <button
                                onClick={() => setActiveTab('synapse')}
                                className={`px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black tracking-[0.2em] transition-all uppercase ${activeTab === 'synapse' ? 'bg-aether-accent text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                SYNAPSE_GRID
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleExport}
                    className="hidden sm:flex items-center gap-3 px-8 py-4 bg-slate-900 border border-white/5 rounded-2xl text-[10px] font-black tracking-[0.2em] text-slate-500 hover:text-aether-accent transition-all shadow-sm uppercase group"
                >
                    <MessageSquare size={14} className="group-hover:scale-110 transition-transform" /> EXPORT_REPORT
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'telemetry' ? (
                    <motion.div
                        key="telemetry"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-10"
                    >
                        {/* Stats Grid - Responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {liveStats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass p-8 md:p-10 rounded-[3rem] relative group border-white/10 transition-all duration-500 hover:bg-slate-900/60 overflow-hidden bg-slate-900/40"
                                >
                                    <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 ${stat.color}`}>
                                        <stat.icon size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className={`p-4 rounded-2xl ${stat.bgColor} transition-transform group-hover:scale-110 duration-500`}>
                                                <stat.icon size={28} className={stat.color} />
                                            </div>
                                            <span className={`text-[8px] font-mono font-black tracking-widest px-3 py-1 rounded-full bg-slate-50 text-slate-400`}>
                                                {stat.trend}
                                            </span>
                                        </div>
                                        <div className="text-slate-400 text-[10px] font-mono mb-2 uppercase tracking-widest font-black">{stat.label}</div>
                                        <div className="text-4xl md:text-5xl font-black tracking-tighter text-[#c5a059]">{stat.value}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Charts Area - Responsive */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 glass p-8 md:p-12 rounded-[4rem] border-white/5 overflow-hidden">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                                    <div>
                                        <h3 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">VELOCITY</h3>
                                        <p className="text-[10px] text-slate-400 font-mono tracking-widest mt-2 font-black">INTERACTION_MONITOR</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-aether-accent"></div>
                                            <span className="text-[9px] font-mono font-black text-slate-400">ENG_RATE</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[300px] md:h-[400px]">
                                    {chartData && (
                                        <Line
                                            data={chartData.engagement}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: { legend: { display: false } },
                                                scales: {
                                                    y: { grid: { display: false }, ticks: { display: false } },
                                                    x: { grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' }, color: '#94a3b8' } }
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="glass p-10 rounded-[4rem] border-white/5 flex flex-col">
                                <h3 className="text-2xl font-black tracking-tighter text-white mb-10 uppercase">UNITS</h3>
                                <div className="flex-1 space-y-8">
                                    {[
                                        { label: 'AI_CORE', val: '45%', color: 'bg-aether-accent' },
                                        { label: 'FIN_SYNC', val: '25%', color: 'bg-sky-500' },
                                        { label: 'BRAND_LAB', val: '30%', color: 'bg-rose-500' },
                                    ].map(item => (
                                        <div key={item.label} className="group/item">
                                            <div className="flex justify-between text-[10px] font-mono mb-4 font-black">
                                                <span className="text-slate-400 uppercase tracking-widest">{item.label}</span>
                                                <span className="text-aether-accent">{item.val}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: item.val }}
                                                    transition={{ duration: 1, ease: "circOut" }}
                                                    className={`h-full ${item.color}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : activeTab === 'synapse' ? (
                    <motion.div
                        key="synapse"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {botStatuses.length > 0 ? (
                                botStatuses.map((bot, i) => (
                                    <motion.div
                                        key={bot.botName}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass p-8 md:p-10 rounded-[3.5rem] border-white/5 relative group overflow-hidden bg-slate-950/40"
                                    >
                                        <div className={`absolute top-0 right-0 w-1.5 h-full ${bot.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500'} transition-all`} />

                                        <div className="flex justify-between items-start mb-10">
                                            <div className="bg-white/5 p-4 rounded-3xl border border-white/10 group-hover:rotate-[360deg] transition-all duration-1000">
                                                <RefreshCw size={24} className={bot.status === 'Active' ? 'text-emerald-400 animate-spin-slow' : 'text-slate-500'} />
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[8px] font-black font-mono tracking-widest px-3 py-1 rounded-full ${bot.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    {bot.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <h4 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.4em] mb-2">{bot.botName}</h4>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">SOVEREIGN_NODE</h3>

                                        <div className="space-y-6 pt-6 border-t border-white/5">
                                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                                <span className="text-[9px] font-mono text-slate-500 uppercase font-black">TASKS_ASYNC</span>
                                                <span className="text-sm font-black text-aether-accent">{bot.tasksCompleted.toLocaleString()}</span>
                                            </div>
                                            <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5">
                                                <div className="flex items-center gap-3 mb-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                    <Terminal size={12} /> CURRENT_SEQUENCE
                                                </div>
                                                <p className="text-[10px] font-mono text-emerald-400/80 line-clamp-1 italic">
                                                    {bot.currentActivity || 'STRETCHING_NEURAL_FABRIC...'}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="lg:col-span-3 py-32 glass rounded-[4rem] border-dashed border-white/10 flex flex-col items-center justify-center gap-6">
                                    <div className="p-8 bg-white/5 rounded-full border border-white/5 animate-pulse">
                                        <AlertCircle size={48} className="text-slate-700" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-black text-white uppercase mb-2 tracking-widest">NO_NODES_DETECTED</h3>
                                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">AWAITING_INITIAL_SYNDICATE_HANDSHAKE</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="sponsorship"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-10"
                    >
                        <div className="glass p-8 md:p-14 rounded-[4rem] border-white overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-separate border-spacing-y-4 min-w-[800px]">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="pb-6 pl-8">PARTNER_ENTITY</th>
                                        <th className="pb-6">TIER</th>
                                        <th className="pb-6">PROTOCOL</th>
                                        <th className="pb-6 pr-8 text-right">VALUATION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sponsors.length > 0 ? (
                                        sponsors.map((s) => (
                                            <tr key={s._id} className="group">
                                                <td className="py-6 pl-8 font-black text-white bg-slate-950/40 first:rounded-l-3xl border-y border-l border-white/5">{s.companyName}</td>
                                                <td className="py-6 bg-slate-950/40 border-y border-white/5">
                                                    <span className="text-[9px] px-3 py-1 bg-aether-soft text-aether-accent rounded-full font-black tracking-widest">{s.tier.toUpperCase()}</span>
                                                </td>
                                                <td className="py-6 bg-slate-950/40 border-y border-white/5">
                                                    <span className="text-[9px] font-bold text-slate-500 font-mono tracking-widest">{s.status.toUpperCase()}</span>
                                                </td>
                                                <td className="py-6 bg-slate-950/40 border-y border-r border-white/5 pr-8 last:rounded-r-3xl font-mono font-black text-emerald-400 text-right">
                                                    ${s.estimatedValue?.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center bg-slate-900/40 rounded-3xl border border-dashed border-white/5">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Target className="text-slate-700" size={32} />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No active partners in database</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
