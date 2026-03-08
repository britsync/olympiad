const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');

router.post('/update', botController.updateStatus);
router.get('/statuses', botController.getBotStatuses);

module.exports = router;
