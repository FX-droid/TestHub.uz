import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Sparkles } from 'lucide-react';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editLoading, setEditLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || ''
        }
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/results/stats/me');
                setStats(data.stats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const onSubmit = async (data) => {
        setMessage({ text: '', type: '' });
        setEditLoading(true);
        try {
            const res = await api.put('/auth/profile', data);
            updateUser(res.data.user);
            setMessage({ text: 'Profil muvaffaqiyatli yangilandi!', type: 'success' });
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Profilni tahrirlashda xatolik', type: 'error' });
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner-dark" /></div>;

    return (
        <div className="page container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }} className="dashboard-grid">
                {/* Left Side Info Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card text-center" style={{ padding: '32px 24px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            {`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()}
                        </div>
                        <h2>{user?.firstName} {user?.lastName}</h2>
                        <p style={{ color: 'var(--text-3)', fontSize: '14px', marginBottom: '16px' }}>@{user?.username}</p>

                        {user?.premium ? (
                            <span className="badge badge-primary" style={{ fontSize: '13px', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Sparkles size={12} /> Premium Foydalanuvchi
                            </span>
                        ) : (
                            <span className="badge badge-gray" style={{ fontSize: '13px', padding: '6px 14px' }}>Oddiy Foydalanuvchi</span>
                        )}

                        <div style={{ textAlign: 'left', marginTop: '24px', fontSize: '13px', color: 'var(--text-3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div><strong>Email:</strong> {user?.email}</div>
                            <div><strong>A\'zo bo\'lgan sana:</strong> {new Date(user?.createdAt).toLocaleDateString('uz-UZ')}</div>
                        </div>
                    </div>

                    {/* Quick Mini Stats */}
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: 16, marginBottom: '16px', fontWeight: 800 }}>Imtihon statistikasi</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                                <span style={{ color: 'var(--text-3)' }}>Topshirilgan mocklar:</span>
                                <span className="font-bold">{stats?.totalMocks || 0} ta</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                                <span style={{ color: 'var(--text-3)' }}>O\'rtacha aniqlik:</span>
                                <span className="font-bold">{stats?.accuracy || 0}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                                <span style={{ color: 'var(--text-3)' }}>Eng yuqori ball:</span>
                                <span className="font-bold" style={{ color: 'var(--success)' }}>{stats?.bestScore || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Settings Card */}
                <div className="card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: 20, marginBottom: '24px', fontWeight: 800 }}>Profil Sozlamalari</h2>

                    {message.text && (
                        <div className={`alert alert-${message.type}`} style={{ marginBottom: '20px' }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" style={{ marginTop: 0 }}>
                        <div className="auth-row">
                            <div className="form-group">
                                <label className="form-label">Ism</label>
                                <input
                                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                                    placeholder="Ism"
                                    {...register('firstName', { required: 'Ism talab qilinadi' })}
                                />
                                {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Familiya</label>
                                <input
                                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                                    placeholder="Familiya"
                                    {...register('lastName', { required: 'Familiya talab qilinadi' })}
                                />
                                {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                className="form-input"
                                value={user?.username}
                                disabled
                                style={{ background: 'var(--surface-2)', cursor: 'not-allowed', color: 'var(--text-3)' }}
                            />
                            <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Username o'zgartirilmaydi.</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                className="form-input"
                                value={user?.email}
                                disabled
                                style={{ background: 'var(--surface-2)', cursor: 'not-allowed', color: 'var(--text-3)' }}
                            />
                            <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Elektron pochta manzili o'zgartirilmaydi.</span>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', marginTop: '8px' }} disabled={editLoading}>
                            {editLoading ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}
                        </button>
                    </form>
                </div>
            </div>
        </div >
    );
}
