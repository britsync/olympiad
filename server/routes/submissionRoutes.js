const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDFs are allowed'), false);
        }
    }
});

router.post('/submit', upload.single('pdf'), submissionController.submitProject);
router.get('/', submissionController.getSubmissions);
router.get('/winners', submissionController.getWinners);
router.delete('/:id', submissionController.deleteSubmission);

module.exports = router;
