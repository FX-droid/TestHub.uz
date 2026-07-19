import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, User, LayoutDashboard, Settings, LogOut, Coins } from 'lucide-react';
import logo from '../assets/logo.svg';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/');
    };

    const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : '';

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                {/* Logo */}
                <Link to="/" className="navbar__logo">
                    <img src={logo} alt="TestHub Logo" className="logo-img" />
                    TestHub.uz
                </Link>

                {/* Desktop Nav */}
                {user ? (
                    <div className="navbar__nav">
                        <NavLink to="/dashboard">Dashboard</NavLink>
                        <NavLink to="/mock">Mock Test</NavLink>
                        <NavLink to="/mistakes">Xatolar</NavLink>
                        <NavLink to="/tasks">Vazifalar</NavLink>
                        {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
                    </div>
                ) : (
                    <div className="navbar__nav">
                        <a href="#features">Imkoniyatlar</a>
                        <a href="#faq">FAQ</a>
                    </div>
                )}

                {/* Actions */}
                <div className="navbar__actions">
                    <button className="navbar__theme-btn" onClick={toggleTheme} title="Toggle theme">
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>

                    {user && (
                        <Link to="/wallet" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, padding: '4px 12px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', borderRadius: 20, textDecoration: 'none', marginLeft: 8 }}>
                            <Coins size={16} /> {user.coins || 0}
                        </Link>
                    )}

                    {user ? (
                        <div style={{ position: 'relative' }} ref={menuRef}>
                            <div className="navbar__avatar" onClick={() => setMenuOpen(o => !o)}>
                                {initials}
                            </div>
                            <AnimatePresence>
                                {menuOpen && (
                                    <motion.div
                                        className="navbar__user-menu"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <div style={{ padding: '8px 12px 4px' }}>
                                            <div style={{ fontSize: 13, fontWeight: 700 }}>{user.firstName} {user.lastName}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>@{user.username}</div>
                                        </div>
                                        <hr />
                                        <Link to="/profile" onClick={() => setMenuOpen(false)}>
                                            <User size={14} /> Profil
                                        </Link>
                                        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                                            <LayoutDashboard size={14} /> Dashboard
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" onClick={() => setMenuOpen(false)}>
                                                <Settings size={14} /> Admin Panel
                                            </Link>
                                        )}
                                        <hr />
                                        <button className="danger" onClick={handleLogout}>
                                            <LogOut size={16} /> Chiqish
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost btn-sm">Kirish</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Ro'yxatdan o'tish</Link>
                        </>
                    )}

                    <button className="navbar__hamburger" onClick={() => setMobileOpen(o => !o)}>
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 16px' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 0' }}>
                            {user ? (
                                <>
                                    <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
                                    <NavLink to="/mock" onClick={() => setMobileOpen(false)}>Mock Test</NavLink>
                                    <NavLink to="/mistakes" onClick={() => setMobileOpen(false)}>Xatolar</NavLink>
                                    <NavLink to="/tasks" onClick={() => setMobileOpen(false)}>Vazifalar</NavLink>
                                    <NavLink to="/wallet" style={{ color: '#F59E0B', fontWeight: 700 }} onClick={() => setMobileOpen(false)}>Wallet (Tangalar: {user.coins || 0})</NavLink>
                                    <NavLink to="/profile" onClick={() => setMobileOpen(false)}>Profil</NavLink>
                                    {user.role === 'admin' && <NavLink to="/admin" onClick={() => setMobileOpen(false)}>Admin</NavLink>}
                                    <button onClick={handleLogout} style={{ color: 'var(--danger)', textAlign: 'left', padding: '8px 0', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer' }}>Chiqish</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileOpen(false)}>Kirish</Link>
                                    <Link to="/register" onClick={() => setMobileOpen(false)}>Ro'yxatdan o'tish</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
