import express from 'express';
import { getNutritionSuggestion } from '../controllers/suggestionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/nutrition', protect, getNutritionSuggestion);

export default router;
