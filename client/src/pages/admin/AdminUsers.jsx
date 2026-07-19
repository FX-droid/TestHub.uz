import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search, Sparkles, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users', {
                params: { page, limit: 12, search }
            });
            setUsers(data.users);
            setTotal(data.total);
            setPages(data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleTogglePremium = async (id) => {
        try {
            await api.put(`/users/${id}/premium`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Premium statusini o\'zgartirishda xatolik');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Rostdan ham bu foydalanuvchini o\'chirmoqchimisiz?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (err) {
                alert(err.response?.data?.message || 'Foydalanuvchini o\'chirishda xatolik');
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>Foydalanuvchilar ro'yxati</h1>
                <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Tizimda ro'yxatdan o'tgan jami foydalanuvchilar soni: {total}</p>
            </div>

            {/* Search Bar */}
            <div className="card" style={{ padding: '16px' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px' }}>
                    <input
                        className="form-input"
                        style={{ flex: 1 }}
                        placeholder="Ism, familiya, email yoki username bo'yicha qidiruv"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Search size={16} /> Qidirish
                    </button>
                </form>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner-dark" /></div>
            ) : users.length > 0 ? (
                <>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Foydalanuvchi</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Premium Status</th>
                                    <th>Rol</th>
                                    <th>Ro'yxatdan o'tgan sana</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td className="font-bold">{u.firstName} {u.lastName}</td>
                                        <td>@{u.username}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <button
                                                className={`badge ${u.premium ? 'badge-primary' : 'badge-gray'}`}
                                                onClick={() => handleTogglePremium(u._id)}
                                                title="Premium statusini o'zgartirish"
                                                style={{ border: 'none', cursor: 'pointer' }}
                                            >
                                                {u.premium ? <><Sparkles size={11} style={{ marginRight: 3 }} /> Premium</> : 'Oddiy'}
                                            </button>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-success'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString('uz-UZ')}</td>
                                        <td>
                                            {u.role !== 'admin' ? (
                                                <button className="btn btn-ghost btn-sm hover-red" onClick={() => handleDeleteUser(u._id)} title="Foydalanuvchini o'chirish" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                    <Trash2 size={14} /> O'chirish
                                                </button>
                                            ) : (
                                                <span style={{ fontSize: 13, color: 'var(--text-4)' }}>Taqiqlangan</span>
                                            )}
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
                    <p>Foydalanuvchilar topilmadi.</p>
                </div>
            )}
        </div>
    );
}
