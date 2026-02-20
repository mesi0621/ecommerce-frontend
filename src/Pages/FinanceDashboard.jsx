import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/FinanceDashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const FinanceDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isFinance, getDisplayName, logout } = useAuth();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState('overview');
    const [transactions, setTransactions] = useState([]);
    const [salesReport, setSalesReport] = useState(null);
    const [commissionsReport, setCommissionsReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPayout, setSelectedPayout] = useState(null);
    const [showPayoutModal, setShowPayoutModal] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !isFinance()) {
            toast.error('Access denied. Finance staff only.');
            navigate('/');
            return;
        }

        fetchData();
    }, [isAuthenticated, isFinance, navigate, toast, activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('auth-token');

            if (activeTab === 'overview' || activeTab === 'reports') {
                await Promise.all([
                    fetchSalesReport(token),
                    fetchCommissionsReport(token)
                ]);
            }

            if (activeTab === 'transactions') {
                await fetchTransactions(token);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/finance/transactions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                setTransactions(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transactions');
        }
    };

    const fetchSalesReport = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/finance/reports/sales', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                setSalesReport(data.data);
            }
        } catch (error) {
            console.error('Error fetching sales report:', error);
        }
    };

    const fetchCommissionsReport = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/finance/reports/commissions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                setCommissionsReport(data.data);
            }
        } catch (error) {
            console.error('Error fetching commissions report:', error);
        }
    };

    const handleProcessPayout = async (sellerId, amount) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/finance/payouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sellerId, amount })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Payout processed successfully');
                setShowPayoutModal(false);
                fetchData();
            } else {
                toast.error(data.error || 'Failed to process payout');
            }
        } catch (error) {
            console.error('Error processing payout:', error);
            toast.error('Failed to process payout');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return `$${amount?.toFixed(2) || '0.00'}`;
    };

    if (loading) {
        return (
            <div className="finance-dashboard">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="finance-dashboard">
            <div className="finance-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-icon">💰</div>
                    <h2>Finance Portal</h2>
                    <p className="user-name">{getDisplayName()}</p>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Overview</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('transactions')}
                    >
                        <span className="nav-icon">💳</span>
                        <span>Transactions</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        <span className="nav-icon">📈</span>
                        <span>Reports</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'payouts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('payouts')}
                    >
                        <span className="nav-icon">💸</span>
                        <span>Payouts</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <span className="nav-icon">👤</span>
                        <span>Profile</span>
                    </button>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span>
                    <span>Logout</span>
                </button>
            </div>

            <div className="finance-main">
                <div className="dashboard-header">
                    <h1>Finance Dashboard</h1>
                    <button className="refresh-btn" onClick={fetchData}>
                        🔄 Refresh
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">💵</div>
                                <div className="stat-content">
                                    <h3>{formatCurrency(salesReport?.totalRevenue)}</h3>
                                    <p>Total Revenue</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🛒</div>
                                <div className="stat-content">
                                    <h3>{salesReport?.totalOrders || 0}</h3>
                                    <p>Total Orders</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <h3>{formatCurrency(commissionsReport?.totalCommission)}</h3>
                                    <p>Platform Commission</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-content">
                                    <h3>{formatCurrency(salesReport?.averageOrderValue)}</h3>
                                    <p>Avg Order Value</p>
                                </div>
                            </div>
                        </div>

                        <div className="overview-section">
                            <h2>Financial Summary</h2>
                            <div className="summary-grid">
                                <div className="summary-card">
                                    <h3>Sales Overview</h3>
                                    <div className="summary-item">
                                        <span>Total Sales:</span>
                                        <strong>{formatCurrency(salesReport?.totalRevenue)}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>Total Orders:</span>
                                        <strong>{salesReport?.totalOrders || 0}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>Average Order:</span>
                                        <strong>{formatCurrency(salesReport?.averageOrderValue)}</strong>
                                    </div>
                                </div>

                                <div className="summary-card">
                                    <h3>Commission Overview</h3>
                                    <div className="summary-item">
                                        <span>Total Commission:</span>
                                        <strong>{formatCurrency(commissionsReport?.totalCommission)}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>Pending Payouts:</span>
                                        <strong>{formatCurrency(commissionsReport?.pendingPayouts)}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>Completed Payouts:</span>
                                        <strong>{formatCurrency(commissionsReport?.completedPayouts)}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'transactions' && (
                    <div className="transactions-section">
                        <h2>All Transactions</h2>
                        {transactions.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">💳</div>
                                <h3>No Transactions</h3>
                                <p>There are no transactions to display</p>
                            </div>
                        ) : (
                            <div className="transactions-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                            <th>Payment Method</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction) => (
                                            <tr key={transaction._id}>
                                                <td>{formatDate(transaction.createdAt)}</td>
                                                <td>#{transaction.orderId?.orderNumber || 'N/A'}</td>
                                                <td>{transaction.userId?.username || 'Unknown'}</td>
                                                <td>{formatCurrency(transaction.amount)}</td>
                                                <td>{transaction.paymentMethod?.replace('_', ' ').toUpperCase()}</td>
                                                <td>
                                                    <span className={`status-badge ${transaction.status}`}>
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="reports-section">
                        <h2>Financial Reports</h2>

                        <div className="report-card">
                            <h3>Sales Report</h3>
                            <div className="report-content">
                                <div className="report-item">
                                    <span className="report-label">Total Revenue:</span>
                                    <span className="report-value">{formatCurrency(salesReport?.totalRevenue)}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Total Orders:</span>
                                    <span className="report-value">{salesReport?.totalOrders || 0}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Average Order Value:</span>
                                    <span className="report-value">{formatCurrency(salesReport?.averageOrderValue)}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Completed Orders:</span>
                                    <span className="report-value">{salesReport?.completedOrders || 0}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Pending Orders:</span>
                                    <span className="report-value">{salesReport?.pendingOrders || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="report-card">
                            <h3>Commission Report</h3>
                            <div className="report-content">
                                <div className="report-item">
                                    <span className="report-label">Total Commission Earned:</span>
                                    <span className="report-value">{formatCurrency(commissionsReport?.totalCommission)}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Pending Payouts:</span>
                                    <span className="report-value">{formatCurrency(commissionsReport?.pendingPayouts)}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Completed Payouts:</span>
                                    <span className="report-value">{formatCurrency(commissionsReport?.completedPayouts)}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Active Sellers:</span>
                                    <span className="report-value">{commissionsReport?.activeSellers || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'payouts' && (
                    <div className="payouts-section">
                        <h2>Seller Payouts</h2>
                        <div className="empty-state">
                            <div className="empty-icon">💸</div>
                            <h3>Payout Management</h3>
                            <p>Process seller payouts and view payout history</p>
                            <button className="action-btn" onClick={() => setShowPayoutModal(true)}>
                                Process New Payout
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <h2>Profile Information</h2>
                        <div className="profile-card">
                            <div className="profile-avatar">👤</div>
                            <div className="profile-info">
                                <h3>{getDisplayName()}</h3>
                                <p className="profile-role">Finance Staff</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showPayoutModal && (
                <>
                    <div className="modal-overlay" onClick={() => setShowPayoutModal(false)} />
                    <div className="payout-modal">
                        <div className="modal-header">
                            <h2>Process Payout</h2>
                            <button className="close-modal" onClick={() => setShowPayoutModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <p>Payout processing feature coming soon...</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FinanceDashboard;
