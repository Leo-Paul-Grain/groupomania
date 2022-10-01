const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { checkUser } = require('../middleware/auth.middleware');

router.get('/', postController.readPost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);

//Routes des commentaires
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', checkUser, postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);

module.exports = router;