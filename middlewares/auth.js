const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Không có token được cung cấp' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = authMiddleware;