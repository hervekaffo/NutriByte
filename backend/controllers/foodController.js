import asyncHandler from '../middleware/asyncHandler.js';
import Food from '../models/foodModel.js';

// @desc    Fetch all foods
// @route   GET /api/foods
// @access  Public
const getFoods = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
  ? {
    $or: [
      { description: { $regex: req.query.keyword, $options: 'i' } },
      { brandedFoodCategory: { $regex: req.query.keyword, $options: 'i' } },
    ],
  }
: {};
  const count = await Food.countDocuments({ ...keyword });
  const foods = await Food.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ foods, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single food
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const food = await Food.findById(req.params.id);
  if (food) {
    return res.json(food);
  } else {
    // NOTE: this will run if a valid ObjectId but no food was found
    // i.e. food may be null
    res.status(404);
    throw new Error('Food not found');
  }
});

// @desc    Create a food
// @route   POST /api/foods
// @access  Private/Admin
const createFood = asyncHandler(async (req, res) => {
  const food = new Food({
    brandOwner: 'Sample name',
    servingSize: 1,
    image: '/images/sample.jpg',
    marketCountry: 'USA',
    brandedFoodCategory: 'Sample category',
    servingSizeUnit: 'g',
    numReviews: 0,
    description: 'Sample description',
  });

  const createdFood = await food.save();
  res.status(201).json(createdFood);
});

// @desc    Update a food
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFood = asyncHandler(async (req, res) => {
  const { brandOwner, servingSize, description, servingSizeUnit, brandedFoodCategory, marketCountry, image } =
    req.body;

  const food = await Food.findById(req.params.id);

  if (food) {
    food.brandOwner = brandOwner;
    food.servingSize = servingSize;
    food.description = description;
    food.servingSizeUnit = servingSizeUnit;
    food.brandOwner = brandOwner;
    food.brandedFoodCategory = brandedFoodCategory;
    food.marketCountry = marketCountry;
    food.image = image;

    const updatedFood = await food.save();
    res.json(updatedFood);
  } else {
    res.status(404);
    throw new Error('Food not found');
  }
});

// @desc    Delete a food
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (food) {
    await Food.deleteOne({ _id: food._id });
    res.json({ message: 'Food removed' });
  } else {
    res.status(404);
    throw new Error('Food not found');
  }
});

// @desc    Create new review
// @route   POST /api/foods/:id/reviews
// @access  Private
const createFoodReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const food = await Food.findById(req.params.id);

  if (food) {
    const alreadyReviewed = food.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Food already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    food.reviews.push(review);

    food.numReviews = food.reviews.length;

    food.rating =
      food.reviews.reduce((acc, item) => item.rating + acc, 0) /
      food.reviews.length;

    await food.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Food not found');
  }
});

// @desc    Get top rated foods
// @route   GET /api/foods/top
// @access  Public
const getTopFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({}).sort({ rating: -1 }).limit(4);

  res.json(foods);
});

export {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  createFoodReview,
  getTopFoods,
};
