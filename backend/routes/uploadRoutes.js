// Description: This file contains the upload routes for handling image uploads.
import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images/user_images/');
  },
  filename(req, file, cb) {
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpe?g|png|webp/;
  const ext  = allowed.test(path.extname(file.originalname).toLowerCase());
  const type = allowed.test(file.mimetype);
  if (ext && type) cb(null, true);
  else cb(new Error('Only .jpg, .jpeg or .png files are allowed'), false);
};

const upload = multer({ storage, fileFilter });

router.post('/', upload.single('picture'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // serve later from /images/user_images/<filename>
  res.status(201).json({ picture: `/images/user_images/${req.file.filename}` });
});

export default router;
