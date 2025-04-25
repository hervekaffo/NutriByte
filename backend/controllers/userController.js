import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
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

// @desc    Register a new user (and auto-create their Goal)
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
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
    goal: goalType,
    dailyCalorieGoal,
    dailyMacrosGoal  // { protein, carbs, fats }
  } = req.body;

  // 1) Prevent duplicate emails
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // 2) Create the User
  const user = await User.create({
    name,
    email,
    password,
    picture,
    age,
    weight,
    height,
    gender,
    activityLevel
    // NOTE: we do NOT set user.goal here—will attach below
  });

  if (user) {
    // 3) Create a Macro doc for their dailyMacrosGoal
    const macro = await Macro.create({
      calories:      Number(dailyCalorieGoal) || 0,
      protein:       Number(dailyMacrosGoal?.protein) || 0,
      fat:           Number(dailyMacrosGoal?.fats)    || 0,
      carbohydrates: Number(dailyMacrosGoal?.carbs)   || 0,
      fiber:         0,
      sugar:         0
    });

    // 4) Create the Goal doc, referencing that Macro
    const goalDoc = await Goal.create({
      userId:           user._id,
      goalType:         goalType || 'Maintenance',
      targetWeight:     null,
      dailyCalorieGoal: Number(dailyCalorieGoal) || 0,
      dailyMacrosGoal:  macro._id,
      startDate:        Date.now()
    });

    // 5) Attach the Goal to the User and save
    user.goal = goalDoc._id;
    await user.save();

    // 6) Generate JWT and return user payload
    generateToken(res, user._id);
    res.status(201).json({
      _id:       user._id,
      name:      user.name,
      email:     user.email,
      picture:   user.picture,
      isAdmin:   user.isAdmin,
      age:       user.age,
      weight:    user.weight,
      height:    user.height,
      gender:    user.gender,
      activityLevel: user.activityLevel,
      goal:      goalDoc,           // include the full Goal in the response
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
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
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name             = req.body.name || user.name;
    user.email            = req.body.email || user.email;
    user.picture          = req.body.picture || user.picture;
    user.age              = req.body.age       !== undefined ? req.body.age       : user.age;
    user.weight           = req.body.weight    !== undefined ? req.body.weight    : user.weight;
    user.height           = req.body.height    !== undefined ? req.body.height    : user.height;
    user.gender           = req.body.gender    || user.gender;
    user.activityLevel    = req.body.activityLevel || user.activityLevel;
    user.goal             = req.body.goal      || user.goal;
    user.dailyCalorieGoal = req.body.dailyCalorieGoal !== undefined
                              ? req.body.dailyCalorieGoal
                              : user.dailyCalorieGoal;
    user.dailyMacrosGoal  = {
      protein: req.body.dailyMacrosGoal?.protein ?? user.dailyMacrosGoal.protein,
      carbs:   req.body.dailyMacrosGoal?.carbs   ?? user.dailyMacrosGoal.carbs,
      fats:    req.body.dailyMacrosGoal?.fats    ?? user.dailyMacrosGoal.fats,
    };

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id:                updatedUser._id,
      name:               updatedUser.name,
      email:              updatedUser.email,
      picture:            updatedUser.picture,
      age:                updatedUser.age,
      weight:             updatedUser.weight,
      height:             updatedUser.height,
      gender:             updatedUser.gender,
      activityLevel:      updatedUser.activityLevel,
      goal:               updatedUser.goal,
      dailyCalorieGoal:   updatedUser.dailyCalorieGoal,
      dailyMacrosGoal:    updatedUser.dailyMacrosGoal,
      isAdmin:            updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Can not delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
