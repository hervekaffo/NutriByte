import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalType: {
    type: String,
    enum: ['Weight Loss', 'Muscle Gain', 'Maintenance'],
    required: true
  },
  targetWeight: {
    type: Number
  },
  dailyCalorieGoal: {
    type: Number,
    required: true
  },
  // Reference your Macro model for the macro breakdown
  dailyMacrosGoal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Macro',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
});

export default mongoose.model('Goal', goalSchema);

  