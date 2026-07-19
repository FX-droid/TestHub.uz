import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.svg';

export default function Register() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch('password');

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);
        try {
            await registerUser(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Ro'yxatdan o'tish muvaffaqiyatsiz");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-card auth-card--wide"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="auth-card__header">
                    <Link to="/" className="auth-logo">
                        <img src={logo} alt="TestHub Logo" className="logo-img" />
                        <span>TestHub.uz</span>
                    </Link>
                    <h1>Hisob yarating</h1>
                    <p>DTMga tayyorlanishni boshlang</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="auth-row">
                        <div className="form-group">
                            <label className="form-label">Ism</label>
                            <input className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="Ismingiz" {...register('firstName', { required: 'Ism talab qilinadi' })} />
                            {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Familiya</label>
                            <input className={`form-input ${errors.lastName ? 'error' : ''}`} placeholder="Familiyangiz" {...register('lastName', { required: 'Familiya talab qilinadi' })} />
                            {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="email@mail.uz" {...register('email', { required: 'Email talab qilinadi', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email noto\'g\'ri' } })} />
                        {errors.email && <span className="form-error">{errors.email.message}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input className={`form-input ${errors.username ? 'error' : ''}`} placeholder="username123" {...register('username', { required: 'Username talab qilinadi', minLength: { value: 3, message: 'Kamida 3 ta belgi' }, pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Faqat harf, raqam va _' } })} />
                        {errors.username && <span className="form-error">{errors.username.message}</span>}
                    </div>

                    <div className="auth-row">
                        <div className="form-group">
                            <label className="form-label">Parol</label>
                            <input type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Kamida 8 ta belgi" {...register('password', { required: 'Parol talab qilinadi', minLength: { value: 8, message: 'Kamida 8 ta belgi' } })} />
                            {errors.password && <span className="form-error">{errors.password.message}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Parolni takrorlang</label>
                            <input type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Parolni takrorlang" {...register('confirmPassword', { required: 'Parolni tasdiqlang', validate: v => v === password || 'Parollar mos kelmadi' })} />
                            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? <><span className="spinner" /> Yaratilmoqda...</> : "Hisob yaratish"}
                    </button>
                </form>

                <div className="auth-card__footer">
                    <p>Hisobingiz bormi? <Link to="/login">Kiring</Link></p>
                </div>
            </motion.div>
        </div>
    );
}
