const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// Single file upload
router.post('/single', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
        success: true,
        message: 'File uploaded successfully',
        data: {
            filename: req.file.filename,
            url: fileUrl, // Relative path for frontend to use
            fullPath: req.file.path
        }
    });
});

// Multiple files upload
router.post('/multiple', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const filesData = req.files.map(file => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        fullPath: file.path
    }));

    res.json({
        success: true,
        message: 'Files uploaded successfully',
        data: filesData
    });
});

module.exports = router;
