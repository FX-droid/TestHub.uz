const express = require('express');
const Result = require('../models/Result');
const Mistake = require('../models/Mistake');
const Question = require('../models/Question');
const Test = require('../models/Test');
const { protect, adminOnly } = require('../middleware/auth');
const { getShuffledOptionsAndAnswer } = require('../utils/shuffle');
const { addCoins } = require('./gamification');

const router = express.Router();

// @POST /api/results/submit - Submit a test result
router.post('/submit', protect, async (req, res, next) => {
    try {
        const { testId, answers, timeUsed } = req.body;

        const test = await Test.findById(testId).populate('questions');
        if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

        let correct = 0;
        let wrong = 0;
        let unanswered = 0;
        const processedAnswers = [];
        const mistakesToSave = [];

        for (const question of test.questions) {
            const userAnswerObj = answers.find(a => a.questionId === question._id.toString());
            const userAnswer = userAnswerObj ? userAnswerObj.answer : null;

            const doc = question.toObject ? question.toObject() : question;
            const { mappedCorrectAnswer } = getShuffledOptionsAndAnswer(doc, req.user._id.toString());

            const isCorrect = userAnswer === mappedCorrectAnswer;

            if (!userAnswer) {
                unanswered++;
            } else if (isCorrect) {
                correct++;
            } else {
                wrong++;
                mistakesToSave.push({
                    userId: req.user._id,
                    questionId: question._id,
                    wrongAnswer: userAnswer,
                    correctAnswer: mappedCorrectAnswer
                });
            }
            processedAnswers.push({
                questionId: question._id,
                userAnswer,
                correctAnswer: mappedCorrectAnswer,
                isCorrect
            });
        }

        const totalQuestions = test.questions.length;
        const score = correct;
        const percentage = Math.round((correct / totalQuestions) * 100 * 10) / 10;

        const result = await Result.create({
            userId: req.user._id,
            testId,
            answers: processedAnswers,
            score,
            correct,
            wrong,
            unanswered,
            percentage,
            timeUsed: timeUsed || 0,
            totalTime: test.duration * 60
        });

        // Save mistakes (upsert to avoid duplicates per user/question combo)
        if (mistakesToSave.length > 0) {
            for (const mistake of mistakesToSave) {
                await Mistake.findOneAndUpdate(
                    { userId: mistake.userId, questionId: mistake.questionId },
                    { ...mistake, resultId: result._id },
                    { upsert: true, new: true }
                );
            }
        }

        // Reward coins
        let rewardCoins = 50;
        let rewardReason = 'Complete Mock';
        if (percentage === 100) {
            rewardCoins += 100;
            rewardReason = 'Perfect Score';
        }
        await addCoins(req.user._id, rewardCoins, rewardReason);

        res.status(201).json({ success: true, message: 'Test submitted', result: result._id, coinsAwarded: rewardCoins });
    } catch (error) {
        next(error);
    }
});

// @GET /api/results/my - Get current user's results
router.get('/my', protect, async (req, res, next) => {
    try {
        const results = await Result.find({ userId: req.user._id })
            .populate('testId', 'title')
            .select('-answers')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ success: true, results });
    } catch (error) {
        next(error);
    }
});

// @GET /api/results/leaderboard
router.get('/leaderboard', protect, async (req, res, next) => {
    try {
        const { sort = 'score' } = req.query;
        let sortField = { score: -1 };
        if (sort === 'accuracy') sortField = { percentage: -1 };
        if (sort === 'total') sortField = { count: -1 };

        const leaderboard = await Result.aggregate([
            {
                $group: {
                    _id: '$userId',
                    bestScore: { $max: '$score' },
                    avgPercentage: { $avg: '$percentage' },
                    count: { $sum: 1 }
                }
            },
            { $sort: sortField.score ? { bestScore: -1 } : sortField },
            { $limit: 50 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    userId: '$_id',
                    firstName: '$user.firstName',
                    lastName: '$user.lastName',
                    username: '$user.username',
                    bestScore: 1,
                    avgPercentage: { $round: ['$avgPercentage', 1] },
                    totalTests: '$count'
                }
            }
        ]);

        res.json({ success: true, leaderboard });
    } catch (error) {
        next(error);
    }
});

// @GET /api/results/:id - get single result with questions
router.get('/:id', protect, async (req, res, next) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('testId', 'title duration')
            .populate('answers.questionId');
        if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
        // Only allow owner or admin
        if (result.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        res.json({ success: true, result });
    } catch (error) {
        next(error);
    }
});

// @GET /api/results (admin)
router.get('/', protect, adminOnly, async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [results, total] = await Promise.all([
            Result.find().populate('userId', 'firstName lastName username').populate('testId', 'title').select('-answers').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Result.countDocuments()
        ]);
        res.json({ success: true, results, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (error) {
        next(error);
    }
});

// @GET /api/results/stats/me - User stats
router.get('/stats/me', protect, async (req, res, next) => {
    try {
        const stats = await Result.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalMocks: { $sum: 1 },
                    totalCorrect: { $sum: '$correct' },
                    totalWrong: { $sum: '$wrong' },
                    bestScore: { $max: '$score' },
                    avgPercentage: { $avg: '$percentage' }
                }
            }
        ]);
        const data = stats[0] || { totalMocks: 0, totalCorrect: 0, totalWrong: 0, bestScore: 0, avgPercentage: 0 };
        const totalAnswered = data.totalCorrect + data.totalWrong;
        data.accuracy = totalAnswered > 0 ? Math.round((data.totalCorrect / totalAnswered) * 100 * 10) / 10 : 0;
        data.avgPercentage = data.avgPercentage ? Math.round(data.avgPercentage * 10) / 10 : 0;
        res.json({ success: true, stats: data });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
