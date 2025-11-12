const jwt = require('jsonwebtoken');

const ValidatorToken = (token) => {
  try {
    const secretKey = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { ValidatorToken };