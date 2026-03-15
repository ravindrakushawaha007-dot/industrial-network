const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/authMiddleware');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Multer storage (Temporary buffer)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB Limit
});

router.post('/', protect, upload.single('media'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        // File Validation (MIME Types)
        const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: 'Invalid file type' });
        }

        // Upload to Cloudinary
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const response = await cloudinary.uploader.upload(base64Image, {
            resource_type: "auto", // Detects if image, video, or raw doc
            folder: "hammerwold_uploads"
        });

        res.status(200).json({
            success: true,
            url: response.secure_url,
            public_id: response.public_id
        });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

module.exports = router;
