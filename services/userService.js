const User = require('../models/User');

const updateUserLocation = async (userId, coordinates) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.location = {
    type: 'Point',
    coordinates
  };
  await user.save();
  return user;
};

module.exports = { updateUserLocation };
