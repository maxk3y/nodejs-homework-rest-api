const { Router } = require('express');

const usersControllers = require('../../controllers/usersController');
const { checkSignup, authMiddleware, uploadAvatar } = require('../../middlewares/usersMiddleware');

const router = Router();

router.post('/register', checkSignup, usersControllers.signup);
router.post('/login', usersControllers.login);
router.post('/logout', authMiddleware, usersControllers.logout);
router.post('/current', authMiddleware, usersControllers.getCurrentUser);
router.patch('/avatars', uploadAvatar, authMiddleware, usersControllers.updateAvatar);

module.exports = router;
