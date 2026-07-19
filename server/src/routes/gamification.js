const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Helper to add coins
const addCoins = async (userId, amount, reason) => {
    await User.findByIdAndUpdate(userId, { $inc: { coins: amount } });
    await Transaction.create({
        userId,
        amount,
        type: amount >= 0 ? 'earn' : 'spend',
        reason
    });
};

// @GET /api/gamification/wallet
router.get('/wallet', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('coins streak');
        const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100);

        res.json({ success: true, coins: user.coins, streak: user.streak, transactions });
    } catch (error) {
        next(error);
    }
});

// @POST /api/gamification/tasks/claim
router.post('/tasks/claim', protect, async (req, res, next) => {
    try {
        const { taskId, reward, title } = req.body;

        const user = await User.findById(req.user._id);

        if (user.completedTasks && user.completedTasks.includes(taskId)) {
            return res.status(400).json({ success: false, message: 'Bu task avval bajarilgan' });
        }

        user.completedTasks.push(taskId);
        await user.save();

        await addCoins(req.user._id, reward, title || 'Vazifa bajarildi');

        res.json({ success: true, message: 'Mukofot olindi!', coins: user.coins + reward });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
module.exports.addCoins = addCoins;
