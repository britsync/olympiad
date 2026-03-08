const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for industry images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/industries');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'industry-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', staffController.getStaff);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);
router.post('/upload-industry-image', upload.single('image'), staffController.uploadIndustryImage);

module.exports = router;
