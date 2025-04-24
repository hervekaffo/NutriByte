import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  email:           { type: String, required: true, unique: true },
  password:        { type: String, required: true },
  picture:         { type: String, required: true, default: 'images/user_images/default.jpg' },
  age:             { type: Number, required: true },
  weight:          { type: Number, required: true },
  height:          { type: Number, required: true },
  gender:          { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  activityLevel:   { type: String, enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] },
  goal:            { type: String, enum: ['Lose Weight', 'Maintain Weight', 'Gain Muscle'], required: true },
  dailyCalorieGoal:{ type: Number, required: true },
  dailyMacrosGoal: {
    protein: { type: Number },
    carbs:   { type: Number },
    fats:    { type: Number },
  },
  isAdmin:         { type: Boolean, required: true, default: false },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plaintext to hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
