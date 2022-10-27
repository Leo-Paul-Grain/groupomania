const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { checkUser } = require('../middleware/auth.middleware');
const multer = require('../middleware/multer-config');

router.get('/', checkUser, postController.readPost);
router.post('/', checkUser, multer, postController.createPost);
router.put('/:id', checkUser, postController.updatePost);
router.delete('/:id', checkUser, postController.deletePost);
router.patch('/like-post/:id', checkUser, postController.likePost);
router.patch('/unlike-post/:id', checkUser, postController.unlikePost);

//Routes des commentaires
router.patch('/comment-post/:id', checkUser, postController.commentPost);
router.patch('/edit-comment-post/:id', checkUser, postController.editCommentPost);
router.patch('/delete-comment-post/:id', checkUser, postController.deleteCommentPost);

module.exports = router;