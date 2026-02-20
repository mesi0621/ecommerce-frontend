import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/DeliveryDashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const DeliveryDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isDelivery, getDisplayName, logout } = useAuth();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState('deliveries');
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Check authentication and role
        if (!isAuthenticated || !isDelivery()) {
            toast.error('Access denied. Delivery staff only.');
            navigate('/');
            return;
        }

        fetchDeliveries();
    }, [isAuthenticated, isDelivery, navigate, toast]);

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/delivery/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setDeliveries(data.data || []);
            } else {
                toast.error('Failed to load deliveries');
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            toast.error('Failed to load deliveries');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/delivery/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Delivery status updated');
                fetchDeliveries();
                if (selectedDelivery?._id === orderId) {
                    setShowDetails(false);
                    setSelectedDelivery(null);
                }
            } else {
                toast.error(data.error || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleViewDetails = (delivery) => {
        setSelectedDelivery(delivery);
        setShowDetails(true);
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

    const getStatusColor = (status) => {
        const colors = {
            pending: '#ffa500',
            assigned: '#2196f3',
            in_transit: '#9c27b0',
            delivered: '#4caf50',
            cancelled: '#f44336'
        };
        return colors[status] || '#757575';
    };

    const getDeliveryStats = () => {
        const stats = {
            total: deliveries.length,
            pending: deliveries.filter(d => d.orderStatus === 'pending' || d.orderStatus === 'assigned').length,
            in_transit: deliveries.filter(d => d.orderStatus === 'in_transit').length,
            delivered: deliveries.filter(d => d.orderStatus === 'delivered').length
        };
        return stats;
    };

    const stats = getDeliveryStats();

    if (loading) {
        return (
            <div className="delivery-dashboard">
                <div className="loading">Loading deliveries...</div>
            </div>
        );
    }

    return (
        <div className="delivery-dashboard">
            {/* Sidebar */}
            <div className="delivery-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-icon">🚚</div>
                    <h2>Delivery Portal</h2>
                    <p className="user-name">{getDisplayName()}</p>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'deliveries' ? 'active' : ''}`}
                        onClick={() => setActiveTab('deliveries')}
                    >
                        <span className="nav-icon">📦</span>
                        <span>My Deliveries</span>
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

            {/* Main Content */}
            <div className="delivery-main">
                <div className="dashboard-header">
                    <h1>Delivery Dashboard</h1>
                    <button className="refresh-btn" onClick={fetchDeliveries}>
                        🔄 Refresh
                    </button>
                </div>

                {activeTab === 'deliveries' && (
                    <>
                        {/* Statistics */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📦</div>
                                <div className="stat-content">
                                    <h3>{stats.total}</h3>
                                    <p>Total Deliveries</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⏳</div>
                                <div className="stat-content">
                                    <h3>{stats.pending}</h3>
                                    <p>Pending</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🚚</div>
                                <div className="stat-content">
                                    <h3>{stats.in_transit}</h3>
                                    <p>In Transit</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✅</div>
                                <div className="stat-content">
                                    <h3>{stats.delivered}</h3>
                                    <p>Delivered</p>
                                </div>
                            </div>
                        </div>

                        {/* Deliveries List */}
                        <div className="deliveries-section">
                            <h2>Assigned Deliveries</h2>
                            {deliveries.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📭</div>
                                    <h3>No Deliveries Assigned</h3>
                                    <p>You don't have any deliveries assigned yet</p>
                                </div>
                            ) : (
                                <div className="deliveries-list">
                                    {deliveries.map((delivery) => (
                                        <div key={delivery._id} className="delivery-card">
                                            <div className="delivery-header">
                                                <div className="delivery-info">
                                                    <h3>Order #{delivery.orderNumber}</h3>
                                                    <p className="delivery-date">{formatDate(delivery.createdAt)}</p>
                                                </div>
                                                <span
                                                    className="delivery-status"
                                                    style={{ backgroundColor: getStatusColor(delivery.orderStatus) }}
                                                >
                                                    {delivery.orderStatus.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="delivery-details">
                                                <div className="detail-row">
                                                    <span className="detail-label">📍 Address:</span>
                                                    <span className="detail-value">
                                                        {delivery.shippingAddress?.address}, {delivery.shippingAddress?.city}
                                                    </span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">📞 Phone:</span>
                                                    <span className="detail-value">{delivery.shippingAddress?.phone}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">👤 Customer:</span>
                                                    <span className="detail-value">{delivery.shippingAddress?.fullName}</span>
                                                </div>
                                                <div className="detail-row">
                                                    <span className="detail-label">📦 Items:</span>
                                                    <span className="detail-value">{delivery.items?.length || 0} items</span>
                                                </div>
                                            </div>

                                            <div className="delivery-actions">
                                                <button
                                                    className="view-btn"
                                                    onClick={() => handleViewDetails(delivery)}
                                                >
                                                    View Details
                                                </button>
                                                {delivery.orderStatus !== 'delivered' && delivery.orderStatus !== 'cancelled' && (
                                                    <>
                                                        {delivery.orderStatus === 'pending' || delivery.orderStatus === 'assigned' ? (
                                                            <button
                                                                className="action-btn start-btn"
                                                                onClick={() => handleUpdateStatus(delivery._id, 'in_transit')}
                                                            >
                                                                Start Delivery
                                                            </button>
                                                        ) : null}
                                                        {delivery.orderStatus === 'in_transit' && (
                                                            <button
                                                                className="action-btn complete-btn"
                                                                onClick={() => handleUpdateStatus(delivery._id, 'delivered')}
                                                            >
                                                                Mark as Delivered
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <h2>Profile Information</h2>
                        <div className="profile-card">
                            <div className="profile-avatar">👤</div>
                            <div className="profile-info">
                                <h3>{getDisplayName()}</h3>
                                <p className="profile-role">Delivery Staff</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetails && selectedDelivery && (
                <>
                    <div className="modal-overlay" onClick={() => setShowDetails(false)} />
                    <div className="details-modal">
                        <div className="modal-header">
                            <h2>Order #{selectedDelivery.orderNumber}</h2>
                            <button className="close-modal" onClick={() => setShowDetails(false)}>
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="modal-section">
                                <h3>Delivery Address</h3>
                                <p><strong>Name:</strong> {selectedDelivery.shippingAddress?.fullName}</p>
                                <p><strong>Phone:</strong> {selectedDelivery.shippingAddress?.phone}</p>
                                <p><strong>Address:</strong> {selectedDelivery.shippingAddress?.address}</p>
                                <p><strong>City:</strong> {selectedDelivery.shippingAddress?.city}</p>
                                <p><strong>Region:</strong> {selectedDelivery.shippingAddress?.region}</p>
                                {selectedDelivery.shippingAddress?.postalCode && (
                                    <p><strong>Postal Code:</strong> {selectedDelivery.shippingAddress.postalCode}</p>
                                )}
                            </div>

                            <div className="modal-section">
                                <h3>Order Items</h3>
                                <div className="items-list">
                                    {selectedDelivery.items?.map((item, index) => (
                                        <div key={index} className="item-row">
                                            <img src={item.image} alt={item.name} className="item-image" />
                                            <div className="item-info">
                                                <p className="item-name">{item.name}</p>
                                                <p className="item-quantity">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Order Information</h3>
                                <p><strong>Order Date:</strong> {formatDate(selectedDelivery.createdAt)}</p>
                                <p><strong>Payment Method:</strong> {selectedDelivery.paymentMethod?.replace('_', ' ').toUpperCase()}</p>
                                <p><strong>Total Amount:</strong> ${selectedDelivery.total?.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DeliveryDashboard;
