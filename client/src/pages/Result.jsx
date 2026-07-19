import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Trophy, XCircle, Minus, Target, Timer } from 'lucide-react';

export default function Result() {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const { data } = await api.get(`/results/${id}`);
                setResult(data.result);
            } catch (err) {
                setError(err.response?.data?.message || 'Natijani yuklashda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    if (loading) return <div className="loading-screen"><div className="spinner-dark" /></div>;
    if (error) return <div className="page container"><div className="alert alert-error">{error}</div></div>;
    if (!result) return <div className="page container"><div className="alert alert-info">Natija topilmadi.</div></div>;

    const scorePercentage = result.percentage;
    const timeFormatted = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="page container">
            {/* Top Banner Result Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Imtihon Natijasi</h1>
                        <p style={{ color: 'var(--text-3)' }}>{result.testId?.title}</p>
                    </div>
                    <Link to="/dashboard" className="btn btn-outline">Dashboardga qaytish</Link>
                </div>

                <div className="stats-grid">
                    <div className="stat-card" style={{ boxShadow: 'none', background: 'var(--surface-2)' }}>
                        <div className="stat-card__icon blue"><Trophy size={20} /></div>
                        <div className="stat-card__info">
                            <h3>{result.score}</h3>
                            <p>Ball / To'g'ri</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ boxShadow: 'none', background: 'var(--surface-2)' }}>
                        <div className="stat-card__icon red"><XCircle size={20} /></div>
                        <div className="stat-card__info">
                            <h3>{result.wrong}</h3>
                            <p>Xato</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ boxShadow: 'none', background: 'var(--surface-2)' }}>
                        <div className="stat-card__icon yellow"><Minus size={20} /></div>
                        <div className="stat-card__info">
                            <h3>{result.unanswered}</h3>
                            <p>Belgilanmagan</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ boxShadow: 'none', background: 'var(--surface-2)' }}>
                        <div className="stat-card__icon green"><Target size={20} /></div>
                        <div className="stat-card__info">
                            <h3>{scorePercentage}%</h3>
                            <p>Natija</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ boxShadow: 'none', background: 'var(--surface-2)' }}>
                        <div className="stat-card__icon purple"><Timer size={20} /></div>
                        <div className="stat-card__info">
                            <h3>{timeFormatted(result.timeUsed)}</h3>
                            <p>Sarflangan vaqt</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Questions List */}
            <div>
                <h2 style={{ fontSize: 20, marginBottom: '20px', fontWeight: 800 }}>Savollar Tahlili</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {result.answers.map((ans, idx) => {
                        const q = ans.questionId;
                        if (!q) return null;

                        return (
                            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="font-bold">Savol {idx + 1}</span>
                                    <span className={`badge ${ans.isCorrect ? 'badge-success' : ans.userAnswer === null ? 'badge-gray' : 'badge-danger'}`}>
                                        {ans.isCorrect ? 'To\'g\'ri' : ans.userAnswer === null ? 'Belgilanmagan' : 'Xato'}
                                    </span>
                                </div>

                                <div style={{ fontSize: 16, fontWeight: 500 }} className="question-text">
                                    {q.question}
                                </div>

                                {/* Options grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid">
                                    {['A', 'B', 'C', 'D'].map((opt) => {
                                        const optionText = q[`option${opt}`];
                                        const isCorrectOption = opt === q.correctAnswer;
                                        const isUserSelected = opt === ans.userAnswer;

                                        let optClass = '';
                                        if (isCorrectOption) optClass = 'correct';
                                        else if (isUserSelected && !ans.isCorrect) optClass = 'incorrect';

                                        return (
                                            <div key={opt} className={`option ${optClass}`}>
                                                <span className="option__label">{opt}</span>
                                                <span className="option__text">{optionText}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                <div style={{ padding: '16px', background: 'var(--primary-50)', borderLeft: '4px solid var(--primary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: 14, color: 'var(--text-2)' }}>
                                    <strong>Tushuntirish:</strong> {q.explanation}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
