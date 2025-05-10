const Post = require('../models/postModel');

const createPost = async(req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file ? req.file.filename : null;
        const newPost = new Post({
            user: req.user._id,
            title,
            description,
            image
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
const getUserPosts = async(req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id });
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllPostsWithUsers = async(req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name email image');
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createPost,
    getUserPosts,
    getAllPostsWithUsers
};