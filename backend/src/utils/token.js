const jwt = require('jsonwebtoken');

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'change-this-secret', {
    expiresIn: '7d',
  });
}

module.exports = { generateToken };
