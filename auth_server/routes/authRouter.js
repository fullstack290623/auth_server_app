const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get);

router.get('/data', authController.get_protected_data);

module.exports = router;