import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminTests() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
    const [currentTestId, setCurrentTestId] = useState(null);

    const [form, setForm] = useState({
        title: '',
        description: '',
        duration: 180,
        questionCount: 90,
        isActive: true
    });

    const fetchTests = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/tests');
            setTests(data.tests);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const handleOpenCreateModal = () => {
        setModalType('create');
        setForm({
            title: '',
            description: '',
            duration: 180,
            questionCount: 90,
            isActive: true
        });
        setModalOpen(true);
    };

    const handleOpenEditModal = (t) => {
        setModalType('edit');
        setCurrentTestId(t._id);
        setForm({
            title: t.title,
            description: t.description || '',
            duration: t.duration,
            questionCount: t.totalQuestions,
            isActive: t.isActive
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu testni o\'chirishni xohlaysizmi?')) {
            try {
                await api.delete(`/tests/${id}`);
                fetchTests();
            } catch (err) {
                alert(err.response?.data?.message || 'Testni o\'chirishda xatolik');
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'create') {
                // Automatically fetch first 90 questions for the simple mock creation
                const { data: qRes } = await api.get('/questions', { params: { limit: form.questionCount } });
                if (qRes.questions.length < form.questionCount) {
                    alert(`Bazadagi savollar soni yetarli emas (Bazada bor: ${qRes.questions.length}, talab qilingan: ${form.questionCount})`);
                    return;
                }
                const questionIds = qRes.questions.map(q => q._id);
                await api.post('/tests', {
                    title: form.title,
                    description: form.description,
                    duration: form.duration,
                    questionIds
                });
            } else {
                await api.put(`/tests/${currentTestId}`, {
                    title: form.title,
                    description: form.description,
                    duration: form.duration,
                    isActive: form.isActive
                });
            }
            setModalOpen(false);
            fetchTests();
        } catch (err) {
            alert(err.response?.data?.message || 'Testni saqlashda xatolik');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800 }}>Mock testlar boshqaruvi</h1>
                    <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Tizimdagi abituriyentlar uchun faol mock testlar</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenCreateModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} /> Yangi Test Qo'shish
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner-dark" /></div>
            ) : tests.length > 0 ? (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Test nomi</th>
                                <th>Tavsif</th>
                                <th>Savollar soni</th>
                                <th>Vaqt (Daqiqa)</th>
                                <th>Holat</th>
                                <th>Amal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((t) => (
                                <tr key={t._id}>
                                    <td className="font-bold">{t.title}</td>
                                    <td>{t.description || '-'}</td>
                                    <td className="font-semibold">{t.totalQuestions} ta</td>
                                    <td>{t.duration} daqiqa</td>
                                    <td>
                                        <span className={`badge ${t.isActive ? 'badge-success' : 'badge-gray'}`}>
                                            {t.isActive ? 'Faol' : 'Nofaol'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => handleOpenEditModal(t)}><Pencil size={14} /></button>
                                            <button className="btn btn-ghost btn-sm btn-icon hover-red" onClick={() => handleDelete(t._id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card text-center" style={{ padding: '40px' }}>
                    <p>Mock testlar topilmadi.</p>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal__header">
                            <h2>{modalType === 'create' ? 'Yangi Test Yaratish' : 'Testni Tahrirlash'}</h2>
                            <button className="close" onClick={() => setModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Test Nomi</label>
                                <input
                                    className="form-input"
                                    required
                                    placeholder="Misol: DTM Matematika 2024 Mock"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tavsif</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    placeholder="Test haqida qisqacha ma'lumot"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label className="form-label">Davomiyligi (Daqiqa)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        required
                                        value={form.duration}
                                        onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                                    />
                                </div>

                                {modalType === 'create' && (
                                    <div className="form-group">
                                        <label className="form-label">Savollar soni</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            required
                                            value={form.questionCount}
                                            onChange={(e) => setForm({ ...form, questionCount: parseInt(e.target.value) })}
                                        />
                                    </div>
                                )}
                            </div>

                            {modalType === 'edit' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={form.isActive}
                                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                    />
                                    <label htmlFor="isActive" className="form-label">Test faolmi?</label>
                                </div>
                            )}

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
