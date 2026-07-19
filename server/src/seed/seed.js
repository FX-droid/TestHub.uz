require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Question = require('../models/Question');
const Test = require('../models/Test');
const Result = require('../models/Result');
const Mistake = require('../models/Mistake');

// ── Question bank generators ──────────────────────────────────────────────────

function mathQuestions() {
    const qs = [];

    // Algebra
    const algebraData = [
        { q: "x² - 5x + 6 = 0 tenglamasining ildizlari yig'indisi?", a: '5', b: '6', c: '-5', d: '-6', ans: 'A', exp: 'Vieta formulasi: ildizlar yig\'indisi = 5.' },
        { q: "x² - 5x + 6 = 0 tenglamasining ildizlari ko'paytmasi?", a: '5', b: '6', c: '-6', d: '30', ans: 'B', exp: 'Vieta formulasi: ildizlar ko\'paytmasi = 6.' },
        { q: "2x + 3 = 11 tenglamaning yechimi?", a: '3', b: '4', c: '5', d: '6', ans: 'B', exp: '2x = 8, x = 4.' },
        { q: "3x - 7 = 8 tenglamaning yechimi?", a: '3', b: '4', c: '5', d: '6', ans: 'C', exp: '3x = 15, x = 5.' },
        { q: "|x - 3| = 5 tenglamasining yechimi?", a: 'x=8 yoki x=-2', b: 'x=2 yoki x=-8', c: 'x=8 yoki x=2', d: 'x=-8 yoki x=2', ans: 'A', exp: 'x-3=5 → x=8; x-3=-5 → x=-2.' },
        { q: "x² + 4x + 4 = 0 tenglamasining ildizi?", a: '2', b: '-2', c: '4', d: '-4', ans: 'B', exp: '(x+2)²=0, x=-2.' },
        { q: "x² - 9 = 0 tenglamasining musbat ildizi?", a: '3', b: '-3', c: '9', d: '81', ans: 'A', exp: 'x²=9, x=±3, musbat ildiz 3.' },
        { q: "2x² - 8 = 0 tenglamasining ildizlari?", a: '±4', b: '±2', c: '±8', d: '±1', ans: 'B', exp: 'x²=4, x=±2.' },
        { q: "Agar f(x)=2x²-3x+1, f(2)=?", a: '3', b: '7', c: '9', d: '1', ans: 'A', exp: 'f(2)=8-6+1=3.' },
        { q: "x/(x-1) = 2/(x-1) tenglamasining yechimi?", a: '1', b: '2', c: 'yechimi yo\'q', d: '0', ans: 'C', exp: 'x=2 mos kelsa ham, x=1 (maxraj 0) - yechim yo\'q.' },
        { q: "log₂8 = ?", a: '2', b: '3', c: '4', d: '8', ans: 'B', exp: '2³=8, log₂8=3.' },
        { q: "log₁₀100 = ?", a: '1', b: '2', c: '10', d: '100', ans: 'B', exp: '10²=100, log₁₀100=2.' },
        { q: "2^10 = ?", a: '512', b: '1024', c: '2048', d: '256', ans: 'B', exp: '2^10=1024.' },
        { q: "√144 = ?", a: '11', b: '12', c: '13', d: '14', ans: 'B', exp: '12²=144.' },
        { q: "√(225) = ?", a: '13', b: '14', c: '15', d: '16', ans: 'C', exp: '15²=225.' },
        { q: "3² + 4² = ?", a: '25', b: '49', c: '5', d: '7', ans: 'A', exp: '9+16=25.' },
        { q: "Ikki sonning AKÖK 12, EKUB 4 bo'lsa, ularning ko'paytmasi?", a: '24', b: '48', c: '16', d: '96', ans: 'B', exp: 'a·b = AKÖK·EKUB = 12·4 = 48.' },
        { q: "Progressiya: 2, 5, 8, 11, ... 10-hadi?", a: '28', b: '29', c: '30', d: '31', ans: 'B', exp: 'a₁=2, d=3; a₁₀=2+9·3=29.' },
        { q: "Geometrik progressiya: 3, 6, 12, ... 5-hadi?", a: '36', b: '48', c: '72', d: '96', ans: 'B', exp: 'q=2; a₅=3·2⁴=48.' },
        { q: "5! = ?", a: '60', b: '100', c: '120', d: '240', ans: 'C', exp: '5!=5·4·3·2·1=120.' },
    ];

    const geomData = [
        { q: "To'g'ri burchakli uchburchakda katetlar 3 va 4. Gipotenuzasi?", a: '5', b: '6', c: '7', d: '25', ans: 'A', exp: 'Pifagor: √(9+16)=√25=5.' },
        { q: "Doiraning radiusi 7. Yuzi?", a: '49π', b: '14π', c: '7π', d: '28π', ans: 'A', exp: 'S=π·r²=49π.' },
        { q: "Doiraning radiusi 7. Uzunligi?", a: '7π', b: '14π', c: '49π', d: '28π', ans: 'B', exp: 'C=2πr=14π.' },
        { q: "Kvadratning tomoni 5. Yuzi?", a: '20', b: '25', c: '10', d: '15', ans: 'B', exp: 'S=5²=25.' },
        { q: "Kvadratning tomoni 5. Perimetri?", a: '15', b: '20', c: '25', d: '10', ans: 'B', exp: 'P=4·5=20.' },
        { q: "To'g'ri to'rtburchak: a=6, b=4. Diagonali?", a: '√52', b: '√40', c: '√48', d: '10', ans: 'A', exp: 'd=√(36+16)=√52.' },
        { q: "Uchburchak tomonlari 3,4,5. Uchburchak turi?", a: 'o\'tmas burchakli', b: 'o\'tkir burchakli', c: 'to\'g\'ri burchakli', d: 'teng tomonli', ans: 'C', exp: '3²+4²=5², Pifagor shartini qanoatlantiradi.' },
        { q: "Teng yonli uchburchak: yon tomoni 5, asos 6. Yuzi?", a: '12', b: '15', c: '18', d: '24', ans: 'A', exp: 'Balandlik h=√(25-9)=4; S=6·4/2=12.' },
        { q: "Kub: qirra 3 cm. Hajmi?", a: '9', b: '18', c: '27', d: '81', ans: 'C', exp: 'V=3³=27 sm³.' },
        { q: "Kub: qirra 4 cm. Sirtining yuzasi?", a: '80', b: '96', c: '100', d: '64', ans: 'B', exp: 'S=6·4²=96 sm².' },
        { q: "Silindr: r=3, h=5. Hajmi?", a: '15π', b: '30π', c: '45π', d: '90π', ans: 'C', exp: 'V=πr²h=9π·5=45π.' },
        { q: "Konus: r=3, h=4. Generatrissasi?", a: '4', b: '5', c: '6', d: '7', ans: 'B', exp: 'l=√(9+16)=5.' },
        { q: "Trapetsiya: parallel tomonlar 8 va 4, balandlik 3. Yuzi?", a: '12', b: '18', c: '24', d: '36', ans: 'B', exp: 'S=(8+4)·3/2=18.' },
        { q: "Romb: diagonallari 6 va 8. Yuzi?", a: '24', b: '48', c: '12', d: '32', ans: 'A', exp: 'S=d₁·d₂/2=48/2=24.' },
        { q: "Muntazam oltiburchak tomoni 4. Yuzi?", a: '24√3', b: '48√3', c: '12√3', d: '96√3', ans: 'A', exp: 'S=3√3/2·a²=3√3/2·16=24√3.' },
    ];

    const trigData = [
        { q: "sin 30° = ?", a: '1/2', b: '√2/2', c: '√3/2', d: '1', ans: 'A', exp: 'sin 30°=1/2.' },
        { q: "cos 60° = ?", a: '√3/2', b: '1/2', c: '√2/2', d: '0', ans: 'B', exp: 'cos 60°=1/2.' },
        { q: "tan 45° = ?", a: '0', b: '1/2', c: '1', d: '√3', ans: 'C', exp: 'tan 45°=1.' },
        { q: "sin 90° = ?", a: '0', b: '1/2', c: '√2/2', d: '1', ans: 'D', exp: 'sin 90°=1.' },
        { q: "cos 0° = ?", a: '0', b: '1', c: '-1', d: '1/2', ans: 'B', exp: 'cos 0°=1.' },
        { q: "sin²x + cos²x = ?", a: '0', b: '1', c: '2', d: 'sin2x', ans: 'B', exp: 'Asosiy trigonometrik oziga: sin²x+cos²x=1.' },
        { q: "2·sin 30°·cos 30° = ?", a: '√3/2', b: '1/2', c: '√3', d: '1', ans: 'A', exp: 'sin60°=√3/2.' },
        { q: "cos 180° = ?", a: '1', b: '0', c: '-1', d: '-1/2', ans: 'C', exp: 'cos 180°=-1.' },
        { q: "tan 60° = ?", a: '1', b: '√2', c: '√3', d: '2', ans: 'C', exp: 'tan 60°=√3.' },
        { q: "sin(-30°) = ?", a: '1/2', b: '-1/2', c: '√3/2', d: '-√3/2', ans: 'B', exp: 'sin toq funksiya: sin(-30°)=-sin(30°)=-1/2.' },
    ];

    const combinatData = [
        { q: "C(5,2) = ?", a: '10', b: '20', c: '5', d: '15', ans: 'A', exp: 'C(5,2)=5!/(2!3!)=10.' },
        { q: "A(4,2) = ?", a: '6', b: '12', c: '24', d: '8', ans: 'B', exp: 'A(4,2)=4·3=12.' },
        { q: "P(4) = 4! = ?", a: '12', b: '16', c: '24', d: '48', ans: 'C', exp: '4!=24.' },
        { q: "C(6,3) = ?", a: '20', b: '30', c: '15', d: '18', ans: 'A', exp: 'C(6,3)=6!/(3!3!)=20.' },
        { q: "3 tugmadan 2 ta tanlash necha usul?", a: '3', b: '6', c: '9', d: '2', ans: 'A', exp: 'C(3,2)=3.' },
        { q: "10 ta raqamdan 3 xonali son nechta? (0 dan boshlanmaydi)", a: '648', b: '900', c: '729', d: '720', ans: 'B', exp: '9·10·10=900.' },
        { q: "Ehtimolik: tangada gerb tushish?", a: '1/4', b: '1/3', c: '1/2', d: '2/3', ans: 'C', exp: 'P=1/2.' },
        { q: "2 ta tanga otilsa, ikkalasi ham gerb bo'lish ehtimoli?", a: '1/4', b: '1/2', c: '1/3', d: '1/8', ans: 'A', exp: 'P=1/2·1/2=1/4.' },
        { q: "6 yoqli kubikda 3 tushishi ehtimoli?", a: '1/3', b: '1/4', c: '1/6', d: '1/12', ans: 'C', exp: 'P=1/6.' },
        { q: "Binomning (a+b)² yoyilmasi?", a: 'a²+b²', b: 'a²+ab+b²', c: 'a²+2ab+b²', d: '2a²+2b²', ans: 'C', exp: '(a+b)²=a²+2ab+b².' },
    ];

    const dsData = [
        { q: "lim(x→0) sin(x)/x = ?", a: '0', b: '1', c: '∞', d: '-1', ans: 'B', exp: 'Mashhur limit: lim sin(x)/x=1.' },
        { q: "(x³)' = ?", a: 'x²', b: '2x²', c: '3x²', d: '3x', ans: 'C', exp: '(xⁿ)\'=nxⁿ⁻¹, bu yerda n=3.' },
        { q: "(sin x)' = ?", a: 'cos x', b: '-cos x', c: 'sin x', d: '-sin x', ans: 'A', exp: '(sin x)\'=cos x.' },
        { q: "∫x dx = ?", a: 'x²+C', b: 'x²/2+C', c: '2x+C', d: '1/x+C', ans: 'B', exp: '∫x dx = x²/2+C.' },
        { q: "∫sin x dx = ?", a: 'cos x+C', b: '-cos x+C', c: 'sin x+C', d: '-sin x+C', ans: 'B', exp: '∫sin x dx=-cos x+C.' },
        { q: "(e^x)' = ?", a: 'e^(x-1)', b: 'xe^x', c: 'e^x', d: '1/e^x', ans: 'C', exp: '(e^x)\'=e^x.' },
        { q: "(ln x)' = ?", a: 'x', b: '1/x²', c: 'ln x', d: '1/x', ans: 'D', exp: '(ln x)\'=1/x.' },
        { q: "f(x)=x²-4x+3 ning minimumi?", a: 'x=2', b: 'x=3', c: 'x=1', d: 'x=0', ans: 'A', exp: 'f\'(x)=2x-4=0 → x=2.' },
        { q: "∫₀¹ x dx = ?", a: '1', b: '1/4', c: '1/2', d: '2', ans: 'C', exp: '[x²/2]₀¹=1/2.' },
        { q: "(cos x)' = ?", a: 'sin x', b: '-sin x', c: 'cos x', d: '-cos x', ans: 'B', exp: '(cos x)\'=-sin x.' },
        { q: "f(x)=3x²+2x, f\'(1) = ?", a: '5', b: '6', c: '7', d: '8', ans: 'D', exp: 'f\'(x)=6x+2; f\'(1)=8.' },
    ];

    const numbersData = [
        { q: "Hisoblang: 15% dan 200 = ?", a: '20', b: '25', c: '30', d: '35', ans: 'C', exp: '200·0.15=30.' },
        { q: "120 ning 25% i?", a: '25', b: '30', c: '20', d: '35', ans: 'B', exp: '120·0.25=30.' },
        { q: "2/3 + 1/6 = ?", a: '3/9', b: '5/6', c: '1/2', d: '7/9', ans: 'B', exp: '4/6+1/6=5/6.' },
        { q: "3/4 × 8/9 = ?", a: '2/3', b: '3/4', c: '1/2', d: '24/36', ans: 'A', exp: '24/36=2/3.' },
        { q: "Agar a:b=3:4 va b:c=2:5 bo\'lsa, a:b:c=?", a: '3:4:10', b: '6:8:20', c: '6:8:10', d: '6:8:5', ans: 'B', exp: 'a:b=6:8, b:c=8:20, shuning uchun 6:8:20.' },
        { q: "Ish 6 kunda bajariladi. 1 kunda necha qismi bajariladi?", a: '1/5', b: '1/6', c: '1/7', d: '1/8', ans: 'B', exp: '1 kunda 1/6 qism.' },
        { q: "Soat minutiga 60 daraja aylanadi. 1 soatda necha daraja?", a: '360', b: '720', c: '3600', d: '60', ans: 'C', exp: '60×60=3600°.' },
        { q: "Biror son 20 ga 25% qo'shilsa, natija?", a: '24', b: '25', c: '26', d: '22', ans: 'B', exp: '20+5=25.' },
        { q: "Bahosi 500 dan 20% chegirma. Yangi narx?", a: '400', b: '450', c: '380', d: '420', ans: 'A', exp: '500-100=400.' },
        { q: "Yil boshida 1000 so\'m, 10% foiz. Yil oxirida?", a: '1050', b: '1100', c: '1010', d: '1200', ans: 'B', exp: '1000+100=1100.' },
        { q: "√2 ≈ ?", a: '1.41', b: '1.73', c: '2.23', d: '1.62', ans: 'A', exp: '√2≈1.414.' },
        { q: "π ≈ ?", a: '3.12', b: '3.14', c: '3.16', d: '3.18', ans: 'B', exp: 'π≈3.14159.' },
        { q: "EKUB(12,18) = ?", a: '3', b: '6', c: '9', d: '12', ans: 'B', exp: 'EKUB(12,18)=6.' },
        { q: "AKÖK(4,6) = ?", a: '2', b: '12', c: '24', d: '4', ans: 'B', exp: 'AKÖK(4,6)=12.' },
        { q: "2^8 = ?", a: '128', b: '256', c: '512', d: '64', ans: 'B', exp: '2^8=256.' },
        { q: "(-2)³ = ?", a: '8', b: '-6', c: '-8', d: '6', ans: 'C', exp: '(-2)³=-8.' },
        { q: "7² = ?", a: '14', b: '49', c: '47', d: '56', ans: 'B', exp: '7·7=49.' },
        { q: "Tub sonlar: 1 dan 20 gacha nechtasi?", a: '7', b: '8', c: '9', d: '10', ans: 'B', exp: '2,3,5,7,11,13,17,19 – 8 ta tub son.' },
        { q: "0.25 = ?/4", a: '4', b: '1', c: '2', d: '3', ans: 'B', exp: '0.25=1/4.' },
        { q: "1/8 + 3/8 = ?", a: '4/16', b: '1/2', c: '3/4', d: '2/8', ans: 'B', exp: '4/8=1/2.' },
    ];

    const eqSysData = [
        { q: "Tenglamalar sistemasi: x+y=5, x-y=1. x=?", a: '2', b: '3', c: '4', d: '5', ans: 'B', exp: '2x=6, x=3.' },
        { q: "Tenglamalar sistemasi: x+y=5, x-y=1. y=?", a: '1', b: '2', c: '3', d: '4', ans: 'B', exp: 'y=5-3=2.' },
        { q: "2x+3y=12, x+y=5. x=?", a: '3', b: '2', c: '4', d: '5', ans: 'A', exp: 'y=5-x; 2x+15-3x=12 → x=3.' },
        { q: "x²+y²=25, x=3. y=?", a: '4', b: '5', c: '3', d: '2', ans: 'A', exp: 'y²=16, y=4.' },
        { q: "xy=12, x+y=7. x va y qiymatlar?", a: '3 va 4', b: '2 va 6', c: '4 va 3', d: 'ham 3,4 ham 4,3', ans: 'D', exp: 'x,y Vieta: x²-7x+12=0, ildizlar 3 va 4.' },
    ];

    const seqData = [
        { q: "1+2+3+...+100 = ?", a: '5000', b: '5050', c: '4950', d: '10100', ans: 'B', exp: 'n(n+1)/2=100·101/2=5050.' },
        { q: "Arifmetik progressiya: a₁=2, d=3, S₅=?", a: '35', b: '40', c: '25', d: '30', ans: 'A', exp: 'S₅=5/2·(4+3·4)=5/2·16=40... wait: S=n/2·(2a₁+(n-1)d)=5/2·(4+12)=5/2·16=40', ans: 'B', exp: 'S₅=5/2·(2·2+(5-1)·3)=5/2·16=40.' },
        { q: "Geometrik progressiya: a₁=1, q=2, S₄=?", a: '15', b: '16', c: '31', d: '30', ans: 'A', exp: 'S₄=1·(2⁴-1)/(2-1)=15.' },
        { q: "1/2+1/4+1/8+... (cheksiz) = ?", a: '1', b: '2', c: '1/2', d: '∞', ans: 'A', exp: 'S=a₁/(1-q)=(1/2)/(1-1/2)=1.' },
        { q: "Arifmetik progressiya: 5, 8, 11, ... a₆=?", a: '20', b: '21', c: '22', d: '23', ans: 'A', exp: 'a₆=5+5·3=20.' },
    ];

    const matrixData = [
        { q: "|2 3; 1 4| determinant?", a: '5', b: '6', c: '7', d: '8', ans: 'A', exp: '2·4-3·1=8-3=5.' },
        { q: "|1 2; 3 4| determinant?", a: '-2', b: '2', c: '-4', d: '4', ans: 'A', exp: '1·4-2·3=4-6=-2.' },
        { q: "Matritsa A=[1 0; 0 1]. Bu qanday matritsa?", a: 'Nol', b: 'Birlik', c: 'Simmetrik', d: 'Diagonal', ans: 'B', exp: 'Birlik matritsa (E yoki I).' },
    ];

    const allData = [...algebraData, ...geomData, ...trigData, ...combinatData, ...dsData, ...numbersData, ...eqSysData, ...seqData, ...matrixData];

    for (const d of allData) {
        qs.push({
            subject: 'Mathematics',
            topic: 'DTM Matematika',
            difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
            question: d.q,
            optionA: d.a,
            optionB: d.b,
            optionC: d.c,
            optionD: d.d,
            correctAnswer: d.ans,
            explanation: d.exp,
            isActive: true
        });
    }
    return qs;
}

// Generate additional filler questions programmatically
function generateFillerQuestions(count) {
    const qs = [];
    const templates = [
        { tmpl: (n) => ({ q: `${n}x = ${n * 3} tenglamaning yechimi?`, a: '1', b: '2', c: '3', d: '4', ans: 'C', exp: `${n}x=${n * 3}, x=3.` }) },
        { tmpl: (n) => ({ q: `${n}² = ?`, a: `${n * n - 1}`, b: `${n * n}`, c: `${n * n + 1}`, d: `${n * n + 2}`, ans: 'B', exp: `${n}·${n}=${n * n}.` }) },
        { tmpl: (n) => ({ q: `${n} + ${n + 1} = ?`, a: `${2 * n}`, b: `${2 * n + 1}`, c: `${2 * n + 2}`, d: `${2 * n - 1}`, ans: 'B', exp: `${n}+${n + 1}=${2 * n + 1}.` }) },
        { tmpl: (n) => ({ q: `${n * n} ning kvadrat ildizi?`, a: `${n - 1}`, b: `${n}`, c: `${n + 1}`, d: `${n + 2}`, ans: 'B', exp: `√${n * n}=${n}.` }) },
        { tmpl: (n) => ({ q: `${n} × ${n + 2} = ?`, a: `${n * (n + 2) - 1}`, b: `${n * (n + 2)}`, c: `${n * (n + 2) + 1}`, d: `${n * (n + 2) + 2}`, ans: 'B', exp: `${n}·${n + 2}=${n * (n + 2)}.` }) },
        { tmpl: (n) => ({ q: `${n}% dan 100 = ?`, a: `${n - 1}`, b: `${n}`, c: `${n + 1}`, d: `${n + 2}`, ans: 'B', exp: `100·${n}/100=${n}.` }) },
        { tmpl: (n) => ({ q: `Arifmetik progressiya: 1, ${1 + n}, ${1 + 2 * n}, ... ning 4-hadi?`, a: `${1 + 3 * n - 1}`, b: `${1 + 3 * n}`, c: `${1 + 3 * n + 1}`, d: `${1 + 3 * n + 2}`, ans: 'B', exp: `a₄=1+3·${n}=${1 + 3 * n}.` }) },
        { tmpl: (n) => ({ q: `x + ${n} = ${2 * n}. x = ?`, a: `${n - 1}`, b: `${n}`, c: `${n + 1}`, d: `${n + 2}`, ans: 'B', exp: `x=${2 * n}-${n}=${n}.` }) },
    ];
    for (let i = 0; i < count; i++) {
        const t = templates[i % templates.length];
        const n = 2 + (i % 9) + 1; // 3 to 11
        const d = t.tmpl(n);
        qs.push({
            subject: 'Mathematics',
            topic: 'DTM Matematika',
            difficulty: ['Easy', 'Medium', 'Hard'][i % 3],
            question: d.q,
            optionA: d.a,
            optionB: d.b,
            optionC: d.c,
            optionD: d.d,
            correctAnswer: d.ans,
            explanation: d.exp,
            isActive: true
        });
    }
    return qs;
}

// ── Seed function ─────────────────────────────────────────────────────────────
async function seed(inProcess = false) {
    try {
        if (!inProcess) {
            const { connectDB } = require('../db');
            await connectDB();
        }
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Question.deleteMany({}),
            Result.deleteMany({}),
            Mistake.deleteMany({})
        ]);
        // Keep tests but delete them too
        await require('../models/Test').deleteMany({});
        console.log('🗑️  Cleared existing data');

        // ── Admin user ────────────────────────────────────────────────────────────
        const admin = await User.create({
            firstName: 'Admin',
            lastName: 'TestHub',
            email: 'admin@testhub.uz',
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            premium: true
        });
        console.log('👤 Admin created: admin / admin123');

        // ── 10 regular users ──────────────────────────────────────────────────────
        const userNames = [
            { fn: 'Ali', ln: 'Karimov', un: 'ali_karimov', em: 'ali@mail.uz' },
            { fn: 'Malika', ln: 'Yusupova', un: 'malika_y', em: 'malika@mail.uz' },
            { fn: 'Jasur', ln: 'Toshmatov', un: 'jasur_t', em: 'jasur@mail.uz' },
            { fn: 'Shahnoza', ln: 'Mirzayeva', un: 'shahnoza_m', em: 'shahnoza@mail.uz' },
            { fn: 'Bobur', ln: 'Nazarov', un: 'bobur_n', em: 'bobur@mail.uz' },
            { fn: 'Nilufar', ln: 'Xolmatova', un: 'nilufar_x', em: 'nilufar@mail.uz' },
            { fn: 'Sardor', ln: 'Raxmatullayev', un: 'sardor_r', em: 'sardor@mail.uz' },
            { fn: 'Dilnoza', ln: 'Ergasheva', un: 'dilnoza_e', em: 'dilnoza@mail.uz' },
            { fn: 'Ulugbek', ln: 'Sobirov', un: 'ulugbek_s', em: 'ulugbek@mail.uz' },
            { fn: 'Mohira', ln: 'Baxtiyorova', un: 'mohira_b', em: 'mohira@mail.uz' },
        ];
        const users = [];
        for (const u of userNames) {
            const user = await User.create({
                firstName: u.fn,
                lastName: u.ln,
                email: u.em,
                username: u.un,
                password: 'Test1234',
                role: 'user',
                premium: Math.random() > 0.7
            });
            users.push(user);
        }
        console.log('👥 10 users created');

        // ── 500 questions ─────────────────────────────────────────────────────────
        const baseQuestions = mathQuestions();
        const needed = 500 - baseQuestions.length;
        const fillerQuestions = generateFillerQuestions(needed > 0 ? needed : 0);
        const allQuestions = [...baseQuestions, ...fillerQuestions].slice(0, 500);
        const insertedQuestions = await Question.insertMany(allQuestions);
        console.log(`❓ ${insertedQuestions.length} questions inserted`);

        // ── 1 Mock Test with 90 questions ─────────────────────────────────────────
        const TestModel = require('../models/Test');
        const testQuestions = insertedQuestions.slice(0, 90).map(q => q._id);
        const mockTest = await TestModel.create({
            title: 'DTM Matematika Mock Test #1',
            description: "O'zbekiston DTM uslubidagi matematik mock test. 90 ta savol, 180 daqiqa.",
            questions: testQuestions,
            duration: 180,
            totalQuestions: 90,
            isActive: true,
            createdBy: admin._id
        });
        console.log('📝 Mock test created:', mockTest.title);

        // ── Sample results for leaderboard ────────────────────────────────────────
        for (const user of users) {
            const correct = 40 + Math.floor(Math.random() * 45);
            const wrong = 90 - correct;
            const answers = testQuestions.map((qId, idx) => {
                const isCorr = idx < correct;
                const q = insertedQuestions[idx];
                return {
                    questionId: qId,
                    userAnswer: isCorr ? q.correctAnswer : (['A', 'B', 'C', 'D'].filter(x => x !== q.correctAnswer)[0]),
                    correctAnswer: q.correctAnswer,
                    isCorrect: isCorr
                };
            });
            const percentage = Math.round((correct / 90) * 1000) / 10;
            await Result.create({
                userId: user._id,
                testId: mockTest._id,
                answers,
                score: correct,
                correct,
                wrong,
                unanswered: 0,
                percentage,
                timeUsed: 3600 + Math.floor(Math.random() * 6000),
                totalTime: 10800
            });
        }
        console.log('📊 Sample results created for leaderboard');

        console.log('\n✅ Database seeded successfully!\n');
        console.log('┌─────────────────────────────────────────┐');
        console.log('│  Admin Login:                           │');
        console.log('│  Username: admin                        │');
        console.log('│  Password: admin123                     │');
        console.log('│                                         │');
        console.log('│  User Login:                            │');
        console.log('│  Username: ali_karimov                  │');
        console.log('│  Password: Test1234                     │');
        console.log('└─────────────────────────────────────────┘\n');

        if (!inProcess) {
            process.exit(0);
        }
    } catch (err) {
        console.error('❌ Seed error:', err);
        if (!inProcess) {
            process.exit(1);
        }
        throw err;
    }
}

if (require.main === module) {
    seed();
} else {
    module.exports = seed;
}
