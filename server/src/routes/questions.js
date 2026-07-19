const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Question = require('../models/Question');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @GET /api/questions - Get all questions (admin)
router.get('/', protect, adminOnly, async (req, res, next) => {
    try {
        const { subject, difficulty, topic, page = 1, limit = 20, search } = req.query;
        const filter = {};
        if (subject) filter.subject = subject;
        if (difficulty) filter.difficulty = difficulty;
        if (topic) filter.topic = new RegExp(topic, 'i');
        if (search) filter.$or = [
            { question: new RegExp(search, 'i') },
            { topic: new RegExp(search, 'i') }
        ];
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [questions, total] = await Promise.all([
            Question.find(filter).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
            Question.countDocuments(filter)
        ]);
        res.json({ success: true, questions, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (error) {
        next(error);
    }
});

// @GET /api/questions/:id
router.get('/:id', protect, async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
        res.json({ success: true, question });
    } catch (error) {
        next(error);
    }
});

// @POST /api/questions - Create question (admin)
router.post('/', protect, adminOnly, [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('topic').notEmpty().withMessage('Topic is required'),
    body('question').notEmpty().withMessage('Question text is required'),
    body('optionA').notEmpty().withMessage('Option A is required'),
    body('optionB').notEmpty().withMessage('Option B is required'),
    body('optionC').notEmpty().withMessage('Option C is required'),
    body('optionD').notEmpty().withMessage('Option D is required'),
    body('correctAnswer').isIn(['A', 'B', 'C', 'D']).withMessage('Correct answer must be A, B, C, or D'),
    body('explanation').notEmpty().withMessage('Explanation is required'),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }
        const question = await Question.create(req.body);
        res.status(201).json({ success: true, message: 'Question created', question });
    } catch (error) {
        next(error);
    }
});

// @PUT /api/questions/:id
router.put('/:id', protect, adminOnly, async (req, res, next) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
        res.json({ success: true, message: 'Question updated', question });
    } catch (error) {
        next(error);
    }
});

// @DELETE /api/questions/:id
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
        res.json({ success: true, message: 'Question deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
