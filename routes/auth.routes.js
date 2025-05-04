const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

// Đăng ký
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

// Lấy thông tin user hiện tại (yêu cầu xác thực)
router.get('/me', authenticate, authController.getMe);

// Đổi mật khẩu (yêu cầu xác thực)
router.put('/change-password', authenticate, authController.changePassword);

module.exports = router;