import asyncHandler from '../middleware/asyncHandler.js';
import NutritionLog from '../models/nutritionLogsModel.js';

// @desc    Get all logs for the logged-in user
// @route   GET /api/nutrition-logs
// @access  Private
const getNutritionLogs = asyncHandler(async (req, res) => {
  const logs = await NutritionLog
    .find({ userId: req.user._id })
    .sort({ date: -1 });
  res.json(logs);
});

// @desc    Get a single log by date (YYYY-MM-DD)
// @route   GET /api/nutrition-logs/:date
// @access  Private
const getNutritionLogByDate = asyncHandler(async (req, res) => {
  const date = new Date(req.params.date);
  date.setHours(0,0,0,0);

  const log = await NutritionLog.findOne({ userId: req.user._id, date });
  if (log) return res.json(log);

  res.status(404);
  throw new Error(`No nutrition log for ${req.params.date}`);
});

export { getNutritionLogs, getNutritionLogByDate };
