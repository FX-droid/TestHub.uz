import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.svg';
import './Auth.scss';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);
        try {
            const user = await login(data.identifier, data.password);
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Kirish muvaffaqiyatsiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="auth-card__header">
                    <Link to="/" className="auth-logo">
                        <img src={logo} alt="TestHub Logo" className="logo-img" />
                        <span>TestHub.uz</span>
                    </Link>
                    <h1>Xush kelibsiz!</h1>
                    <p>Hisobingizga kiring</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Username yoki Email</label>
                        <input
                            className={`form-input ${errors.identifier ? 'error' : ''}`}
                            placeholder="username yoki email@mail.uz"
                            {...register('identifier', { required: 'Username yoki email kiriting' })}
                        />
                        {errors.identifier && <span className="form-error">{errors.identifier.message}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Parol</label>
                        <input
                            type="password"
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            placeholder="Parolingizni kiriting"
                            {...register('password', { required: 'Parol kiriting' })}
                        />
                        {errors.password && <span className="form-error">{errors.password.message}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? <><span className="spinner" /> Kirilmoqda...</> : 'Kirish'}
                    </button>
                </form>

                <div className="auth-card__footer">
                    <p>Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'ting</Link></p>
                    <div className="demo-hint">
                        <strong>Demo:</strong> admin / admin123
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
