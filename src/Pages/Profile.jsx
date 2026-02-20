import React, { useState, useEffect } from 'react';
import './CSS/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchUserData();
        fetchOrders();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await fetch('http://localhost:5000/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setUser(data.data);
                setFormData({
                    username: data.data.username,
                    email: data.data.email,
                    phone: data.data.phone || '',
                    address: data.data.address || ''
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert('Profile updated successfully!');
                setEditMode(false);
                fetchUserData();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: 'Customer requested cancellation' })
            });

            const data = await response.json();
            if (data.success) {
                alert('Order cancelled successfully!');
                fetchOrders();
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        window.location.href = '/';
    };

    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }

    if (!user) {
        return <div className="profile-error">Please login to view your profile</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <div className="profile-user-info">
                    <div className="profile-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                </div>
                <nav className="profile-nav">
                    <button
                        className={activeTab === 'profile' ? 'active' : ''}
                        onClick={() => setActiveTab('profile')}
                    >
                        👤 My Profile
                    </button>
                    <button
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={() => setActiveTab('orders')}
                    >
                        📦 My Orders
                    </button>
                    {user.role === 'admin' && (
                        <button
                            className={activeTab === 'admin' ? 'active' : ''}
                            onClick={() => window.location.href = '/admin'}
                        >
                            ⚙️ Admin Dashboard
                        </button>
                    )}
                    <button onClick={handleLogout} className="logout-btn">
                        🚪 Logout
                    </button>
                </nav>
            </div>

            <div className="profile-content">
                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>My Profile</h2>
                            {!editMode && (
                                <button onClick={() => setEditMode(true)} className="edit-btn">
                                    ✏️ Edit Profile
                                </button>
                            )}
                        </div>

                        {editMode ? (
                            <form onSubmit={handleUpdateProfile} className="profile-form">
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="save-btn">Save Changes</button>
                                    <button type="button" onClick={() => setEditMode(false)} className="cancel-btn">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-details">
                                <div className="detail-item">
                                    <label>Username:</label>
                                    <span>{user.username}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Email:</label>
                                    <span>{user.email}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Role:</label>
                                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Account Status:</label>
                                    <span className={user.isActive ? 'status-active' : 'status-inactive'}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Member Since:</label>
                                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="orders-section">
                        <h2>My Orders</h2>
                        {orders.length === 0 ? (
                            <div className="no-orders">
                                <p>You haven't placed any orders yet.</p>
                                <button onClick={() => window.location.href = '/'}>
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order._id} className="order-card">
                                        <div className="order-header">
                                            <div>
                                                <h3>Order #{order.orderNumber}</h3>
                                                <p className="order-date">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="order-status-badges">
                                                <span className={`status-badge ${order.orderStatus}`}>
                                                    {order.orderStatus}
                                                </span>
                                                <span className={`payment-badge ${order.paymentStatus}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="order-items">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="order-item">
                                                    <img src={item.image} alt={item.name} />
                                                    <div className="item-details">
                                                        <p className="item-name">{item.name}</p>
                                                        <p className="item-quantity">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="item-price">${item.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="order-footer">
                                            <div className="order-total">
                                                <span>Total:</span>
                                                <strong>${order.total.toFixed(2)}</strong>
                                            </div>
                                            {order.orderStatus === 'pending' && (
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="cancel-order-btn"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
