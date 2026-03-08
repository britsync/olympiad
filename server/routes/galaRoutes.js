const express = require('express');
const router = express.Router();
const galaController = require('../controllers/galaController');

router.post('/rsvp', galaController.submitRSVP);
router.get('/rsvps', galaController.getRSVPs);

module.exports = router;
