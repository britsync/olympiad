const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('axios-rate-limit');
const axios = require('axios');
const path = require('path');
const compression = require('compression');

const teamRoutes = require('./routes/teamRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const galaRoutes = require('./routes/galaRoutes');
const judgeRoutes = require('./routes/judgeRoutes');
const botRoutes = require('./routes/botRoutes');
const settingRoutes = require('./routes/settingRoutes');
const staffRoutes = require('./routes/staffRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MONGODB_CONNECT_ERROR:', err));
// 1. Diagnostics & Static Prep


const fs = require('fs');

// 1. Diagnostics & Static Prep
// Check multiple common locations for the build output
const potentialPaths = [
  path.resolve(__dirname, '../client/dist'),
  path.resolve(__dirname, 'dist'),
  path.resolve(__dirname, '../dist'),
  path.join(__dirname, 'public')
];

let staticPath = null;
for (const p of potentialPaths) {
  if (fs.existsSync(p)) {
    staticPath = p;
    break;
  }
}

console.log('--- SYSTEM_DIAGNOSTICS ---');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Detected Static Path: ${staticPath || 'NONE'}`);

// 2. Prioritized Static Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const shouldServeStatic = staticPath && (process.env.NODE_ENV === 'production' || process.env.SERVE_STATIC === 'true' || true); // Force true if path exists for now to fix user issue

if (shouldServeStatic) {
  app.use(express.static(staticPath));
  console.log(`STATIC_SERVING_ACTIVE: ${staticPath}`);
}

// 3. API Routes
const cmsRoutes = require('./routes/cmsRoutes');
app.use('/api/cms', cmsRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/gala', galaRoutes);
app.use('/api/judges', judgeRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/bot-status', botRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/staff', staffRoutes);

// 4. SPA Fallback (MUST be last)
if (shouldServeStatic) {
  app.use((req, res, next) => {
    // Skip if API, uploads, or file extension
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || /\.[a-z0-9]+$/i.test(req.path)) {
      return next();
    }

    // Serve index.html for all other routes (SPA support)
    const indexPath = path.join(staticPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      // console.log(`SPA_FALLBACK: ${req.path}`);
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Default route if static files not served or not found
app.get('/', (req, res) => {
  if (shouldServeStatic) {
    // If we are here, it means static serving failed weirdly, but usually handled above.
    // Just in case index.html is missing but folder exists
    res.send('Olympiad API Online - Frontend files detected but index.html missing.');
  } else {
    res.send('Olympiad API Running (Dev/API Mode) - No frontend detected.');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal_System_Failure',
    error: err.message,
    protocol: 'SYNC_ERROR_0X500'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
