const {
  generatePasswordHash,
  compare,
  generateAccessToken,
} = require('../helpers');
const User = require('../models/User');

const UserController = {
  register: async (req, res, next) => {
    const { email, password: pass, name } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    console.log('user:', user);
    if (user) {
      return res.status(403).json({ error: 'Email already exits' });
    }
    // Generate Hashed Password
    const { hashedPassword: password } = generatePasswordHash(pass);
    const newUser = new User({
      name,
      email,
      password,
    });
    try {
      const result = await newUser.save();
      res.status(201).json({
        message: 'Succuss fully registered',
        user: result,
      });
    } catch (error) {
      res.status(401).json({ error });
    }
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'Invalid email' });
      }
      const isPasswordMatched = compare(password, user.password);
      if (isPasswordMatched) {
        // generate token
        const accessToken = generateAccessToken(user.id);
        res.status(200).json({
          user,
          access_token: accessToken,
        });
      } else {
        res.status(400).json({ error: 'Invalid Password' });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  getAllUsers: async (req, res, next) => {
    const user = req.user;

    try {
      const users = await User.find({ _id: { $ne: user.id } });
      res.status(200).json({
        users,
        length: users.length,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

module.exports = UserController;
