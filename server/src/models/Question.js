const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'English', 'Uzbek', 'Russian'],
        trim: true
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    question: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true
    },
    optionA: {
        type: String,
        required: [true, 'Option A is required'],
        trim: true
    },
    optionB: {
        type: String,
        required: [true, 'Option B is required'],
        trim: true
    },
    optionC: {
        type: String,
        required: [true, 'Option C is required'],
        trim: true
    },
    optionD: {
        type: String,
        required: [true, 'Option D is required'],
        trim: true
    },
    correctAnswer: {
        type: String,
        required: [true, 'Correct answer is required'],
        enum: ['A', 'B', 'C', 'D']
    },
    explanation: {
        type: String,
        required: [true, 'Explanation is required'],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

questionSchema.index({ subject: 1, difficulty: 1 });
questionSchema.index({ topic: 1 });

module.exports = mongoose.model('Question', questionSchema);
