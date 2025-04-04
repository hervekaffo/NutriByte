import express from 'express';
const router = express.Router();
import { getFoods, getFoodById } from '../controllers/foodController.js';


router.route('/').get(getFoods);
router.route('/:id').get(getFoodById);

 export default router;