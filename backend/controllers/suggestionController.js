import asyncHandler from '../middleware/asyncHandler.js';
import Goal        from '../models/goalModel.js';
import NutritionLog from '../models/nutritionLogsModel.js';
import OpenAI      from 'openai';
import dotenv      from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // make sure this is set in your .env
});

// @desc    Get AI nutrition suggestions based on latest log & goal
// @route   GET /api/suggestions/nutrition
// @access  Private
export const getNutritionSuggestion = asyncHandler(async (req, res) => {
  // 1) Load the user's goal
  const goal = await Goal.findOne({ userId: req.user._id }).populate('dailyMacrosGoal');
  if (!goal) {
    return res.status(400).json({ message: 'Please set a daily goal first.' });
  }

  // 2) Load the most recent nutrition log
  const latestLog = await NutritionLog.findOne({ userId: req.user._id })
    .sort({ date: -1 })
    .lean();
  if (!latestLog) {
    return res.status(400).json({ message: 'No nutrition logs found.' });
  }

  // 3) Build a concise prompt
  const prompt = `
Your daily calorie goal: ${goal.dailyCalorieGoal} kcal
Your daily macro goals: protein ${goal.dailyMacrosGoal.protein}g, carbs ${goal.dailyMacrosGoal.carbohydrates}g, fats ${goal.dailyMacrosGoal.fat}g

Today’s intake:
- Calories: ${latestLog.totalCalories} kcal
- Protein: ${latestLog.totalMacros.protein} g
- Carbs: ${latestLog.totalMacros.carbs} g
- Fats: ${latestLog.totalMacros.fats} g

Please give 3 short, actionable suggestions to help me get closer to my goals tomorrow.
`.trim();

  // 4) Call OpenAI’s chat completion
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful nutrition coach.' },
      { role: 'user',   content: prompt },
    ],
    max_tokens: 200,
  });

  // 5) Extract and return the suggestion text
  const suggestion = response.choices?.[0]?.message?.content?.trim();
  if (!suggestion) {
    return res.status(500).json({ message: 'AI did not return a suggestion.' });
  }

  res.json({ suggestion });
});