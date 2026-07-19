const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');
const Test = require('../models/Test');
const User = require('../models/User');

dotenv.config();

// Helpers for dynamic generation
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (acc) => acc.sort(() => Math.random() - 0.5);

// ============================================
// UZBEK LANGUAGE GENERATOR
// ============================================
const generateUzbek = () => {
    const qParams = [
        { topic: 'Fonetika', template: 'Qaysi so’zda {num} ta harf qatnashgan?', generator: () => { const a = randInt(4, 9); return { q: a.toString(), opts: [`${a} ta`, `${a + 1} ta`, `${a - 1} ta`, `${a + 2} ta`] } } },
        { topic: 'Leksikologiya', template: 'Qaysi qatordagi so’zlar {type} hisoblanadi?', generator: () => { const t = ['omonim', 'sinonim', 'antonim', 'paronim']; const ans = t[randInt(0, 3)]; return { q: ans, opts: [ans.toUpperCase(), t[(t.indexOf(ans) + 1) % 4].toUpperCase(), t[(t.indexOf(ans) + 2) % 4].toUpperCase(), "Hech qaysi"] } } },
        { topic: 'Morfologiya', template: 'Berilgan so’zning asosi va qo’shimchasini toping: {word}', generator: () => { const w = ['kitobim', 'qalamlar', 'ishchi', 'paxtakor']; const ans = ['kitob-im', 'qalam-lar', 'ish-chi', 'paxta-kor']; const i = randInt(0, 3); return { q: w[i], opts: [ans[i], ans[(i + 1) % 4], ans[(i + 2) % 4], w[i] + "-?"] } } },
    ];
    let questions = [];
    for (let i = 0; i < 90; i++) {
        const type = qParams[i % qParams.length];
        const data = type.generator();
        const text = type.template.replace(/\{.*\}/, data.q);

        let customOpts = [...data.opts];
        customOpts = shuffle(customOpts);
        const correctOptLetter = ['A', 'B', 'C', 'D'][customOpts.indexOf(data.opts[0])];

        questions.push({
            subject: 'Uzbek Language',
            topic: type.topic,
            difficulty: ['Easy', 'Medium', 'Hard'][randInt(0, 2)],
            text,
            optionA: customOpts[0],
            optionB: customOpts[1],
            optionC: customOpts[2],
            optionD: customOpts[3],
            correctAnswer: correctOptLetter,
            explanation: `Ushbu savol ${type.topic} tahlili doirasida to'g'ri formula orqali yechildi: ${data.opts[0]}`
        });
    }
    return questions;
};

// ============================================
// PHYSICS GENERATOR
// ============================================
const generatePhysics = () => {
    let questions = [];
    for (let i = 0; i < 90; i++) {
        const v = randInt(20, 120);
        const t = randInt(2, 10);
        const ans = v * t;
        const opts = shuffle([`${ans} km`, `${ans + 10} km`, `${ans - 20} km`, `${ans * 2} km`]);
        const correctOptLetter = ['A', 'B', 'C', 'D'][opts.indexOf(`${ans} km`)];
        questions.push({
            subject: 'Physics',
            topic: 'Kinematics',
            difficulty: 'Medium',
            text: `Avtomobil ${v} km/soat tezlik bilan ${t} soat harakatlandi. U qancha masofani bosib o'tgan?`,
            optionA: opts[0], optionB: opts[1], optionC: opts[2], optionD: opts[3],
            correctAnswer: correctOptLetter,
            explanation: `Masofa formulasi: S = v * t = ${v} * ${t} = ${ans} km`
        });
    }
    return questions;
};

// ============================================
// CHEMISTRY GENERATOR
// ============================================
const generateChemistry = () => {
    let questions = [];
    const elements = [
        { name: 'Kislorod', mass: 16, formula: 'O2', val: 32 },
        { name: 'Vodorod', mass: 1, formula: 'H2', val: 2 },
        { name: 'Azot', mass: 14, formula: 'N2', val: 28 },
        { name: 'Uglerod', mass: 12, formula: 'CO2', val: 44 }
    ];
    for (let i = 0; i < 90; i++) {
        const el = elements[i % elements.length];
        const moles = randInt(2, 15);
        const ans = el.val * moles;
        const opts = shuffle([`${ans} g`, `${ans + 10} g`, `${ans - 5} g`, `${ans * 2} g`]);
        const correctOptLetter = ['A', 'B', 'C', 'D'][opts.indexOf(`${ans} g`)];
        questions.push({
            subject: 'Chemistry',
            topic: 'Stexiometriya',
            difficulty: 'Hard',
            text: `${moles} mol ${el.formula} gazining massasi qancha (grammda)? (M(${el.formula})=${el.val})`,
            optionA: opts[0], optionB: opts[1], optionC: opts[2], optionD: opts[3],
            correctAnswer: correctOptLetter,
            explanation: `Massa = mol * molyar massa = ${moles} * ${el.val} = ${ans} gramm.`
        });
    }
    return questions;
};

// ============================================
// BIOLOGY GENERATOR
// ============================================
const generateBiology = () => {
    let questions = [];
    const facts = [
        { text: 'Qaysi organoida oqsil sintezida qatnashadi?', ans: 'Ribosoma', fakes: ['Mitoxondriya', 'Lizosoma', 'Yadro'] },
        { text: 'Fotosintez jarayoni hujayraning qaysi qismida kechadi?', ans: 'Xloroplast', fakes: ['Vakuola', 'Plastida', 'Golji apparati'] },
        { text: 'Odam organizmida nechta xromosoma bor?', ans: '46 ta (23 juft)', fakes: ['48 ta', '42 ta', '44 ta'] }
    ];
    for (let i = 0; i < 90; i++) {
        const f = facts[i % facts.length];
        // small variation
        const opts = shuffle([f.ans, ...f.fakes]);
        const correctOptLetter = ['A', 'B', 'C', 'D'][opts.indexOf(f.ans)];
        questions.push({
            subject: 'Biology',
            topic: 'Hujayra biologiyasi',
            difficulty: 'Medium',
            text: `[Variant ${i + 1}] ${f.text}`,
            optionA: opts[0], optionB: opts[1], optionC: opts[2], optionD: opts[3],
            correctAnswer: correctOptLetter,
            explanation: `To'g'ri javob: ${f.ans}. Asosiy biologiya qoidalariga ko'ra o'zini tasdiqlaydi.`
        });
    }
    return questions;
};

// ============================================
// RUN SEEDER
// ============================================
const runGamificationSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/testhub');
        console.log('DB connected for Gamification Seed.');

        const admin = await User.findOne({ role: 'admin' });
        const adminId = admin ? admin._id : null;

        const subjectGens = [
            { title: 'Uzbek Language Mock', desc: 'Sifatli ona tili va adabiyot dtm testlari.', gen: generateUzbek },
            { title: 'Physics Mastery', desc: 'Asosiy va murakkab fizika qonuniyatlari.', gen: generatePhysics },
            { title: 'Chemistry Base', desc: 'Umumiy kimyo testlari to\'plami.', gen: generateChemistry },
            { title: 'Biology Standard', desc: 'Biologiya chuqurlashtirilgan savollar.', gen: generateBiology }
        ];

        for (const meta of subjectGens) {
            console.log(`Generating 90 questions for ${meta.title}...`);
            const qData = meta.gen();
            const docs = await Question.insertMany(qData);

            await Test.create({
                title: meta.title,
                description: meta.desc,
                questions: docs.map(d => d._id),
                duration: 180,
                totalQuestions: 90,
                isActive: true,
                createdBy: adminId
            });
            console.log(`Created test: ${meta.title} with 90 questions!`);
        }

        console.log('All gamification data seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runGamificationSeed();
