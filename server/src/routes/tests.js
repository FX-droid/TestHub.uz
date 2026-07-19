const express = require('express');
const Test = require('../models/Test');
const Question = require('../models/Question');
const { protect, adminOnly } = require('../middleware/auth');
const { processTestForUser } = require('../utils/shuffle');

const router = express.Router();

// @GET /api/tests - Get all tests
router.get('/', protect, async (req, res, next) => {
    try {
        const tests = await Test.find({ isActive: true }).select('-questions').sort({ createdAt: -1 });
        res.json({ success: true, tests });
    } catch (error) {
        next(error);
    }
});

// @GET /api/tests/active - Get the latest active test for mock
router.get('/active', protect, async (req, res, next) => {
    try {
        const test = await Test.findOne({ isActive: true }).populate('questions').sort({ createdAt: -1 });
        if (!test) return res.status(404).json({ success: false, message: 'No active test found' });

        const processedTest = processTestForUser(test.toObject(), req.user._id.toString());
        res.json({ success: true, test: processedTest });
    } catch (error) {
        next(error);
    }
});

// @GET /api/tests/:id
router.get('/:id', protect, async (req, res, next) => {
    try {
        const test = await Test.findById(req.params.id).populate('questions');
        if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

        const processedTest = processTestForUser(test.toObject(), req.user._id.toString());
        res.json({ success: true, test: processedTest });
    } catch (error) {
        next(error);
    }
});

// @POST /api/tests (admin)
router.post('/', protect, adminOnly, async (req, res, next) => {
    try {
        const { title, description, questionIds, duration } = req.body;
        if (!questionIds || questionIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Questions are required' });
        }
        const test = await Test.create({
            title,
            description,
            questions: questionIds,
            duration: duration || 180,
            totalQuestions: questionIds.length,
            createdBy: req.user._id
        });
        res.status(201).json({ success: true, message: 'Test created', test });
    } catch (error) {
        next(error);
    }
});

// @PUT /api/tests/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
    try {
        const { title, description, questionIds, duration, isActive } = req.body;
        const update = { title, description, duration, isActive };
        if (questionIds) {
            update.questions = questionIds;
            update.totalQuestions = questionIds.length;
        }
        const test = await Test.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
        res.json({ success: true, message: 'Test updated', test });
    } catch (error) {
        next(error);
    }
});

// @DELETE /api/tests/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
    try {
        const test = await Test.findByIdAndDelete(req.params.id);
        if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
        res.json({ success: true, message: 'Test deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
