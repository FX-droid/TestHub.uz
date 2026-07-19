import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminResults() {
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/results', {
                params: { page, limit: 15 }
            });
            setResults(data.results);
            setTotal(data.total);
            setPages(data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [page]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>Foydalanuvchilar natijalari</h1>
                <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Tizimda topshirilgan jami mock imtihonlar ro'yxati</p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner-dark" /></div>
            ) : results.length > 0 ? (
                <>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Foydalanuvchi</th>
                                    <th>Username</th>
                                    <th>Imtihon nomi</th>
                                    <th>Ball (To'g'ri)</th>
                                    <th>Foiz</th>
                                    <th>Sarflangan vaqt</th>
                                    <th>Topshirilgan sana</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r) => (
                                    <tr key={r._id}>
                                        <td className="font-bold">{r.userId?.firstName} {r.userId?.lastName}</td>
                                        <td>@{r.userId?.username}</td>
                                        <td className="font-semibold">{r.testId?.title}</td>
                                        <td><span style={{ color: 'var(--success)', fontWeight: 700 }}>{r.score}</span> / 90</td>
                                        <td>{r.percentage}%</td>
                                        <td>{formatTime(r.timeUsed)}</td>
                                        <td>{new Date(r.createdAt).toLocaleString('uz-UZ')}</td>
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
                    <p>Natijalar topilmadi.</p>
                </div>
            )}
        </div>
    );
}
