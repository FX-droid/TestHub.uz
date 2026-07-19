import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { Timer, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, XCircle, SendHorizonal } from 'lucide-react';
import './MockTest.scss';

export default function MockTest() {
    const navigate = useNavigate();
    const { id: testId } = useParams();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // questionId -> 'A'|'B'|'C'|'D'
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // confirmation modal open
    const [autoSubmitMsg, setAutoSubmitMsg] = useState(''); // msg when timer hits 0
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const submittingRef = useRef(false); // stable ref for submitTest closure

    // ── Load test ─────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const { data } = await api.get(`/tests/${testId}`);
                setTest(data.test);
                setTimeLeft(data.test.duration * 60);

                const saved = localStorage.getItem(`mock_answers_${data.test._id}`);
                if (saved) setAnswers(JSON.parse(saved));

                startTimeRef.current = Date.now();
            } catch (err) {
                setError(err.response?.data?.message || 'Testni yuklashda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, []);

    // ── Submit (memoized, stable via ref) ────────────────────────────────
    const submitTest = useCallback(async (auto = false, currentAnswers) => {
        if (!test || submittingRef.current) return;
        submittingRef.current = true;
        setSubmitting(true);
        if (timerRef.current) clearInterval(timerRef.current);

        const timeUsed = Math.min(
            test.duration * 60,
            Math.round((Date.now() - startTimeRef.current) / 1000)
        );

        // currentAnswers is passed from timer callback to avoid stale closure
        const snapshotAnswers = currentAnswers || answers;
        const answerPayload = Object.entries(snapshotAnswers).map(([qId, ans]) => ({
            questionId: qId,
            answer: ans
        }));

        try {
            const { data } = await api.post('/results/submit', {
                testId: test._id,
                answers: answerPayload,
                timeUsed
            });
            localStorage.removeItem(`mock_answers_${test._id}`);
            navigate(`/result/${data.result}`);
        } catch (err) {
            setError('Testni yuborishda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
            setSubmitting(false);
            submittingRef.current = false;
        }
    }, [test, answers, navigate]);

    // ── Timer ─────────────────────────────────────────────────────────────
    const answersRef = useRef(answers);
    useEffect(() => { answersRef.current = answers; }, [answers]);

    useEffect(() => {
        if (loading || !test) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setAutoSubmitMsg('Vaqt tugadi! Natijalar saqlanmoqda...');
                    // Pass stable answers snapshot to avoid stale closure
                    submitTest(true, answersRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [loading, test, submitTest]);

    // ── Auto-save ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (test) localStorage.setItem(`mock_answers_${test._id}`, JSON.stringify(answers));
    }, [answers, test]);

    // ── Guards ────────────────────────────────────────────────────────────
    if (loading) return <div className="loading-screen"><div className="spinner-dark" /></div>;
    if (error) return <div className="page container"><div className="alert alert-error">{error}</div></div>;
    if (!test) return <div className="page container"><div className="alert alert-info">Faol test topilmadi.</div></div>;

    // ── Derived stats ─────────────────────────────────────────────────────
    const totalQ = test.questions.length;
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = totalQ - answeredCount;
    const currentQuestion = test.questions[currentIdx];
    const isTimeLow = timeLeft > 0 && timeLeft <= 300; // last 5 minutes

    const handleSelectOption = (opt) => {
        setAnswers((prev) => ({ ...prev, [currentQuestion._id]: opt }));
    };

    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleFinishClick = () => setShowConfirm(true);
    const handleConfirmSubmit = () => { setShowConfirm(false); submitTest(false); };
    const handleCancelConfirm = () => setShowConfirm(false);

    return (
        <div className="mock-test-layout">

            {/* ── Header ──────────────────────────────────────────────── */}
            <header className="mock-header">
                <div className="mock-header__inner">
                    <div className="mock-title">
                        <h2>{test.title}</h2>
                        <span className="mock-progress">{answeredCount} / {totalQ} javob berildi</span>
                    </div>

                    <div className={`mock-timer ${isTimeLow ? 'mock-timer--warning' : ''}`}>
                        {isTimeLow ? <AlertTriangle size={16} className="icon" /> : <Timer size={16} className="icon" />}
                        <span className="time">{formatTime(timeLeft)}</span>
                    </div>

                    <button
                        className="btn btn-danger btn-sm mock-finish-btn"
                        onClick={handleFinishClick}
                        disabled={submitting}
                    >
                        {submitting
                            ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Yuborilmoqda...</>
                            : <><SendHorizonal size={15} /> Testni Yakunlash</>
                        }
                    </button>
                </div>
            </header>

            {/* ── Auto-submit overlay ──────────────────────────────────── */}
            {autoSubmitMsg && (
                <div className="mock-auto-submit-bar">
                    <AlertTriangle size={16} />
                    {autoSubmitMsg}
                </div>
            )}

            {/* ── Main Workspace ───────────────────────────────────────── */}
            <div className="mock-container">
                <div className="mock-workspace">

                    {/* Question card */}
                    <div className="mock-question-card">
                        <div className="card-header">
                            <span className="badge badge-primary">{currentQuestion.subject}</span>
                            <span className="badge badge-gray">{currentQuestion.topic}</span>
                            <span className="badge badge-warning">{currentQuestion.difficulty}</span>
                        </div>
                        <div className="current-q-num">Savol {currentIdx + 1} / {totalQ}</div>
                        <div className="question-body">{currentQuestion.question}</div>

                        <div className="options-list">
                            {['A', 'B', 'C', 'D'].map((opt) => {
                                const optText = currentQuestion[`option${opt}`];
                                const isSelected = answers[currentQuestion._id] === opt;
                                return (
                                    <button
                                        key={opt}
                                        className={`option ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleSelectOption(opt)}
                                    >
                                        <span className="option__label">{opt}</span>
                                        <span className="option__text">{optText}</span>
                                        {isSelected && <CheckCircle size={16} className="option__check" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Nav buttons */}
                        <div className="card-actions">
                            <button
                                className="btn btn-outline"
                                disabled={currentIdx === 0}
                                onClick={() => setCurrentIdx(i => i - 1)}
                            >
                                <ChevronLeft size={16} /> Oldingi
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={currentIdx === totalQ - 1}
                                onClick={() => setCurrentIdx(i => i + 1)}
                            >
                                Keyingi <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Question Navigator */}
                    <div className="mock-navigator-panel">
                        <div className="nav-legend">
                            <span className="nav-legend__item answered">
                                <span className="dot" /> Javob berilgan
                            </span>
                            <span className="nav-legend__item">
                                <span className="dot empty" /> Javob berilmagan
                            </span>
                        </div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '12px 0 8px', color: 'var(--text-2)' }}>
                            Savollar ({answeredCount}/{totalQ})
                        </h3>
                        <div className="nav-grid">
                            {test.questions.map((q, idx) => {
                                const isAnswered = !!answers[q._id];
                                const isCurrent = idx === currentIdx;
                                return (
                                    <button
                                        key={q._id}
                                        className={`nav-item ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                                        onClick={() => setCurrentIdx(idx)}
                                        title={`Savol ${idx + 1}${isAnswered ? ' ✓' : ''}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Finish button in sidebar too */}
                        <button
                            className="btn btn-danger w-full mock-finish-sidebar"
                            onClick={handleFinishClick}
                            disabled={submitting}
                            style={{ marginTop: 16 }}
                        >
                            <SendHorizonal size={15} /> Testni Yakunlash
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Confirmation Modal ───────────────────────────────────── */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        className="mock-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={handleCancelConfirm}
                    >
                        <motion.div
                            className="mock-modal"
                            initial={{ opacity: 0, scale: 0.93, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 20 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mock-modal__icon">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="mock-modal__title">Testni yakunlashni xohlaysizmi?</h2>
                            <p className="mock-modal__sub">Bir marta yuborilgandan so'ng o'zgartirish mumkin emas.</p>

                            <div className="mock-modal__stats">
                                <div className="mstat mstat--green">
                                    <CheckCircle size={18} />
                                    <div>
                                        <span>{answeredCount}</span>
                                        <small>Javob berilgan</small>
                                    </div>
                                </div>
                                <div className="mstat mstat--orange">
                                    <XCircle size={18} />
                                    <div>
                                        <span>{unansweredCount}</span>
                                        <small>Javob berilmagan</small>
                                    </div>
                                </div>
                                <div className="mstat mstat--blue">
                                    <Timer size={18} />
                                    <div>
                                        <span>{formatTime(timeLeft)}</span>
                                        <small>Qolgan vaqt</small>
                                    </div>
                                </div>
                            </div>

                            {unansweredCount > 0 && (
                                <div className="mock-modal__warn">
                                    <AlertTriangle size={14} />
                                    {unansweredCount} ta savol javob berilmagan holda xato hisoblanadi.
                                </div>
                            )}

                            <div className="mock-modal__actions">
                                <button className="btn btn-outline btn-lg" onClick={handleCancelConfirm}>
                                    Davom etish
                                </button>
                                <button className="btn btn-danger btn-lg" onClick={handleConfirmSubmit}>
                                    <SendHorizonal size={16} /> Ha, Yakunlash
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
