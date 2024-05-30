const User = require('../models/User');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const payload = {
    userId: userId,
    // Set expiration time to 1 month from now (in seconds)
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30)
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const signup = async (userData) => {
  const { firstName, lastName, email, password, phone, location: { coordinates }, role, photo, address: { street, city, state, country, zip }} = userData;

  // Check if user already exists
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    address: {
      street,
      city,
      state,
      country,
      zip
    },
    role: role || 'customer',
    location: {
      type: 'Point',
      coordinates
    },
    photo
  });

  // Save the user to the database
  await newUser.save();

  // Generate token
  const token = generateToken(newUser._id);

  // Save token to database
  await Token.create({ token, userId: newUser._id });

  // Exclude the password from the user object before returning
  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;

  // Return user details and token to client
  return { user: userWithoutPassword, token };
};

const login = async (loginData) => {
  const { email, password } = loginData;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Check if there is an existing valid token
  let userToken = await Token.findOne({ userId: user._id });

  if (userToken) {
    try {
      // Verify if the existing token is still valid
      jwt.verify(userToken.token, process.env.JWT_SECRET);
      // If the token is valid, return it
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      return { user: userWithoutPassword, token: userToken.token };
    } catch (error) {
      // If token has expired or is invalid, generate a new one
      const newToken = generateToken(user._id);
      userToken.token = newToken;
      await userToken.save();
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      return { user: userWithoutPassword, token: newToken };
    }
  } else {
    // No existing token, generate a new one
    const newToken = generateToken(user._id);
    await Token.create({ token: newToken, userId: user._id });
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return { user: userWithoutPassword, token: newToken };
  }
};

module.exports = { signup, login };
