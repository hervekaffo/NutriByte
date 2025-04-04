import mongoose from 'mongoose';
const mealSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
    date: { type: Date, default: Date.now },
    foods: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
        servingSize: { type: String },
        quantity: { type: Number, required: true },
      }
    ]
  });
  
  module.exports = mongoose.model('Meal', mealSchema);