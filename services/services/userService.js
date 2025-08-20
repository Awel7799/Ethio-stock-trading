// services/userService.js
const User = require('../models/User'); // adjust path if needed

async function getAllUsers() {
  return User.find({}, '_id').lean(); // get only user IDs
}

module.exports = { getAllUsers };
