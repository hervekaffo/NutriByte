import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goalType: { type: String, enum: ['Weight Loss', 'Muscle Gain', 'Maintenance'], required: true },
    targetWeight: { type: Number, required: false },
    dailyCalorieGoal: { type: Number, required: true },
    dailyMacrosGoal: {
      protein: { type: Number },
      carbs: { type: Number },
      fats: { type: Number }
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }
  });
  
  module.exports = mongoose.model('Goal', goalSchema);
  