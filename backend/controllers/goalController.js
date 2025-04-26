import asyncHandler from '../middleware/asyncHandler.js';
import Goal        from '../models/goalModel.js';
import { Macro }   from '../models/foodModel.js';    // ← ensure Macro is exported from foodModel.js
import User        from '../models/userModel.js';

// @desc    Get the current user's goal
// @route   GET /api/goals/my
// @access  Private
export const getMyGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ userId: req.user._id })
    .populate('dailyMacrosGoal');

  // Return null if no goal, so front-end can show “No goal set”
  if (!goal) {
    return res.status(200).json(null);
  }

  res.json(goal);
});

// @desc    Create a new goal for current user
// @route   POST /api/goals
// @access  Private
export const createGoal = asyncHandler(async (req, res) => {
  const {
    goalType,
    targetWeight,
    dailyCalorieGoal,
    dailyMacrosGoal: { protein, carbs, fats },
    startDate,
    endDate
  } = req.body;

  // 1) Create Macro
  const macro = await Macro.create({
    calories:      dailyCalorieGoal,
    protein,
    fat:           fats,
    carbohydrates: carbs,
    fiber:         0,
    sugar:         0
  });

  // 2) Create Goal referencing that Macro
  const goal = await Goal.create({
    userId:           req.user._id,
    goalType,
    targetWeight,
    dailyCalorieGoal,
    dailyMacrosGoal:  macro._id,
    startDate,
    endDate
  });

  // 3) Attach goal to user
  await User.findByIdAndUpdate(req.user._id, { goal: goal._id });

  // 4) Return populated Goal
  const populated = await goal.populate('dailyMacrosGoal');
  res.status(201).json(populated);
});

// @desc    Update an existing goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  // Only owner or admin may update
  if (goal.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const {
    goalType,
    targetWeight,
    dailyCalorieGoal,
    dailyMacrosGoal: { protein, carbs, fats },
    startDate,
    endDate
  } = req.body;

  // Update Macro doc
  await Macro.findByIdAndUpdate(goal.dailyMacrosGoal, {
    calories:      dailyCalorieGoal,
    protein,
    fat:           fats,
    carbohydrates: carbs
  });

  // Update Goal fields
  goal.goalType         = goalType;
  goal.targetWeight     = targetWeight;
  goal.dailyCalorieGoal = dailyCalorieGoal;
  goal.startDate        = startDate;
  goal.endDate          = endDate;

  const updated = await goal.save();
  res.json(await updated.populate('dailyMacrosGoal'));
});

// @desc    Admin: Get all goals
// @route   GET /api/goals
// @access  Private/Admin
export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find()
    .populate('dailyMacrosGoal')
    .populate('userId', 'name email');
  res.json(goals);
});

// @desc    Admin: Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private/Admin
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }
  // Remove associated Macro
  await Macro.findByIdAndDelete(goal.dailyMacrosGoal);
  await goal.deleteOne();
  res.json({ message: 'Goal removed' });
});

// @desc    Admin: Get goal by ID
// @route   GET /api/goals/:id
// @access  Private/Admin
export const getGoalById = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)
    .populate('dailyMacrosGoal');
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }
  res.json(goal);
});
