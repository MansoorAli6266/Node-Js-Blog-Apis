const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async(req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const image = req.file ? req.file.filename : null;

        // First we check the use is already resgister or not 
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // we will always make our password hashed
        const hashedPassword = await bcrypt.hash(password, 10);

        // we will create a new user with model
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            image
        });

        await newUser.save();

        // Create JWT token for user authentication
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                image: newUser.image
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        // we will first check the user is regsiter or not 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // we will check also th e password is correct or not
        const matchpassword = await bcrypt.compare(password, user.password);
        if (!matchpassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: 'User hAs Been Login successfully',
            user: {
                'User ID ': user._id,

            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getUserProfile = async(req, res) => {
    try {
        res.status(200).json({
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };