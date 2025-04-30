#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Recursively compress images
export async function compressImages(inputDir = './images', outputDir = './compressed') {
  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
  }

  async function compressFile(src, dst) {
    const ext = path.extname(src).toLowerCase();
    let pipeline = sharp(src);

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: 30, mozjpeg: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: 30, compressionLevel: 8 });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: 30 });
    } else {
      // copy other file types
      await fs.copyFile(src, dst);
      console.log(`Copied: ${src} → ${dst}`);
      return;
    }

    await pipeline.toFile(dst);
    console.log(`Compressed: ${src} → ${dst}`);
  }

  async function walk(srcDir, dstDir) {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const dstPath = path.join(dstDir, entry.name);

      if (entry.isDirectory()) {
        await walk(srcPath, dstPath);
      } else if (exts.includes(path.extname(entry.name).toLowerCase())) {
        await ensureDir(path.dirname(dstPath));
        await compressFile(srcPath, dstPath);
      }
    }
  }

  console.log(`Compressing from "${inputDir}" to "${outputDir}"…`);
  await walk(inputDir, outputDir);
  console.log('Compression complete.');
}

// If this file is run directly, call compressImages()
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const [,, inDir, outDir] = process.argv;
  compressImages(inDir, outDir).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
