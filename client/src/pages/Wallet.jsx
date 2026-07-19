import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowDownRight, ArrowUpRight, Search, Filter, History } from 'lucide-react';
import api from '../utils/api';
import './Wallet.scss';

export default function Wallet() {
    const [transactions, setTransactions] = useState([]);
    const [coins, setCoins] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const { data } = await api.get('/gamification/wallet');
                setTransactions(data.transactions);
                setCoins(data.coins);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, []);

    const filteredTransactions = transactions.filter(t => {
        if (filter !== 'all' && t.type !== filter) return false;
        if (searchQuery && !t.reason.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('uz-UZ', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    if (loading) return <div className="loading-screen"><div className="spinner-primary" /></div>;

    return (
        <div className="page container wallet-page">
            <motion.div
                className="wallet-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="balance-card">
                    <div className="balance-card__icon">
                        <Coins size={32} />
                    </div>
                    <div>
                        <p className="balance-card__label">Mavjud tangalar</p>
                        <h1 className="balance-card__amount">{coins}</h1>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="wallet-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="wallet-content__header">
                    <h2><History size={20} /> Tranzaksiyalar tarixi</h2>

                    <div className="wallet-controls">
                        <div className="search-box">
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-box">
                            <Filter size={16} />
                            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="all">Barchasi</option>
                                <option value="earn">Kirimlar</option>
                                <option value="spend">Chiqimlar</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="transactions-list">
                    {filteredTransactions.length === 0 ? (
                        <div className="empty-state">
                            <Coins size={48} className="empty-state__icon" />
                            <p>Tranzaksiyalar topilmadi</p>
                        </div>
                    ) : (
                        filteredTransactions.map((tx, i) => (
                            <motion.div
                                key={tx._id}
                                className="transaction-item"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <div className={`transaction-icon ${tx.type === 'earn' ? 'earn' : 'spend'}`}>
                                    {tx.type === 'earn' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                </div>
                                <div className="transaction-info">
                                    <h4>{tx.reason}</h4>
                                    <span>{formatDate(tx.createdAt)}</span>
                                </div>
                                <div className={`transaction-amount ${tx.type === 'earn' ? 'earn' : 'spend'}`}>
                                    {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}
