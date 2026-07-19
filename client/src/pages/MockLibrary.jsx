import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, BarChart3, AlertTriangle, SendHorizonal, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import './MockLibrary.scss';

export default function MockLibrary() {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                // Fetch the active tests list
                const { data } = await api.get('/tests');
                setTests(data.tests);
            } catch (err) {
                setError(err.response?.data?.message || 'Testlarni yuklashda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    const handleStartClick = (test) => {
        setSelectedTest(test);
    };

    const handleConfirmStart = () => {
        if (selectedTest) {
            navigate(`/mock/${selectedTest._id}`);
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner-dark" /></div>;
    if (error) return <div className="page container"><div className="alert alert-error">{error}</div></div>;

    return (
        <div className="page container mock-library">
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Mock Test Kutubxonasi</h1>
                <p>O'zingizga mos testni tanlang va DTM imtihoniga tayyorgarlikni boshlang</p>
            </motion.div>

            <div className="tests-grid">
                {tests.map((test, i) => (
                    <motion.div
                        key={test._id}
                        className="test-card"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="test-card__header">
                            <span className="badge badge-primary">DTM Standarti</span>
                            <span className="badge badge-gray">{test.duration} daqiqa</span>
                        </div>

                        <h3 className="test-card__title">{test.title}</h3>
                        <p className="test-card__desc">{test.description || "Ushbu mock test haqiqiy DTM standartlari asosida tuzilgan."}</p>

                        <div className="test-card__meta">
                            <div className="meta-item">
                                <BookOpen size={16} />
                                <span>{test.totalQuestions || 90} savol</span>
                            </div>
                            <div className="meta-item">
                                <Clock size={16} />
                                <span>{test.duration || 180} daqiqa</span>
                            </div>
                            <div className="meta-item">
                                <BarChart3 size={16} />
                                <span>O'rta qiyinlik</span>
                            </div>
                        </div>

                        <div className="test-card__footer">
                            <button
                                className="btn btn-primary w-full"
                                onClick={() => handleStartClick(test)}
                            >
                                Testni boshlash
                            </button>
                        </div>
                    </motion.div>
                ))}

                {tests.length === 0 && (
                    <div className="empty-state">
                        <div className="icon">📚</div>
                        <h3>Hozircha testlar yo'q</h3>
                        <p>Tez kunda yangi mock testlar qo'shiladi.</p>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {selectedTest && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedTest(null)}
                    >
                        <motion.div
                            className="modal confirm-modal"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="confirm-modal__icon">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="confirm-modal__title">{selectedTest.title}ni boshlash</h2>

                            <div className="confirm-modal__info-box">
                                <div className="info-row">
                                    <CheckCircle size={16} className="text-success" />
                                    <span><strong>{selectedTest.totalQuestions || 90} ta savol</strong> mavjud. Barcha fanlar aralash keladi.</span>
                                </div>
                                <div className="info-row">
                                    <CheckCircle size={16} className="text-success" />
                                    <span><strong>{selectedTest.duration || 180} daqiqa</strong> vaqt beriladi. Vaqt tugashi bilan test avtomatik yakunlanadi.</span>
                                </div>
                                <div className="info-row">
                                    <CheckCircle size={16} className="text-success" />
                                    <span>Natijangiz avtomatik saqlanib, <strong>Xatolar daftari</strong> shakllantiriladi.</span>
                                </div>
                            </div>

                            <p className="confirm-modal__warning">
                                Testni boshlagandan so'ng, uni to'xtatib turish imkoniyati yo'q. Tayyormisiz?
                            </p>

                            <div className="confirm-modal__actions">
                                <button
                                    className="btn btn-outline btn-lg"
                                    onClick={() => setSelectedTest(null)}
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleConfirmStart}
                                >
                                    <SendHorizonal size={16} /> Boshlash
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
