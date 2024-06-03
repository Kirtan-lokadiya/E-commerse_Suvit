const authService = require('../services/authService');
const Token = require('../models/Token')

const signup = async (req, res) => {
  try {
    const { user, token } = await authService.signup(req.body);
    res.status(201).json({ message: 'User created successfully', user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};


const  logout = async (req, res) => {
  
    
    const userId = req.user._id; 
    
    try {
        await Token.deleteOne({ userId: userId });
        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
};

module.exports = { signup, login, logout };
