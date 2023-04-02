const express = require('express');
const router = express.Router();
const {
    handleLogin,
    handleRefresh,
    handleResetPassword,
    handleLogout
} = require('../controllers/authController');

router.post('/', handleLogin);
router.get('/refresh', handleRefresh);
router.put('/reset-password', handleResetPassword);
router.post('/logout', handleLogout);

module.exports = router;