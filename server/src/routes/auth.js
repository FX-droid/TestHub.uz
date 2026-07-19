const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');

const router = express.Router();

// @POST /api/auth/register
router.post('/register', [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('username').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-30 chars, letters/numbers/underscores only'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Passwords do not match');
        return true;
    })
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
        }
        const { firstName, lastName, email, username, password } = req.body;

        // Check existing
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ success: false, message: 'Email already registered' });

        const existingUsername = await User.findOne({ username: username.toLowerCase() });
        if (existingUsername) return res.status(400).json({ success: false, message: 'Username already taken' });

        const user = await User.create({ firstName, lastName, email, username: username.toLowerCase(), password });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                role: user.role,
                premium: user.premium,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
});

// @POST /api/auth/login
router.post('/login', [
    body('identifier').trim().notEmpty().withMessage('Email or username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }
        const { identifier, password } = req.body;

        // Find by email or username
        const user = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }]
        }).select('+password');

        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = generateToken(user._id);

        // Handle Streak Logic
        const now = new Date();
        const lastLogin = user.streak?.lastLoginDate;
        let isNewDay = true;
        let isConsecutive = false;

        if (lastLogin) {
            const todayStr = now.toDateString();
            const lastLoginStr = new Date(lastLogin).toDateString();
            if (todayStr === lastLoginStr) {
                isNewDay = false;
            } else {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                if (yesterday.toDateString() === lastLoginStr) {
                    isConsecutive = true;
                }
            }
        } else {
            isConsecutive = true;
        }

        if (isNewDay) {
            if (!user.streak) user.streak = {};
            user.streak.current = isConsecutive ? (user.streak.current || 0) + 1 : 1;
            user.streak.lastLoginDate = now;
            await user.save();

            const { addCoins } = require('./gamification');
            await addCoins(user._id, 20, 'Daily Login');
            if (user.streak.current % 7 === 0) {
                await addCoins(user._id, 100, '7-Day Streak');
            }
        }

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                role: user.role,
                premium: user.premium,
                coins: user.coins,
                streak: user.streak,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
});

// @PUT /api/auth/profile
router.put('/profile', protect, [
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }
        const { firstName, lastName } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { ...(firstName && { firstName }), ...(lastName && { lastName }) },
            { new: true, runValidators: true }
        );
        res.json({ success: true, message: 'Profile updated', user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
