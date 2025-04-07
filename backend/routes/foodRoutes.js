import express from 'express';
const router = express.Router();
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  createFoodReview,
  getTopFoods,
} from '../controllers/foodController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getFoods).post(protect, admin, createFood);
router.route('/:id/reviews').post(protect, checkObjectId, createFoodReview);
router.get('/top', getTopFoods);
router
  .route('/:id')
  .get(checkObjectId, getFoodById)
  .put(protect, admin, checkObjectId, updateFood)
  .delete(protect, admin, checkObjectId, deleteFood);

export default router;
