const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, addComment } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id/like').post(protect, likePost);
router.route('/:id/comment').post(protect, addComment);

module.exports = router;
