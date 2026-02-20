import React, { useState, useEffect } from 'react';
import './CSS/AdminDashboard.css';
import AdminAnalytics from '../Components/AdminAnalytics/AdminAnalytics';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [auditLogs, setAuditLogs] = useState([]);
    const [bankTransfers, setBankTransfers] = useState([]);

    // Form states for adding new items
    const [newProduct, setNewProduct] = useState({
        name: '', category: '', new_price: '', old_price: '', description: '', image: ''
    });
    const [newCoupon, setNewCoupon] = useState({
        code: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxDiscount: '', expiresAt: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        fetchDashboardData();
    }, [activeTab]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth-token');

            if (activeTab === 'overview') {
                await fetchStats();
            } else if (activeTab === 'users') {
                await fetchUsers();
            } else if (activeTab === 'products') {
                await fetchPendingProducts();
            } else if (activeTab === 'allProducts') {
                await fetchAllProducts();
            } else if (activeTab === 'orders') {
                await fetchOrders();
            } else if (activeTab === 'reviews') {
                await fetchReviews();
            } else if (activeTab === 'coupons') {
                await fetchCoupons();
            } else if (activeTab === 'analytics') {
                await fetchAnalytics();
            } else if (activeTab === 'audit') {
                await fetchAuditLogs();
            } else if (activeTab === 'bankTransfers') {
                await fetchBankTransfers();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        // Mock stats - replace with actual API calls
        setStats({
            totalUsers: 150,
            totalProducts: 320,
            totalOrders: 89,
            pendingProducts: 12,
            revenue: 45678
        });
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
            const response = await fetch('http://localhost:5000/api/orders/admin/all', {
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
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    const fetchAllProducts = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setAllProducts(data.data);
            }
        } catch (error) {
            console.error('Error fetching all products:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/reviews/admin/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        }
    };

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/coupons', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setCoupons(data.data);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setCoupons([]);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/admin/analytics', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setAnalytics(data.data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setAnalytics({});
        }
    };

    const fetchAuditLogs = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/admin/audit-logs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setAuditLogs(data.data);
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            setAuditLogs([]);
        }
    };

    const fetchBankTransfers = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/orders/admin/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                // Filter only bank transfer orders with pending payment
                const bankTransferOrders = data.data.filter(
                    order => order.paymentMethod === 'bank_transfer' && order.paymentStatus === 'pending'
                );
                setBankTransfers(bankTransferOrders);
            }
        } catch (error) {
            console.error('Error fetching bank transfers:', error);
            setBankTransfers([]);
        }
    };

    const handleVerifyBankTransfer = async (orderId, verified, notes = '') => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/payments/bank-transfer/verify/${orderId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ verified, notes })
            });
            const data = await response.json();
            if (data.success) {
                alert(verified ? 'Payment verified successfully!' : 'Payment rejected');
                fetchBankTransfers();
            }
        } catch (error) {
            console.error('Error verifying bank transfer:', error);
            alert('Failed to verify payment');
        }
    };

    const viewReceipt = (filename) => {
        const token = localStorage.getItem('auth-token');
        window.open(`http://localhost:5000/api/payments/bank-transfer/receipt/${filename}?token=${token}`, '_blank');
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                alert('Product deleted successfully!');
                fetchAllProducts();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...newProduct, isApproved: true })
            });
            const data = await response.json();
            if (data.success) {
                alert('Product added successfully!');
                setNewProduct({ name: '', category: '', new_price: '', old_price: '', description: '', image: '' });
                fetchAllProducts();
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/coupons', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCoupon)
            });
            const data = await response.json();
            if (data.success) {
                alert('Coupon created successfully!');
                setNewCoupon({ code: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxDiscount: '', expiresAt: '' });
                fetchCoupons();
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            alert('Failed to create coupon');
        }
    };

    const handleDeleteCoupon = async (couponId) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/coupons/${couponId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                alert('Coupon deleted successfully!');
                fetchCoupons();
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
            alert('Failed to delete coupon');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                alert('Review deleted successfully!');
                fetchReviews();
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review');
        }
    };

    const handleToggleUserStatus = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            const data = await response.json();
            if (data.success) {
                alert('User status updated successfully!');
                fetchUsers();
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            alert('Failed to update user status');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <h2>Admin Panel</h2>
                <nav className="admin-nav">
                    <button
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview
                    </button>
                    <button
                        className={activeTab === 'users' ? 'active' : ''}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Users
                    </button>
                    <button
                        className={activeTab === 'allProducts' ? 'active' : ''}
                        onClick={() => setActiveTab('allProducts')}
                    >
                        📦 All Products
                    </button>
                    <button
                        className={activeTab === 'products' ? 'active' : ''}
                        onClick={() => setActiveTab('products')}
                    >
                        ⏳ Pending Products
                    </button>
                    <button
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={() => setActiveTab('orders')}
                    >
                        🛒 Orders
                    </button>
                    <button
                        className={activeTab === 'bankTransfers' ? 'active' : ''}
                        onClick={() => setActiveTab('bankTransfers')}
                    >
                        🏦 Bank Transfers
                    </button>
                    <button
                        className={activeTab === 'reviews' ? 'active' : ''}
                        onClick={() => setActiveTab('reviews')}
                    >
                        ⭐ Reviews
                    </button>
                    <button
                        className={activeTab === 'coupons' ? 'active' : ''}
                        onClick={() => setActiveTab('coupons')}
                    >
                        🎟️ Coupons
                    </button>
                    <button
                        className={activeTab === 'analytics' ? 'active' : ''}
                        onClick={() => setActiveTab('analytics')}
                    >
                        📈 Analytics
                    </button>
                    <button
                        className={activeTab === 'audit' ? 'active' : ''}
                        onClick={() => setActiveTab('audit')}
                    >
                        📋 Audit Logs
                    </button>
                    <button onClick={() => window.location.href = '/profile'}>
                        👤 My Profile
                    </button>
                    <button onClick={() => window.location.href = '/'}>
                        🏠 Back to Shop
                    </button>
                </nav>
            </div>

            <div className="admin-content">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <div className="overview-section">
                                <h2>Dashboard Overview</h2>
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
                                    <div className="stat-card">
                                        <div className="stat-icon">⏳</div>
                                        <div className="stat-info">
                                            <h3>{stats.pendingProducts}</h3>
                                            <p>Pending Approvals</p>
                                        </div>
                                    </div>
                                    <div className="stat-card highlight">
                                        <div className="stat-icon">💰</div>
                                        <div className="stat-info">
                                            <h3>${stats.revenue}</h3>
                                            <p>Total Revenue</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="users-section">
                                <h2>User Management</h2>
                                <div className="table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
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
                                                        <button
                                                            onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                                                            className={user.isActive ? 'deactivate-btn' : 'activate-btn'}
                                                        >
                                                            {user.isActive ? '🚫 Deactivate' : '✅ Activate'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="products-section">
                                <h2>Pending Product Approvals</h2>
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
                                                    <p className="product-price">${product.new_price}</p>
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

                        {activeTab === 'orders' && (
                            <div className="orders-section">
                                <h2>Order Management</h2>
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
                                            {orders.map((order) => (
                                                <tr key={order._id}>
                                                    <td>{order.orderNumber}</td>
                                                    <td>{order.userId?.username || 'N/A'}</td>
                                                    <td>${order.total.toFixed(2)}</td>
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
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'allProducts' && (
                            <div className="all-products-section">
                                <h2>All Products Management</h2>

                                <div className="add-product-form">
                                    <h3>Add New Product</h3>
                                    <form onSubmit={handleAddProduct}>
                                        <input
                                            type="text"
                                            placeholder="Product Name"
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            required
                                        />
                                        <select
                                            value={newProduct.category}
                                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="men">Men</option>
                                            <option value="women">Women</option>
                                            <option value="kid">Kids</option>
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="New Price"
                                            value={newProduct.new_price}
                                            onChange={(e) => setNewProduct({ ...newProduct, new_price: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Old Price (optional)"
                                            value={newProduct.old_price}
                                            onChange={(e) => setNewProduct({ ...newProduct, old_price: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Image filename (e.g., product_1.png)"
                                            value={newProduct.image}
                                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={newProduct.description}
                                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        />
                                        <button type="submit" className="add-btn">Add Product</button>
                                    </form>
                                </div>

                                <div className="table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allProducts.map((product) => (
                                                <tr key={product.id}>
                                                    <td>{product.id}</td>
                                                    <td>{product.name}</td>
                                                    <td>{product.category}</td>
                                                    <td>${product.new_price}</td>
                                                    <td>{product.stock || 'N/A'}</td>
                                                    <td>
                                                        <span className={product.isApproved ? 'status-active' : 'status-inactive'}>
                                                            {product.isApproved ? 'Approved' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="delete-btn"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="reviews-section">
                                <h2>Review Management</h2>
                                <div className="table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>User</th>
                                                <th>Rating</th>
                                                <th>Comment</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reviews.length === 0 ? (
                                                <tr><td colSpan="6" className="no-data">No reviews found</td></tr>
                                            ) : (
                                                reviews.map((review) => (
                                                    <tr key={review._id}>
                                                        <td>{review.productId?.name || 'N/A'}</td>
                                                        <td>{review.userId?.username || 'N/A'}</td>
                                                        <td>{'⭐'.repeat(review.rating)}</td>
                                                        <td>{review.comment}</td>
                                                        <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleDeleteReview(review._id)}
                                                                className="delete-btn"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'coupons' && (
                            <div className="coupons-section">
                                <h2>Coupon Management</h2>

                                <div className="add-coupon-form">
                                    <h3>Create New Coupon</h3>
                                    <form onSubmit={handleAddCoupon}>
                                        <input
                                            type="text"
                                            placeholder="Coupon Code (e.g., SAVE20)"
                                            value={newCoupon.code}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                            required
                                        />
                                        <select
                                            value={newCoupon.discountType}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Discount Value"
                                            value={newCoupon.discountValue}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Min Purchase Amount"
                                            value={newCoupon.minPurchase}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max Discount (optional)"
                                            value={newCoupon.maxDiscount}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                                        />
                                        <input
                                            type="date"
                                            placeholder="Expiry Date"
                                            value={newCoupon.expiresAt}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                                        />
                                        <button type="submit" className="add-btn">Create Coupon</button>
                                    </form>
                                </div>

                                <div className="table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>Type</th>
                                                <th>Value</th>
                                                <th>Min Purchase</th>
                                                <th>Expires</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {coupons.length === 0 ? (
                                                <tr><td colSpan="7" className="no-data">No coupons found</td></tr>
                                            ) : (
                                                coupons.map((coupon) => (
                                                    <tr key={coupon._id}>
                                                        <td><strong>{coupon.code}</strong></td>
                                                        <td>{coupon.discountType}</td>
                                                        <td>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}</td>
                                                        <td>${coupon.minPurchase || 0}</td>
                                                        <td>{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                                                        <td>
                                                            <span className={coupon.isActive ? 'status-active' : 'status-inactive'}>
                                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleDeleteCoupon(coupon._id)}
                                                                className="delete-btn"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <AdminAnalytics />
                        )}

                        {activeTab === 'bankTransfers' && (
                            <div className="bank-transfers-section">
                                <h2>Bank Transfer Verification</h2>
                                <div className="table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Customer</th>
                                                <th>Amount</th>
                                                <th>Reference Code</th>
                                                <th>Uploaded</th>
                                                <th>Receipt</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bankTransfers.length === 0 ? (
                                                <tr><td colSpan="7" className="no-data">No pending bank transfers</td></tr>
                                            ) : (
                                                bankTransfers.map((order) => (
                                                    <tr key={order._id}>
                                                        <td>{order.orderNumber}</td>
                                                        <td>{order.userId?.username || 'N/A'}</td>
                                                        <td>${order.total.toFixed(2)}</td>
                                                        <td>
                                                            <strong>{order.paymentDetails?.referenceCode || 'N/A'}</strong>
                                                        </td>
                                                        <td>
                                                            {order.paymentDetails?.uploadedAt
                                                                ? new Date(order.paymentDetails.uploadedAt).toLocaleString()
                                                                : 'N/A'}
                                                        </td>
                                                        <td>
                                                            {order.paymentDetails?.receiptFilename ? (
                                                                <button
                                                                    onClick={() => viewReceipt(order.paymentDetails.receiptFilename)}
                                                                    className="view-receipt-btn"
                                                                >
                                                                    👁️ View Receipt
                                                                </button>
                                                            ) : (
                                                                <span>No receipt</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => {
                                                                    const notes = prompt('Add verification notes (optional):');
                                                                    if (notes !== null) {
                                                                        handleVerifyBankTransfer(order._id, true, notes);
                                                                    }
                                                                }}
                                                                className="approve-btn"
                                                            >
                                                                ✅ Verify
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const notes = prompt('Reason for rejection:');
                                                                    if (notes) {
                                                                        handleVerifyBankTransfer(order._id, false, notes);
                                                                    }
                                                                }}
                                                                className="reject-btn"
                                                            >
                                                                ❌ Reject
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'audit' && (
                            <div className="audit-section">
                                <h2>Audit Logs</h2>
                                <div className="table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>User</th>
                                                <th>Action</th>
                                                <th>Details</th>
                                                <th>IP Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {auditLogs.length === 0 ? (
                                                <tr><td colSpan="5" className="no-data">No audit logs found</td></tr>
                                            ) : (
                                                auditLogs.map((log) => (
                                                    <tr key={log._id}>
                                                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                                                        <td>{log.username || 'System'}</td>
                                                        <td>{log.action}</td>
                                                        <td>{JSON.stringify(log.details)}</td>
                                                        <td>{log.ipAddress}</td>
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
    );
};

export default AdminDashboard;
