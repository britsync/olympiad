const mongoose = require('mongoose');
const dotenv = require('dotenv');
const GatewayNode = require('./models/GatewayNode');
const AcademyResource = require('./models/AcademyResource');
const AwardTier = require('./models/AwardTier');
const FAQ = require('./models/FAQ');
const ContactNode = require('./models/ContactNode');
const DynamicContent = require('./models/DynamicContent');

const ExpertNode = require('./models/ExpertNode');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await GatewayNode.deleteMany({});
        await AcademyResource.deleteMany({});
        await DynamicContent.deleteMany({});
        await FAQ.deleteMany({});
        await ContactNode.deleteMany({});
        await AwardTier.deleteMany({});
        await ExpertNode.deleteMany({});

        // 1. Gateway Nodes (Feature Cards, Partners, Roadmap, AND Academy Modules)
        const gatewayNodes = [
            // Home Feature Cards (Hero)
            { title: 'NEURAL INFRASTRUCTURE', description: 'Deploying edge-computing nodes for real-time community data processing across distributed networks.', icon: 'Cpu', color: 'text-aether-gold', glow: 'rgba(197, 160, 89, 0.1)', category: 'HERO_FEATURE', order: 1 },
            { title: 'GLOBAL SYNDICATE', description: 'A unified network of AI researchers and community developers from over 40 participating nations.', icon: 'Globe2', color: 'text-blue-400', glow: 'rgba(96, 165, 250, 0.1)', category: 'HERO_FEATURE', order: 2 },
            { title: 'SECURE PROTOCOLS', description: 'End-to-end encrypted project submission and validation layers with AES-256 standard security.', icon: 'ShieldAlert', color: 'text-rose-400', glow: 'rgba(251, 113, 133, 0.1)', category: 'HERO_FEATURE', order: 3 },

            // Partners
            { title: 'NVIDIA_QUANTUM', subtext: 'COMPUTE_NODE', icon: 'Cpu', category: 'PARTNER', order: 10 },
            { title: 'MIT_REACTION_LABS', subtext: 'RESEARCH_HUB', icon: 'Database', category: 'PARTNER', order: 11 },
            { title: 'IEEE_STANDARD', subtext: 'PROTOCOL_AUTH', icon: 'ShieldCheck', category: 'PARTNER', order: 12 },

            // Gala Roadmap
            { title: 'GAIO ACADEMY LAUNCH', subtext: 'SHORT-TERM (1-2Y)', description: 'Expand to 15 countries, Strengthen sponsor pipeline, Launch portals', icon: 'GraduationCap', category: 'ROADMAP', order: 20 },
            { title: 'GLOBAL FINALS & FUNDING', subtext: 'MID-TERM (3-5Y)', description: 'Establish permanent London finals, Launch incubation platform', icon: 'Target', category: 'ROADMAP', order: 21 },
            { title: 'THE VENTURE FUND', subtext: 'LONG-TERM (5Y+)', description: 'GAIO Venture Fund activation, Global AI policy advisory', icon: 'TrendingUp', category: 'ROADMAP', order: 22 },

            // Academy Modules
            {
                title: 'AI TOOLS & INFRASTRUCTURE',
                description: 'Introduction to LLMs, stable diffusion, and edge computing for community impact.',
                icon: 'Cpu',
                subtext: 'MODULE_01',
                category: 'ACADEMY_MODULE',
                order: 1,
                details: 'Deep dive into the neural core. Learn to deploy specialized LLMs for localized data processing. Includes workshops on API integration, GPU optimization, and secure node deployment.',
                topics: ['Edge Computing', 'Model Quantization', 'Neural Architecture']
            },
            {
                title: 'STRATEGIC BRANDING',
                description: 'Crafting a global identity for local community projects.',
                icon: 'PenTool',
                subtext: 'MODULE_02',
                category: 'ACADEMY_MODULE',
                order: 2,
                details: 'Design systems for the new epoch. Establish a visual syndicate identity that resonates globally while maintaining local cultural integrity. Master the art of tech-strategic storytelling.',
                topics: ['Visual Identity', 'Narrative Design', 'Global Consistency']
            },
            {
                title: 'FINANCIAL ARCHITECTURE',
                description: 'Building sustainable revenue models for social AI ventures.',
                icon: 'Briefcase',
                subtext: 'MODULE_03',
                category: 'ACADEMY_MODULE',
                order: 3,
                details: 'The economics of intelligence. Develop robust financial structures for AI initiatives. Covers tokenomics, grant synchronization, and sustainable scaling strategies.',
                topics: ['Tokenomics', 'Grant Frameworks', 'Revenue Operations']
            },

            // Strategy Pillars (Gala Revenue Details)
            {
                title: 'Global Title Sponsorship',
                subtext: 'SPONSORSHIPS',
                description: 'Exclusive global brand integration across all GAIO nodes and media properties.',
                icon: 'Landmark',
                category: 'STRATEGY_PILLAR',
                order: 30,
                payload: {
                    value: '£200k - £500k+',
                    projections: [
                        { year: 'Year 1', value: '£200,000', label: 'Activation & Foundation' },
                        { year: 'Year 2', value: '£350,000', label: 'Institutional Scale' },
                        { year: 'Year 3', value: '£500,000+', label: 'Global Authority' }
                    ],
                    kpis: ['100% Brand Ownership', 'Policy-Level Visibility', 'Talent Pipeline Priority'],
                    strategy: 'Rights-based revenue scaling without linear cost growth via global IP ownership.'
                }
            },
            {
                title: 'Continental Rights',
                subtext: 'CONTINENTAL RIGHTS',
                description: 'Strategic naming and hosting rights for key economic regions.',
                icon: 'Globe',
                category: 'STRATEGY_PILLAR',
                order: 1,
                payload: {
                    value: '£40k - £120k',
                    projections: [
                        { year: 'Year 1', value: '£120,000', label: '3 Continents Active' },
                        { year: 'Year 2', value: '£375,000', label: 'Full 5-Continent Rollout' },
                        { year: 'Year 3', value: '£600,000+', label: 'Market Maturity' }
                    ],
                    kpis: ['£40k-£120k per Region', 'Licensed (Not Sold) Rights', 'Regional Media Dominance'],
                    strategy: 'Geographic licensing models with 20% revenue share back to global entity.'
                }
            },
            {
                title: 'Broadcast & Media',
                subtext: 'MEDIA LICENSING',
                description: 'Monetizing the GAIO narrative through exclusive content and live distribution.',
                icon: 'Rocket',
                category: 'STRATEGY_PILLAR',
                order: 2,
                payload: {
                    value: '£50k - £200k+',
                    projections: [
                        { year: 'Year 1', value: '£80,000', label: 'Livestream & Highlights' },
                        { year: 'Year 2', value: '£150,000', label: 'Documentary Licensing' },
                        { year: 'Year 3', value: '£300,000+', label: 'Global Syndication' }
                    ],
                    kpis: ['Exclusive Broadcast Partners', 'Education Replay Rights', 'Multi-Platform Exposure'],
                    strategy: 'Building a long-term media asset that compounds with audience growth.'
                }
            },
            {
                title: 'Participation & Platform',
                subtext: 'PLATFORM FEES',
                description: 'Ecosystem accessibility fees for startups and elite academic institutions.',
                icon: 'Target',
                category: 'STRATEGY_PILLAR',
                order: 3,
                payload: {
                    value: '£135k Year 1',
                    projections: [
                        { year: 'Year 1', value: '£135,000', label: '100 Startups / 20 Uni' },
                        { year: 'Year 2', value: '£250,000', label: 'Expanded Track Capacity' },
                        { year: 'Year 3', value: '£500,000+', label: 'Institutional Standard' }
                    ],
                    kpis: ['£750/Startup Fee', '£3k/University Package', 'Verified AI Talent Data'],
                    strategy: 'Sustainable node architecture with non-event-dependent income.'
                }
            },
            {
                title: 'Talent & Data Licensing',
                subtext: 'DATA LICENSING',
                description: 'High-value access to the world’s most verified AI talent pipeline.',
                icon: 'ShieldCheck',
                category: 'STRATEGY_PILLAR',
                order: 34,
                payload: {
                    value: '£20k/partner',
                    projections: [
                        { year: 'Year 1', value: '£100,000', label: '5 Global Partners' },
                        { year: 'Year 2', value: '£250,000', label: 'Skills Gap Analysis' },
                        { year: 'Year 3', value: '£500,000+', label: 'Enterprise Benchmarking' }
                    ],
                    kpis: ['£20k/Partner Subscription', 'Early Recruitment Access', 'Anonymized Skills Insights'],
                    strategy: 'Commercializing the talent discovery process for tech giants.'
                }
            },
            {
                title: 'Startup Ecosystem',
                subtext: 'EQUITY ASSETS',
                description: 'Direct participation in the economic upside of incubated AI ventures.',
                icon: 'Coins',
                category: 'STRATEGY_PILLAR',
                order: 35,
                payload: {
                    value: '1-3% Carry',
                    projections: [
                        { year: 'Year 1', value: '£75,000', label: '10 Participating Funds' },
                        { year: 'Year 2', value: '£200,000', label: 'Demo Day Expansion' },
                        { year: 'Year 3', value: '£350,000+', label: 'Portfolio Maturity' }
                    ],
                    kpis: ['1-3% Carry / Equity', '£7.5k Fund Access Fees', 'Strategic Deal Flow'],
                    strategy: 'Embedded optionality in selected startups with deferred upside.'
                }
            },
            {
                title: 'Institutional Expansion',
                subtext: 'GOVERNMENT R&D',
                description: 'Global training, certifications, and R&D policy labs.',
                icon: 'TrendingUp',
                category: 'STRATEGY_PILLAR',
                order: 36,
                payload: {
                    value: '£300k+ Year 2',
                    projections: [
                        { year: 'Year 1', value: '£0', label: 'Implementation Phase' },
                        { year: 'Year 2', value: '£400,000', label: 'Institute Launch' },
                        { year: 'Year 3', value: '£750,000+', label: 'Policy Authority' }
                    ],
                    kpis: ['GAIO Certification Rights', 'Government Training Labs', 'Research Grants'],
                    strategy: 'Positioning GAIO as a global academic and policy authority.'
                }
            },
            { title: 'Implementation Plan', description: 'Comprehensive roadmap for global AI ecosystem integration and local node synchronization.', icon: 'ZapIcon', category: 'ABOUT_CARD', subtext: '03', order: 3 },
        ];
        await GatewayNode.insertMany(gatewayNodes);

        // 2. Academy Resources (Library)
        const academyResources = [
            {
                title: 'Neural Architectures',
                type: 'VIDEO_LECTURE',
                date: 'Feb 2026',
                description: 'Advanced strategies for deploying transformer models on low-resource community hardware.',
                size: '850MB',
                duration: '1h 15m',
                overview: 'Advanced strategies for deploying transformer models on low-resource community hardware.',
                specs: ['NVIDIA Jetson Optimized', 'Quantization Ready', 'Edge-First Design'],
                downloadLink: 'NEURAL_ARCH_S01.MP4',
                order: 1
            },
            {
                title: 'Branding for AI',
                type: 'PDF_GUIDE',
                date: 'Feb 2026',
                description: 'Developing a visual language that communicates precision, trust, and global-to-local hybridity.',
                size: '14MB',
                pages: '28 Pages',
                overview: 'Developing a visual language that communicates precision, trust, and global-to-local hybridity.',
                specs: ['Vector Assets Included', 'Dynamic Color Systems', 'Narrative Logic'],
                downloadLink: 'GAIO_BRAND_V2.PDF',
                order: 2
            },
            {
                title: 'SYNTHETIC_EVOLUTION_V1',
                type: 'VIDEO_SERIES',
                date: 'Jan 2026',
                description: 'The base layer for GAIO technical development.',
                size: '2.4GB',
                duration: '12h 40m',
                overview: 'The base layer for GAIO technical development.',
                specs: ['Foundational Theory', 'Sync Procedures'],
                downloadLink: 'GAIO_S1_FULL.ZIP',
                order: 3
            },
            {
                title: 'QUANTUM_NARRATIVES',
                type: 'WHITE_PAPER',
                date: 'Jan 2026',
                description: 'Strategic framework for high-impact AI storytelling.',
                size: '12MB',
                pages: '42 Pages',
                overview: 'Strategic framework for high-impact AI storytelling.',
                specs: ['Narrative Logic', 'Impact Benchmarks'],
                downloadLink: 'QUANTUM_STORY.PDF',
                order: 4
            }
        ];
        await AcademyResource.insertMany(academyResources);

        // 3. Expert Panel (Judges)
        const experts = [
            {
                name: 'Dr. Sarah Chen',
                expertise: ['AI Strategy'],
                company: 'Neural Systems',
                bio: 'Expert in scalable AI ethics and community development.',
                linkedin: 'https://linkedin.com/in/sarahchen',
                category: 'JUDGE',
                order: 1
            },
            {
                name: 'Marcus Vault',
                expertise: ['Venture Capital'],
                company: 'Tech Capital',
                bio: 'Venture capitalist focusing on local emerging markets.',
                linkedin: 'https://linkedin.com/in/marcusvault',
                category: 'JUDGE',
                order: 2
            },
            {
                name: 'Elena Rodriguez',
                expertise: ['Global Branding'],
                company: 'Global Sync',
                bio: 'Architect of some of the world’s most impactful social brands.',
                linkedin: 'https://linkedin.com/in/elenarodriguez',
                category: 'JUDGE',
                order: 3
            }
        ];
        await ExpertNode.insertMany(experts);

        // 4. Dynamic Content
        const content = [
            { sectionId: 'Hero', key: 'main_title', value: 'GLOBAL AI OLYMPIAD' },
            { sectionId: 'Hero', key: 'subtitle', value: 'Orchestrating the convergence of synthetic intelligence and community evolution.' },
            { sectionId: 'About', key: 'mission_title', value: 'Harnessing AI for Local Evolution' },
            { sectionId: 'About', key: 'mission_statement', value: 'Our vision is to become the world’s leading AI Olympiad, shaping the next generation of AI leaders, innovators, and entrepreneurs.' },
            { sectionId: 'About', key: 'organizer_title', value: 'Organizer: Britsync' },
            { sectionId: 'About', key: 'organizer_desc', value: 'Britsync is an AI-based digital marketing solution provider dedicated to bridging the gap between advanced technology and community needs.' },
            { sectionId: 'About', key: 'organizer_icon', value: 'Cpu' },
            // Contact Strings
            { sectionId: 'Contact', key: 'hero_title', value: 'ESTABLISH LINK' },
            { sectionId: 'Contact', key: 'hero_description', value: 'Initiate a secure neural connection with the GAIO global coordination hub.' },
            { sectionId: 'Contact', key: 'form_heading', value: 'TRANSMIT_DATA' },
            { sectionId: 'Contact', key: 'rsvp_heading', value: 'GALA_ACCESS_COORDINATION' },
            { sectionId: 'Contact', key: 'rsvp_description', value: 'Secure your terminal for the London Grand Finale.' },
            // Gala Strings
            { sectionId: 'Gala', key: 'hero_subheading', value: 'GLOBAL_STRATEGIC_ASSET // LONDON_2026' },
            { sectionId: 'Gala', key: 'hero_title_part1', value: 'THE' },
            { sectionId: 'Gala', key: 'hero_title_accent', value: 'GAIO' },
            { sectionId: 'Gala', key: 'hero_title_part2', value: 'EXPERIENCE' },
            { sectionId: 'Gala', key: 'hero_description_lead', value: 'A FLAGSHIP INTERNATIONAL AI ECOSYSTEM DESIGNED TO IDENTIFY, NURTURE, AND COMMERCIALIZE' },
            { sectionId: 'Gala', key: 'hero_description_accent', value: 'FUTURE-READY TALENT' },
            { sectionId: 'Gala', key: 'cta_idle', value: 'SECURE ACCESS_COORDINATES' },
            { sectionId: 'Gala', key: 'cta_decrypting', value: 'DECRYPTING_LOCATION...' },
            { sectionId: 'Gala', key: 'cta_success', value: 'LOCATION_LOCKED: LONDON_ROYAL' },
            { sectionId: 'Gala', key: 'vision_title_part1', value: 'OUR' },
            { sectionId: 'Gala', key: 'vision_title_accent', value: 'VISION_MATRIX' },
            { sectionId: 'Gala', key: 'vision_description', value: 'TO BECOME THE WORLD’S LEADING AI OLYMPIAD, SHAPING THE DIGITAL FRONTIER THROUGH SECURE GLOBAL NODES.' },
            { sectionId: 'Gala', key: 'strategy_label', value: 'FINANCIAL_STRUCTURE' },
            { sectionId: 'Gala', key: 'strategy_title_part1', value: 'INVESTORS' },
            { sectionId: 'Gala', key: 'strategy_title_part2', value: 'PLACE' },
            { sectionId: 'Gala', key: 'strategy_description', value: 'DIVERSIFIED, NON-EVENT-DEPENDENT INCOME STREAMS THAT ENSURE LONG-TERM SCALABILITY AND SUCCESS.' },
            // Prizes Strings
            { sectionId: 'Prizes', key: 'header_title_part1', value: 'REWARD' },
            { sectionId: 'Prizes', key: 'header_title_accent', value: 'TIERS' },
            { sectionId: 'Prizes', key: 'panel_title_part1', value: 'EXPERT' },
            { sectionId: 'Prizes', key: 'panel_title_part2', value: 'PANEL' },
            { sectionId: 'Prizes', key: 'gala_badge', value: 'PRIME_EVENT_2026 // LONDON' },
            { sectionId: 'Prizes', key: 'gala_title_part1', value: 'LONDON ROYAL' },
            { sectionId: 'Prizes', key: 'gala_title_accent', value: 'GALA CEREMONY' },
            { sectionId: 'Prizes', key: 'gala_description', value: 'The ultimate convergence of synthetic intelligence and sovereign community evolution.' },
            { sectionId: 'Prizes', key: 'partnership_label', value: 'STRATEGIC_PARTNERSHIPS' },
            { sectionId: 'Prizes', key: 'partnership_title', value: 'Become a Global Title Sponsor' },
            { sectionId: 'Prizes', key: 'partnership_description', value: 'Gain exclusive intelligence naming rights, internal talent pipeline access, and global policy visibility.' },
            // FAQ Strings
            { sectionId: 'FAQ', key: 'page_subheading', value: 'Knowledge_Base' },
            { sectionId: 'FAQ', key: 'page_heading_main', value: 'FREQUENTLY ASKED' },
            { sectionId: 'FAQ', key: 'page_heading_accent', value: 'PROTOCOLS' },
            // Sponsor Portal Strings
            { sectionId: 'Sponsor', key: 'auth_title', value: 'PROTOCOL' },
            { sectionId: 'Sponsor', key: 'auth_title_accent', value: 'LOCKED' },
            { sectionId: 'Sponsor', key: 'auth_subtitle', value: 'ENCRYPTED SPONSOR TERMINAL. ENTER ACCESS_KEY TO DECODE.' },
            { sectionId: 'Sponsor', key: 'portal_tag', value: 'PRIVATE_OFFERING // SPONSOR_SYNDICATE' },
            { sectionId: 'Sponsor', key: 'portal_title', value: 'SPONSOR' },
            { sectionId: 'Sponsor', key: 'portal_title_accent', value: 'PORTAL' },
            { sectionId: 'Sponsor', key: 'portal_description', value: 'GAIO represents a scalable, multi-revenue, low-risk, high-impact platform positioned at the intersection of AI education and global talent.' },
            { sectionId: 'Sponsor', key: 'pillar_heading', value: 'REVENUE_ARCHITECTURES' },
            { sectionId: 'Sponsor', key: 'drawer_projection_heading', value: 'FINANCIAL_PROJECTIONS' },
            { sectionId: 'Sponsor', key: 'drawer_kpi_heading', value: 'STRATEGIC_KPIs' },
            { sectionId: 'Sponsor', key: 'drawer_strategy_heading', value: 'ECONOMIC_MOAT' },
            { sectionId: 'Sponsor', key: 'model_heading', value: 'FINANCIAL_MODEL' },
            { sectionId: 'Sponsor', key: 'termsheet_heading', value: 'SPONSOR_SYNDICATE <br /><span className="text-aether-gold">TERM_SHEET</span>' },
            { sectionId: 'Sponsor', key: 'intel_pack_download_label', value: 'DOWNLOAD_FULL_INTEL_PACK' },
            { sectionId: 'Sponsor', key: 'intel_pack_initiating', value: 'INITIATING_DEEP_DIVE...' },
            { sectionId: 'Sponsor', key: 'intel_pack_syncing', value: 'DECODING_INTEL_PACK...' },
            { sectionId: 'Sponsor', key: 'intel_pack_complete', value: 'INTEL_DECRYPTED' },
            { sectionId: 'Sponsor', key: 'intel_pdf_path', value: 'GAIO_Investor_Profile.pdf' },
            { sectionId: 'Sponsor', key: 'nda_pack_download_label', value: 'DOWNLOAD_SPONSOR_NDA_PACK' },
            { sectionId: 'Sponsor', key: 'nda_pack_initiating', value: 'SYNCING_NDA_PROTOCOL...' },
            { sectionId: 'Sponsor', key: 'nda_pack_syncing', value: 'GENERATING_ENCRYPTED_PDF...' },
            { sectionId: 'Sponsor', key: 'nda_pack_complete', value: 'NDA_PACK_READY' },
            { sectionId: 'Sponsor', key: 'nda_pdf_path', value: 'GAIO_Structure_Strategy.pdf' },
            { sectionId: 'Sponsor', key: 'extraction_node_text', value: 'Establishing_Secure_Extraction_Node...' },
            { sectionId: 'Sponsor', key: 'auth_placeholder', value: 'ENTER_PROTOCOL_KEY' },
            { sectionId: 'Sponsor', key: 'auth_button_text', value: 'INITIATE_DECODING' },
            // Sponsor Timeline
            { sectionId: 'Sponsor_Timeline', key: 'Year_1', value: 'Year 1 | 15 Countries | £1.01M | 89%' },
            { sectionId: 'Sponsor_Timeline', key: 'Year_2', value: 'Year 2 | 30 Countries | £2.42M | 77%' },
            { sectionId: 'Sponsor_Timeline', key: 'Year_3', value: 'Year 3 | 50+ Countries | £4.95M | 76%' },
            // Sponsor Term Sheet
            { sectionId: 'Sponsor_TermSheet', key: '01_Sponsorship_Tier', value: 'Elite Nodal Partner' },
            { sectionId: 'Sponsor_TermSheet', key: '02_Benefit_Package', value: 'Global Visibility' },
            { sectionId: 'Sponsor_TermSheet', key: '03_Commercial_Rights', value: 'Full Regional Dominance' }
        ];
        await DynamicContent.insertMany(content);

        // 5. Award Tiers
        const awards = [
            { tierName: 'GRAND AWARD', reward: '$100,000 Equity-Free Seed', description: 'The absolute pinnacle of synthetic coordination.', icon: 'Star', color: 'text-aether-gold', order: 1 },
            { tierName: 'CONTINENTAL CHAMPIONS', reward: '$25,000 + Deployment Grant', description: 'Regional supremacy in decentralized AI.', icon: 'Globe', color: 'text-blue-400', order: 2 },
            { tierName: 'REGIONAL NODE LEADERS', reward: '$10,000 + Ecosystem Access', description: 'Scaling localized intelligence nodes.', icon: 'MapPin', color: 'text-emerald-400', order: 3 }
        ];
        await AwardTier.insertMany(awards);

        // 6. Contact Nodes (Communication Channels)
        const contactNodes = [
            { label: 'Protocol', value: 'ops@britsync.com', icon: 'Mail', type: 'LINK', redirectUrl: 'mailto:ops@britsync.com', order: 1 },
            { label: 'Support', value: 'Discord_Syndicate', icon: 'MessageSquare', type: 'LINK', redirectUrl: 'https://discord.gg/', order: 2 },
            { label: 'Twitter', value: '@GAIO_Syndicate', icon: 'Twitter', type: 'SOCIAL', redirectUrl: 'https://twitter.com', order: 3 },
            { label: 'LinkedIn', value: 'GAIO_Global', icon: 'Linkedin', type: 'SOCIAL', redirectUrl: 'https://linkedin.com', order: 4 },
            { label: 'GitHub', value: 'GAIO_Nodes', icon: 'Github', type: 'SOCIAL', redirectUrl: 'https://github.com', order: 5 }
        ];
        await ContactNode.insertMany(contactNodes);

        // 7. Geospatial Locations (Contact Page)
        const locationNodes = [
            { title: 'LONDON_HUB', subtext: 'COORDINATION_CENTER', description: 'Central nexus for global AI syndicate operations and London Finales.', icon: 'MapPin', category: 'LOCATION', order: 1 },
            { title: 'SINGAPORE_NODE', subtext: 'APAC_GATEWAY', description: 'Primary technical infrastructure and data relay for Southeast Asian markets.', icon: 'Globe', category: 'LOCATION', order: 2 },
            { title: 'NEW_YORK_GATEWAY', subtext: 'AMERICAS_SYNDICATE', description: 'Strategic coordination for North American R&D and venture partnerships.', icon: 'Zap', category: 'LOCATION', order: 3 }
        ];
        await GatewayNode.insertMany(locationNodes);

        // 8. Gala Goals (Gala RSVP Page)
        const galaGoals = [
            { title: 'ESTABLISH GAIO AS GLOBALLY RECOGNIZED BRAND', category: 'GALA_GOAL', order: 1 },
            { title: 'OPERATE CHAPTERS IN 50+ COUNTRIES', category: 'GALA_GOAL', order: 2 },
            { title: 'CREATE GAIO-BACKED STARTUPS & LABS', category: 'GALA_GOAL', order: 3 },
            { title: 'FEEDER PLATFORM FOR TECH GIANTS', category: 'GALA_GOAL', order: 4 }
        ];
        await GatewayNode.insertMany(galaGoals);

        // 9. About Strengths (About Page)
        const aboutStrengths = [
            { title: 'Impact', description: 'Solving tangible problems in local infrastructures.', category: 'ABOUT_STRENGTH', order: 1 },
            { title: 'Innovation', description: 'Pushing the boundaries of what AI can achieve locally.', category: 'ABOUT_STRENGTH', order: 2 },
            { title: 'Collaboration', description: 'Uniting tech, finance, and marketing expertise.', category: 'ABOUT_STRENGTH', order: 3 }
        ];
        await GatewayNode.insertMany(aboutStrengths);

        // 10. Additional Academy Modules (Weeks 4-6)
        const additionalModules = [
            {
                title: 'TECHNICAL DEPLOYMENT',
                description: 'Hands-on coding for scalable AI solutions.',
                icon: 'Code',
                subtext: 'MODULE_04',
                category: 'ACADEMY_MODULE',
                order: 4,
                details: 'Code to production. Transition from prototype to global deployment. Includes CI/CD pipelines for AI models, distributed cloud infrastructure, and load balancing.',
                topics: ['Distributed Systems', 'CI/CD Pipelines', 'Cloud Scaling']
            },
            {
                title: 'LOCAL MARKET SYNC',
                description: 'Adapting global technology for diverse micro-communities.',
                icon: 'Globe',
                subtext: 'MODULE_05',
                category: 'ACADEMY_MODULE',
                order: 5,
                details: 'Synchronizing intelligence. Learn adaptive strategies for deploying global technical standards into micro-local markets. Focuses on localization and community-led development.',
                topics: ['Market Adaption', 'Hyper-Localization', 'Feedback Loops']
            },
            {
                title: 'LEADERSHIP & SCALE',
                description: 'Preparing for the final pitch and global scaling strategies.',
                icon: 'BookOpen',
                subtext: 'MODULE_06',
                category: 'ACADEMY_MODULE',
                order: 6,
                details: 'The final ascendancy. Refining the syndicate pitch for global stakeholders. Develop multi-year scaling roadmaps and leadership structures for long-term impact.',
                topics: ['Stakeholder Pitching', 'Scaling Roadmaps', 'Governance Models']
            }
        ];
        await GatewayNode.insertMany(additionalModules);

        // 11. FAQs
        const faqsData = [
            { question: "WHAT IS THE GLOBAL AI OLYMPIAD (GAIO)?", answer: "A flagship international ecosystem combining virtual challenges, regional physical finals, and a grand London gala. We identify and commercialize future-ready AI talent." },
            { question: "HOW DO TEAMS REGISTER?", answer: "Teams of 3-5 members can register via our 'ACTIVATE_ACCESS' portal. Individual pioneers can also register to be matched with a syndicate." },
            { question: "ARE THERE PARTICIPATION FEES?", answer: "The core challenge is accessible to all selected teams. Premium 'Fast-Track' nodes may have associated ecosystem fees." }
        ];
        await FAQ.insertMany(faqsData);

        console.log('Database seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedData();
