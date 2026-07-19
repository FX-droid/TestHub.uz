function createPRNG(seedStr) {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
        seed = (seed << 5) - seed + seedStr.charCodeAt(i);
        seed |= 0;
    }
    seed = Math.abs(seed);
    return function () {
        seed = (seed * 9301 + 49297) % 233280;
        return Math.abs(seed / 233280);
    };
}

function seededShuffle(array, prng) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(prng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getShuffledOptionsAndAnswer(question, userId) {
    const optPrng = createPRNG(`${userId}_${question._id}`);
    const optKeys = ['A', 'B', 'C', 'D'];
    const shuffledKeys = seededShuffle(optKeys, optPrng);

    const mappedCorrectIndex = shuffledKeys.indexOf(question.correctAnswer);
    const mappedCorrectAnswer = optKeys[mappedCorrectIndex];

    return {
        optionA: question[`option${shuffledKeys[0]}`],
        optionB: question[`option${shuffledKeys[1]}`],
        optionC: question[`option${shuffledKeys[2]}`],
        optionD: question[`option${shuffledKeys[3]}`],
        mappedCorrectAnswer,
        shuffledKeys
    };
}

function processTestForUser(testObj, userId) {
    const prng = createPRNG(`${userId}_${testObj._id}`);
    // Shuttle questions order
    let questions = [...testObj.questions].filter(q => q);
    questions = seededShuffle(questions, prng);

    // Shuffle options for each and map
    questions = questions.map(q => {
        const doc = q._doc ? q._doc : q;
        const { optionA, optionB, optionC, optionD, mappedCorrectAnswer } = getShuffledOptionsAndAnswer(doc, userId);
        return {
            ...doc,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer: mappedCorrectAnswer
        };
    });

    return {
        ...testObj,
        questions
    };
}

module.exports = { createPRNG, seededShuffle, getShuffledOptionsAndAnswer, processTestForUser };
