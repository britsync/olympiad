# GAIO VPS Setup - Phase 2: Automation & Data

Since the backend is now running, follow these steps to populate your data and activate the automation features. 

### 1. Database Seeding (Run these on VPS)
These scripts will populate your database with initial content (CMS, FAQs, etc.).
```bash
# Move to server directory
cd /var/www/olympiad/server

# Seed CMS (Main Site Content)
node seed_cms.js

# Seed FAQs
node seed_faqs.js

# Check DB Connection (Verify data is there)
node check_db.js
```

### 2. Activate Syndicate Bots (PM2)
These bots handle heartbeats, telemetry, and automated sync. Run them inside PM2 so they stay online.
```bash
# Start the Syndicate Bots
pm2 start gaio_syndicate_bots.js --name gaio-bots

# Verify Bots are running
pm2 list
pm2 logs gaio-bots
```

### 3. Final Verification
Check that the Admin Panel and Frontend are communicating correctly.
- **Frontend**: Visit your domain and ensure the home page loads.
- **Admin Panel**: Visit `/admin` (or your admin route) and login.
- **System Check**: Confirm the "Live Deployment Feed" (stats from the bots) is showing active heartbeats.

### 4. Persistence
Ensure PM2 restarts your processes if the server reboots:
```bash
pm2 save
pm2 startup
```
*(Follow any instructions PM2 output gives you after the startup command)*
