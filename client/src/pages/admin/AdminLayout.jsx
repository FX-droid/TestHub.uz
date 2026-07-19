import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, HelpCircle, ClipboardList, Users, BarChart3, LogOut, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.svg';
import './Admin.scss';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar__logo">
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '18px' }}>
                        <img src={logo} alt="TestHub Logo" className="logo-img" />
                        <span>TestHub Admin</span>
                    </Link>
                </div>

                <nav className="admin-sidebar__nav">
                    <NavLink to="/admin/dashboard"><LayoutDashboard size={16} /> Dashboard</NavLink>
                    <NavLink to="/admin/questions"><HelpCircle size={16} /> Savollar (CRUD)</NavLink>
                    <NavLink to="/admin/tests"><ClipboardList size={16} /> Mock Testlar</NavLink>
                    <NavLink to="/admin/users"><Users size={16} /> Foydalanuvchilar</NavLink>
                    <NavLink to="/admin/results"><BarChart3 size={16} /> Natijalar</NavLink>
                </nav>

                <div className="admin-sidebar__footer">
                    <div className="admin-user-info">
                        <div className="avatar">{initials}</div>
                        <div className="details">
                            <div className="name">{user?.firstName}</div>
                            <div className="role">Administrator</div>
                        </div>
                    </div>
                    <button className="btn btn-ghost danger w-full" onClick={handleLogout} style={{ justifyContent: 'flex-start', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={16} /> Chiqish
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                <header className="admin-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <ArrowLeft size={14} /> Saytga qaytish
                        </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="badge badge-primary">Admin Modul</span>
                    </div>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
