const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Handle both Bearer and plain token formats
    const tokenToVerify = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    // Verify token
    const decoded = jwt.verify(tokenToVerify, process.env.JWT_SECRET);

    // Attach decoded payload to request
    req.user = decoded; // { id: user_id }

    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;