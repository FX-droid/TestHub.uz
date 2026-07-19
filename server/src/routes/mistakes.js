const express = require('express');
const Mistake = require('../models/Mistake');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @GET /api/mistakes/my - Get current user mistakes
router.get('/my', protect, async (req, res, next) => {
    try {
        const { subject, page = 1, limit = 20 } = req.query;
        const filter = { userId: req.user._id };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let query = Mistake.find(filter)
            .populate({
                path: 'questionId',
                match: subject ? { subject } : {},
                select: 'subject topic question optionA optionB optionC optionD correctAnswer explanation difficulty'
            })
            .sort({ createdAt: -1 });

        const mistakes = await query;
        // Filter out null populates (when subject filter applied)
        const filtered = mistakes.filter(m => m.questionId !== null);
        const paginated = filtered.slice(skip, skip + parseInt(limit));

        res.json({ success: true, mistakes: paginated, total: filtered.length, page: parseInt(page), pages: Math.ceil(filtered.length / parseInt(limit)) });
    } catch (error) {
        next(error);
    }
});

// @DELETE /api/mistakes/:id
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const mistake = await Mistake.findOne({ _id: req.params.id, userId: req.user._id });
        if (!mistake) return res.status(404).json({ success: false, message: 'Mistake not found' });
        await mistake.deleteOne();
        res.json({ success: true, message: 'Mistake deleted' });
    } catch (error) {
        next(error);
    }
});

// @DELETE /api/mistakes/clear/all - delete all mistakes for user
router.delete('/clear/all', protect, async (req, res, next) => {
    try {
        await Mistake.deleteMany({ userId: req.user._id });
        res.json({ success: true, message: 'All mistakes cleared' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
