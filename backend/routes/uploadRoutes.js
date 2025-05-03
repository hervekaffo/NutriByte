// Description: This file contains the upload routes for handling image uploads.
import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
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
  const sourcePath = `images/user_images/${req.file.filename}`;
  const destinationPath = `frontend/public/images/user_images/${req.file.filename}`;

  fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error copying file', error: err.message });
    }
    res.status(201).json({ picture: `/images/user_images/${req.file.filename}` });
  });
});

export default router;
