import mongoose from 'mongoose';

const nutritionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Keep date, but remove `unique: true` here
  date: {
    type: Date,
    default: Date.now
  },

  totalCalories: {
    type: Number,
    required: true
  },

  totalMacros: {
    protein: { type: Number, required: true },
    carbs:   { type: Number, required: true },
    fats:    { type: Number, required: true }
  },

  progressTowardsGoal: {
    calories: { type: Number },
    protein:  { type: Number },
    carbs:    { type: Number },
    fats:     { type: Number }
  }
});

// Add a compound unique index on userId+date
nutritionLogSchema.index(
  { userId: 1, date: 1 },
  { unique: true }
);

export default mongoose.model('NutritionLog', nutritionLogSchema);
