import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { CheckCircle, AlertCircle, Loader, ExternalLink, Target, Send, Zap } from 'lucide-react';
import './Tasks.scss';

export default function Tasks() {
    const { user, updateUser } = useAuth(); // Assume we might need to update user context
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claimLoading, setClaimLoading] = useState(null);
    const [tgVerifying, setTgVerifying] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const { data } = await api.get('/results/stats/me');
                setStats(data.stats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const tasks = [
        {
            id: 'tg_channel',
            title: "Telegram Kanal",
            desc: "Bizning rasmiy @testhub kanalimizga a'zo bo'ling.",
            reward: 50,
            type: 'telegram',
            icon: <Send size={24} />
        },
        {
            id: 'tg_group',
            title: "Telegram Guruh",
            desc: "Talabalar hamjamiyatiga qo'shiling.",
            reward: 50,
            type: 'telegram',
            icon: <Send size={24} />
        },
        {
            id: 'mock_1',
            title: "Ilk qadam",
            desc: "Birinchi DTM mock testini topshiring.",
            reward: 100,
            type: 'system',
            check: () => stats?.totalMocks >= 1,
            progress: `${Math.min(stats?.totalMocks || 0, 1)} / 1`,
            icon: <Target size={24} />
        },
        {
            id: 'mock_5',
            title: "Tajribali olg'a",
            desc: "5 ta mock testni yakunlang.",
            reward: 200,
            type: 'system',
            check: () => stats?.totalMocks >= 5,
            progress: `${Math.min(stats?.totalMocks || 0, 5)} / 5`,
            icon: <Target size={24} />
        },
        {
            id: 'streak_3',
            title: "Odatga aylantirish",
            desc: "3 kunlik ketma-ketlik ulanishini bajaring (3-Day Streak).",
            reward: 150,
            type: 'system',
            check: () => user?.streak?.current >= 3,
            progress: `${Math.min(user?.streak?.current || 0, 3)} / 3`,
            icon: <Zap size={24} />
        }
    ];

    const hasCompleted = (id) => user?.completedTasks?.includes(id);

    const handleAction = async (task) => {
        if (task.type === 'telegram') {
            if (tgVerifying !== task.id) {
                // Phase 1: Click "Join". Opens window, then simulates verification
                window.open('https://t.me', '_blank');
                setTgVerifying(task.id);
            } else {
                // Phase 2: Claim
                await processClaim(task);
            }
        } else if (task.type === 'system') {
            await processClaim(task);
        }
    };

    const processClaim = async (task) => {
        setClaimLoading(task.id);
        try {
            const { data } = await api.post('/gamification/tasks/claim', {
                taskId: task.id,
                reward: task.reward,
                title: task.title
            });
            // Update local user context to reflect the new coins and completed task
            const newCompletedTasks = [...(user.completedTasks || []), task.id];
            updateUser({ ...user, coins: data.coins, completedTasks: newCompletedTasks });
        } catch (error) {
            alert(error.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setClaimLoading(null);
        }
    };

    if (loading) return <div className="loading-screen"><div className="spinner-primary" /></div>;

    return (
        <div className="page container tasks-page">
            <div className="tasks-header">
                <h1>Vazifalar Markazi</h1>
                <p>Tangalar ishlab olish uchun quyidagi vazifalarni bajaring. Tangalarni keyinchalik qimmatbaho mukofotlarga almashtirishingiz mumkin.</p>
            </div>

            <div className="tasks-grid">
                {tasks.map((task, i) => {
                    const completed = hasCompleted(task.id);
                    let canClaim = false;
                    let actionText = '';
                    let actionClass = 'btn-primary';

                    if (completed) {
                        actionText = 'Bajarildi';
                        actionClass = 'btn-outline';
                    } else if (task.type === 'telegram') {
                        if (tgVerifying === task.id) {
                            canClaim = true;
                            actionText = "Tekshirish va Olish";
                            actionClass = 'btn-success';
                        } else {
                            canClaim = true; // Can click to start process
                            actionText = "Ulanish";
                        }
                    } else if (task.type === 'system') {
                        const isSatisfied = task.check();
                        if (isSatisfied) {
                            canClaim = true;
                            actionText = "Mukofotni Olish";
                            actionClass = 'btn-success';
                        } else {
                            canClaim = false;
                            actionText = "Bajarilmoqda";
                            actionClass = 'btn-disabled';
                        }
                    }

                    return (
                        <motion.div
                            key={task.id}
                            className={`task-card ${completed ? 'completed' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="task-card__icon">
                                {task.icon}
                            </div>
                            <div className="task-card__body">
                                <h3>{task.title}</h3>
                                <p>{task.desc}</p>

                                {task.type === 'system' && !completed && (
                                    <div className="task-progress">
                                        Holat: <strong>{task.progress}</strong>
                                    </div>
                                )}
                            </div>

                            <div className="task-card__action">
                                <div className="reward-badge">+{task.reward} Tanga</div>

                                <button
                                    className={`btn ${actionClass}`}
                                    onClick={() => handleAction(task)}
                                    disabled={!canClaim || completed || claimLoading === task.id}
                                    style={!canClaim && !completed ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                                >
                                    {claimLoading === task.id ? (
                                        <div className="spinner-light" style={{ width: 16, height: 16, borderWidth: 2 }} />
                                    ) : completed ? (
                                        <><CheckCircle size={16} /> Bajarildi</>
                                    ) : actionText}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
