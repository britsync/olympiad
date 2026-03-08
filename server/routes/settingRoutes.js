const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

router.get('/:key', settingController.getSetting);
router.post('/update', settingController.updateSetting);
router.post('/verify', settingController.verifyPassword);

module.exports = router;
