const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsorController');

router.get('/', sponsorController.getSponsors);
router.post('/', sponsorController.addSponsor);
router.put('/:id', sponsorController.updateSponsor);
router.delete('/:id', sponsorController.deleteSponsor);

module.exports = router;
