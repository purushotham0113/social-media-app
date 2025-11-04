const express = require('express');
const router = express.Router();
const postController = require('../controllers/postCntroller')
const authcheck = require('../middlewares/auth')
const { parser } = require('../utils/cloudinary');

router.get('/get/:id', postController.getPost)
//protected routes
router.post('/add', authcheck, parser.single('file'), postController.addPost)
router.get('/user/:userId', authcheck, postController.getPostsOfUser)
router.put('/update/:id', authcheck, postController.updatePost)
router.delete('/delete/:id', authcheck, postController.deletePost)
router.put('/likes/:pid', authcheck, postController.likePost)
router.put('/dislikes/:pid', authcheck, postController.dislikePost)
router.post('/:pid/comment', authcheck, postController.addComment)
router.get('/:pid/comments', authcheck, postController.getComments)

module.exports = router;