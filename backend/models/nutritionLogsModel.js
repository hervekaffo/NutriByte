import mongoose from 'mongoose';

const nutritionLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now, unique: true },
    totalCalories: { type: Number, required: true },
    totalMacros: {
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fats: { type: Number, required: true }
    },
    progressTowardsGoal: {
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fats: { type: Number }
    }
  });
  
  module.exports = mongoose.model('NutritionLog', nutritionLogSchema);
  