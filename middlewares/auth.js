const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware xác thực JWT
exports.authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header hoặc cookie
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để truy cập'
      });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user và gắn vào request
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập hết hạn hoặc không hợp lệ',
      error: error.message
    });
  }
};

// Middleware phân quyền (role-based access control)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} không có quyền truy cập`
      });
    }
    next();
  };
};