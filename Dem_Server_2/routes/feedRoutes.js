const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const authcheck = require('../middlewares/auth');

// All feed routes are protected

router.use(authcheck);

router.get('/search', feedController.search)
router.get('/get', feedController.feed);
router.get('/popular', feedController.popular);
router.get('/explore', feedController.explore);

module.exports = router;
