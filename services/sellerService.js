const Seller = require('../models/Seller');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (sellerId) => {
  const payload = {
    sellerId: sellerId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30)
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const signup = async (userData) => {
  const { firstName, lastName, email, password, phone, address, companyName, businessRegistrationNumber, bankName, accountNumber, location } = userData;

  let existingSeller = await Seller.findOne({ email });
  if (existingSeller) {
    throw new Error('Seller with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newSeller = new Seller({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    address,
    companyName,
    businessRegistrationNumber,
    bankName,
    accountNumber,
    location
  });

  await newSeller.save();

  const token = generateToken(newSeller._id);

  await Token.create({ token, userId: newSeller._id });

  const sellerWithoutPassword = newSeller.toObject();
  delete sellerWithoutPassword.password;

  return { seller: sellerWithoutPassword, token };
};

const login = async (loginData) => {
  const { email, password } = loginData;

  const seller = await Seller.findOne({ email });
  if (!seller) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, seller.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  let userToken = await Token.findOne({ userId: seller._id });

  if (userToken) {
    try {
      jwt.verify(userToken.token, process.env.JWT_SECRET);
      const sellerWithoutPassword = seller.toObject();
      delete sellerWithoutPassword.password;
      return { seller: sellerWithoutPassword, token: userToken.token };
    } catch (error) {
      const newToken = generateToken(seller._id);
      userToken.token = newToken;
      await userToken.save();
      const sellerWithoutPassword = seller.toObject();
      delete sellerWithoutPassword.password;
      return { seller: sellerWithoutPassword, token: newToken };
    }
  } else {
    const newToken = generateToken(seller._id);
    await Token.create({ token: newToken, userId: seller._id });
    const sellerWithoutPassword = seller.toObject();
    delete sellerWithoutPassword.password;
    return { seller: sellerWithoutPassword, token: newToken };
  }
};

const updateLocation = async (sellerId, location) => {
  const seller = await Seller.findByIdAndUpdate(sellerId, { location }, { new: true });
  if (!seller) {
    throw new Error('Seller not found');
  }
  const sellerWithoutPassword = seller.toObject();
  delete sellerWithoutPassword.password;
  return sellerWithoutPassword;
};

module.exports = { signup, login, updateLocation };
