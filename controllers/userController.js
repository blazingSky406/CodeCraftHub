const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            //console.log('user email not found')
            return res.status(400).json({ message: 'user email not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            //console.log('password does not match')
            return res.status(400).json({ message: 'password does not match' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return the token to the client
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user details
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10); // Hash the new password if provided

        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    const { id } = req.params; // Get user ID from request parameters
    try {
        const user = await User.findByIdAndDelete(id); // Use findByIdAndDelete to remove user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
