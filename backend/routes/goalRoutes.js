import express from 'express';
import {
  getMyGoal,
  createGoal,
  updateGoal,
  getGoals,
  deleteGoal,
  getGoalById
} from '../controllers/goalController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// This must live *before* your “/:id” route or it will get shadowed
router.route('/my')
  .get(protect, getMyGoal);

router.route('/')
  .post(protect, createGoal)
  .get(protect, admin, getGoals);

router.route('/:id')
  .get(protect, admin, getGoalById)
  .put(protect, updateGoal)
  .delete(protect, admin, deleteGoal);

export default router;

