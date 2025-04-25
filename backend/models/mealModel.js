import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:   { type: Date, default: Date.now },

  foods: [
    {
      foodId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
      servingSize: { type: String },
      quantity:    { type: Number, required: true },
    }
  ],

 //total nutrients for this meal
  totalCalories: {
    type: Number,
    required: true,
    default: 0
  },
  totalMacros: {                       // ⬅️ Macros for this meal
    protein: { type: Number, required: true, default: 0 },
    carbs:   { type: Number, required: true, default: 0 },
    fats:    { type: Number, required: true, default: 0 }
  }
});

export default mongoose.model('Meal', mealSchema);
