const express = require('express');
const User = require('../models/User');
const Result = require('../models/Result');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @GET /api/users - Admin: list all users
router.get('/', protect, adminOnly, async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const filter = {};
        if (search) filter.$or = [
            { firstName: new RegExp(search, 'i') },
            { lastName: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
            { username: new RegExp(search, 'i') }
        ];
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [users, total] = await Promise.all([
            User.find(filter).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
            User.countDocuments(filter)
        ]);
        res.json({ success: true, users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (error) {
        next(error);
    }
});

// @PUT /api/users/:id/premium - Toggle premium status (admin)
router.put('/:id/premium', protect, adminOnly, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.premium = !user.premium;
        await user.save();
        res.json({ success: true, message: `User premium set to ${user.premium}`, user });
    } catch (error) {
        next(error);
    }
});

// @DELETE /api/users/:id - Admin: delete user
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
        await user.deleteOne();
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
