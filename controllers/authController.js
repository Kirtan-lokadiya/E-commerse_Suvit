const authService = require('../services/authService');

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

module.exports = { signup, login };
