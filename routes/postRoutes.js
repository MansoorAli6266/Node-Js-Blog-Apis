const express = require('express');
const { createPost, getUserPosts, getAllPostsWithUsers } = require('../controllers/postController');
const { protect } = require('../middleware/authmiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/create-post', protect, upload.single('image'), createPost);
router.get('/user-posts', protect, getUserPosts);
router.get('/all', getAllPostsWithUsers);

module.exports = router;