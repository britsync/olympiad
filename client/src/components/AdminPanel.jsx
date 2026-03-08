import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import {
    Users, FileText, Star, TrendingUp, Settings,
    CheckCircle2 as CheckCircle, XCircle, ChevronRight, Video,
    Award, BarChart3, Database, ShieldCheck,
    ArrowUpRight, Mail, Plus, Trash2, Save, X, Target, Cpu,
    Palette, DollarSign, Lock, Zap, Globe2, ShieldAlert,
    PenTool, Briefcase, GraduationCap, Rocket, MapPin, Clock, Wine,
    Send, Globe, Landmark, Coins, FileCheck, Unlock, Smartphone,
    Layout, BookOpen, Shield, HelpCircle, Network, UploadCloud, Eye
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DynamicIcon = ({ name, ...props }) => {
    const Icons = {
        Cpu, Globe2, ShieldAlert, Target, Palette, Award, FileText, Database,
        ShieldCheck, Mail, Settings, X, Save, Trash2, TrendingUp, Users,
        PenTool, Briefcase, GraduationCap, Rocket, BarChart3, MapPin,
        CheckCircle, Clock, Wine, Send, Globe, Landmark, Coins, Lock,
        FileCheck, Unlock, Smartphone, Layout, BookOpen, Shield, HelpCircle, Network
    };
    const IconComponent = Icons[name] || Cpu;
    return <IconComponent {...props} />;
};

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [activeTab, setActiveTab] = useState('judging');
    const [submissions, setSubmissions] = useState([]);
    const [participants, setParticipants] = useState([]); // New state for all registered units
    const [sponsors, setSponsors] = useState([]);
    const [rsvps, setRsvps] = useState([]);
    const [staff, setStaff] = useState([]);
    const [botStatuses, setBotStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddSponsor, setShowAddSponsor] = useState(false);
    const [geographicData, setGeographicData] = useState({
        Asia: 35, Europe: 25, Africa: 15, MiddleEast: 10, Americas: 15
    });
    const [revenuePillars, setRevenuePillars] = useState([
        { name: 'Strategic', target: 350000, current: 200000, color: '#c5a059' },
        { name: 'Continental', target: 270000, current: 120000, color: '#0ea5e9' },
        { name: 'Media', target: 80000, current: 50000, color: '#f43f5e' },
        { name: 'Talent', target: 175000, current: 100000, color: '#10b981' },
    ]);
    const [newSponsor, setNewSponsor] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        tier: 'Bronze',
        interestLevel: 'Medium',
        estimatedValue: 0
    });
    const [filterType, setFilterType] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [newSponsorPassword, setNewSponsorPassword] = useState('');
    const [showAddStaff, setShowAddStaff] = useState(false);
    const [newStaff, setNewStaff] = useState({
        name: '', role: '', level: 'Britsync', location: '', parent: null, department: 'Core', linkedin: '', photo: '', industries: []
    });
    const [editingStaff, setEditingStaff] = useState(null);

    // --- CMS States ---
    const [cmsData, setCmsData] = useState({
        gateway: [],
        academy: [],
        awards: [],
        faqs: [],
        contact: [],
        content: [],
        experts: []
    });
    const [editingItem, setEditingItem] = useState(null); // { type, data }
    const [showEditModal, setShowEditModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [iconSearch, setIconSearch] = useState('');
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoints = [
                { key: 'submissions', url: `${API_BASE_URL}/api/judges/submissions` },
                { key: 'participants', url: `${API_BASE_URL}/api/teams` },
                { key: 'sponsors', url: `${API_BASE_URL}/api/sponsors` },
                { key: 'rsvps', url: `${API_BASE_URL}/api/gala/rsvps` },
                { key: 'bots', url: `${API_BASE_URL}/api/bots/statuses` },
                { key: 'staff', url: `${API_BASE_URL}/api/staff` },
                { key: 'analytics', url: `${API_BASE_URL}/api/analytics` }
            ];

            const results = await Promise.allSettled(endpoints.map(e => axios.get(e.url)));

            results.forEach((result, index) => {
                const key = endpoints[index].key;
                if (result.status === 'fulfilled') {
                    const data = result.value.data;
                    if (key === 'submissions') setSubmissions(Array.isArray(data) ? data : []);
                    if (key === 'participants') setParticipants(Array.isArray(data) ? data : []);
                    if (key === 'sponsors') setSponsors(Array.isArray(data) ? data : []);
                    if (key === 'rsvps') setRsvps(Array.isArray(data) ? data : []);
                    if (key === 'staff') setStaff(Array.isArray(data) ? data : []);
                    if (key === 'bots') setBotStatuses(Array.isArray(data) ? data : []);
                    if (key === 'analytics') {
                        setGeographicData(prev => ({
                            ...prev,
                            visitors: data.visitors,
                            ministryInvolvement: data.ministryInvolvement
                        }));
                    }
                }
            });

            // Fetch CMS Data
            const cmsTypes = ['gateway', 'academy', 'awards', 'faqs', 'contact', 'content', 'experts'];
            const cmsResults = await Promise.allSettled(cmsTypes.map(t => axios.get(`${API_BASE_URL}/api/cms/${t}`)));

            const newCmsData = {};
            cmsResults.forEach((res, i) => {
                if (res.status === 'fulfilled') {
                    newCmsData[cmsTypes[i]] = res.value.data;
                }
            });
            setCmsData(prev => ({ ...prev, ...newCmsData }));

            console.log('SYNC_COMPLETE:', new Date().toLocaleTimeString());
        } catch (error) {
            console.error('CRITICAL_SYNC_FAILURE');
        }
        setLoading(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/settings/verify`, {
                key: 'admin_password',
                password: accessCode
            });
            if (res.data.success) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            alert('PROTOCOL_REJECTED: INVALID_ACCESS_KEY');
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData();
        const interval = setInterval(fetchData, 10000); // Polling for bots
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const renderStatCard = (label, value, Icon) => (
        <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-aether-gold/30 hover:bg-slate-900/60 transition-all duration-500 shadow-2xl">
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-aether-gold transition-colors">{label}</p>
                <p className="text-4xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform origin-left">{value}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl text-slate-400 group-hover:text-aether-gold group-hover:bg-aether-gold/10 transition-all">
                <Icon size={24} />
            </div>
        </div>
    );

    const handleScoreSubmit = async (submissionId, scores) => {
        try {
            await axios.post(`${API_BASE_URL}/api/judges/score`, {
                submissionId,
                judgeId: 'ADMIN_CHIEF',
                ...scores
            });
            alert('Score Synchronized');
            const subRes = await axios.get(`${API_BASE_URL}/api/judges/submissions`);
            setSubmissions(subRes.data);
        } catch (error) {
            alert('Scoring Failed');
        }
    };

    const handleSubmissionStatusUpdate = async (submissionId, status) => {
        try {
            await axios.post(`${API_BASE_URL}/api/judges/status`, { submissionId, status });
            const subRes = await axios.get(`${API_BASE_URL}/api/judges/submissions`);
            setSubmissions(subRes.data);
        } catch (error) {
            alert('Status Sync Failed');
        }
    };

    const handlePublishWinners = async () => {
        if (!submissions || submissions.length === 0) return alert('NO_DATA_TO_PUBLISH');
        if (!window.confirm('INITIATE_PROTOCOL: PUBLISH_WINNERS? This will lock the Top 3 teams as AWARD_WINNERS.')) return;

        try {
            const sorted = [...submissions].sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
            const top3 = sorted.slice(0, 3);

            await Promise.all(top3.map(sub =>
                axios.post(`${API_BASE_URL}/api/judges/status`, { submissionId: sub._id, status: 'Award Winner' })
            ));

            alert('WINNERS_ANNOUNCED: PROTOCOL_INITIATED');
            fetchData(); // Refresh data
        } catch (error) {
            alert('PUBLISH_FAILURE: NETWORK_ERROR');
        }
    };

    const handleUnpublishWinners = async () => {
        if (!window.confirm('WARNING: REVOKE_WINNERS_PROTOCOL? This will remove "Award Winner" status from all teams.')) return;

        try {
            const winners = submissions.filter(s => s.validationStatus === 'Award Winner');
            if (winners.length === 0) return alert('NO_winners_FOUND');

            await Promise.all(winners.map(sub =>
                axios.post(`${API_BASE_URL}/api/judges/status`, { submissionId: sub._id, status: 'Evaluated' })
            ));

            alert('WINNERS_REVOKED: STATUS_RESET');
            fetchData();
        } catch (error) {
            alert('REVOKE_FAILURE: NETWORK_ERROR');
        }
    };

    const handleAddSponsor = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/sponsors`, newSponsor);
            const sponRes = await axios.get(`${API_BASE_URL}/api/sponsors`);
            setSponsors(sponRes.data);
            setShowAddSponsor(false);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'CRM Sync Failed';
            alert(`CRM_SYNC_ERROR: ${errorMsg}`);
        }
    };

    const handleSponsorStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${API_BASE_URL}/api/sponsors/${id}`, { status });
            const sponRes = await axios.get(`${API_BASE_URL}/api/sponsors`);
            setSponsors(sponRes.data);
            alert('SPONSOR_SYNCHRONIZED');
        } catch (error) {
            alert('SYNC_ERROR_SPONSOR');
        }
    };

    const handlePasswordUpdate = async (key, value) => {
        try {
            await axios.post(`${API_BASE_URL}/api/settings/update`, { key, value });
            alert(`PROTOCOL_OPTIMIZED: ${key.toUpperCase()} UPDATED`);
            if (key === 'admin_password') setNewAdminPassword('');
            if (key === 'sponsor_password') setNewSponsorPassword('');
        } catch (error) {
            alert('PROTOCOL_FAILURE: UPDATE_SYNC_ERROR');
        }
    };

    // --- CMS CRUD Handlers ---
    const saveCmsItem = async (type, data) => {
        try {
            if (data._id) {
                await axios.put(`${API_BASE_URL}/api/cms/${type}/${data._id}`, data);
            } else {
                await axios.post(`${API_BASE_URL}/api/cms/${type}`, data);
            }
            setShowEditModal(false);
            setEditingItem(null);
            alert('CMS_NODE_SYNCHRONIZED_SUCCESSFULLY');
            fetchData();
        } catch (error) {
            console.error('CMS_SYNC_ERROR:', error);
            alert(`CMS_SYNC_FAILURE: ${error.response?.data?.message || error.message}`);
        }
    };

    const deleteCmsItem = async (type, id) => {
        if (!window.confirm('TERMINATE_DATA_NODE?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/cms/${type}/${id}`);
            fetchData();
        } catch (error) {
            alert('CMS_DELETE_FAILURE');
        }
    };

    const handleDeleteParticipant = async (id) => {
        if (!window.confirm('WARNING: DELETE_PROTOCOL_INITIATED. This action is irreversible. Confirm deletion of participant?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/teams/${id}`);
            alert('PARTICIPANT_REMOVED');
            fetchData();
        } catch (error) {
            alert('DELETE_FAILURE: NETWORK_ERROR');
        }
    };

    const handleDeleteSubmission = async (id) => {
        if (!window.confirm('WARNING: ERASE_SUBMISSION_DATA? This action cannot be undone.')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/submissions/${id}`);
            alert('SUBMISSION_ERASED');
            fetchData();
        } catch (error) {
            alert('DELETE_FAILURE: NETWORK_ERROR');
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm('TERMINATE_STAFF_NODE? Action irreversible.')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/staff/${id}`);
            alert('STAFF_NODE_DELETED');
            fetchData();
        } catch (error) {
            alert('DELETE_FAILURE');
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/staff`, newStaff);
            setShowAddStaff(false);
            setNewStaff({ name: '', role: '', level: 'Britsync', location: '', parent: null, department: 'Core', linkedin: '', photo: '', industries: [] });
            fetchData();
        } catch (error) {
            alert('STAFF_INGEST_FAILURE');
        }
    };

    const handleUpdateStaff = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/api/staff/${editingStaff._id}`, editingStaff);
            setEditingStaff(null);
            alert('STAFF_NODE_SYNCHRONIZED');
            fetchData();
        } catch (error) {
            alert('STAFF_UPDATE_FAILURE');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-6 py-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-12 md:p-16 rounded-[4rem] border-white/10 max-w-lg w-full text-center relative overflow-hidden bg-slate-900/40 shadow-2xl shadow-black/40"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-aether-accent"></div>
                    <div className="w-20 h-20 bg-aether-soft rounded-3xl flex items-center justify-center mx-auto mb-10 text-aether-accent">
                        <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-white mb-4 uppercase">SECURITY_GATE</h2>
                    <p className="text-slate-500 text-[10px] font-black mb-12 uppercase tracking-[0.3em] font-mono">Authorized Personnel Only</p>

                    <form onSubmit={handleLogin} className="space-y-8 text-left">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-[0.3em] font-mono">Access Protocol</label>
                            <input
                                type="password"
                                placeholder="****************"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-8 py-5 focus:border-aether-accent outline-none transition-all text-center font-black tracking-[1em] placeholder:tracking-normal placeholder:font-bold text-white shadow-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-aether-accent text-white font-black py-6 rounded-2xl tracking-[0.3em] uppercase hover:shadow-2xl hover:shadow-aether-accent/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-xs"
                        >
                            INITIATE_HANDSHAKE
                        </button>
                    </form>

                    <div className="mt-12 flex items-center justify-center gap-4 text-[9px] font-mono font-black text-slate-300 tracking-[0.4em] uppercase">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> ENCRYPTION: AES-256_STABLE
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-950 flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-80 bg-slate-900 border-r border-white/5 flex flex-col z-50 shrink-0 sticky top-0 h-full overflow-y-auto custom-scrollbar"
            >
                <div className="p-10">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="w-12 h-12 bg-aether-gold rounded-2xl flex items-center justify-center text-slate-950">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">GAIO</h2>
                            <span className="text-[10px] font-mono text-aether-gold font-black tracking-widest">ADMIN_OS</span>
                        </div>
                    </div>

                    <nav className="space-y-4">
                        {[
                            { id: 'participants', label: 'PARTICIPANTS', icon: Users },
                            { id: 'judging', label: 'JUDGING_QUEUE', icon: Award },
                            { id: 'staff', label: 'TEAM_PROTOCOL', icon: Network },
                            { id: 'sponsorship', label: 'CRM_PIPELINE', icon: Target },
                            { id: 'bots', label: 'BOT_TELEMETRY', icon: Cpu },
                            { id: 'logistics', label: 'GALA_RSVP', icon: Star },
                            { id: 'separator_cms', label: '--- CMS CONTROL ---', isSeparator: true },
                            { id: 'page_home', label: 'Home Management', icon: Layout },
                            { id: 'page_academy', label: 'Academy Terminal', icon: BookOpen },
                            { id: 'page_prizes', label: 'Prizes Syndicate', icon: Award },
                            { id: 'page_gala', label: 'Gala Portal', icon: Target },
                            { id: 'page_about', label: 'Mission Sync', icon: Globe },
                            { id: 'page_contact', label: 'Contact Sync', icon: Mail },
                            { id: 'page_sponsor', label: 'Sponsor Sync', icon: Coins },
                            { id: 'page_faqs', label: 'FAQ Sync', icon: HelpCircle },
                            { id: 'security', label: 'Security Protocol', icon: ShieldCheck }
                        ].map((item) => (
                            item.isSeparator ? (
                                <div key={item.id} className="pt-6 pb-2 text-[8px] font-mono text-slate-700 tracking-[0.5em] text-center border-b border-white/5 mb-4">{item.label}</div>
                            ) : (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all uppercase group ${activeTab === item.id ? 'bg-aether-gold text-slate-950 shadow-2xl' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <item.icon size={18} className={`${activeTab === item.id ? 'text-slate-950' : 'text-aether-gold'} group-hover:scale-110 transition-transform`} />
                                    {item.label}
                                </button>
                            )
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-10 border-t border-white/5 bg-slate-950/40">
                    <div className="flex items-center gap-4 text-emerald-500 font-mono text-[9px] font-black tracking-widest uppercase mb-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        SECURE_ACCESS
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="w-full py-4 border border-white/5 rounded-xl text-[9px] font-black text-slate-500 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest"
                    >
                        TERMINATE_SESSION
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.05),transparent)]">
                <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-white/5 p-8 flex justify-between items-center">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
                            {[
                                { id: 'participants', label: 'REGISTRATION_DATABASE' },
                                { id: 'judging', label: 'JUDGING_QUEUE' },
                                { id: 'sponsorship', label: 'CRM_PIPELINE' },
                                { id: 'bots', label: 'BOT_TELEMETRY' },
                                { id: 'logistics', label: 'GALA_RSVP' },
                                { id: 'cms_portal', label: 'PORTAL_CONTROL' },
                                { id: 'cms_academy', label: 'ACADEMY_SYNC' },
                                { id: 'cms_awards', label: 'AWARD_HUB' },
                                { id: 'cms_content', label: 'CONTENT_TERMINAL' }
                            ].find(t => t.id === activeTab)?.label || activeTab}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                            <span className="text-[8px] font-mono text-slate-500 font-bold tracking-[0.3em] uppercase">
                                {loading ? 'SYNCING_NODE' : 'NODE_STABLE'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <button
                            onClick={fetchData}
                            className="px-6 py-2 bg-slate-900 border border-white/10 text-white rounded-xl text-[9px] font-black tracking-[0.3em] uppercase hover:bg-aether-gold transition-all shadow-lg flex items-center gap-3"
                        >
                            <Cpu size={14} className={loading ? 'animate-spin' : ''} />
                            <span>SYNC_NODE</span>
                        </button>
                        <div className="text-right">
                            <p className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-widest leading-none mb-1">SYSTEM_LOAD</p>
                            <div className="h-1.5 w-32 bg-slate-900 rounded-full overflow-hidden">
                                <motion.div animate={{ width: '24%' }} className="h-full bg-aether-gold" />
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/10 bg-slate-900 flex items-center justify-center text-slate-500">
                            <Users size={20} />
                        </div>
                    </div>
                </header>

                <div className="p-12 relative text-slate-400">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-10"
                        >
                            {activeTab === 'participants' && (
                                <div className="space-y-10">
                                    <div className="glass p-10 rounded-[4rem] border-white/10 bg-slate-900/40">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                                            <div>
                                                <h3 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">Registration Database</h3>
                                                <p className="text-[10px] font-mono text-slate-500 mt-2 uppercase tracking-widest font-black">Sync_Status: Stable</p>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex gap-2 bg-slate-950/40 p-1 rounded-2xl border border-white/5">
                                                    {['All', 'Individual', 'Startup'].map(dept => (
                                                        <button
                                                            key={dept}
                                                            onClick={() => setFilterType(dept)}
                                                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterType === dept ? 'bg-aether-gold text-slate-950 shadow-2xl scale-105' : 'text-slate-500 hover:text-white'
                                                                }`}
                                                        >
                                                            {dept}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto no-scrollbar">
                                            <table className="w-full text-left border-separate border-spacing-y-4">
                                                <thead>
                                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        <th className="pb-6 pl-8">Name</th>
                                                        <th className="pb-6">Department</th>
                                                        <th className="pb-6">Country</th>
                                                        <th className="pb-6">Contact</th>
                                                        <th className="pb-6 pr-8 text-right font-mono">Operations</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {participants
                                                        .filter(p => filterType === 'All' || (p.department || p.type || 'Individual') === filterType)
                                                        .map((p) => (
                                                            <tr key={p._id} className="group hover:scale-[1.01] transition-all duration-500">
                                                                <td className="py-6 pl-8 bg-slate-900/40 first:rounded-l-[2rem] border-y border-l border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500 shadow-2xl">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-black text-white uppercase text-sm tracking-tight group-hover:text-aether-gold transition-colors">{p.name || p.teamName}</span>
                                                                        <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase truncate max-w-[200px] group-hover:text-slate-400 transition-colors">{p.email || (p.members && p.members[0]?.email) || 'NO_EMAIL'}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-6 bg-slate-900/40 border-y border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500">
                                                                    <span className={`text-[9px] px-3 py-1 rounded-full font-black tracking-widest ${(p.department || p.type) === 'Individual' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                                                                        {(p.department || p.type || 'PENDING').toUpperCase()}
                                                                    </span>
                                                                </td>
                                                                <td className="py-6 bg-slate-900/40 border-y border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500">
                                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                                        {p.country?.toUpperCase() || (p.members && p.members[0]?.country?.toUpperCase()) || 'N/A'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-6 bg-slate-900/40 border-y border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                                    <div className="flex flex-col">
                                                                        <span>{p.contactNo || (p.members && p.members[0]?.phone) || 'N/A'}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-6 pr-8 bg-slate-900/40 border-y border-r border-white/5 last:rounded-r-[2rem] text-right group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500">
                                                                    <button
                                                                        onClick={() => setSelectedParticipant(p)}
                                                                        className="p-2 text-slate-500 hover:text-aether-gold transition-all hover:scale-110 active:scale-90"
                                                                        title="View Details"
                                                                    >
                                                                        <Mail size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteParticipant(p._id)}
                                                                        className="p-2 text-slate-500 hover:text-red-500 transition-all hover:scale-110 active:scale-90 ml-2"
                                                                        title="Remove Participant"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                            {participants.length === 0 && (
                                                <div className="text-center py-20 text-slate-300 font-mono text-[10px] uppercase tracking-widest border border-dashed border-slate-200 rounded-3xl">No registrations found in node</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Participant Details Modal */}
                            <AnimatePresence>
                                {selectedParticipant && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                                        onClick={() => setSelectedParticipant(null)}
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl shadow-black/50 overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-8">
                                                <button
                                                    onClick={() => setSelectedParticipant(null)}
                                                    className="p-3 rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-6 mb-10">
                                                <div className="w-20 h-20 rounded-3xl bg-aether-gold/10 border border-aether-gold/20 flex items-center justify-center text-aether-gold shadow-[0_0_30px_-10px_rgba(197,160,89,0.3)]">
                                                    <Users size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                                                        {selectedParticipant.name || selectedParticipant.teamName}
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${selectedParticipant.department === 'Individual' || selectedParticipant.type === 'Individual' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                                                            {selectedParticipant.department || selectedParticipant.type || 'UNKNOWN_UNIT'}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest">
                                                            ID: {selectedParticipant._id.slice(-6).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2 p-5 bg-slate-950/50 rounded-2xl border border-white/5">
                                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Globe size={12} /> Country
                                                    </label>
                                                    <p className="text-lg font-bold text-white uppercase tracking-tight">
                                                        {selectedParticipant.country || (selectedParticipant.members && selectedParticipant.members[0]?.country) || 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="space-y-2 p-5 bg-slate-950/50 rounded-2xl border border-white/5">
                                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Smartphone size={12} /> Contact
                                                    </label>
                                                    <p className="text-lg font-bold text-white font-mono tracking-tight">
                                                        {selectedParticipant.contactNo || (selectedParticipant.members && selectedParticipant.members[0]?.phone) || 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="col-span-2 space-y-2 p-5 bg-slate-950/50 rounded-2xl border border-white/5">
                                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Mail size={12} /> Email Address
                                                    </label>
                                                    <p className="text-lg font-bold text-white font-mono tracking-tight break-all">
                                                        {selectedParticipant.email || (selectedParticipant.members && selectedParticipant.members[0]?.email) || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                                                <button
                                                    onClick={() => {
                                                        const email = selectedParticipant.email || (selectedParticipant.members && selectedParticipant.members[0]?.email);
                                                        if (email) window.location.href = `mailto:${email}`;
                                                    }}
                                                    className="flex-1 py-4 bg-aether-gold text-slate-950 font-black rounded-xl uppercase tracking-[0.2em] hover:bg-white transition-colors text-xs flex items-center justify-center gap-3"
                                                >
                                                    <Send size={14} /> Send Transmission
                                                </button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {activeTab === 'judging' && (
                                <div className="space-y-10 text-slate-400">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                        <div className="lg:col-span-2 glass p-10 rounded-[3rem] border-white/5 bg-slate-900/40 max-h-[800px] overflow-y-auto custom-scrollbar">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                                <h3 className="text-2xl font-black tracking-tighter uppercase text-white">Submission Queue</h3>
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="flex gap-2 bg-slate-950/40 p-1 rounded-2xl border border-white/5">
                                                        {['All', 'Individual', 'Startup'].map(dept => (
                                                            <button
                                                                key={dept}
                                                                onClick={() => setFilterType(dept)}
                                                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterType === dept ? 'bg-aether-gold text-slate-950 shadow-2xl' : 'text-slate-500 hover:text-white'
                                                                    }`}
                                                            >
                                                                {dept}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                {submissions
                                                    .filter(sub => (filterType === 'All' || sub.teamId?.department === filterType))
                                                    .map((sub) => (
                                                        <div key={sub._id} className="group bg-slate-950/40 rounded-3xl p-8 border border-white/5 hover:border-aether-gold/30 transition-all shadow-2xl relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-aether-gold/5 rounded-full blur-3xl -z-10 group-hover:bg-aether-gold/10 transition-colors"></div>
                                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-aether-gold transition-colors">{sub.teamId?.name || 'NODE_UNKNOWN'}</h4>
                                                                        <span className="text-[9px] px-3 py-1 bg-white/5 rounded-full text-slate-400 font-black tracking-widest border border-white/10 uppercase">
                                                                            {sub.teamId?.department?.toUpperCase() || 'PARTICIPANT'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-400 font-light max-w-xl uppercase tracking-tight leading-relaxed">{sub.projectIdea}</p>
                                                                </div>
                                                                <div className="flex flex-wrap gap-4">
                                                                    <a href={`${API_BASE_URL}/${sub.pdfLink.replace(/\\/g, '/').replace(/^uploads\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest border border-white/10">
                                                                        <FileText size={14} /> VIEW_PAYLOAD
                                                                    </a>
                                                                    {sub.videoUrl && (
                                                                        <a href={sub.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-aether-gold/10 rounded-xl text-[9px] font-black text-aether-gold hover:bg-aether-gold/20 transition-all uppercase tracking-widest border border-aether-gold/20">
                                                                            <Video size={14} /> PLAY_EXECUTION
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-white/5 pt-8 items-end">
                                                                {[
                                                                    { label: 'TECHNICAL', key: 'technical' },
                                                                    { label: 'MARKET', key: 'market' },
                                                                    { label: 'PITCH', key: 'pitch' },
                                                                    { label: 'PRESENTATION', key: 'presentation' }
                                                                ].map(domain => (
                                                                    <div key={domain.key} className="space-y-3">
                                                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{domain.label}</label>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="0"
                                                                            className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 focus:border-aether-gold outline-none transition-all text-sm font-black text-white font-mono"
                                                                            defaultValue={sub.judgingScores?.[domain.key] || 0}
                                                                            id={`${domain.key}-${sub._id}`}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="space-y-3">
                                                                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">NODE_STATUS</label>
                                                                    <select
                                                                        className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 focus:border-aether-gold outline-none transition-all text-[9px] font-black text-slate-400 uppercase tracking-widest"
                                                                        value={sub.validationStatus}
                                                                        onChange={(e) => handleSubmissionStatusUpdate(sub._id, e.target.value)}
                                                                    >
                                                                        <option value="Pending">PENDING</option>
                                                                        <option value="Validated">VALIDATED</option>
                                                                        <option value="Rejected">REJECTED</option>
                                                                        <option value="Award Winner">AWARD_WINNER</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    const technical = parseInt(document.getElementById(`technical-${sub._id}`).value);
                                                                    const market = parseInt(document.getElementById(`market-${sub._id}`).value);
                                                                    const pitch = parseInt(document.getElementById(`pitch-${sub._id}`).value);
                                                                    const presentation = parseInt(document.getElementById(`presentation-${sub._id}`).value);
                                                                    handleScoreSubmit(sub._id, { technical, market, pitch, presentation });
                                                                }}
                                                                className="w-full mt-6 py-4 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black text-white hover:bg-aether-gold hover:text-slate-950 transition-all uppercase tracking-[0.3em]"
                                                            >
                                                                SYNC_METRICS
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSubmission(sub._id)}
                                                                className="w-full mt-2 py-4 bg-slate-950/40 border border-red-500/20 rounded-xl text-[9px] font-black text-red-500/60 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"
                                                            >
                                                                <Trash2 size={12} /> ERASE_PAYLOAD
                                                            </button>
                                                        </div>
                                                    ))}
                                                {submissions.length === 0 && (
                                                    <div className="text-center py-20 text-slate-600 font-mono text-[10px] uppercase tracking-widest border border-dashed border-white/5 rounded-3xl">No submissions synchronized</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="glass p-10 rounded-[3rem] border-white/10 bg-slate-900/40 h-fit">
                                            <h3 className="text-2xl font-black tracking-tighter uppercase text-white mb-10">GLOBAL_RANKING</h3>
                                            <div className="space-y-6">
                                                {submissions && submissions.length > 0 ? (
                                                    [...submissions].sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0)).slice(0, 10).map((sub, index) => (
                                                        <div key={sub._id} className="flex items-center justify-between p-6 bg-slate-950/40 rounded-[2rem] border border-white/5 hover:border-aether-gold/20 transition-all group">
                                                            <div className="flex items-center gap-5">
                                                                {(sub.averageScore || 0) > 0 ? (
                                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${index === 0 ? 'bg-aether-gold text-slate-950 shadow-[0_0_20px_rgba(197,160,89,0.3)]' : 'bg-slate-900 text-slate-400'}`}>
                                                                        #{index + 1}
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs bg-slate-900/50 text-slate-600 border border-white/5">
                                                                        -
                                                                    </div>
                                                                )}
                                                                <div className="flex flex-col">
                                                                    <span className="font-black text-white uppercase text-xs tracking-tight group-hover:text-aether-gold transition-colors">{sub.teamId?.name || 'REDACTED'}</span>
                                                                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{sub.teamId?.department === 'Individual' ? 'SOLO_NODE' : 'STARTUP_NODE'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="text-sm font-black text-white font-mono">{sub.averageScore ? sub.averageScore.toFixed(1) : 0}</div>
                                                                    {sub.averageScore > 0 && <CheckCircle size={10} className="text-emerald-500" />}
                                                                </div>
                                                                <div className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">RANKED</div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-10 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] border border-dashed border-white/5 rounded-3xl">No rankings currently synchronized</div>
                                                )}

                                                {submissions && submissions.length > 0 && (
                                                    <>
                                                        <button
                                                            onClick={handlePublishWinners}
                                                            className="w-full py-4 mt-6 bg-aether-gold text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-colors shadow-[0_0_30px_rgba(197,160,89,0.2)] flex items-center justify-center gap-2"
                                                        >
                                                            <Award size={16} /> PUBLISH_WINNERS
                                                        </button>
                                                        <button
                                                            onClick={handleUnpublishWinners}
                                                            className="w-full mt-2 py-4 bg-slate-800 text-slate-400 border border-slate-700 rounded-xl text-[10px] font-black hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"
                                                        >
                                                            <ShieldAlert size={16} /> REVOKE_WINNERS
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {activeTab === 'staff' && (
                                <div className="space-y-10">
                                    <AnimatePresence>
                                        {showAddStaff && (
                                            <>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    onClick={() => setShowAddStaff(false)}
                                                    className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[200]"
                                                />
                                                <motion.div
                                                    initial={{ x: '100%', opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    exit={{ x: '100%', opacity: 0 }}
                                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                                    className="fixed top-0 right-0 h-screen w-full lg:w-[600px] bg-slate-900 shadow-[-50px_0_100px_rgba(0,0,0,0.8)] z-[201] p-8 md:p-16 border-l border-white/5 flex flex-col overflow-y-auto custom-scrollbar"
                                                >
                                                    <div className="flex justify-between items-center mb-12">
                                                        <div>
                                                            <h3 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">INGEST_STAFF_NODE</h3>
                                                            <p className="text-[10px] font-mono font-black text-slate-500 tracking-widest mt-2 uppercase">Protocol: Org_Hierarchy_v1</p>
                                                        </div>
                                                        <button onClick={() => setShowAddStaff(false)} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors">
                                                            <X size={24} />
                                                        </button>
                                                    </div>

                                                    <form onSubmit={handleAddStaff} className="space-y-8 lg:space-y-10">
                                                        <div className="space-y-6">
                                                            <div className="space-y-3">
                                                                <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Full Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white"
                                                                    value={newStaff.name}
                                                                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                                                                    required
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-6">
                                                                <div className="space-y-3">
                                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Protocol Level</label>
                                                                    <select
                                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none font-bold text-white cursor-pointer hover:border-aether-gold transition-all"
                                                                        value={newStaff.level}
                                                                        onChange={e => setNewStaff({ ...newStaff, level: e.target.value })}
                                                                    >
                                                                        <option value="Britsync">BRITSYNC (MAIN)</option>
                                                                        <option value="Continental_Coordinator">CONTINENTAL</option>
                                                                        <option value="Regional_Coordinator">REGIONAL</option>
                                                                        <option value="Ground_Team">GROUND_TEAM</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Role Title</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white"
                                                                        value={newStaff.role}
                                                                        onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Active Coverage (Location)</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="e.g. Europe, Nigeria, or Lagos"
                                                                    className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white"
                                                                    value={newStaff.location}
                                                                    onChange={e => setNewStaff({ ...newStaff, location: e.target.value })}
                                                                />
                                                            </div>

                                                            <div className="space-y-3">
                                                                <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Parent Node (Hierarchy)</label>
                                                                <select
                                                                    className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none font-bold text-white cursor-pointer hover:border-aether-gold transition-all"
                                                                    value={newStaff.parent || ''}
                                                                    onChange={e => setNewStaff({ ...newStaff, parent: e.target.value || null })}
                                                                >
                                                                    <option value="">NO_PARENT_NODE (ROOT)</option>
                                                                    {staff.map(m => (
                                                                        <option key={m._id} value={m._id}>{m.name} ({m.level})</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-6">
                                                                <div className="space-y-3">
                                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Department</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white"
                                                                        value={newStaff.department}
                                                                        onChange={e => setNewStaff({ ...newStaff, department: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">LinkedIn URL</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white"
                                                                        value={newStaff.linkedin}
                                                                        onChange={e => setNewStaff({ ...newStaff, linkedin: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Industries Management Section */}
                                                        <div className="space-y-6 pt-6 border-t border-white/5">
                                                            <div className="flex justify-between items-center px-2">
                                                                <div className="flex flex-col">
                                                                    <label className="text-[10px] font-black text-aether-gold tracking-[0.3em] uppercase leading-none">Associated Industries</label>
                                                                    <span className="text-[8px] font-mono text-slate-500 mt-2 uppercase tracking-widest">Popup Data Nodes</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setNewStaff({
                                                                        ...newStaff,
                                                                        industries: [...(newStaff.industries || []), { title: '', info: '', image: '' }]
                                                                    })}
                                                                    className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/30 transition-all active:scale-95"
                                                                >
                                                                    + ADD_INDUSTRY
                                                                </button>
                                                            </div>

                                                            <div className="space-y-4">
                                                                {(newStaff.industries || []).map((ind, idx) => (
                                                                    <div key={idx} className="p-6 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4 relative group/ind hover:border-aether-gold/20 transition-all">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const newInds = [...newStaff.industries];
                                                                                newInds.splice(idx, 1);
                                                                                setNewStaff({ ...newStaff, industries: newInds });
                                                                            }}
                                                                            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover/ind:opacity-100"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>

                                                                        <div className="space-y-2">
                                                                            <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Industry Name</label>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="e.g. Energy Analytics"
                                                                                className="w-full bg-slate-900 border border-white/5 p-4 rounded-xl outline-none focus:border-aether-gold transition-all font-bold text-white text-sm"
                                                                                value={ind.title}
                                                                                onChange={e => {
                                                                                    const newInds = [...newStaff.industries];
                                                                                    newInds[idx].title = e.target.value;
                                                                                    setNewStaff({ ...newStaff, industries: newInds });
                                                                                }}
                                                                            />
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            <div className="space-y-2">
                                                                                <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Industry Image</label>
                                                                                <div className="flex gap-4 items-center">
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        className="hidden"
                                                                                        id={`new-ind-img-${idx}`}
                                                                                        onChange={async (e) => {
                                                                                            const file = e.target.files[0];
                                                                                            if (!file) return;

                                                                                            const formData = new FormData();
                                                                                            formData.append('image', file);

                                                                                            try {
                                                                                                const res = await axios.post(`${API_BASE_URL}/api/staff/upload-industry-image`, formData, {
                                                                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                                                                });
                                                                                                const newInds = [...newStaff.industries];
                                                                                                newInds[idx].image = res.data.url;
                                                                                                setNewStaff({ ...newStaff, industries: newInds });
                                                                                            } catch (err) {
                                                                                                console.error("UPLOAD_ERROR", err);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={`new-ind-img-${idx}`}
                                                                                        className="flex-1 bg-slate-900 border border-white/5 p-4 rounded-xl cursor-pointer hover:border-aether-gold/50 transition-all text-xs font-mono text-white/50 flex items-center justify-between"
                                                                                    >
                                                                                        <span className="truncate max-w-[150px]">{ind.image ? ind.image.split('/').pop() : 'CHOOSE_FILE'}</span>
                                                                                        <Plus size={14} className="text-aether-gold" />
                                                                                    </label>
                                                                                    {ind.image && (
                                                                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                                                                            <img src={ind.image.startsWith('http') ? ind.image : `${API_BASE_URL}${ind.image}`} className="w-full h-full object-cover" alt="" />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Details / Info</label>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Brief description..."
                                                                                    className="w-full bg-slate-900 border border-white/5 p-4 rounded-xl outline-none focus:border-aether-gold transition-all font-bold text-white text-xs"
                                                                                    value={ind.info}
                                                                                    onChange={e => {
                                                                                        const newInds = [...newStaff.industries];
                                                                                        newInds[idx].info = e.target.value;
                                                                                        setNewStaff({ ...newStaff, industries: newInds });
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {(newStaff.industries || []).length === 0 && (
                                                                    <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                                                                        No industries linked to this node
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button type="submit" className="w-full bg-white text-slate-950 font-black py-7 rounded-3xl uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-aether-gold transition-all flex items-center justify-center gap-4 group">
                                                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                                            <span>INITIALIZE_STAFF_SYNC</span>
                                                        </button>
                                                    </form>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>

                                    <div className="glass p-10 rounded-[4rem] border-white/10 bg-slate-900/40">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                                            <div>
                                                <h3 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">Team Hierarchy</h3>
                                                <p className="text-[10px] font-mono text-slate-500 mt-2 uppercase tracking-widest font-black">Sync_Status: Org_Stable</p>
                                            </div>
                                            <button onClick={() => setShowAddStaff(true)} className="flex items-center gap-3 px-8 py-4 bg-aether-gold text-slate-950 rounded-2xl text-[9px] font-black tracking-widest uppercase hover:bg-white transition-all shadow-lg shadow-aether-gold/20">
                                                <Plus size={14} /> Add Staff Node
                                            </button>
                                        </div>

                                        <div className="overflow-x-auto no-scrollbar">
                                            <table className="w-full text-left border-separate border-spacing-y-4">
                                                <thead>
                                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        <th className="pb-6 pl-8">Name</th>
                                                        <th className="pb-6">Level</th>
                                                        <th className="pb-6">Coverage</th>
                                                        <th className="pb-6">Role</th>
                                                        <th className="pb-6 pr-8 text-right font-mono">Operations</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {staff.map((m) => (
                                                        <tr key={m._id} className="group hover:scale-[1.01] transition-all duration-500">
                                                            <td className="py-6 pl-8 bg-slate-900/40 first:rounded-l-[2rem] border-y border-l border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500 shadow-2xl font-black text-white uppercase text-sm tracking-tight">{m.name}</td>
                                                            <td className="py-6 bg-slate-900/40 border-y border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500">
                                                                <span className="text-[8px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 uppercase tracking-widest text-slate-400">
                                                                    {m.level.replace('_', ' ')}
                                                                </span>
                                                            </td>
                                                            <td className="py-6 bg-slate-900/40 border-y border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500 text-[10px] font-black text-aether-gold uppercase tracking-widest">
                                                                {m.location || 'GLOBAL'}
                                                            </td>
                                                            <td className="py-6 bg-slate-900/40 border-y border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                                {m.role}
                                                            </td>
                                                            <td className="py-6 pr-8 bg-slate-900/40 border-y border-r border-white/5 last:rounded-r-[2rem] text-right group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500">
                                                                <button
                                                                    onClick={() => setEditingStaff(m)}
                                                                    className="p-3 text-slate-500 hover:text-aether-gold transition-all hover:scale-110 active:scale-90"
                                                                    title="Edit Staff Node"
                                                                >
                                                                    <LucideIcons.Edit3 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteStaff(m._id)}
                                                                    className="p-3 text-slate-500 hover:text-red-500 transition-all hover:scale-110 active:scale-90 ml-1"
                                                                    title="Terminate Node"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {staff.length === 0 && (
                                                <div className="text-center py-20 text-slate-300 font-mono text-[10px] uppercase tracking-widest border border-dashed border-slate-200 rounded-3xl">No staff nodes synchronized</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expert Panel Section: JURY */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Jury Panel</h4>
                                            <button onClick={() => { setEditingItem({ type: 'experts', data: { name: '', company: '', expertise: [], bio: '', linkedin: '', category: 'JUDGE' } }); setShowEditModal(true); }} className="px-4 py-2 bg-aether-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest">+ Member</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.experts.filter(e => e.category === 'JUDGE').map(expert => (
                                                <div key={expert._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 flex gap-6 items-start group">
                                                    <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-aether-gold/40 transition-all">
                                                        <Users size={24} className="text-slate-700" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="text-lg font-black text-white uppercase tracking-tight">{expert.name}</h4>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => { setEditingItem({ type: 'experts', data: expert }); setShowEditModal(true); }} className="p-1 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                                <button onClick={() => deleteCmsItem('experts', expert._id)} className="p-1 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                            </div>
                                                        </div>
                                                        <div className="text-[9px] font-mono text-aether-gold uppercase mb-4 tracking-widest">{expert.company} // {expert.category}</div>
                                                        <p className="text-xs text-slate-400 font-light leading-relaxed italic line-clamp-2">"{expert.bio}"</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Founding Partners Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Founding Partners</h4>
                                            <button onClick={() => { setEditingItem({ type: 'experts', data: { name: '', company: '', expertise: [], bio: '', linkedin: '', photo: '', category: 'FOUNDER' } }); setShowEditModal(true); }} className="px-4 py-2 bg-aether-gold text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white">+ Partner</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.experts.filter(e => e.category === 'FOUNDER').map(expert => (
                                                <div key={expert._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 flex gap-6 items-start group">
                                                    <div className="w-16 h-16 bg-slate-950 rounded-2xl overflow-hidden shrink-0 border border-white/10 group-hover:border-aether-gold/40 transition-all">
                                                        {expert.photo ? (
                                                            <img src={expert.photo.startsWith('http') ? expert.photo : `${API_BASE_URL}/${expert.photo}`} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <Users size={24} className="text-slate-700 m-5" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="text-lg font-black text-white uppercase tracking-tight">{expert.name}</h4>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => { setEditingItem({ type: 'experts', data: expert }); setShowEditModal(true); }} className="p-1 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                                <button onClick={() => deleteCmsItem('experts', expert._id)} className="p-1 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                            </div>
                                                        </div>
                                                        <div className="text-[9px] font-mono text-aether-gold uppercase mb-4 tracking-widest">{expert.company} // FOUNDER</div>
                                                        <p className="text-xs text-slate-400 font-light leading-relaxed italic line-clamp-2">"{expert.bio}"</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            )}

                            {activeTab === 'sponsorship' && (
                                <div className="glass p-10 md:p-14 rounded-[4rem] border-white/5 bg-slate-900/40 custom-scrollbar relative">
                                    <AnimatePresence>
                                        {showAddSponsor && (
                                            <>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    onClick={() => setShowAddSponsor(false)}
                                                    className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[200]"
                                                />
                                                <motion.div
                                                    initial={{ x: '100%', opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    exit={{ x: '100%', opacity: 0 }}
                                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                                    className="fixed top-0 right-0 h-screen w-full lg:w-[600px] bg-slate-900 shadow-[-50px_0_100px_rgba(0,0,0,0.8)] z-[201] p-8 md:p-16 border-l border-white/5 flex flex-col overflow-y-auto custom-scrollbar"
                                                >
                                                    <div className="flex justify-between items-center mb-12">
                                                        <div>
                                                            <h3 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">ADD_PROSPECT</h3>
                                                            <p className="text-[10px] font-mono font-black text-slate-500 tracking-widest mt-2 uppercase">Protocol: Pipeline_Ingest_v3</p>
                                                        </div>
                                                        <button onClick={() => setShowAddSponsor(false)} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors">
                                                            <X size={24} />
                                                        </button>
                                                    </div>

                                                    <form onSubmit={handleAddSponsor} className="space-y-8 lg:space-y-12">
                                                        <div className="space-y-6 lg:space-y-8">
                                                            <div className="space-y-3 lg:space-y-4">
                                                                <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Entity Name</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="e.g. NVIDIA Corporation"
                                                                    className="w-full bg-slate-950/50 border border-white/5 p-5 lg:p-6 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white placeholder:text-slate-700"
                                                                    value={newSponsor.companyName}
                                                                    onChange={e => setNewSponsor({ ...newSponsor, companyName: e.target.value })}
                                                                    required
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-3 lg:space-y-4">
                                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Contact</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Name"
                                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 lg:p-6 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white placeholder:text-slate-700 font-mono"
                                                                        value={newSponsor.contactPerson}
                                                                        onChange={e => setNewSponsor({ ...newSponsor, contactPerson: e.target.value })}
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="space-y-3 lg:space-y-4">
                                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Email</label>
                                                                    <input
                                                                        type="email"
                                                                        placeholder="protocol@node.com"
                                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 lg:p-6 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white placeholder:text-slate-700 font-mono"
                                                                        value={newSponsor.email}
                                                                        onChange={e => setNewSponsor({ ...newSponsor, email: e.target.value })}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3 lg:space-y-4">
                                                                <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Partnership Tier</label>
                                                                <select className="w-full bg-slate-950/50 border border-white/5 p-5 lg:p-6 rounded-2xl outline-none font-bold text-white cursor-pointer hover:border-aether-gold transition-all appearance-none" value={newSponsor.tier} onChange={e => setNewSponsor({ ...newSponsor, tier: e.target.value })}>
                                                                    <option value="Bronze" className="bg-slate-900">Bronze Protocol</option>
                                                                    <option value="Silver" className="bg-slate-900">Silver Protocol</option>
                                                                    <option value="Gold" className="bg-slate-900">Gold Protocol</option>
                                                                    <option value="Platinum" className="bg-slate-900">Platinum Protocol</option>
                                                                    <option value="Title Sponsor" className="bg-slate-900">Global Title Sponsor</option>
                                                                </select>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-3 lg:space-y-4">
                                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Interest</label>
                                                                    <select className="w-full bg-slate-950/50 border border-white/5 p-5 lg:p-6 rounded-2xl outline-none font-bold text-white cursor-pointer hover:border-aether-gold transition-all appearance-none" value={newSponsor.interestLevel || 'Medium'} onChange={e => setNewSponsor({ ...newSponsor, interestLevel: e.target.value })}>
                                                                        <option value="Low" className="bg-slate-900">Low</option>
                                                                        <option value="Medium" className="bg-slate-900">Medium</option>
                                                                        <option value="High" className="bg-slate-900">High</option>
                                                                        <option value="Signed" className="bg-slate-900">Signed</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-3 lg:space-y-4">
                                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Valuation ($)</label>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="0"
                                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 lg:p-6 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white placeholder:text-slate-700 font-mono"
                                                                        value={newSponsor.estimatedValue}
                                                                        onChange={e => setNewSponsor({ ...newSponsor, estimatedValue: parseInt(e.target.value) || 0 })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button type="submit" className="w-full bg-white text-slate-950 font-black py-7 rounded-3xl uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-aether-gold transition-all flex items-center justify-center gap-4 group mt-8">
                                                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                                            <span>SYNC_PROSPECT_NODE</span>
                                                        </button>
                                                    </form>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                                        <h3 className="text-3xl font-black tracking-tighter uppercase text-white group-hover:text-aether-gold transition-colors">Sponsor Pipeline</h3>
                                        <button onClick={() => setShowAddSponsor(true)} className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-aether-accent text-white rounded-2xl text-[9px] font-black tracking-widest uppercase hover:shadow-xl hover:shadow-aether-accent/20 transition-all shadow-sm">
                                            <Plus size={14} /> Add Prospect
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto no-scrollbar pb-6">
                                        <table className="w-full text-left border-separate border-spacing-y-4 min-w-[800px]">
                                            <thead>
                                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <th className="pb-6 pl-8">Entity</th>
                                                    <th className="pb-6">Status</th>
                                                    <th className="pb-6">Type</th>
                                                    <th className="pb-6">Category</th>
                                                    <th className="pb-6 font-mono">Contact</th>
                                                    <th className="pb-6 font-mono">Protocol</th>
                                                    <th className="pb-6 pr-8 text-right font-mono">Valuation</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sponsors.length > 0 ? (
                                                    sponsors.map((s) => (
                                                        <tr key={s._id} className="group">
                                                            <td className="py-6 pl-8 font-black text-white bg-slate-950/40 first:rounded-l-3xl border-y border-l border-white/5 shadow-sm">{s.companyName}</td>
                                                            <td className="py-6 bg-slate-950/40 border-y border-white/5 shadow-sm">
                                                                <select
                                                                    className={`text-[9px] px-3 py-1 rounded-full font-black tracking-widest border-none cursor-pointer bg-slate-900 ${s.status === 'Partner' ? 'text-emerald-400' :
                                                                        s.status === 'In Discussion' ? 'text-amber-400' : 'text-slate-500'
                                                                        }`}
                                                                    value={s.status}
                                                                    onChange={(e) => handleSponsorStatusUpdate(s._id, e.target.value)}
                                                                >
                                                                    <option value="Lead" className="bg-slate-900">Lead</option>
                                                                    <option value="In Discussion" className="bg-slate-900">In Discussion</option>
                                                                    <option value="Contract Sent" className="bg-slate-900">Contract Sent</option>
                                                                    <option value="Partner" className="bg-slate-900">Partner</option>
                                                                </select>
                                                            </td>
                                                            <td className="py-6 bg-slate-950/40 border-y border-white/5 shadow-sm font-black text-slate-400 text-[10px]">{s.type || 'N/A'}</td>
                                                            <td className="py-6 bg-slate-950/40 border-y border-white/5 shadow-sm font-black text-slate-400 text-[10px] uppercase font-mono">{s.category || 'N/A'}</td>
                                                            <td className="py-6 bg-slate-950/40 border-y border-white/5 shadow-sm font-black text-slate-400 text-[10px]">{s.contactPerson}</td>
                                                            <td className="py-6 bg-slate-950/40 border-y border-white/5 shadow-sm">
                                                                <span className="text-[9px] font-black text-slate-500 font-mono tracking-widest">{s.tier.toUpperCase()}</span>
                                                            </td>
                                                            <td className="py-6 bg-slate-950/40 border-y border-r border-white/5 pr-8 last:rounded-r-3xl font-mono font-black text-emerald-400 text-right shadow-sm">
                                                                ${s.estimatedValue?.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="py-24 text-center bg-slate-900/40 rounded-[2.5rem] border border-dashed border-white/10 shadow-2xl">
                                                            <div className="flex flex-col items-center gap-6">
                                                                <div className="p-5 bg-white/5 rounded-2xl text-slate-500">
                                                                    <Target size={40} />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <span className="text-[12px] font-black text-white uppercase tracking-[0.3em] block">NO_PROSPECTS_DETECTED</span>
                                                                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">PIPELINE_EMPTY // WAITING_FOR_SYNC</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'bots' && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {botStatuses.map((bot) => (
                                            <div key={bot._id} className="glass p-8 rounded-[3rem] border-white/10 bg-slate-900/40 group overflow-hidden relative">
                                                <div className={`absolute top-0 right-0 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.08] transition-all ${bot.status === 'Active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    <Database size={100} />
                                                </div>
                                                <div className="flex justify-between items-start mb-10">
                                                    <div className={`p-4 rounded-2xl bg-slate-950 group-hover:scale-110 transition-transform ${bot.status === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        <Target size={24} />
                                                    </div>
                                                    <span className={`text-[8px] font-black tracking-widest px-3 py-1 rounded-full ${bot.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                        {bot.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{bot.botName}</h4>
                                                <p className="text-[10px] font-mono text-slate-500 mb-6">{bot.currentActivity}</p>
                                                <div className="flex justify-between items-center text-[8px] font-black text-slate-400 tracking-[0.2em] uppercase pt-6 border-t border-white/5">
                                                    <span>TASKS: {bot.tasksCompleted}</span>
                                                    <span>SYNC: {new Date(bot.lastSync).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        <div className="glass p-12 rounded-[4rem] border-white/5 bg-slate-900/20">
                                            <h3 className="text-2xl font-black text-white mb-12 tracking-tighter uppercase flex items-center gap-3">
                                                <TrendingUp className="text-aether-accent" /> REVENUE_PILLARS
                                            </h3>
                                            <div className="space-y-10">
                                                {revenuePillars.map(pillar => (
                                                    <div key={pillar.name}>
                                                        <div className="flex justify-between text-[10px] font-black font-mono mb-4">
                                                            <span className="text-slate-400 uppercase tracking-widest">{pillar.name}</span>
                                                            <span className="text-aether-accent">${(pillar.current / 1000).toFixed(0)}k / ${(pillar.target / 1000).toFixed(0)}k</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(pillar.current / pillar.target) * 100}%` }}
                                                                className="h-full rounded-full"
                                                                style={{ backgroundColor: pillar.color }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="glass p-12 rounded-[4rem] border-white/5 bg-slate-900/20">
                                            <h3 className="text-2xl font-black text-white mb-12 tracking-tighter uppercase flex items-center gap-3">
                                                <BarChart3 className="text-aether-accent" /> GEOGRAPHIC_DIST
                                            </h3>
                                            <div className="flex flex-col gap-6">
                                                {Object.entries(geographicData).map(([region, percent]) => (
                                                    <div key={region} className="flex items-center gap-6">
                                                        <div className="w-24 text-[10px] font-black text-slate-500 uppercase font-mono tracking-widest">{region}</div>
                                                        <div className="flex-1 h-8 bg-slate-950/50 rounded-xl overflow-hidden relative">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percent}%` }}
                                                                className="h-full bg-aether-accent opacity-20"
                                                            />
                                                            <div className="absolute inset-0 flex items-center px-4 justify-between">
                                                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                                                <span className="text-[10px] font-black text-aether-accent font-mono">{percent}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'logistics' && (
                                <div
                                    className="glass p-10 md:p-20 rounded-[4rem] border-white/10 bg-slate-900/60"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16 px-4">
                                        <div>
                                            <h3 className="text-4xl font-black tracking-tighter uppercase text-white leading-none group-hover:text-aether-gold transition-colors">GALA_RSVP<br />SYSTEM</h3>
                                            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-4">Managing access to the Royal Museum of Science gala.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-slate-950/40 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center group shadow-2xl backdrop-blur-3xl">
                                                <div className="text-4xl font-black text-aether-gold leading-none group-hover:scale-110 transition-transform">{rsvps.length}</div>
                                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-4">CONFIRMED</div>
                                            </div>
                                            <div className="bg-slate-950/40 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center group shadow-2xl backdrop-blur-3xl">
                                                <div className="text-4xl font-black text-emerald-400 leading-none group-hover:scale-110 transition-transform">{rsvps.reduce((acc, r) => acc + (r.guestCount || 1), 0)}</div>
                                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-4">TOTAL_HEADS</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto no-scrollbar pb-6">
                                        <table className="w-full text-left border-separate border-spacing-y-4 min-w-[800px]">
                                            <thead>
                                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <th className="pb-6 pl-8">Guest</th>
                                                    <th className="pb-6">Nodes</th>
                                                    <th className="pb-6">Status</th>
                                                    <th className="pb-6 pr-8 text-right font-mono">Protocol</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rsvps.map((rsvp) => (
                                                    <tr key={rsvp._id} className="group hover:scale-[1.01] transition-all duration-500">
                                                        <td className="py-6 pl-8 bg-slate-900/40 first:rounded-l-[2rem] border-y border-l border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500 shadow-2xl">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 border border-white/5 uppercase">
                                                                    {rsvp.guestName.charAt(0)}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-black text-white uppercase text-sm tracking-tight group-hover:text-aether-gold transition-colors">{rsvp.guestName}</span>
                                                                    <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">{rsvp.email}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-6 bg-slate-900/40 border-y border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500">
                                                            <span className="text-[9px] font-black text-white uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                                                {rsvp.guestCount} NODES
                                                            </span>
                                                        </td>
                                                        <td className="py-6 bg-slate-900/40 border-y border-white/5 group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500">
                                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                                                CONFIRMED
                                                            </span>
                                                        </td>
                                                        <td className="py-6 pr-8 bg-slate-900/40 border-y border-r border-white/5 last:rounded-r-[2rem] text-right group-hover:border-aether-gold/30 group-hover:bg-slate-900/60 transition-all duration-500">
                                                            <div className="text-[10px] font-mono text-slate-500 uppercase">
                                                                SYNC_NODE_{rsvp._id.slice(-4).toUpperCase()}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'strategy' && (
                                <div
                                    className="space-y-12"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        {/* Investment Opportunity Tracker */}
                                        <div className="glass p-12 rounded-[4rem] border-white/5 bg-slate-900/40 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-aether-gold/5 rounded-full blur-[80px] -z-10 group-hover:bg-aether-gold/10 transition-colors"></div>
                                            <h3 className="text-3xl font-black text-white mb-12 tracking-tighter uppercase flex items-center gap-4">
                                                <TrendingUp className="text-aether-gold" /> INVESTMENT_TRACKER
                                            </h3>
                                            <div className="space-y-8">
                                                {[
                                                    { label: 'EQUITY_AVAILABLE', value: '12%', status: 'NEGOTIATION', color: 'text-aether-gold' },
                                                    { label: 'POST_MONEY_VAL', value: '£5.2M', status: 'STABLE', color: 'text-white' },
                                                    { label: 'FOUNDING_PARTNERS', value: '3/5', status: 'ACTIVE', color: 'text-white' }
                                                ].map((stat, i) => (
                                                    <div key={i} className="flex justify-between items-center p-8 bg-slate-950/60 rounded-[2.5rem] border border-white/5 group/stat hover:border-aether-gold/30 transition-all shadow-2xl">
                                                        <div>
                                                            <div className="text-[10px] font-mono text-slate-500 mb-1 font-black tracking-widest uppercase">{stat.label}</div>
                                                            <div className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
                                                        </div>
                                                        <div className="px-5 py-2 bg-slate-900 rounded-xl text-[9px] font-black text-aether-gold border border-aether-gold/20 group-hover/stat:bg-aether-gold group-hover/stat:text-white transition-colors uppercase tracking-widest">{stat.status}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Global Roadmap Visualization */}
                                        <div className="glass p-12 rounded-[4rem] border-white/5 bg-slate-900/40 relative overflow-hidden group">
                                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-aether-accent/5 rounded-full blur-[80px] -z-10 group-hover:bg-aether-accent/10 transition-colors"></div>
                                            <h3 className="text-3xl font-black text-white mb-12 tracking-tighter uppercase flex items-center gap-4">
                                                <Target className="text-aether-gold" /> GLOBAL_ROADMAP
                                            </h3>
                                            <div className="space-y-10 relative">
                                                <div className="absolute left-6 top-8 bottom-8 w-px bg-white/5"></div>
                                                {[
                                                    { year: 'PHASE 01', goal: 'Launch 15 Country Nodes', date: 'Q2 2026', done: true },
                                                    { year: 'PHASE 02', goal: 'GAIO Academy Activation', date: 'Q4 2026', done: false },
                                                    { year: 'PHASE 03', goal: 'Global Finale & Venture Fund', date: '2027', done: false },
                                                    { year: 'PHASE 04', goal: 'Institutional R&D Hubs', date: '2028', done: false }
                                                ].map((phase, i) => (
                                                    <div key={i} className="relative pl-16 group/phase">
                                                        <div className={`absolute left-4 top-2 w-4 h-4 rounded-full border-4 border-slate-900 z-10 transition-all ${phase.done ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700 group-hover/phase:bg-aether-gold'}`}></div>
                                                        <div className="text-[10px] font-mono text-slate-500 mb-1 font-black tracking-widest uppercase">{phase.year} // {phase.date}</div>
                                                        <div className={`text-xl font-black uppercase tracking-tight transition-colors ${phase.done ? 'text-white' : 'text-slate-500 group-hover/phase:text-white'}`}>{phase.goal}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        {/* Skill Matching Engine Status */}
                                        <div className="glass p-12 rounded-[4rem] border-white/5 bg-slate-900/40">
                                            <h3 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase flex items-center gap-4"><Cpu className="text-aether-gold" size={24} /> NEURAL_MATCHING_ENGINE</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                                                {renderStatCard("OVERALL_UNITS", participants.length, Users)}
                                                {renderStatCard("ACTIVE_PAYLOADS", submissions.length, FileText)}
                                                {renderStatCard("GALA_RESERVATIONS", rsvps.length, Star)}
                                                {renderStatCard("REVENUE_PIPELINE", `$${(revenuePillars.reduce((a, b) => a + b.current, 0) / 1000).toFixed(0)}k`, TrendingUp)}
                                            </div>
                                        </div>

                                        {/* Strategic Leads Feed */}
                                        <div className="glass p-12 rounded-[4rem] border-white/5 bg-slate-900/40 relative overflow-hidden group">
                                            <h3 className="text-2xl font-black text-white mb-10 tracking-tighter uppercase flex items-center gap-4">
                                                <Users className="text-aether-gold" /> STRATEGIC_LEADS
                                            </h3>
                                            <div className="space-y-4">
                                                {sponsors.filter(s => s.tier === 'Platinum' || s.tier === 'Gold').slice(0, 3).map((lead, i) => (
                                                    <div key={i} className="flex justify-between items-center p-6 bg-slate-950/60 rounded-3xl border border-white/5 group/lead hover:border-aether-gold/30 transition-all">
                                                        <div>
                                                            <div className="text-white font-black uppercase text-sm tracking-tight">{lead.companyName}</div>
                                                            <div className="text-[9px] font-mono text-slate-500 font-bold tracking-widest uppercase">{lead.contactPerson} // NODE_{i + 1}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-aether-gold font-black text-sm uppercase tracking-tighter">£{lead.estimatedValue?.toLocaleString()}</div>
                                                            <div className="text-[8px] font-mono text-emerald-500 font-black uppercase tracking-widest">VETTING_SYNC</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {sponsors.filter(s => s.tier === 'Platinum' || s.tier === 'Gold').length === 0 && (
                                                    <div className="text-center py-10 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] border border-dashed border-white/5 rounded-3xl">No high-tier leads currently synchronized</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'page_home' && (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-3xl font-black text-white uppercase">Home Page Sync</h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Hero', key: '', value: '' } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Page String</button>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: '', icon: 'Cpu', color: 'text-aether-gold', category: 'HERO_FEATURE' } }); setShowEditModal(true); }} className="px-6 py-3 bg-aether-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-aether-accent/90">+ Feature Card</button>
                                        </div>
                                    </div>

                                    {/* Hero Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Hero Section</h4>
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Hero', key: 'hero_heading', value: '' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Text</button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Hero Texts */}
                                            {cmsData.content.filter(c => c.sectionId === 'Hero' && c.key !== 'target_date_iso').map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-aether-gold font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-light leading-relaxed">{item.value}</p>
                                                </div>
                                            ))}

                                            {/* Timer Node */}
                                            {cmsData.content.filter(c => c.sectionId === 'Hero' && c.key === 'target_date_iso').map(timer => (
                                                <div key={timer._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden flex items-center justify-between">
                                                    <div>
                                                        <div className="text-[10px] font-mono text-emerald-500 mb-2 uppercase tracking-widest">Countdown_Sync</div>
                                                        <div className="text-xl font-black text-white tracking-widest">{timer.value}</div>
                                                    </div>
                                                    <button onClick={() => { setEditingItem({ type: 'content', data: timer }); setShowEditModal(true); }} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Clock size={24} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Features Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Features Section</h4>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: '', icon: 'Cpu', color: 'text-aether-gold', category: 'HERO_FEATURE' } }); setShowEditModal(true); }} className="px-4 py-2 bg-aether-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-aether-accent/90">+ Feature</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {cmsData.gateway.filter(g => g.category === 'HERO_FEATURE').map(node => (
                                                <div key={node._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className={`p-4 rounded-2xl bg-slate-950 ${node.color}`}><DynamicIcon name={node.icon} size={24} /></div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: node }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('gateway', node._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <h4 className="text-xl font-black text-white uppercase mb-2">{node.title}</h4>
                                                    <p className="text-[10px] text-slate-400 uppercase font-mono leading-relaxed">{node.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Partners Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Partner Ecosystem</h4>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: 'Partner Name', description: 'PARTNER', icon: 'Globe', category: 'PARTNER' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Partner</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            {cmsData.gateway.filter(g => g.category === 'PARTNER').map(node => (
                                                <div key={node._id} className="glass p-6 rounded-[2rem] border-white/5 bg-slate-900/40 group relative overflow-hidden flex items-center gap-4">
                                                    <div className="p-3 rounded-xl bg-slate-950 text-slate-500"><DynamicIcon name={node.icon} size={20} /></div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-black text-white uppercase">{node.title}</h4>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => { setEditingItem({ type: 'gateway', data: node }); setShowEditModal(true); }} className="p-1 text-slate-500 hover:text-white transition-colors"><Settings size={12} /></button>
                                                        <button onClick={() => deleteCmsItem('gateway', node._id)} className="p-1 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={12} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'page_academy' && (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-3xl font-black text-white uppercase">Academy Workspace</h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Academy', key: '', value: '' } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Page String</button>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: '', icon: 'Cpu', subtext: 'MODULE_01', category: 'ACADEMY_MODULE', topics: ['Topic 1', 'Topic 2'], details: 'Full module details go here...' } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Curriculum Node</button>
                                            <button onClick={() => { setEditingItem({ type: 'academy', data: { title: '', date: '', type: 'VIDEO', description: '', size: '500MB', duration: '45m', overview: 'Technical overview of this resource...', specs: ['Requirement 1', 'Requirement 2'] } }); setShowEditModal(true); }} className="px-6 py-3 bg-aether-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest">+ Digital Asset</button>
                                        </div>
                                    </div>

                                    {/* Header Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Header Section</h4>
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Academy', key: '', value: '' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Text</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.content.filter(c => c.sectionId === 'Academy').map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-aether-gold font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-light leading-relaxed">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Certification Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Certification Nodes</h4>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', subtext: 'CERT_ID', icon: 'Shield', category: 'ACADEMY_CERT' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Cert</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {cmsData.gateway.filter(g => g.category === 'ACADEMY_CERT').map(node => (
                                                <div key={node._id} className="glass p-6 rounded-3xl border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl"><DynamicIcon name={node.icon} size={20} /></div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: node }); setShowEditModal(true); }} className="p-1 text-slate-500 hover:text-white transition-colors"><Settings size={12} /></button>
                                                            <button onClick={() => deleteCmsItem('gateway', node._id)} className="p-1 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={12} /></button>
                                                        </div>
                                                    </div>
                                                    <div className="text-[8px] font-mono text-slate-500 mb-1 uppercase">{node.subtext}</div>
                                                    <h5 className="font-black text-white text-xs uppercase tracking-widest">{node.title}</h5>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Curriculum Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">6_Week Curriculum</h4>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: '', icon: 'Cpu', subtext: 'MODULE_01', category: 'ACADEMY_MODULE', topics: ['Topic 1'], details: 'Details...' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Module</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {cmsData.gateway.filter(g => g.category === 'ACADEMY_MODULE').sort((a, b) => a.order - b.order).map(module => (
                                                <div key={module._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-4 rounded-2xl bg-slate-950 text-aether-gold group-hover:bg-aether-gold group-hover:text-white transition-all"><DynamicIcon name={module.icon} size={24} /></div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: module }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('gateway', module._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] font-mono text-aether-gold mb-2 uppercase tracking-widest">{module.subtext}</div>
                                                    <h4 className="text-xl font-black text-white uppercase mb-2">{module.title}</h4>
                                                    <p className="text-[10px] text-slate-400 uppercase font-mono leading-relaxed line-clamp-2">{module.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Library Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Library Resources</h4>
                                            <button onClick={() => { setEditingItem({ type: 'academy', data: { title: '', date: '', type: 'VIDEO', description: '', size: '500MB', duration: '45m', overview: 'Overview...', specs: ['Spec 1'] } }); setShowEditModal(true); }} className="px-4 py-2 bg-aether-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-aether-accent/90">+ Asset</button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-separate border-spacing-y-4">
                                                <thead>
                                                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                        <th className="pl-8 pb-4">Title</th>
                                                        <th className="pb-4">Type</th>
                                                        <th className="pb-4">File Specs</th>
                                                        <th className="pr-8 pb-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cmsData.academy.map(res => (
                                                        <tr key={res._id} className="group">
                                                            <td className="py-6 pl-8 bg-slate-900/40 first:rounded-l-3xl border-y border-l border-white/5 font-black text-white text-sm">{res.title}</td>
                                                            <td className="py-6 bg-slate-900/40 border-y border-white/5">
                                                                <span className="text-[9px] px-3 py-1 bg-white/5 rounded-full text-slate-400 font-mono">{res.type}</span>
                                                            </td>
                                                            <td className="py-6 bg-slate-900/40 border-y border-white/5 font-mono text-[10px] text-slate-500">
                                                                {res.size} // {res.duration || res.pages || res.format}
                                                            </td>
                                                            <td className="py-6 pr-8 bg-slate-900/40 border-y border-r border-white/5 last:rounded-r-3xl text-right">
                                                                <button onClick={() => { setEditingItem({ type: 'academy', data: res }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white"><Settings size={14} /></button>
                                                                <button onClick={() => deleteCmsItem('academy', res._id)} className="p-2 text-slate-500 hover:text-rose-500"><Trash2 size={14} /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'page_prizes' && (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-3xl font-black text-white uppercase">Prizes & Panel Sync</h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Prizes', key: '', value: '' } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Page String</button>
                                            <button onClick={() => { setEditingItem({ type: 'awards', data: { tierName: '', reward: '', description: '', icon: 'Award', color: 'text-aether-gold', order: 0 } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Reward Tier</button>
                                            <button onClick={() => { setEditingItem({ type: 'experts', data: { name: '', company: '', expertise: [], bio: '', linkedin: '', category: 'JUDGE' } }); setShowEditModal(true); }} className="px-6 py-3 bg-aether-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest">+ Panel Member</button>
                                        </div>
                                    </div>

                                    {/* Header Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Header Section</h4>
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Prizes', key: '', value: '' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Text</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.content.filter(c => c.sectionId === 'Prizes').map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-aether-gold font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-light leading-relaxed">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rewards Tier Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Rewards Tier</h4>
                                            <button onClick={() => { setEditingItem({ type: 'awards', data: { tierName: '', reward: '', description: '', icon: 'Award', color: 'text-aether-gold', order: 0 } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Tier</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {cmsData.awards.sort((a, b) => a.order - b.order).map(tier => (
                                                <div key={tier._id} className="glass p-10 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-8">
                                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-aether-gold">
                                                            <Award size={32} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'awards', data: tier }); setShowEditModal(true); }} className="p-2 text-slate-400 hover:text-white transition-colors"><Settings size={16} /></button>
                                                            <button onClick={() => deleteCmsItem('awards', tier._id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{tier.tierName}</h4>
                                                    <div className="text-aether-gold font-mono text-xl font-black mb-4">{tier.reward}</div>
                                                    <p className="text-[10px] text-slate-500 uppercase font-black leading-relaxed">{tier.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            )}



                            {activeTab === 'page_about' && (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-3xl font-black text-white uppercase">Mission & Impact Sync</h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'About', key: '', value: '' } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Page String</button>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: 'Detailed description for About card...', icon: 'Target', category: 'ABOUT_CARD', subtext: '01', order: 0 } }); setShowEditModal(true); }} className="px-6 py-3 bg-aether-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest">+ About Card</button>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: '', icon: 'Shield', category: 'ABOUT_STRENGTH', order: 0 } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">+ About Strength</button>
                                        </div>
                                    </div>

                                    {/* Header Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Header Section</h4>
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'About', key: '', value: '' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Text</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.content.filter(c => c.sectionId === 'About').map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-aether-gold font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-light leading-relaxed">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mission Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Mission Section</h4>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: 'Detailed description for About card...', icon: 'Target', category: 'ABOUT_CARD', subtext: '01', order: 0 } }); setShowEditModal(true); }} className="px-4 py-2 bg-aether-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest">+ Card</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {cmsData.gateway.filter(g => g.category === 'ABOUT_CARD').sort((a, b) => a.order - b.order).map(card => (
                                                <div key={card._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-4 rounded-2xl bg-slate-950 text-aether-gold group-hover:bg-aether-gold group-hover:text-white transition-all"><DynamicIcon name={card.icon} size={24} /></div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: card }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('gateway', card._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">ABOUT_SYNC // {card.subtext}</div>
                                                    <h4 className="text-xl font-black text-white uppercase mb-4">{card.title}</h4>
                                                    <p className="text-[10px] text-slate-400 uppercase font-black leading-relaxed">{card.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Strengths Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Protocol Strengths</h4>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: '', icon: 'Shield', category: 'ABOUT_STRENGTH', order: 0 } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Strength</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {cmsData.gateway.filter(g => g.category === 'ABOUT_STRENGTH').sort((a, b) => a.order - b.order).map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="w-12 h-1 bg-aether-gold/30 rounded-full"></div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('gateway', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <h4 className="font-black text-white uppercase tracking-widest text-xs mb-2">{item.title}</h4>
                                                    <p className="text-slate-500 text-[10px] font-black uppercase leading-relaxed">{item.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'page_gala' && (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-3xl font-black text-white uppercase">Gala & Strategy Sync</h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Gala', key: '', value: '' } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Page String</button>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', subtext: 'PHASE 01', description: 'Roadmap step description...', icon: 'Target', category: 'ROADMAP', order: 0 } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">+ Roadmap Step</button>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: 'New Pillar', subtext: 'STRATEGY', description: 'Detailed strategy breakdown...', category: 'STRATEGY_PILLAR', payload: { projections: ['500% Efficiency', '10k nodes'], kpis: ['KPI 1', 'KPI 2'], strategy: 'Detailed strategy text...' } } }); setShowEditModal(true); }} className="px-6 py-3 bg-aether-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest">+ Strategic Pillar</button>
                                        </div>
                                    </div>

                                    {/* Gala Strings */}
                                    <section className="space-y-6">
                                        <h4 className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.5em] border-b border-white/5 pb-4">Gala _ Headings</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.content.filter(c => c.sectionId === 'Gala').map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-aether-gold font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-light leading-relaxed">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-6">
                                        <h4 className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.5em] border-b border-white/5 pb-4">Event _ Roadmap</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {cmsData.gateway.filter(g => g.category === 'ROADMAP').sort((a, b) => a.order - b.order).map(node => (
                                                <div key={node._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-4 rounded-2xl bg-slate-950 text-aether-gold"><Target size={24} /></div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: node }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('gateway', node._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">{node.subtext}</div>
                                                    <h4 className="text-xl font-black text-white uppercase mb-2">{node.title}</h4>
                                                    <p className="text-[10px] text-slate-400 uppercase font-mono leading-relaxed">{node.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-6">
                                        <h4 className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.5em] border-b border-white/5 pb-4">Strategy _ Pillars</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {cmsData.gateway.filter(g => g.category === 'STRATEGY_PILLAR').sort((a, b) => a.order - b.order).map(pillar => (
                                                <div key={pillar._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 border border-emerald-500/20"><TrendingUp size={24} /></div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: pillar }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('gateway', pillar._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] font-mono text-emerald-500 mb-2 uppercase tracking-widest">{pillar.subtext}</div>
                                                    <h4 className="text-xl font-black text-white uppercase mb-2">{pillar.title}</h4>
                                                    <p className="text-[10px] text-slate-400 uppercase font-mono leading-relaxed">{pillar.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-6">
                                        <h4 className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.5em] border-b border-white/5 pb-4">Strategic _ Partners</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {cmsData.gateway.filter(g => g.category === 'PARTNER').map(node => (
                                                <div key={node._id} className="glass p-6 rounded-3xl border-white/5 bg-slate-900/40 group text-center">
                                                    <div className="flex justify-between mb-4">
                                                        <div className="text-[8px] font-bold text-aether-gold uppercase tracking-tighter">PARTNER_NODE</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: node }); setShowEditModal(true); }} className="text-slate-500 hover:text-white"><Settings size={12} /></button>
                                                            <button onClick={() => deleteCmsItem('gateway', node._id)} className="text-slate-500 hover:text-rose-500"><Trash2 size={12} /></button>
                                                        </div>
                                                    </div>
                                                    <h5 className="font-black text-white text-xs uppercase mb-1 tracking-widest">{node.title}</h5>
                                                    <div className="text-[9px] font-mono text-slate-500 uppercase">{node.subtext}</div>
                                                </div>
                                            ))}
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', subtext: '', icon: 'Database', category: 'PARTNER' } }); setShowEditModal(true); }} className="glass p-6 rounded-3xl border border-dashed border-white/10 text-slate-600 text-[10px] font-black uppercase hover:text-white hover:border-white/30 transition-all">+ Add Partner</button>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'page_faqs' && (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-3xl font-black text-white uppercase">FAQ Workspace</h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'FAQ', key: '', value: '' } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Header String</button>
                                            <button onClick={() => { setEditingItem({ type: 'faqs', data: { question: '', answer: '', category: 'GENERAL', order: 0 } }); setShowEditModal(true); }} className="px-6 py-3 bg-aether-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest">+ New FAQ Node</button>
                                        </div>
                                    </div>

                                    {/* Page Headings */}
                                    <section className="space-y-6">
                                        <h4 className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.5em] border-b border-white/5 pb-4">FAQ _ Headings</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.content.filter(c => c.sectionId === 'FAQ').map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-aether-gold font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-light leading-relaxed">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-6 h-fit h-full">
                                        <h4 className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.5em] border-b border-white/5 pb-4">Knowledge _ Base</h4>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                            {cmsData.faqs.sort((a, b) => a.order - b.order).map(faq => (
                                                <div key={faq._id} className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 group relative">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="text-xs font-black text-white uppercase leading-tight max-w-[80%]">{faq.question}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'faqs', data: faq }); setShowEditModal(true); }} className="p-1 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('faqs', faq._id)} className="p-1 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 uppercase font-black leading-relaxed line-clamp-2">{faq.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'page_contact' && (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-3xl font-black text-white uppercase">Contact Sync Terminal</h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Contact', key: '', value: '' } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Page String</button>
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Contact', key: 'event_location', value: 'Royal Museum, London' } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Event Meta</button>
                                            <button onClick={() => { setEditingItem({ type: 'contact', data: { label: '', value: '', icon: 'Mail', type: 'LINK', redirectUrl: '' } }); setShowEditModal(true); }} className="px-6 py-3 bg-aether-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest">+ Communication Channel</button>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: '', icon: 'Globe', category: 'LOCATION', color: 'text-blue-400' } }); setShowEditModal(true); }} className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/30 transition-all">+ Location Data</button>
                                        </div>
                                    </div>

                                    {/* Header Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Header Section</h4>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Contact', key: '', value: '' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Text</button>
                                                <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Contact', key: 'event_location', value: 'Royal Museum, London' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Meta</button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.content.filter(c => c.sectionId === 'Contact').map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-aether-gold font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-light leading-relaxed">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Locations Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Locations Section</h4>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: '', icon: 'Globe', category: 'LOCATION', color: 'text-blue-400' } }); setShowEditModal(true); }} className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/30">+ Node</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {cmsData.gateway.filter(g => g.category === 'LOCATION').map(node => (
                                                <div key={node._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className={`p-4 rounded-2xl bg-slate-950 ${node.color}`}><DynamicIcon name={node.icon} size={24} /></div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: node }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('gateway', node._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <h4 className="text-xl font-black text-white uppercase mb-2">{node.title}</h4>
                                                    <p className="text-[10px] text-slate-400 uppercase font-mono leading-relaxed">{node.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Communication Section (Direct Connect) */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Direct Connect</h4>
                                            <button onClick={() => { setEditingItem({ type: 'contact', data: { label: '', value: '', icon: 'Mail', type: 'LINK', redirectUrl: '' } }); setShowEditModal(true); }} className="px-4 py-2 bg-aether-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-aether-accent/90">+ Channel</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.contact.filter(c => c.type === 'LINK').map(node => (
                                                <div key={node._id} className="flex justify-between items-center p-6 bg-slate-900/40 rounded-2xl border border-white/5 group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-slate-950 rounded-xl text-aether-gold"><DynamicIcon name={node.icon || 'Mail'} size={16} /></div>
                                                        <div>
                                                            <div className="text-xs font-black text-white uppercase">{node.label}</div>
                                                            <div className="text-[9px] font-mono text-slate-500">{node.value}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { setEditingItem({ type: 'contact', data: node }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                        <button onClick={() => deleteCmsItem('contact', node._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Social Net Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Social Net</h4>
                                            <button onClick={() => { setEditingItem({ type: 'contact', data: { label: 'Social', value: '@Handle', icon: 'Twitter', type: 'SOCIAL', redirectUrl: '' } }); setShowEditModal(true); }} className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/30">+ Social Node</button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                            {cmsData.contact.filter(c => c.type === 'SOCIAL').map(node => (
                                                <div key={node._id} className="flex flex-col items-center p-6 bg-slate-900/40 rounded-3xl border border-white/5 group relative">
                                                    <div className="p-4 bg-slate-950 rounded-2xl text-white mb-4"><DynamicIcon name={node.icon} size={24} /></div>
                                                    <div className="text-[10px] font-black text-white uppercase mb-1">{node.icon}</div>
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setEditingItem({ type: 'contact', data: node }); setShowEditModal(true); }} className="p-1 text-slate-500 hover:text-white"><Settings size={12} /></button>
                                                        <button onClick={() => deleteCmsItem('contact', node._id)} className="p-1 text-slate-500 hover:text-rose-500"><Trash2 size={12} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'page_sponsor' && (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-3xl font-black text-white uppercase italic">Sponsor <span className="text-gradient">Sync</span></h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Sponsor', key: '', value: '' } }); setShowEditModal(true); }} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Page String</button>
                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: '', icon: 'Target', category: 'STRATEGY_PILLAR', subtext: 'REVENUE', order: 0, payload: { value: '', projections: [], kpis: [], strategy: '' } } }); setShowEditModal(true); }} className="px-6 py-3 bg-aether-gold text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest">+ Revenue Pillar</button>
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Sponsor_Timeline', key: '', value: '' } }); setShowEditModal(true); }} className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest">+ Timeline Node</button>
                                        </div>
                                    </div>

                                    {/* Hero Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Portal Intro</h4>
                                            <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Sponsor', key: '', value: '' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Text</button>
                                        </div>
                                        {/* Generic Content (Hero/Intro) */}
                                        <h4 className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.5em] border-b border-white/5 pb-4 mb-8">Hero _ Content</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.content.filter(c => c.sectionId === 'Sponsor' && !['pillar_heading', 'model_heading', 'termsheet_heading'].includes(c.key) && !(c.key.includes('pack') || c.key.includes('auth') || c.key.includes('extraction') || c.key.includes('pdf'))).map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-aether-gold font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-light leading-relaxed">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Protocol Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Protocol & Auth</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.content.filter(c => c.sectionId === 'Sponsor' && (c.key.includes('pack') || c.key.includes('auth') || c.key.includes('extraction') || c.key.includes('pdf'))).map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-emerald-500 font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-black leading-relaxed">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Revenue Pillars Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Revenue Pillars</h4>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Sponsor', key: 'pillar_heading', value: 'REVENUE_ARCHITECTURES' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Heading</button>
                                                <button onClick={() => { setEditingItem({ type: 'gateway', data: { title: '', description: '', icon: 'Target', category: 'STRATEGY_PILLAR', subtext: 'REVENUE', order: 0, payload: { value: '', mission: '', strategy: '', projections: [], kpis: [] } } }); setShowEditModal(true); }} className="px-4 py-2 bg-aether-gold text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-widest">+ Pillar</button>
                                            </div>
                                        </div>

                                        {/* Localized Heading for this section */}
                                        <div className="grid grid-cols-1 gap-8 mb-4">
                                            {cmsData.content.filter(c => c.sectionId === 'Sponsor' && c.key === 'pillar_heading').map(item => (
                                                <div key={item._id} className="glass p-6 rounded-3xl border-white/10 bg-white/5 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-[9px] font-mono text-slate-400 mb-1 uppercase tracking-widest">Section Heading</div>
                                                        <div className="text-xl font-black text-white tracking-widest">{item.value}</div>
                                                    </div>
                                                    <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-3 bg-slate-950 rounded-xl text-slate-400 hover:text-white transition-colors"><Settings size={14} /></button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {cmsData.gateway.filter(g => g.category === 'STRATEGY_PILLAR').sort((a, b) => a.order - b.order).map(pillar => (
                                                <div key={pillar._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 border border-emerald-500/20"><TrendingUp size={24} /></div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'gateway', data: pillar }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('gateway', pillar._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] font-mono text-emerald-500 mb-2 uppercase tracking-widest">{pillar.subtext}</div>
                                                    <h4 className="text-xl font-black text-white uppercase mb-2">{pillar.title}</h4>
                                                    <p className="text-[10px] text-slate-400 uppercase font-mono leading-relaxed line-clamp-2">{pillar.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Financial Timeline Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Financial Timeline</h4>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Sponsor', key: 'model_heading', value: 'FINANCIAL_MODEL' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Heading</button>
                                                <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Sponsor_Timeline', key: 'Timeline_Node', value: '202X | GOAL_NAME | $00M | 00%' } }); setShowEditModal(true); }} className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest">+ Node</button>
                                            </div>
                                        </div>

                                        {/* Localized Heading */}
                                        <div className="grid grid-cols-1 gap-8 mb-4">
                                            {cmsData.content.filter(c => c.sectionId === 'Sponsor' && c.key === 'model_heading').map(item => (
                                                <div key={item._id} className="glass p-6 rounded-3xl border-white/10 bg-white/5 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-[9px] font-mono text-slate-400 mb-1 uppercase tracking-widest">Section Heading</div>
                                                        <div className="text-xl font-black text-white tracking-widest">{item.value}</div>
                                                    </div>
                                                    <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-3 bg-slate-950 rounded-xl text-slate-400 hover:text-white transition-colors"><Settings size={14} /></button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {cmsData.content.filter(c => c.sectionId === 'Sponsor_Timeline').map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-blue-400 font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-black">{item.value}</p>
                                                    <div className="mt-2 text-[8px] font-mono text-slate-500">{item.value.includes('|') ? 'FORMAT_VALID' : 'INVALID_FORMAT'}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Term Sheet Section */}
                                    <div className="p-10 rounded-[4rem] border border-white/5 bg-white/[0.02] space-y-10">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Term Sheet</h4>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Sponsor', key: 'termsheet_heading', value: 'SPONSOR_SYNDICATE_TERM_SHEET' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">+ Heading</button>
                                                <button onClick={() => { setEditingItem({ type: 'content', data: { sectionId: 'Sponsor_TermSheet', key: '00_TERM_LABEL', value: 'TERM_VALUE' } }); setShowEditModal(true); }} className="px-4 py-2 bg-white/5 border border-dashed border-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">+ Term Clause</button>
                                            </div>
                                        </div>

                                        {/* Localized Heading */}
                                        <div className="grid grid-cols-1 gap-8 mb-4">
                                            {cmsData.content.filter(c => c.sectionId === 'Sponsor' && c.key === 'termsheet_heading').map(item => (
                                                <div key={item._id} className="glass p-6 rounded-3xl border-white/10 bg-white/5 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-[9px] font-mono text-slate-400 mb-1 uppercase tracking-widest">Section Heading</div>
                                                        <div className="text-xl font-black text-white tracking-widest">{item.value}</div>
                                                    </div>
                                                    <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-3 bg-slate-950 rounded-xl text-slate-400 hover:text-white transition-colors"><Settings size={14} /></button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {cmsData.content.filter(c => c.sectionId === 'Sponsor_TermSheet').map(item => (
                                                <div key={item._id} className="glass p-8 rounded-[3rem] border-white/5 bg-slate-900/40 group relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="text-[10px] font-mono text-aether-gold font-black uppercase tracking-widest">{item.key}</div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'content', data: item }); setShowEditModal(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
                                                            <button onClick={() => deleteCmsItem('content', item._id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-white font-black">{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        <div className="glass p-12 rounded-[4rem] border-white/5 bg-slate-900/40 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-rose-500/10 transition-colors"></div>
                                            <h3 className="text-3xl font-black text-white mb-12 tracking-tighter uppercase flex items-center gap-4">
                                                <ShieldCheck className="text-rose-500" /> ADMIN_PROTOCOL_KEY
                                            </h3>
                                            <p className="text-slate-500 text-sm font-light uppercase tracking-widest mb-10 leading-relaxed">
                                                Update the master access key for the GAIO Admin Control Center.
                                            </p>
                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-mono text-slate-500 font-black tracking-widest uppercase ml-2">NEW_ADMIN_SECRET</label>
                                                    <input
                                                        type="password"
                                                        value={newAdminPassword}
                                                        onChange={(e) => setNewAdminPassword(e.target.value)}
                                                        placeholder="****************"
                                                        className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-8 py-6 text-white focus:border-rose-500 outline-none transition-all font-black tracking-[0.5em] placeholder:tracking-normal"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handlePasswordUpdate('admin_password', newAdminPassword)}
                                                    className="w-full py-6 bg-rose-500 text-white font-black rounded-2xl tracking-[0.3em] uppercase hover:shadow-[0_20px_40px_rgba(244,63,94,0.3)] transition-all flex items-center justify-center gap-4 text-[10px]"
                                                >
                                                    <Save size={18} /> OVERWRITE_ADMIN_KEY
                                                </button>
                                            </div>
                                        </div>

                                        <div className="glass p-12 rounded-[4rem] border-white/5 bg-slate-900/40 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-aether-gold/5 rounded-full blur-[80px] -z-10 group-hover:bg-aether-gold/10 transition-colors"></div>
                                            <h3 className="text-3xl font-black text-white mb-12 tracking-tighter uppercase flex items-center gap-4">
                                                <Lock className="text-aether-gold" /> SPONSOR_TERMINAL_KEY
                                            </h3>
                                            <p className="text-slate-500 text-sm font-light uppercase tracking-widest mb-10 leading-relaxed">
                                                Manage the decryption key for the private Sponsor Syndicate portal (/sponsor).
                                            </p>
                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-mono text-slate-500 font-black tracking-widest uppercase ml-2">NEW_SPONSOR_SECRET</label>
                                                    <input
                                                        type="password"
                                                        value={newSponsorPassword}
                                                        onChange={(e) => setNewSponsorPassword(e.target.value)}
                                                        placeholder="****************"
                                                        className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-8 py-6 text-white focus:border-aether-gold outline-none transition-all font-black tracking-[0.5em] placeholder:tracking-normal"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handlePasswordUpdate('sponsor_password', newSponsorPassword)}
                                                    className="w-full py-6 bg-aether-gold text-slate-950 font-black rounded-2xl tracking-[0.3em] uppercase hover:shadow-[0_20px_40px_rgba(197,160,89,0.3)] transition-all flex items-center justify-center gap-4 text-[10px]"
                                                >
                                                    <Save size={18} /> OVERWRITE_SPONSOR_KEY
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Staff Node Edit Modal */}
                    <AnimatePresence>
                        {editingStaff && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setEditingStaff(null)}
                                    className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[200]"
                                />
                                <motion.div
                                    initial={{ x: '100%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: '100%', opacity: 0 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="fixed top-0 right-0 h-screen w-full lg:w-[600px] bg-slate-900 shadow-[-50px_0_100px_rgba(0,0,0,0.8)] z-[201] p-8 md:p-16 border-l border-white/5 flex flex-col overflow-y-auto custom-scrollbar"
                                >
                                    <div className="flex justify-between items-center mb-12">
                                        <div>
                                            <h3 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">EDIT_STAFF_NODE</h3>
                                            <p className="text-[10px] font-mono font-black text-aether-gold tracking-widest mt-2 uppercase">Protocol: Node_Update_v1</p>
                                        </div>
                                        <button onClick={() => setEditingStaff(null)} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpdateStaff} className="space-y-8 lg:space-y-10">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white"
                                                    value={editingStaff.name}
                                                    onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Protocol Level</label>
                                                    <select
                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none font-bold text-white cursor-pointer hover:border-aether-gold transition-all"
                                                        value={editingStaff.level}
                                                        onChange={e => setEditingStaff({ ...editingStaff, level: e.target.value })}
                                                    >
                                                        <option value="Britsync">BRITSYNC (MAIN)</option>
                                                        <option value="Continental_Coordinator">CONTINENTAL</option>
                                                        <option value="Regional_Coordinator">REGIONAL</option>
                                                        <option value="Ground_Team">GROUND_TEAM</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Role Title</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white"
                                                        value={editingStaff.role}
                                                        onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Active Coverage (Location)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Europe, Nigeria, or Lagos"
                                                    className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white"
                                                    value={editingStaff.location}
                                                    onChange={e => setEditingStaff({ ...editingStaff, location: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Parent Node (Hierarchy)</label>
                                                <select
                                                    className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none font-bold text-white cursor-pointer hover:border-aether-gold transition-all"
                                                    value={editingStaff.parent || ''}
                                                    onChange={e => setEditingStaff({ ...editingStaff, parent: e.target.value || null })}
                                                >
                                                    <option value="">NO_PARENT_NODE (ROOT)</option>
                                                    {staff.filter(s => s._id !== editingStaff._id).map(m => (
                                                        <option key={m._id} value={m._id}>{m.name} ({m.level})</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">Department</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white"
                                                        value={editingStaff.department}
                                                        onChange={e => setEditingStaff({ ...editingStaff, department: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase ml-2 leading-none">LinkedIn URL</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-slate-950/50 border border-white/5 p-5 rounded-2xl outline-none focus:border-aether-gold transition-all font-bold text-white"
                                                        value={editingStaff.linkedin}
                                                        onChange={e => setEditingStaff({ ...editingStaff, linkedin: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            {/* Industries Management Section */}
                                            <div className="space-y-6 pt-6 border-t border-white/5">
                                                <div className="flex justify-between items-center px-2">
                                                    <div className="flex flex-col">
                                                        <label className="text-[10px] font-black text-aether-gold tracking-[0.3em] uppercase leading-none">Associated Industries</label>
                                                        <span className="text-[8px] font-mono text-slate-500 mt-2 uppercase tracking-widest">Popup Data Nodes</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingStaff({
                                                            ...editingStaff,
                                                            industries: [...(editingStaff.industries || []), { title: '', info: '', image: '' }]
                                                        })}
                                                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/30 transition-all active:scale-95"
                                                    >
                                                        + ADD_INDUSTRY
                                                    </button>
                                                </div>

                                                <div className="space-y-4">
                                                    {(editingStaff.industries || []).map((ind, idx) => (
                                                        <div key={idx} className="p-6 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4 relative group/ind hover:border-aether-gold/20 transition-all">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newInds = [...editingStaff.industries];
                                                                    newInds.splice(idx, 1);
                                                                    setEditingStaff({ ...editingStaff, industries: newInds });
                                                                }}
                                                                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover/ind:opacity-100"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>

                                                            <div className="space-y-2">
                                                                <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Industry Name</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="e.g. Energy Analytics"
                                                                    className="w-full bg-slate-900 border border-white/5 p-4 rounded-xl outline-none focus:border-aether-gold transition-all font-bold text-white text-sm"
                                                                    value={ind.title}
                                                                    onChange={e => {
                                                                        const newInds = [...editingStaff.industries];
                                                                        newInds[idx].title = e.target.value;
                                                                        setEditingStaff({ ...editingStaff, industries: newInds });
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Industry Image</label>
                                                                    <div className="flex gap-4 items-center">
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            className="hidden"
                                                                            id={`edit-ind-img-${idx}`}
                                                                            onChange={async (e) => {
                                                                                const file = e.target.files[0];
                                                                                if (!file) return;

                                                                                const formData = new FormData();
                                                                                formData.append('image', file);

                                                                                try {
                                                                                    const res = await axios.post(`${API_BASE_URL}/api/staff/upload-industry-image`, formData, {
                                                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                                                    });
                                                                                    const newInds = [...editingStaff.industries];
                                                                                    newInds[idx].image = res.data.url;
                                                                                    setEditingStaff({ ...editingStaff, industries: newInds });
                                                                                } catch (err) {
                                                                                    console.error("UPLOAD_ERROR", err);
                                                                                }
                                                                            }}
                                                                        />
                                                                        <label
                                                                            htmlFor={`edit-ind-img-${idx}`}
                                                                            className="flex-1 bg-slate-900 border border-white/5 p-4 rounded-xl cursor-pointer hover:border-aether-gold/50 transition-all text-xs font-mono text-white/50 flex items-center justify-between"
                                                                        >
                                                                            <span className="truncate max-w-[150px]">{ind.image ? ind.image.split('/').pop() : 'CHOOSE_FILE'}</span>
                                                                            <Plus size={14} className="text-aether-gold" />
                                                                        </label>
                                                                        {ind.image && (
                                                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                                                                <img src={ind.image.startsWith('http') ? ind.image : `${API_BASE_URL}${ind.image}`} className="w-full h-full object-cover" alt="" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Details / Info</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Brief description..."
                                                                        className="w-full bg-slate-900 border border-white/5 p-4 rounded-xl outline-none focus:border-aether-gold transition-all font-bold text-white text-xs"
                                                                        value={ind.info}
                                                                        onChange={e => {
                                                                            const newInds = [...editingStaff.industries];
                                                                            newInds[idx].info = e.target.value;
                                                                            setEditingStaff({ ...editingStaff, industries: newInds });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(editingStaff.industries || []).length === 0 && (
                                                        <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                                                            No industries linked to this node
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-aether-gold text-slate-950 font-black py-7 rounded-3xl uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-white transition-all flex items-center justify-center gap-4 group">
                                            <Save size={18} className="group-hover:scale-110 transition-transform" />
                                            <span>COMMIT_STAFF_UPDATE</span>
                                        </button>
                                    </form>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Universal CMS Edit Modal */}
            <AnimatePresence>
                {showEditModal && editingItem && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[300] flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass p-12 md:p-16 rounded-[4rem] border-white/5 bg-slate-900 max-w-2xl w-full my-auto shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative max-h-[90vh] overflow-y-auto no-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">NODE_EDITOR</h3>
                                    <p className="text-[10px] font-mono font-black text-aether-gold tracking-[0.3em] mt-2 uppercase">SYNC_TYPE: {editingItem.type}</p>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                                {editingItem.data.sectionId === 'Sponsor_Timeline' && (
                                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
                                        <p className="text-[10px] font-mono text-blue-400 uppercase font-black tracking-widest mb-1">Format Required</p>
                                        <p className="text-[10px] text-slate-400 font-mono">YEAR | GOAL | REVENUE | MARGIN</p>
                                        <p className="text-[10px] text-slate-500 mt-2 italic">Example: 2025 | Global Expansion | $50M | 30%</p>
                                    </div>
                                )}
                                {(() => {
                                    const relevantTypes = ['gateway', 'academy'];
                                    const fieldsToEnsure = editingItem.type === 'academy' ? ['downloadLink', 'isPreviewable'] : (editingItem.type === 'gateway' ? ['downloadLink'] : []);
                                    const allKeys = Array.from(new Set([...Object.keys(editingItem.data), ...fieldsToEnsure]))
                                        .filter(k => !['_id', '__v', 'createdAt', 'updatedAt'].includes(k));

                                    return allKeys.map(key => {
                                        const val = editingItem.data[key];
                                        const isArray = Array.isArray(val);
                                        const isLongText = ['description', 'answer', 'projectIdea', 'bio', 'details', 'overview', 'specs', 'topics', 'expertise', 'value', 'payload'].includes(key);
                                        const isCategory = key === 'category';
                                        const isSection = key === 'sectionId';
                                        const isKey = key === 'key';
                                        const isPayload = key === 'payload'; // Special Handler

                                        // Hide technical fields if they have a value (pre-filled from "Add" button or existing item)
                                        // Unless it's a NEW item where we might need to set them (but usually pre-filled)
                                        if ((isCategory || isSection || isKey) && val && editingItem.data._id) {
                                            return null;
                                        }

                                        const isDownloadLink = key === 'downloadLink';
                                        const isPhoto = key === 'photo';
                                        const isPreviewable = key === 'isPreviewable';

                                        if (isDownloadLink || isPhoto) {
                                            return (
                                                <div key={key} className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between">
                                                        <span>{key}</span>
                                                        {!val && <span className="text-red-500 animate-pulse">{isPhoto ? 'IMAGE_MISSING' : 'PDF_MISSING_NODE'}</span>}
                                                    </label>
                                                    <div className="flex gap-4 items-center">
                                                        <input
                                                            type="file"
                                                            accept={isPhoto ? "image/*" : "application/pdf"}
                                                            className="hidden"
                                                            id={`cms-${key}-upload`}
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0];
                                                                if (!file) return;
                                                                setIsUploading(true);
                                                                const formData = new FormData();
                                                                formData.append(isPhoto ? 'image' : 'pdf', file);
                                                                try {
                                                                    const res = await axios.post(`${API_BASE_URL}/api/cms/upload`, formData);
                                                                    setEditingItem({ ...editingItem, data: { ...editingItem.data, [key]: res.data.filePath } });
                                                                } catch (err) {
                                                                    alert('UPLOAD_FAILURE');
                                                                } finally {
                                                                    setIsUploading(false);
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`cms-${key}-upload`}
                                                            className="flex-1 bg-slate-950/40 border border-white/5 p-5 rounded-2xl cursor-pointer hover:border-aether-gold/50 transition-all text-xs font-mono text-white/50 flex items-center justify-between"
                                                        >
                                                            <span>{isUploading ? 'UPLOADING...' : (val ? val.split('/').pop() : (isPhoto ? 'CHOOSE_IMAGE_FILE' : 'CHOOSE_PDF_FILE'))}</span>
                                                            <UploadCloud size={16} className={val ? 'text-emerald-500' : 'text-aether-gold'} />
                                                        </label>
                                                        {val && (
                                                            <button
                                                                onClick={() => window.open(`${API_BASE_URL}/${val}`, '_blank')}
                                                                className="p-5 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors"
                                                            >
                                                                {isPhoto ? <Layout size={16} /> : <Eye size={16} />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={key} className="space-y-3">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                        {key} {isArray && '(COMMA_SEPARATED)'}
                                                    </label>
                                                    {key === 'icon' && (
                                                        <div className="w-full mt-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Search Icons..."
                                                                value={iconSearch}
                                                                onChange={(e) => setIconSearch(e.target.value)}
                                                                className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2 text-xs font-mono text-white mb-2"
                                                            />
                                                            <div className="grid grid-cols-6 gap-2 max-h-[150px] overflow-y-auto custom-scrollbar p-2 bg-slate-950/40 rounded-xl border border-white/5">
                                                                {Object.keys(LucideIcons)
                                                                    .filter(iconName => iconName.toLowerCase().includes(iconSearch.toLowerCase()))
                                                                    .slice(0, 100) // Limit render
                                                                    .map(iconName => {
                                                                        const Icon = LucideIcons[iconName];
                                                                        if (!Icon) return null;
                                                                        return (
                                                                            <button
                                                                                key={iconName}
                                                                                onClick={() => {
                                                                                    setEditingItem({ ...editingItem, data: { ...editingItem.data, [key]: iconName } });
                                                                                    setIconSearch('');
                                                                                }}
                                                                                className={`p-2 rounded-lg flex flex-col items-center gap-1 hover:bg-white/10 ${val === iconName ? 'bg-aether-gold/20 text-aether-gold' : 'text-slate-500'}`}
                                                                                title={iconName}
                                                                            >
                                                                                <Icon size={16} />
                                                                            </button>
                                                                        );
                                                                    })}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {key !== 'icon' && key === 'icon' && <span className="text-[8px] font-mono text-slate-600 uppercase">Lucide_Icon_Name</span>}
                                                </div>

                                                {
                                                    typeof val === 'boolean' ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setEditingItem({ ...editingItem, data: { ...editingItem.data, [key]: !val } });
                                                            }}
                                                            className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-3 ${val ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-950/40 text-slate-600 border-white/5'}`}
                                                        >
                                                            <div className={`w-2 h-2 rounded-full ${val ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}></div>
                                                            {key === 'isPreviewable'
                                                                ? (val ? 'GUEST_ACCESS: OPEN' : 'GUEST_ACCESS: RESTRICTED')
                                                                : (val ? 'PROTOCOL_ENABLED' : 'PROTOCOL_DISABLED')
                                                            }
                                                        </button>
                                                    ) : isCategory ? (
                                                        <select
                                                            value={val}
                                                            onChange={e => setEditingItem({ ...editingItem, data: { ...editingItem.data, [key]: e.target.value } })}
                                                            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-aether-gold font-mono text-xs appearance-none"
                                                        >
                                                            {editingItem.type === 'gateway' && [
                                                                { v: 'HERO_FEATURE', l: 'HERO_FEATURE [Home_Page]' },
                                                                { v: 'ACADEMY_MODULE', l: 'ACADEMY_MODULE [Academy_Page]' },
                                                                { v: 'ROADMAP', l: 'ROADMAP [Gala_Roadmap]' },
                                                                { v: 'PARTNER', l: 'PARTNER [Strategy_Logos]' },
                                                                { v: 'INFRASTRUCTURE', l: 'INFRASTRUCTURE [Gala_Details]' },
                                                                { v: 'SYNDICATE', l: 'SYNDICATE [Gala_Details]' }
                                                            ].map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
                                                            {editingItem.type === 'experts' && [
                                                                { v: 'JUDGE', l: 'JUDGE_PANEL' },
                                                                { v: 'MENTOR', l: 'MENTOR_NETWORK' },
                                                                { v: 'ADVISOR', l: 'ADVISORY_BOARD' },
                                                                { v: 'SPEAKER', l: 'RESOURCES_SPEAKER' },
                                                                { v: 'FOUNDER', l: 'FOUNDING_PARTNER' }
                                                            ].map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
                                                            {editingItem.type === 'academy' && [
                                                                { v: 'VIDEO', l: 'VIDEO_CONTENT' },
                                                                { v: 'PDF_GUIDE', l: 'PDF_GUIDE' },
                                                                { v: 'DATASET', l: 'DATASET' },
                                                                { v: 'WORKSHOP', l: 'LIVE_WORKSHOP' },
                                                                { v: 'DOC', l: 'DOCUMENTATION' },
                                                                { v: 'VIDEO_SERIES', l: 'VIDEO_SERIES' },
                                                                { v: 'VIDEO_LECTURE', l: 'VIDEO_LECTURE' }
                                                            ].map(opt => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
                                                            {!['gateway', 'experts', 'academy'].includes(editingItem.type) && <option value={val}>{val}</option>}
                                                        </select>
                                                    ) : isLongText ? (
                                                        <textarea
                                                            value={isArray ? val.join(', ') : (typeof val === 'object' ? JSON.stringify(val, null, 2) : val)}
                                                            onChange={e => {
                                                                let finalVal = e.target.value;
                                                                if (isArray) finalVal = e.target.value.split(',').map(s => s.trim());
                                                                if (!isArray && (typeof val === 'object' || key === 'payload')) {
                                                                    try { finalVal = JSON.parse(e.target.value); } catch (err) { /* keep string until valid */ }
                                                                }
                                                                setEditingItem({
                                                                    ...editingItem,
                                                                    data: {
                                                                        ...editingItem.data,
                                                                        [key]: finalVal
                                                                    }
                                                                });
                                                            }}
                                                            className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-aether-gold min-h-[120px] font-light text-sm leading-relaxed custom-scrollbar font-mono"
                                                            placeholder={isArray ? "Item 1, Item 2, Item 3..." : "JSON Data"}
                                                        />
                                                    ) : (
                                                        <input
                                                            type={typeof val === 'number' ? 'number' : 'text'}
                                                            value={val}
                                                            onChange={e => setEditingItem({
                                                                ...editingItem,
                                                                data: {
                                                                    ...editingItem.data,
                                                                    [key]: typeof val === 'number' ? Number(e.target.value) : e.target.value
                                                                }
                                                            })}
                                                            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-aether-gold font-mono text-xs"
                                                        />
                                                    )
                                                }
                                            </div>
                                        );
                                    })
                                })()}

                                <button
                                    onClick={() => saveCmsItem(editingItem.type, editingItem.data)}
                                    className="w-full py-8 bg-aether-gold text-slate-950 font-black rounded-[2rem] tracking-[0.4em] uppercase hover:shadow-[0_20px_50px_rgba(197,160,89,0.3)] transition-all flex items-center justify-center gap-4 group mt-12"
                                >
                                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                                    OVERWRITE_NODE_DATA
                                </button>

                                <p className="text-[8px] font-mono text-center text-slate-600 uppercase tracking-[0.2em]">WARNING: This action is irreversible on the active node.</p>
                            </div>
                        </motion.div>
                    </div>
                )
                }
            </AnimatePresence >
        </div >
    );
}
