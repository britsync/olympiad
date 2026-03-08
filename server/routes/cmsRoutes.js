const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'cms_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDFs and images (JPG/PNG/WEBP) are allowed'), false);
        }
    }
});

// Unified CMS Routes
router.get('/:type', cmsController.getAll);
router.post('/upload', upload.single('pdf'), cmsController.uploadFile);
router.post('/:type', cmsController.create);
router.put('/:type/:id', cmsController.update);
router.delete('/:type/:id', cmsController.delete);

// Specialized route for bulk content updates
router.post('/content/bulk', cmsController.bulkUpsertContent);

module.exports = router;
