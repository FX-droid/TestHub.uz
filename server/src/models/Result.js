const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    userAnswer: {
        type: String,
        enum: ['A', 'B', 'C', 'D', null],
        default: null
    },
    correctAnswer: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    answers: [answerSchema],
    score: {
        type: Number,
        required: true,
        default: 0
    },
    correct: {
        type: Number,
        required: true,
        default: 0
    },
    wrong: {
        type: Number,
        required: true,
        default: 0
    },
    unanswered: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        required: true,
        default: 0
    },
    timeUsed: {
        type: Number,
        comment: 'Time used in seconds',
        default: 0
    },
    totalTime: {
        type: Number,
        default: 10800,
        comment: '180 minutes in seconds'
    }
}, {
    timestamps: true
});

resultSchema.index({ userId: 1, createdAt: -1 });
resultSchema.index({ score: -1 });

module.exports = mongoose.model('Result', resultSchema);
