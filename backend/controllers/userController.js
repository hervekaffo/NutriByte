import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      isAdmin: user.isAdmin,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activityLevel: user.activityLevel,
      goal: user.goal,
      dailyCalorieGoal: user.dailyCalorieGoal,
      dailyMacrosGoal: user.dailyMacrosGoal,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    picture,
    age,
    weight,
    height,
    gender,
    activityLevel,
    goal,
    dailyCalorieGoal,
    dailyMacrosGoal,
  } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    picture,
    age,
    weight,
    height,
    gender,
    activityLevel,
    goal,
    dailyCalorieGoal,
    dailyMacrosGoal,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      isAdmin: user.isAdmin,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activityLevel: user.activityLevel,
      goal: user.goal,
      dailyCalorieGoal: user.dailyCalorieGoal,
      dailyMacrosGoal: user.dailyMacrosGoal,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      isAdmin: user.isAdmin,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activityLevel: user.activityLevel,
      goal: user.goal,
      dailyCalorieGoal: user.dailyCalorieGoal,
      dailyMacrosGoal: user.dailyMacrosGoal,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update basic fields
  user.name             = req.body.name              || user.name;
  user.email            = req.body.email             || user.email;
  user.picture          = req.body.picture           || user.picture;
  // Numeric fields: use nullish coalescing to allow zero
  user.age              = req.body.age               ?? user.age;
  user.weight           = req.body.weight            ?? user.weight;
  user.height           = req.body.height            ?? user.height;
  // Enums / strings
  user.gender           = req.body.gender            || user.gender;
  user.activityLevel    = req.body.activityLevel     || user.activityLevel;
  user.goal             = req.body.goal              || user.goal;
  user.dailyCalorieGoal = req.body.dailyCalorieGoal  ?? user.dailyCalorieGoal;
  // dailyMacrosGoal can be an ObjectId or embedded object
  if (req.body.dailyMacrosGoal) {
    user.dailyMacrosGoal = req.body.dailyMacrosGoal;
  }

  // Password
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    picture: updatedUser.picture,
    age: updatedUser.age,
    weight: updatedUser.weight,
    height: updatedUser.height,
    gender: updatedUser.gender,
    activityLevel: updatedUser.activityLevel,
    goal: updatedUser.goal,
    dailyCalorieGoal: updatedUser.dailyCalorieGoal,
    dailyMacrosGoal: updatedUser.dailyMacrosGoal,
    isAdmin: updatedUser.isAdmin,
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error('Cannot delete admin user');
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name    = req.body.name    || user.name;
  user.email   = req.body.email   || user.email;
  user.isAdmin = Boolean(req.body.isAdmin);

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});
