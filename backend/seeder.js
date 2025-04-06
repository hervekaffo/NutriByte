import mongoose from 'mongoose';
 import dotenv from 'dotenv';
 import colors from 'colors';
 import users from './data/users.js';
 import foods from './data/branded_food.js';
 import User from './models/userModel.js';
 import Food from './models/foodModel.js'; 
 import Meal from './models/mealModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Food.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleFoods = foods.map((food) => {
      return { ...food };
    });

    await Food.insertMany(sampleFoods);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
}

const destroyData = async () => {
  try {
    await Food.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};
if (process.argv[2] === '-d') {
  destroyData();
}   
else {
  importData();
}
