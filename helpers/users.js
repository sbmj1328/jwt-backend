const crypto = require('crypto');
const slt = process.env.SALT || 'xxi93jk67k3j';
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateSalt = (rounds) => {
  if (rounds >= 15) {
    throw new Error(`${rounds} is greater than 15,Must be less that 15`);
  }
  if (typeof rounds !== 'number') {
    throw new Error('rounds param must be a number');
  }
  if (rounds == null) {
    rounds = 12;
  }
  return crypto
    .randomBytes(Math.ceil(rounds / 2))
    .toString('hex')
    .slice(0, rounds);
};

const hasher = (password, salt) => {
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  let value = hash.digest('hex');
  return {
    salt: salt,
    hashedPassword: value,
  };
};

const hash = (password, salt = slt) => {
  if (password == null || salt == null) {
    throw new Error('Must Provide Password and salt values');
  }
  if (typeof password !== 'string' || typeof salt !== 'string') {
    throw new Error(
      'password must be a string and salt must either be a salt string or a number of rounds'
    );
  }
  return hasher(password, salt);
};

module.exports = {
  compare: (password, hashedPassword, salt = slt) => {
    if (password == null || hash == null) {
      throw new Error('password and hash is required to compare');
    }
    if (typeof password !== 'string') {
      throw new Error('password must be a String and hash must be an Object');
    }
    let passwordData = hasher(password, salt);
    if (passwordData.hashedPassword === hashedPassword) {
      return true;
    }
    return false;
  },
  generateAccessToken: (id) => {
    return jwt.sign({ id }, '21km2b82329bjjsaz');
  },
  generatePasswordHash: (password) => {
    return hash(password);
  },
  authenticateToken: async (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // if there isn't any token

    try {
      const { id } = await jwt.verify(token, '21km2b82329bjjsaz');

      if (!id) {
        return res.status(401).json({ error: 'Failed to Authenticate. Please logout and try again' });
      }

      const user = await User.findById(id);

      req.user = user;
      next(); // pass the execution off to whatever request the client intended
    } catch (error) {
      res.status(403).json({ error: 'Failed to Authenticate. Please logout and try again' });
    }
  },
};
