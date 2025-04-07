import asyncHandler from "../middleware/asyncHandler.js";
import Food from "../models/foodModel.js";

// @desc    Fetch all foods
// @route   GET /api/foods  
// @access  Public
const getFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({});
  res.json(foods);
});

// @desc    Fetch food by ID
// @route   GET /api/foods/:id  
// @access  Public
const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (food) {
    return res.json(food);
  }
  res.status(404);
  throw new Error("Resource not found");
}); 

export { getFoods, getFoodById };