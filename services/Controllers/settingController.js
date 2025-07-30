// controllers/settingController.js
const User = require('../models/users'); // import the User model

// Controller function to create a new user
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;

    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      message: 'Server error while creating user',
      error: error.message
    });
  }
};
