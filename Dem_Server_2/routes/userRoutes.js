const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authcheck = require('../middlewares/auth');
const { parser } = require('../utils/cloudinary');

// Protected routes
router.use(authcheck);

router.get('/profile/:id', userController.getProfile);
router.put('/update', parser.single('file'), userController.updateUser);
router.post('/follows/:tid', userController.followById);
router.post('/unfollows/:tid', userController.unfollowById);
router.get('/followers', userController.followers);
router.get('/following', userController.following);
router.get('/:id', userController.getUserById); // get another user profile

module.exports = router;
