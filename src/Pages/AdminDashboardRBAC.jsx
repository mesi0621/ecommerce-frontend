import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminOnly } from '../Components/PermissionGuard';
import './CSS/AdminDashboardRBAC.css';

const AdminDashboardRBAC = () => {
    const navigate = useNavigate();
    const { user, role, isAdmin, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        pendingProducts: 0,
        revenue: 0
    });

    // Data states
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Redirect if not admin
        if (!isAdmin()) {
            navigate('/');
            return;
        }

        fetchDashboardData();
    }, [activeTab, isAdmin, navigate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                await fetchStats();
            } else if (activeTab === 'users') {
                await fetchUsers();
            } else if (activeTab === 'products') {
                await fetchPendingProducts();
            } else if (activeTab === 'orders') {
                await fetchOrders();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('auth-token');

            // Fetch users count
            const usersRes = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = await usersRes.json();

            // Fetch products count
            const productsRes = await fetch('http://localhost:5000/api/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const productsData = await productsRes.json();

            // Fetch pending products
            const pendingRes = await fetch('http://localhost:5000/api/products/admin/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const pendingData = await pendingRes.json();

            // Fetch orders
            const ordersRes = await fetch('http://localhost:5000/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const ordersData = await ordersRes.json();

            setStats({
                totalUsers: usersData.success ? usersData.data.length : 0,
                totalProducts: productsData.success ? productsData.data.length : 0,
                totalOrders: ordersData.success ? ordersData.data.length : 0,
                pendingProducts: pendingData.success ? pendingData.data.length : 0,
                revenue: ordersData.success ? ordersData.data.reduce((sum, order) => sum + (order.total || 0), 0) : 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchPendingProducts = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/products/admin/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleApproveProduct = async (productId) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/products/${productId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                alert('Product approved successfully!');
                fetchPendingProducts();
                fetchStats();
            } else {
                alert(data.error || 'Failed to approve product');
            }
        } catch (error) {
            console.error('Error approving product:', error);
            alert('Failed to approve product');
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            });
            const data = await response.json();
            if (data.success) {
                alert('User role updated successfully!');
                fetchUsers();
            } else {
                alert(data.error || 'Failed to change user role');
            }
        } catch (error) {
            console.error('Error changing role:', error);
            alert('Failed to change user role');
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                alert('Order status updated successfully!');
                fetchOrders();
            } else {
                alert(data.error || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    return (
        <AdminOnly fallback="/">
            <div className="admin-dashboard-rbac">
                {/* Sidebar */}
                <div className="admin-sidebar-rbac">
                    <div className="admin-header">
                        <h2>Admin Panel</h2>
                        <div className="admin-user-info">
                            <p className="admin-username">{user?.username || user?.email}</p>
                            <span className="admin-role-badge">{role}</span>
                        </div>
                    </div>

                    <nav className="admin-nav-rbac">
                        <button
                            className={activeTab === 'overview' ? 'active' : ''}
                            onClick={() => setActiveTab('overview')}
                        >
                            <span className="nav-icon">📊</span>
                            <span className="nav-text">Overview</span>
                        </button>
                        <button
                            className={activeTab === 'users' ? 'active' : ''}
                            onClick={() => setActiveTab('users')}
                        >
                            <span className="nav-icon">👥</span>
                            <span className="nav-text">Users</span>
                        </button>
                        <button
                            className={activeTab === 'products' ? 'active' : ''}
                            onClick={() => setActiveTab('products')}
                        >
                            <span className="nav-icon">⏳</span>
                            <span className="nav-text">Pending Products</span>
                        </button>
                        <button
                            className={activeTab === 'orders' ? 'active' : ''}
                            onClick={() => setActiveTab('orders')}
                        >
                            <span className="nav-icon">🛒</span>
                            <span className="nav-text">Orders</span>
                        </button>

                        <div className="nav-divider"></div>

                        <button onClick={() => navigate('/profile')}>
                            <span className="nav-icon">👤</span>
                            <span className="nav-text">My Profile</span>
                        </button>
                        <button onClick={() => navigate('/')}>
                            <span className="nav-icon">🏠</span>
                            <span className="nav-text">Back to Shop</span>
                        </button>
                        <button onClick={logout} className="logout-btn">
                            <span className="nav-icon">🚪</span>
                            <span className="nav-text">Logout</span>
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="admin-content-rbac">
                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <>
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="overview-section">
                                    <h1>Dashboard Overview</h1>
                                    <div className="stats-grid">
                                        <div className="stat-card">
                                            <div className="stat-icon">👥</div>
                                            <div className="stat-info">
                                                <h3>{stats.totalUsers}</h3>
                                                <p>Total Users</p>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon">📦</div>
                                            <div className="stat-info">
                                                <h3>{stats.totalProducts}</h3>
                                                <p>Total Products</p>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon">🛒</div>
                                            <div className="stat-info">
                                                <h3>{stats.totalOrders}</h3>
                                                <p>Total Orders</p>
                                            </div>
                                        </div>
                                        <div className="stat-card warning">
                                            <div className="stat-icon">⏳</div>
                                            <div className="stat-info">
                                                <h3>{stats.pendingProducts}</h3>
                                                <p>Pending Approvals</p>
                                            </div>
                                        </div>
                                        <div className="stat-card highlight">
                                            <div className="stat-icon">💰</div>
                                            <div className="stat-info">
                                                <h3>{stats.revenue.toFixed(2)} ETB</h3>
                                                <p>Total Revenue</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="quick-actions">
                                        <h2>Quick Actions</h2>
                                        <div className="action-buttons">
                                            <button onClick={() => setActiveTab('users')} className="action-btn">
                                                Manage Users
                                            </button>
                                            <button onClick={() => setActiveTab('products')} className="action-btn">
                                                Approve Products
                                            </button>
                                            <button onClick={() => setActiveTab('orders')} className="action-btn">
                                                View Orders
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <div className="users-section">
                                    <h1>User Management</h1>
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Username</th>
                                                    <th>Email</th>
                                                    <th>Current Role</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="no-data">No users found</td>
                                                    </tr>
                                                ) : (
                                                    users.map((user) => (
                                                        <tr key={user._id}>
                                                            <td>{user.username}</td>
                                                            <td>{user.email}</td>
                                                            <td>
                                                                <span className={`role-badge ${user.role}`}>
                                                                    {user.role}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={user.isActive ? 'status-active' : 'status-inactive'}>
                                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <select
                                                                    value={user.role}
                                                                    onChange={(e) => handleChangeRole(user._id, e.target.value)}
                                                                    className="role-select"
                                                                >
                                                                    <option value="customer">Customer</option>
                                                                    <option value="seller">Seller</option>
                                                                    <option value="admin">Admin</option>
                                                                    <option value="delivery">Delivery</option>
                                                                    <option value="support">Support</option>
                                                                    <option value="finance">Finance</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Products Tab */}
                            {activeTab === 'products' && (
                                <div className="products-section">
                                    <h1>Pending Product Approvals</h1>
                                    <div className="products-grid">
                                        {products.length === 0 ? (
                                            <p className="no-data">No pending products</p>
                                        ) : (
                                            products.map((product) => (
                                                <div key={product._id} className="product-card">
                                                    <img src={product.image} alt={product.name} />
                                                    <div className="product-info">
                                                        <h3>{product.name}</h3>
                                                        <p className="product-category">{product.category}</p>
                                                        <p className="product-price">{product.new_price} ETB</p>
                                                        {product.sellerId && (
                                                            <p className="product-seller">
                                                                Seller: {product.sellerId.businessName || 'Unknown'}
                                                            </p>
                                                        )}
                                                        <button
                                                            onClick={() => handleApproveProduct(product.id)}
                                                            className="approve-btn"
                                                        >
                                                            ✓ Approve Product
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className="orders-section">
                                    <h1>Order Management</h1>
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Order #</th>
                                                    <th>Customer</th>
                                                    <th>Total</th>
                                                    <th>Status</th>
                                                    <th>Payment</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className="no-data">No orders found</td>
                                                    </tr>
                                                ) : (
                                                    orders.map((order) => (
                                                        <tr key={order._id}>
                                                            <td>{order.orderNumber}</td>
                                                            <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                                                            <td>{order.total} ETB</td>
                                                            <td>
                                                                <span className={`status-badge ${order.orderStatus}`}>
                                                                    {order.orderStatus}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={`payment-badge ${order.paymentStatus}`}>
                                                                    {order.paymentStatus}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <select
                                                                    value={order.orderStatus}
                                                                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                                    className="status-select"
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="confirmed">Confirmed</option>
                                                                    <option value="processing">Processing</option>
                                                                    <option value="shipped">Shipped</option>
                                                                    <option value="delivered">Delivered</option>
                                                                    <option value="cancelled">Cancelled</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminOnly>
    );
};

export default AdminDashboardRBAC;
