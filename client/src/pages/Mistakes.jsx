import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'English', 'Uzbek', 'Russian'];

export default function Mistakes() {
    const [mistakes, setMistakes] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchMistakes = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/mistakes/my', {
                params: { subject, page, limit: 10 }
            });
            setMistakes(data.mistakes);
            setTotal(data.total);
            setPages(data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMistakes();
    }, [page, subject]);

    const handleDelete = async (id) => {
        if (window.confirm('Bu xatoni o\'chirmoqchimisiz?')) {
            setActionLoading(true);
            try {
                await api.delete(`/mistakes/${id}`);
                fetchMistakes();
            } catch (err) {
                console.error(err);
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('Hamma xatolarni o\'chirishni xohlaysizmi?')) {
            setActionLoading(true);
            try {
                await api.delete('/mistakes/clear/all');
                fetchMistakes();
            } catch (err) {
                console.error(err);
            } finally {
                setActionLoading(false);
            }
        }
    };

    return (
        <div className="page container">
            {/* Header and Filter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800 }}>Xatolar daftari</h1>
                    <p style={{ color: 'var(--text-3)' }}>Jami xatolar: {total}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select
                        className="form-input"
                        style={{ width: '180px', padding: '8px 12px' }}
                        value={subject}
                        onChange={(e) => { setSubject(e.target.value); setPage(1); }}
                    >
                        <option value="">Barcha fanlar</option>
                        {SUBJECTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    {mistakes.length > 0 && (
                        <button className="btn btn-danger btn-sm" onClick={handleClearAll} disabled={actionLoading}>
                            Hammasini tozalash
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                    <div className="spinner-dark" />
                </div>
            ) : mistakes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {mistakes.map((m, idx) => {
                        const q = m.questionId;
                        if (!q) return null;

                        return (
                            <div key={m._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: '40px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <span className="badge badge-primary">{q.subject}</span>
                                        <span className="badge badge-gray">{q.topic}</span>
                                        <span className="badge badge-warning">{q.difficulty}</span>
                                    </div>
                                    <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>
                                        Qo'shildi: {new Date(m.createdAt).toLocaleDateString('uz-UZ')}
                                    </span>
                                </div>

                                <div style={{ fontSize: 16, fontWeight: 600 }} className="question-text">
                                    {q.question}
                                </div>

                                {/* Options list */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid">
                                    {['A', 'B', 'C', 'D'].map((opt) => {
                                        const optionText = q[`option${opt}`];
                                        const isCorrectOption = opt === q.correctAnswer;
                                        const isUserSelected = opt === m.wrongAnswer;

                                        let optClass = '';
                                        if (isCorrectOption) optClass = 'correct';
                                        else if (isUserSelected) optClass = 'incorrect';

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

                                {/* Delete button absolutely positioned top right */}
                                <button
                                    className="btn btn-ghost btn-icon hover-red"
                                    style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-4)' }}
                                    onClick={() => handleDelete(m._id)}
                                    title="Xatoni o'chirish"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className="pagination">
                            <button disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
                            {[...Array(pages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={page === i + 1 ? 'active' : ''}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button disabled={page === pages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="card text-center" style={{ padding: '60px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--success)', marginBottom: '16px' }}><CheckCircle size={48} /></div>
                    <h3>Xatolar topilmadi</h3>
                    <p style={{ color: 'var(--text-3)' }}>Ajoyib natija! Hozircha qilgan xatolaringiz ro'yxati bo'sh.</p>
                </div>
            )}
        </div>
    );
}
