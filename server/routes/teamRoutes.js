const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/register', teamController.registerTeam);
router.get('/', teamController.getTeams);
router.delete('/:id', teamController.deleteTeam);

module.exports = router;
