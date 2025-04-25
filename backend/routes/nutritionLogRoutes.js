import express from 'express';
import { getNutritionLogs, getNutritionLogByDate } from '../controllers/nutritionLogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNutritionLogs);

router.route('/:date')
  .get(protect, getNutritionLogByDate);

export default router;
