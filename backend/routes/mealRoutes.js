import express from 'express';
import { createMeal, updateMeal } from '../controllers/mealController.js';
import { protect } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = express.Router();

// POST /api/meals         ➔ Create new meal & update log
router.route('/')
  .post(protect, createMeal);

// PUT /api/meals/:id      ➔ Update existing meal & adjust log
router.route('/:id')
  .put(protect, checkObjectId, updateMeal);

export default router;
