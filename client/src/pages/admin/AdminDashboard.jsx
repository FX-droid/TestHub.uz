import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Users, HelpCircle, ClipboardList, TrendingUp, Plus, FileText } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data.stats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminStats();
    }, []);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner-dark" /></div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h1 style={{ fontSize: 28, fontWeight: 800 }}>Admin Dashboard</h1>
                <p style={{ color: 'var(--text-3)' }}>TestHub.uz platformasini umumiy ko'rinishi va statistikasi</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card__icon blue"><Users size={20} /></div>
                    <div className="stat-card__info">
                        <h3>{stats?.totalUsers || 0}</h3>
                        <p>Jami Foydalanuvchilar</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon green"><HelpCircle size={20} /></div>
                    <div className="stat-card__info">
                        <h3>{stats?.totalQuestions || 0}</h3>
                        <p>Jami Savollar</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon purple"><ClipboardList size={20} /></div>
                    <div className="stat-card__info">
                        <h3>{stats?.totalTests || 0}</h3>
                        <p>Faol Mock Testlar</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon yellow"><TrendingUp size={20} /></div>
                    <div className="stat-card__info">
                        <h3>{stats?.totalResults || 0}</h3>
                        <p>Urinishlar (Mocks)</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="dashboard-grid">
                {/* Recent Activity */}
                <div className="card">
                    <h2 style={{ fontSize: 18, marginBottom: '16px', fontWeight: 800 }}>So'nggi urinishlar</h2>
                    {stats?.recentResults && stats.recentResults.length > 0 ? (
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Foydalanuvchi</th>
                                        <th>Test</th>
                                        <th>Natija (Ball)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentResults.map((r) => (
                                        <tr key={r._id}>
                                            <td className="font-semibold">{r.userId?.firstName} {r.userId?.lastName}</td>
                                            <td>{r.testId?.title}</td>
                                            <td><span style={{ color: 'var(--success)', fontWeight: 700 }}>{r.score}</span> / 90</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Hozircha urinishlar yo'q.</p>
                    )}
                </div>

                {/* Quick Links */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800 }}>Tezkor havolalar</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/admin/questions" className="btn btn-outline" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={16} /> Yangi Savol Qo'shish
                        </Link>
                        <Link to="/admin/tests" className="btn btn-outline" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={16} /> Mock Test Tahrirlash
                        </Link>
                        <Link to="/admin/users" className="btn btn-outline" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Users size={16} /> Userlar Ro'yxati
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
