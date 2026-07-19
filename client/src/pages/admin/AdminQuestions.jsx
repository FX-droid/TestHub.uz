import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'English', 'Uzbek', 'Russian'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function AdminQuestions() {
    const [questions, setQuestions] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // Search/Filter states
    const [search, setSearch] = useState('');
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState('');

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
    const [currentQuestionId, setCurrentQuestionId] = useState(null);

    // Form State
    const [form, setForm] = useState({
        subject: 'Mathematics',
        topic: '',
        difficulty: 'Medium',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: ''
    });

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/questions', {
                params: { page, limit: 10, search, subject, difficulty }
            });
            setQuestions(data.questions);
            setTotal(data.total);
            setPages(data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [page, subject, difficulty]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchQuestions();
    };

    const handleOpenCreateModal = () => {
        setModalType('create');
        setForm({
            subject: 'Mathematics',
            topic: '',
            difficulty: 'Medium',
            question: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctAnswer: 'A',
            explanation: ''
        });
        setModalOpen(true);
    };

    const handleOpenEditModal = (q) => {
        setModalType('edit');
        setCurrentQuestionId(q._id);
        setForm({
            subject: q.subject,
            topic: q.topic,
            difficulty: q.difficulty,
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu savolni o\'chirishni xohlaysizmi?')) {
            try {
                await api.delete(`/questions/${id}`);
                fetchQuestions();
            } catch (err) {
                alert(err.response?.data?.message || 'Savolni o\'chirishda xatolik');
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'create') {
                await api.post('/questions', form);
            } else {
                await api.put(`/questions/${currentQuestionId}`, form);
            }
            setModalOpen(false);
            fetchQuestions();
        } catch (err) {
            alert(err.response?.data?.message || 'Savolni saqlashda xatolik');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800 }}>Savollar boshqaruvi (CRUD)</h1>
                    <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Jami topilgan savollar soni: {total}</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenCreateModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} /> Yangi Savol Qo'shish
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="card" style={{ padding: '16px' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                        className="form-input"
                        style={{ flex: 1, minWidth: '200px' }}
                        placeholder="Savol yoki mavzu bo'yicha qidiruv"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="form-input"
                        style={{ width: '160px' }}
                        value={subject}
                        onChange={(e) => { setSubject(e.target.value); setPage(1); }}
                    >
                        <option value="">Barcha fanlar</option>
                        {SUBJECTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <select
                        className="form-input"
                        style={{ width: '160px' }}
                        value={difficulty}
                        onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
                    >
                        <option value="">Barcha qiyinchiliklar</option>
                        {DIFFICULTIES.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary" type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Search size={16} /> Qidirish
                    </button>
                </form>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner-dark" /></div>
            ) : questions.length > 0 ? (
                <>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '10%' }}>Fan</th>
                                    <th style={{ width: '15%' }}>Mavzu</th>
                                    <th style={{ width: '45%' }}>Savol</th>
                                    <th style={{ width: '10%' }}>Qiyinchilik</th>
                                    <th style={{ width: '10%' }}>Javob</th>
                                    <th style={{ width: '10%' }}>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((q) => (
                                    <tr key={q._id}>
                                        <td><span className="badge badge-primary">{q.subject}</span></td>
                                        <td className="font-semibold">{q.topic}</td>
                                        <td style={{ fontSize: 13, wordBreak: 'break-all' }}>{q.question}</td>
                                        <td>
                                            <span className={`badge ${q.difficulty === 'Easy' ? 'badge-success' : q.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'}`}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                        <td className="font-bold text-primary">{q.correctAnswer}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => handleOpenEditModal(q)} title="Tahrirlash"><Pencil size={14} /></button>
                                                <button className="btn btn-ghost btn-sm btn-icon hover-red" onClick={() => handleDelete(q._id)} title="O'chirish"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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
                </>
            ) : (
                <div className="card text-center" style={{ padding: '40px' }}>
                    <p>Savollar topilmadi.</p>
                </div>
            )}

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '640px' }}>
                        <div className="modal__header">
                            <h2>{modalType === 'create' ? 'Yangi Savol Qo\'shish' : 'Savolni Tahrirlash'}</h2>
                            <button className="close" onClick={() => setModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label className="form-label">Fan</label>
                                    <select
                                        className="form-input"
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    >
                                        {SUBJECTS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Qiyinchilik</label>
                                    <select
                                        className="form-input"
                                        value={form.difficulty}
                                        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                                    >
                                        {DIFFICULTIES.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Mavzu (Topic)</label>
                                <input
                                    className="form-input"
                                    required
                                    placeholder="Mavzu nomini kiriting"
                                    value={form.topic}
                                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Savol Matni</label>
                                <textarea
                                    className="form-input"
                                    required
                                    rows="3"
                                    placeholder="Savol matnini kiriting"
                                    value={form.question}
                                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label className="form-label">Variant A</label>
                                    <input
                                        className="form-input"
                                        required
                                        value={form.optionA}
                                        onChange={(e) => setForm({ ...form, optionA: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Variant B</label>
                                    <input
                                        className="form-input"
                                        required
                                        value={form.optionB}
                                        onChange={(e) => setForm({ ...form, optionB: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label className="form-label">Variant C</label>
                                    <input
                                        className="form-input"
                                        required
                                        value={form.optionC}
                                        onChange={(e) => setForm({ ...form, optionC: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Variant D</label>
                                    <input
                                        className="form-input"
                                        required
                                        value={form.optionD}
                                        onChange={(e) => setForm({ ...form, optionD: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">To'g'ri javob</label>
                                <select
                                    className="form-input"
                                    value={form.correctAnswer}
                                    onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                                >
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tushuntirish (Explanation)</label>
                                <textarea
                                    className="form-input"
                                    required
                                    rows="2"
                                    placeholder="Yechimning to'liq tushuntirishi"
                                    value={form.explanation}
                                    onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                                />
                            </div>

                            <div className="modal__footer">
                                <button className="btn btn-ghost" type="button" onClick={() => setModalOpen(false)}>Bekor qilish</button>
                                <button className="btn btn-primary" type="submit">Saqlash</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
