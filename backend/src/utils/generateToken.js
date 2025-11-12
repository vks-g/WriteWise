const jwt = require('jsonwebtoken');

const GenerateToken = (payload) => {
  const secretKey = process.env.JWT_SECRET;
  const options = { expiresIn: '10h' };
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

module.exports = { GenerateToken };