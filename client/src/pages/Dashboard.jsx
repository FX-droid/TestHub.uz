import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Sparkles, FileText, Clock, Inbox, ClipboardList, CheckCircle, XCircle, Target, Trophy, Coins } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [results, setResults] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [test, setTest] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, resultsRes, testRes, leadRes] = await Promise.all([
                    api.get('/results/stats/me'),
                    api.get('/results/my'),
                    api.get('/tests/active'),
                    api.get('/results/leaderboard')
                ]);
                setStats(statsRes.data.stats);
                setResults(resultsRes.data.results);
                setTest(testRes.data.test);
                setLeaderboard(leadRes.data.leaderboard);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-screen"><div className="spinner-dark" /></div>;

    return (
        <div className="page container">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="dashboard-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Welcome Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Assalomu alaykum, {user?.firstName}!</h1>
                            <p style={{ color: 'var(--text-3)' }}>Bugun o'z mahoratingizni sinab ko'rishga tayyormisiz?</p>
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <Link to="/wallet" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, padding: '6px 14px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', borderRadius: 20, textDecoration: 'none' }}>
                                <Coins size={16} /> {user?.coins || 0}
                            </Link>
                            {user?.premium && <span className="badge badge-primary" style={{ padding: '6px 14px', borderRadius: 20 }}><Sparkles size={14} style={{ marginRight: 4 }} /> Premium</span>}
                        </div>
                    </div>

                    {/* Active Mock Test Banner */}
                    {test ? (
                        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', color: 'white', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ zIndex: 1 }}>
                                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '8px', border: 'none' }}>Bugungi Mock Test</span>
                                <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: '8px' }}>{test.title}</h2>
                                <div style={{ display: 'flex', gap: '16px', fontSize: 14, opacity: 0.9 }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><FileText size={16} /> {test.questions.length} Savol</span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Clock size={16} /> {test.duration} Daqiqa</span>
                                </div>
                            </div>
                            <Link to={`/mock/${test._id}`} className="btn btn-primary" style={{ background: 'white', color: 'var(--primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                Boshlash
                            </Link>
                        </div>
                    ) : (
                        <div className="card text-center" style={{ padding: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-4)', marginBottom: '16px' }}><Inbox size={36} /></div>
                            <h3>Hozirda faol mock testlar yo'q</h3>
                            <p style={{ color: 'var(--text-3)' }}>Tez orada yangi DTM mock testlari qo'shiladi.</p>
                        </div>
                    )}

                    {/* Statistics Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-card__icon blue"><ClipboardList size={20} /></div>
                            <div className="stat-card__info">
                                <h3>{stats?.totalMocks || 0}</h3>
                                <p>Total Mocks</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon green"><CheckCircle size={20} /></div>
                            <div className="stat-card__info">
                                <h3>{stats?.totalCorrect || 0}</h3>
                                <p>To'g'ri javoblar</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon red"><XCircle size={20} /></div>
                            <div className="stat-card__info">
                                <h3>{stats?.totalWrong || 0}</h3>
                                <p>Xatolar</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__icon purple"><Target size={20} /></div>
                            <div className="stat-card__info">
                                <h3>{stats?.accuracy || 0}%</h3>
                                <p>Aniqlik</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Results */}
                    <div>
                        <h2 style={{ fontSize: 20, marginBottom: '16px', fontWeight: 700 }}>So'nggi Natijalar</h2>
                        {results.length > 0 ? (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Test Nomi</th>
                                            <th>Ball</th>
                                            <th>Foiz</th>
                                            <th>Sana</th>
                                            <th>Amal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((r) => (
                                            <tr key={r._id}>
                                                <td className="font-semibold">{r.testId?.title}</td>
                                                <td><span style={{ color: 'var(--success)', fontWeight: 700 }}>{r.score}</span> / 90</td>
                                                <td>{r.percentage}%</td>
                                                <td>{new Date(r.createdAt).toLocaleDateString('uz-UZ')}</td>
                                                <td>
                                                    <Link to={`/result/${r._id}`} className="btn btn-outline btn-sm">Tahlil</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="card text-center" style={{ padding: '32px' }}>
                                <p style={{ color: 'var(--text-3)' }}>Siz hali mock test topshirmagansiz.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Leaderboard */}
                <div>
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h2 style={{ fontSize: 18, marginBottom: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Trophy size={18} style={{ color: '#F59E0B' }} /> Global Leaderboard
                        </h2>
                        {leaderboard.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {leaderboard.map((item, idx) => (
                                    <div key={item.userId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: idx < leaderboard.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: idx === 0 ? '#fef3c7' : idx === 1 ? '#f1f5f9' : idx === 2 ? '#fee2e2' : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: idx === 0 ? '#b45309' : idx === 1 ? '#475569' : idx === 2 ? '#b91c1c' : 'var(--text-3)' }}>
                                            {idx + 1}
                                        </div>
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <div className="font-semibold" style={{ fontSize: 14, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                {item.firstName} {item.lastName}
                                            </div>
                                            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>@{item.username}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 15 }}>{item.bestScore}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-4)' }}>{item.avgPercentage}% accuracy</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Jadval bo'sh.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
