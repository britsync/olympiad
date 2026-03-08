const express = require('express');
const router = express.Router();
const judgeController = require('../controllers/judgeController');

router.get('/submissions', judgeController.getSubmissions);
router.post('/score', judgeController.submitScore);
router.post('/status', judgeController.updateStatus);
router.get('/rankings', judgeController.getRankings);

module.exports = router;
