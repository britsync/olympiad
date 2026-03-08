const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

const Analytics = require('../models/Analytics');

router.post('/log', analyticsController.logEvent);
router.get('/', analyticsController.getAnalytics);
router.post('/visitor', analyticsController.trackVisitor);
router.post('/ministry', analyticsController.updateMinistryStats);

router.get('/track-open/:id', async (req, res) => {
    try {
        await new Analytics({
            type: 'EMAIL_OUTREACH',
            event: 'Email Opened',
            metadata: { trackingId: req.params.id, opened: true }
        }).save();
    } catch (e) {
        console.error('Tracking failed');
    }

    const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': img.length
    });
    res.end(img);
});

module.exports = router;
