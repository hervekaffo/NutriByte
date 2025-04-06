import mongoose, { model } from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  activityLevel: { type: String, enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] },
  goal: { type: String, enum: ['Lose Weight', 'Maintain Weight', 'Gain Muscle'] },
  dailyCalorieGoal: { type: Number },
  dailyMacrosGoal: {
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number }
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
},
  {timestamps: true,}
);

export default model('User', userSchema);
