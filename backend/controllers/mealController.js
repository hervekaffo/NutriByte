// backend/controllers/mealController.js

import asyncHandler from '../middleware/asyncHandler.js';
import Meal         from '../models/mealModel.js';
import Food         from '../models/foodModel.js';
import NutritionLog from '../models/nutritionLogsModel.js';
import User         from '../models/userModel.js';
import Goal         from '../models/goalModel.js';

// Helper to zero out the time portion of a Date
const normalizeDate = dt => {
  const d = new Date(dt);
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Create a new Meal & upsert that day’s NutritionLog
// @route   POST /api/meals
// @access  Private
export const createMeal = asyncHandler(async (req, res) => {
  const { date, foods, overrideTotals } = req.body;

  // 1) Fetch the user's Goal (with macros)
  const goal = await Goal.findOne({ userId: req.user._id })
    .populate('dailyMacrosGoal');
  if (!goal) {
    res.status(400);
    throw new Error('Please set a daily goal before logging meals');
  }

  let totalCalories, totalProtein, totalCarbs, totalFats;

  if (overrideTotals) {
    // Use manually entered totals
    totalCalories = overrideTotals.totalCalories;
    totalProtein  = overrideTotals.totalMacros.protein;
    totalCarbs    = overrideTotals.totalMacros.carbs;
    totalFats     = overrideTotals.totalMacros.fats;
  } else {
    // Bulk-fetch all Foods + their macros
    const foodDocs = await Food.find({
      _id: { $in: foods.map(f => f.foodId) }
    }).populate('macros');

    // Compute totals from macros
    totalCalories = 0;
    totalProtein  = 0;
    totalCarbs    = 0;
    totalFats     = 0;

    for (const item of foods) {
      const foodDoc = foodDocs.find(fd => fd._id.toString() === item.foodId);
      if (!foodDoc) {
        throw new Error(`Food not found: ${item.foodId}`);
      }
      if (!foodDoc.macros) {
        console.warn(
          `Warning: No macros for Food ${foodDoc._id} (${foodDoc.description}). Defaulting to zeros.`
        );
        continue;
      }
      const m   = foodDoc.macros;
      const qty = item.quantity;

      totalCalories += (m.calories      || 0) * qty;
      totalProtein  += (m.protein       || 0) * qty;
      totalCarbs    += (m.carbohydrates || 0) * qty;
      totalFats     += (m.fat           || 0) * qty;
    }
  }

  // 2) Save the Meal document
  const meal = new Meal({
    userId:       req.user._id,
    date,
    foods,
    totalCalories,
    totalMacros: {
      protein: totalProtein,
      carbs:   totalCarbs,
      fats:    totalFats
    }
  });
  const createdMeal = await meal.save();

  // 3) Upsert the daily NutritionLog
  const logDate = normalizeDate(date);
  let log = await NutritionLog.findOne({
    userId: req.user._id,
    date:   logDate
  });

  if (log) {
    log.totalCalories       += totalCalories;
    log.totalMacros.protein += totalProtein;
    log.totalMacros.carbs   += totalCarbs;
    log.totalMacros.fats    += totalFats;
  } else {
    log = new NutritionLog({
      userId:       req.user._id,
      date:         logDate,
      totalCalories,
      totalMacros: {
        protein: totalProtein,
        carbs:   totalCarbs,
        fats:    totalFats
      }
    });
  }

  // 4) Compute progress toward the daily Goal
  log.progressTowardsGoal = {
    calories: (log.totalCalories / goal.dailyCalorieGoal) * 100,
    protein:  (log.totalMacros.protein / goal.dailyMacrosGoal.protein) * 100,
    carbs:    (log.totalMacros.carbs / goal.dailyMacrosGoal.carbohydrates) * 100,
    fats:     (log.totalMacros.fats / goal.dailyMacrosGoal.fat) * 100,
  };

  await log.save();

  res.status(201).json(createdMeal);
});

// @desc    Update an existing Meal & adjust that day’s NutritionLog
// @route   PUT /api/meals/:id
// @access  Private
export const updateMeal = asyncHandler(async (req, res) => {
  const { date, foods } = req.body;
  const meal = await Meal.findById(req.params.id);
  if (!meal) {
    res.status(404);
    throw new Error('Meal not found');
  }

  // Store old totals for diffing
  const old = {
    calories: meal.totalCalories,
    protein:  meal.totalMacros.protein,
    carbs:    meal.totalMacros.carbs,
    fats:     meal.totalMacros.fats
  };

  // Recalculate totals
  const foodDocs = await Food.find({
    _id: { $in: foods.map(f => f.foodId) }
  }).populate('macros');

  let totalCalories = 0,
      totalProtein  = 0,
      totalCarbs    = 0,
      totalFats     = 0;

  for (const item of foods) {
    const foodDoc = foodDocs.find(fd => fd._id.toString() === item.foodId);
    if (!foodDoc || !foodDoc.macros) continue;
    const m   = foodDoc.macros;
    const qty = item.quantity;

    totalCalories += (m.calories      || 0) * qty;
    totalProtein  += (m.protein       || 0) * qty;
    totalCarbs    += (m.carbohydrates || 0) * qty;
    totalFats     += (m.fat           || 0) * qty;
  }

  // Update the Meal document
  meal.date          = date || meal.date;
  meal.foods         = foods;
  meal.totalCalories = totalCalories;
  meal.totalMacros   = {
    protein: totalProtein,
    carbs:   totalCarbs,
    fats:    totalFats
  };
  const updatedMeal = await meal.save();

  // Adjust the NutritionLog for that date
  const logDate = normalizeDate(meal.date);
  const log = await NutritionLog.findOne({
    userId: req.user._id,
    date:   logDate
  });

  if (log) {
    log.totalCalories       += (totalCalories - old.calories);
    log.totalMacros.protein += (totalProtein  - old.protein);
    log.totalMacros.carbs   += (totalCarbs    - old.carbs);
    log.totalMacros.fats    += (totalFats     - old.fats);

    // Recompute progress toward goal when you update
    const goal = await Goal.findOne({ userId: req.user._id })
      .populate('dailyMacrosGoal');
    if (goal) {
      log.progressTowardsGoal = {
        calories: (log.totalCalories / goal.dailyCalorieGoal) * 100,
        protein:  (log.totalMacros.protein / goal.dailyMacrosGoal.protein) * 100,
        carbs:    (log.totalMacros.carbs / goal.dailyMacrosGoal.carbohydrates) * 100,
        fats:     (log.totalMacros.fats / goal.dailyMacrosGoal.fat) * 100,
      };
    }

    await log.save();
  }

  res.json(updatedMeal);
});
