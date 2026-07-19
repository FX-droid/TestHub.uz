import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { BookOpen, Timer, BarChart3, XCircle, Trophy, Moon, ClipboardList, Clock, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import './Landing.scss';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const features = [
    { icon: 'book', title: "500+ Savollar", desc: "DTM uslubidagi matematik savollar bazasi" },
    { icon: 'timer', title: "180 Daqiqalik Imtihon", desc: "Haqiqiy DTM formatidagi mock testlar" },
    { icon: 'chart', title: "Batafsil Statistika", desc: "Har bir testdan keyin to'liq tahlil" },
    { icon: 'xcircle', title: "Xatolar Daftari", desc: "Noto'g'ri javoblarni avtomatik saqlaydi" },
    { icon: 'trophy', title: "Reyting Jadvali", desc: "Global reytingda o'z o'rningizni biling" },
    { icon: 'moon', title: "Qorong'u Rejim", desc: "Ko'zga qulay qorong'u interfeys" },
];

const renderFeatureIcon = (iconName) => {
    switch (iconName) {
        case 'book': return <BookOpen size={24} className="lucide-icon" />;
        case 'timer': return <Timer size={24} className="lucide-icon" />;
        case 'chart': return <BarChart3 size={24} className="lucide-icon" />;
        case 'xcircle': return <XCircle size={24} className="lucide-icon" />;
        case 'trophy': return <Trophy size={24} className="lucide-icon" />;
        case 'moon': return <Moon size={24} className="lucide-icon" />;
        default: return null;
    }
};

const stats = [
    { value: '500+', label: "Savollar" },
    { value: '90', label: "Savol/Test" },
    { value: '180', label: "Daqiqa" },
    { value: '100%', label: "Bepul" },
];

const testimonials = [
    { name: "Ali Karimov", role: "DTM abituriyenti", text: "TestHub.uz menga DTMga tayyorlanishda juda yordam berdi. Reytingim sezilarli darajada oshdi!", avatar: "AK" },
    { name: "Malika Yusupova", role: "11-sinf o'quvchisi", text: "Har kuni mock test ishlayapman. Savollar haqiqiy DTMga juda o'xshash!", avatar: "MY" },
    { name: "Sardor Raxmatullayev", role: "Repetitor", text: "O'quvchilarim uchun eng yaxshi platforma. Xatolar daftari juda qulay.", avatar: "SR" },
];

const faqs = [
    { q: "TestHub.uz nima?", a: "TestHub.uz - O'zbekiston DTM imtihoniga tayyorlanish uchun mock test platformasi. Haqiqiy DTM uslubidagi 90 savollik testlar bilan mashq qilishingiz mumkin." },
    { q: "Testlar bepulmi?", a: "Ha, barcha asosiy funksiyalar to'liq bepul. Mock testlar, xatolar daftari va statistika barchasi bepul." },
    { q: "Qancha vaqt beriladi?", a: "Har bir mock testda 180 daqiqa (3 soat) vaqt beriladi - bu haqiqiy DTM vaqtiga mos keladi." },
    { q: "Natijalarim saqlanadimi?", a: "Ha, barcha natijalaringiz avtomatik saqlanadi. Statistikangizni istalgan vaqt ko'rishingiz mumkin." },
    { q: "Noto'g'ri javoblar qaerga saqlanadi?", a: "Xatolar daftariga avtomatik saqlanadi. U yerda qayta ko'rib chiqishingiz mumkin." },
];

export default function Landing() {
    return (
        <div className="landing">
            {/* Hero */}
            <section className="landing__hero">
                <div className="hero-bg">
                    <div className="hero-blob hero-blob--1" />
                    <div className="hero-blob hero-blob--2" />
                </div>
                <div className="container">
                    <motion.div
                        className="hero-content"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                    >
                        <motion.div variants={fadeUp} className="hero-badge">
                            <Sparkles size={14} style={{ marginRight: 6 }} /> DTM Mock Test Platformasi
                        </motion.div>
                        <motion.h1 variants={fadeUp}>
                            DTMga eng yaxshi usulda
                            <br />
                            <span className="gradient-text">Tayyorlan!</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="hero-desc">
                            500+ savoldan iborat bank, 90 savollik mock testlar, batafsil statistika va xatolar daftari.
                            Haqiqiy DTM formatida mashq qil — natijangni oshir.
                        </motion.p>
                        <motion.div variants={fadeUp} className="hero-actions">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Boshlash — Bepul
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-lg">
                                Kirish
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hero-card"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="mock-preview">
                            <div className="mock-preview__header">
                                <span className="mock-preview__title-icon"><ClipboardList size={16} /> DTM Mock Test</span>
                                <span className="timer"><Clock size={14} /> 2:45:00</span>
                            </div>
                            <div className="mock-preview__question">
                                <div className="q-num">Savol 23 / 90</div>
                                <p>x² - 5x + 6 = 0 tenglamasining ildizlari yig'indisi nechaga teng?</p>
                                <div className="mock-preview__options">
                                    {['A. 3', 'B. 5 ✓', 'C. -5', 'D. 6'].map((o, i) => (
                                        <div key={i} className={`mock-opt ${i === 1 ? 'selected' : ''}`}>{o}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="mock-preview__footer">
                                <button className="btn btn-ghost btn-sm"><ArrowLeft size={14} /> Oldingi</button>
                                <button className="btn btn-primary btn-sm">Keyingi <ArrowRight size={14} /></button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="landing__stats">
                <div className="container">
                    <div className="stats-row">
                        {stats.map((s, i) => (
                            <motion.div
                                key={i}
                                className="stat-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="stat-item__value">{s.value}</div>
                                <div className="stat-item__label">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="landing__features" id="features">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Platforma imkoniyatlari</h2>
                        <p>DTMga tayyorlanish uchun kerakli barcha vositalar</p>
                    </motion.div>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                className="feature-card"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className="feature-card__icon">{renderFeatureIcon(f.icon)}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="landing__testimonials">
                <div className="container">
                    <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2>Foydalanuvchilar fikri</h2>
                    </motion.div>
                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                className="testimonial-card"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <p>"{t.text}"</p>
                                <div className="testimonial-card__author">
                                    <div className="author-avatar">{t.avatar}</div>
                                    <div>
                                        <div className="author-name">{t.name}</div>
                                        <div className="author-role">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="landing__faq" id="faq">
                <div className="container">
                    <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2>Ko'p so'raladigan savollar</h2>
                    </motion.div>
                    <div className="faq-list">
                        {faqs.map((f, i) => (
                            <motion.details
                                key={i}
                                className="faq-item"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                            >
                                <summary>{f.q}</summary>
                                <p>{f.a}</p>
                            </motion.details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="landing__cta">
                <div className="container">
                    <motion.div
                        className="cta-box"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Bugun boshla!</h2>
                        <p>Minglab abituriyentlar bilan birga DTMga tayyorlan</p>
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Bepul Ro'yxatdan O'tish
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing__footer">
                <div className="container">
                    <div className="footer-inner">
                        <div className="footer-brand">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 18, color: 'var(--primary)' }}>
                                <img src={logo} alt="TestHub Logo" className="logo-img" />TestHub.uz
                            </div>
                            <p>DTM Mock Test Platformasi</p>
                        </div>
                        <div className="footer-links">
                            <Link to="/login">Kirish</Link>
                            <Link to="/register">Ro'yxatdan o'tish</Link>
                        </div>
                    </div>
                    <div className="footer-copy">
                        © {new Date().getFullYear()} TestHub.uz. Barcha huquqlar himoyalangan.
                    </div>
                </div>
            </footer>
        </div>
    );
}
