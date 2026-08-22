const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const ALLOWED_FOLDERS = ['courses', 'instructors', 'blogs', 'welfare', 'resources', 'announcements', 'certifications', 'payment-receipts'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.zip', '.txt', '.jpg', '.jpeg', '.png'];

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = '.' + file.originalname.split('.').pop().toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpg, png, webp, gif)'), false);
    }
  },
});

const uploadDocument = multer({
  storage,
  limits: { fileSize: 52 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = '.' + file.originalname.split('.').pop().toLowerCase();
    if (ALLOWED_DOCUMENT_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only document files are allowed (pdf, doc, docx, ppt, pptx, xls, xlsx, zip, txt)'), false);
    }
  },
});

// POST /api/v1/upload?folder=courses|instructors|blogs
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      return res.status(500).json({ success: false, message: 'Cloudinary credentials not configured on server' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const folder = ALLOWED_FOLDERS.includes(req.query.folder)
      ? req.query.folder
      : 'misc';

    const cloudinaryFolder = `alkahaf/${folder}`;

    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: cloudinaryFolder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadToCloudinary();

    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
});

// POST /api/v1/upload/document?folder=courses
router.post('/document', authMiddleware, uploadDocument.single('file'), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      return res.status(500).json({ success: false, message: 'Cloudinary credentials not configured on server' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const folder = ALLOWED_FOLDERS.includes(req.query.folder)
      ? req.query.folder
      : 'misc';

    const cloudinaryFolder = `alkahaf/${folder}`;

    // Cloudinary's raw resource_type does not automatically keep the file
    // extension in the delivery URL (unlike images) — the public_id must
    // include it explicitly, or downloaded files end up without one.
    const ext = '.' + req.file.originalname.split('.').pop().toLowerCase();
    const baseName = req.file.originalname
      .slice(0, -ext.length)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 80) || 'file';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const publicId = `${baseName}-${uniqueSuffix}${ext}`;

    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: cloudinaryFolder, resource_type: 'raw', public_id: publicId },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadToCloudinary();

    res.json({ success: true, url: result.secure_url, name: req.file.originalname, size: req.file.size });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
});

module.exports = router;
