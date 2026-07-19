import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import logo from './assets/logo.svg';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MockLibrary from './pages/MockLibrary';
import MockTest from './pages/MockTest';
import Result from './pages/Result';
import Mistakes from './pages/Mistakes';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Tasks from './pages/Tasks';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminTests from './pages/admin/AdminTests';
import AdminUsers from './pages/admin/AdminUsers';
import AdminResults from './pages/admin/AdminResults';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-screen"><img src={logo} alt="Logo" className="logo-img" style={{ marginBottom: 16 }} /><div className="spinner-dark" /></div>;
    return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-screen"><img src={logo} alt="Logo" className="logo-img" style={{ marginBottom: 16 }} /><div className="spinner-dark" /></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
}

function PublicRoute({ children }) {
    const { user } = useAuth();
    return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppLayout({ children }) {
    return <>
        <Navbar />
        <main>{children}</main>
    </>;
}

export default function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<AppLayout><Landing /></AppLayout>} />
            <Route path="/login" element={<PublicRoute><AppLayout><Login /></AppLayout></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><AppLayout><Register /></AppLayout></PublicRoute>} />

            {/* Protected */}
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/mock" element={<ProtectedRoute><AppLayout><MockLibrary /></AppLayout></ProtectedRoute>} />
            <Route path="/mock/:id" element={<ProtectedRoute><MockTest /></ProtectedRoute>} />
            <Route path="/result/:id" element={<ProtectedRoute><AppLayout><Result /></AppLayout></ProtectedRoute>} />
            <Route path="/mistakes" element={<ProtectedRoute><AppLayout><Mistakes /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><AppLayout><Wallet /></AppLayout></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><AppLayout><Tasks /></AppLayout></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="questions" element={<AdminQuestions />} />
                <Route path="tests" element={<AdminTests />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="results" element={<AdminResults />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
