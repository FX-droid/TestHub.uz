const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const Result = require('../models/Result');
const Mistake = require('../models/Mistake');
const Test = require('../models/Test');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @GET /api/admin/stats - Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res, next) => {
    try {
        const [totalUsers, totalQuestions, totalTests, totalResults, recentResults] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Question.countDocuments(),
            Test.countDocuments(),
            Result.countDocuments(),
            Result.find().populate('userId', 'firstName lastName username').populate('testId', 'title').select('-answers').sort({ createdAt: -1 }).limit(10)
        ]);

        const scoreStats = await Result.aggregate([
            { $group: { _id: null, avgScore: { $avg: '$score' }, avgPercentage: { $avg: '$percentage' } } }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalQuestions,
                totalTests,
                totalResults,
                avgScore: scoreStats[0] ? Math.round(scoreStats[0].avgScore * 10) / 10 : 0,
                avgPercentage: scoreStats[0] ? Math.round(scoreStats[0].avgPercentage * 10) / 10 : 0,
                recentResults
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
