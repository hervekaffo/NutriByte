
/**
 * @file seedImages.js
 * @description This script connects to a MongoDB database, retrieves all food items from the database, 
 * assigns a consistent image to each food item from a directory of images, and updates the database with the assigned image paths.
 * The script ensures that the same image is consistently assigned to the same food item based on a simple hash function.
 * 
 * @requires mongoose - MongoDB object modeling tool for Node.js.
 * @requires dotenv - Loads environment variables from a .env file into process.env.
 * @requires path - Node.js module for working with file and directory paths.
 * @requires fs - Node.js module for interacting with the file system.
 * @requires Food - The Mongoose model representing the food collection in the database.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Food from './backend/models/foodModel.js';

dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✔️  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  }
}

function getConsistentImage(files, key) {
  // simple hash: sum char codes mod files.length
  const idx =
    key
      .split('')
      .reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
    files.length;
  return files[idx];
}

async function seedImages() {
  // 1) read all image filenames
  const imagesDir = path.join(process.cwd(), 'public', 'food_images');
  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => /\.(jpe?g|png|gif)$/i.test(f));

  if (!files.length) {
    console.error('No image files found in', imagesDir);
    process.exit(1);
  }

  // 2) fetch all foods
  const foods = await Food.find({});
  console.log(`🔄  Found ${foods.length} foods—assigning images…`);

  // 3) assign and save
  for (const food of foods) {
    const chosen = getConsistentImage(files, food._id.toString());
    food.image = `/food_images/${chosen}`;
    await food.save();
    console.log(` • ${food._id} → ${chosen}`);
  }

  console.log('✅  Done!');
  process.exit();
}

// run!
(async () => {
  await connectDB();
  await seedImages();
})();
