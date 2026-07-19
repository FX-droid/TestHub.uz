const mongoose = require('mongoose');

const mistakeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    resultId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Result',
        default: null
    },
    wrongAnswer: {
        type: String,
        enum: ['A', 'B', 'C', 'D', null],
        default: null
    },
    correctAnswer: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true
    }
}, {
    timestamps: true
});

mistakeSchema.index({ userId: 1, createdAt: -1 });
mistakeSchema.index({ userId: 1, questionId: 1 });

module.exports = mongoose.model('Mistake', mistakeSchema);
