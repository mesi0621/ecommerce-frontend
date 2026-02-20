import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SellerOnly } from '../Components/PermissionGuard';
import './CSS/SellerDashboardRBAC.css';

const SellerDashboardRBAC = () => {
    const navigate = useNavigate();
    const { user, role, isSeller, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        totalProducts: 0,
        approvedProducts: 0,
        pendingProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    });

    // Data states
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState(null);

    // Form state for new product
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'men',
        new_price: '',
        old_price: '',
        description: '',
        image: '',
        stock: 100
    });

    useEffect(() => {
        // Redirect if not seller
        if (!isSeller()) {
            navigate('/');
            return;
        }

        fetchDashboardData();
    }, [activeTab, isSeller, navigate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                await fetchStats();
            } else if (activeTab === 'products') {
                await fetchProducts();
            } else if (activeTab === 'orders') {
                await fetchOrders();
            } else if (activeTab === 'profile') {
                await fetchProfile();
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

            // Fetch seller's products
            const productsRes = await fetch('http://localhost:5000/api/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const productsData = await productsRes.json();

            // Fetch seller's orders
            const ordersRes = await fetch('http://localhost:5000/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const ordersData = await ordersRes.json();

            if (productsData.success) {
                const myProducts = productsData.data;
                const approved = myProducts.filter(p => p.isApproved).length;
                const pending = myProducts.filter(p => !p.isApproved).length;

                setStats({
                    totalProducts: myProducts.length,
                    approvedProducts: approved,
                    pendingProducts: pending,
                    totalOrders: ordersData.success ? ordersData.data.length : 0,
                    totalRevenue: ordersData.success ? ordersData.data.reduce((sum, order) => sum + (order.total || 0), 0) : 0
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/products', {
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

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/seller/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setProfile(data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
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
                body: JSON.stringify(newProduct)
            });
            const data = await response.json();
            if (data.success) {
                alert('Product added successfully! Waiting for admin approval.');
                setNewProduct({
                    name: '',
                    category: 'men',
                    new_price: '',
                    old_price: '',
                    description: '',
                    image: '',
                    stock: 100
                });
                fetchProducts();
                fetchStats();
            } else {
                alert(data.error || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    const handleUpdateProduct = async (productId, updates) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            const data = await response.json();
            if (data.success) {
                alert('Product updated successfully!');
                fetchProducts();
            } else {
                alert(data.error || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
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
                fetchProducts();
                fetchStats();
            } else {
                alert(data.error || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
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
        <SellerOnly fallback="/">
            <div className="seller-dashboard-rbac">
                {/* Sidebar */}
                <div className="seller-sidebar-rbac">
                    <div className="seller-header">
                        <h2>Seller Panel</h2>
                        <div className="seller-user-info">
                            <p className="seller-username">{user?.username || user?.email}</p>
                            <span className="seller-role-badge">{role}</span>
                        </div>
                    </div>

                    <nav className="seller-nav-rbac">
                        <button
                            className={activeTab === 'overview' ? 'active' : ''}
                            onClick={() => setActiveTab('overview')}
                        >
                            <span className="nav-icon">📊</span>
                            <span className="nav-text">Overview</span>
                        </button>
                        <button
                            className={activeTab === 'products' ? 'active' : ''}
                            onClick={() => setActiveTab('products')}
                        >
                            <span className="nav-icon">📦</span>
                            <span className="nav-text">My Products</span>
                        </button>
                        <button
                            className={activeTab === 'orders' ? 'active' : ''}
                            onClick={() => setActiveTab('orders')}
                        >
                            <span className="nav-icon">🛒</span>
                            <span className="nav-text">Orders</span>
                        </button>
                        <button
                            className={activeTab === 'profile' ? 'active' : ''}
                            onClick={() => setActiveTab('profile')}
                        >
                            <span className="nav-icon">🏢</span>
                            <span className="nav-text">Business Profile</span>
                        </button>

                        <div className="nav-divider"></div>

                        <button onClick={() => navigate('/profile')}>
                            <span className="nav-icon">👤</span>
                            <span className="nav-text">My Account</span>
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
                <div className="seller-content-rbac">
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
                                    <h1>Seller Dashboard</h1>
                                    <div className="stats-grid">
                                        <div className="stat-card">
                                            <div className="stat-icon">📦</div>
                                            <div className="stat-info">
                                                <h3>{stats.totalProducts}</h3>
                                                <p>Total Products</p>
                                            </div>
                                        </div>
                                        <div className="stat-card success">
                                            <div className="stat-icon">✅</div>
                                            <div className="stat-info">
                                                <h3>{stats.approvedProducts}</h3>
                                                <p>Approved Products</p>
                                            </div>
                                        </div>
                                        <div className="stat-card warning">
                                            <div className="stat-icon">⏳</div>
                                            <div className="stat-info">
                                                <h3>{stats.pendingProducts}</h3>
                                                <p>Pending Approval</p>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon">🛒</div>
                                            <div className="stat-info">
                                                <h3>{stats.totalOrders}</h3>
                                                <p>Total Orders</p>
                                            </div>
                                        </div>
                                        <div className="stat-card highlight">
                                            <div className="stat-icon">💰</div>
                                            <div className="stat-info">
                                                <h3>{stats.totalRevenue.toFixed(2)} ETB</h3>
                                                <p>Total Revenue</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="quick-actions">
                                        <h2>Quick Actions</h2>
                                        <div className="action-buttons">
                                            <button onClick={() => setActiveTab('products')} className="action-btn">
                                                Add New Product
                                            </button>
                                            <button onClick={() => setActiveTab('orders')} className="action-btn">
                                                View Orders
                                            </button>
                                            <button onClick={() => setActiveTab('profile')} className="action-btn">
                                                Update Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Products Tab */}
                            {activeTab === 'products' && (
                                <div className="products-section">
                                    <h1>My Products</h1>

                                    {/* Add Product Form */}
                                    <div className="add-product-form">
                                        <h2>Add New Product</h2>
                                        <form onSubmit={handleAddProduct}>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Product Name *</label>
                                                    <input
                                                        type="text"
                                                        value={newProduct.name}
                                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Category *</label>
                                                    <select
                                                        value={newProduct.category}
                                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                                        required
                                                    >
                                                        <option value="men">Men</option>
                                                        <option value="women">Women</option>
                                                        <option value="kid">Kids</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Current Price (ETB) *</label>
                                                    <input
                                                        type="number"
                                                        value={newProduct.new_price}
                                                        onChange={(e) => setNewProduct({ ...newProduct, new_price: e.target.value })}
                                                        required
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Original Price (ETB) *</label>
                                                    <input
                                                        type="number"
                                                        value={newProduct.old_price}
                                                        onChange={(e) => setNewProduct({ ...newProduct, old_price: e.target.value })}
                                                        required
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Stock Quantity *</label>
                                                    <input
                                                        type="number"
                                                        value={newProduct.stock}
                                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                                        required
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea
                                                    value={newProduct.description}
                                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Image URL *</label>
                                                <input
                                                    type="url"
                                                    value={newProduct.image}
                                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                                    required
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                            </div>
                                            <button type="submit" className="submit-btn">Add Product</button>
                                        </form>
                                    </div>

                                    {/* Products List */}
                                    <div className="products-list">
                                        <h2>Your Products ({products.length})</h2>
                                        <div className="products-grid">
                                            {products.length === 0 ? (
                                                <p className="no-data">No products yet. Add your first product above!</p>
                                            ) : (
                                                products.map((product) => (
                                                    <div key={product._id} className="product-card">
                                                        <div className="product-status">
                                                            {product.isApproved ? (
                                                                <span className="status-approved">✓ Approved</span>
                                                            ) : (
                                                                <span className="status-pending">⏳ Pending</span>
                                                            )}
                                                        </div>
                                                        <img src={product.image} alt={product.name} />
                                                        <div className="product-info">
                                                            <h3>{product.name}</h3>
                                                            <p className="product-category">{product.category}</p>
                                                            <p className="product-price">{product.new_price} ETB</p>
                                                            <p className="product-stock">Stock: {product.stock}</p>
                                                            <div className="product-actions">
                                                                <button
                                                                    onClick={() => handleDeleteProduct(product.id)}
                                                                    className="delete-btn"
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className="orders-section">
                                    <h1>Orders for Your Products</h1>
                                    <div className="table-container">
                                        <table className="seller-table">
                                            <thead>
                                                <tr>
                                                    <th>Order #</th>
                                                    <th>Customer</th>
                                                    <th>Total</th>
                                                    <th>Status</th>
                                                    <th>Payment</th>
                                                    <th>Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="no-data">No orders yet</td>
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
                                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                            <td>
                                                                <select
                                                                    value={order.orderStatus}
                                                                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                                    className="status-select"
                                                                    disabled={order.orderStatus === 'delivered' || order.orderStatus === 'cancelled'}
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="confirmed">Confirmed</option>
                                                                    <option value="processing">Processing</option>
                                                                    <option value="shipped">Shipped</option>
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

                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="profile-section">
                                    <h1>Business Profile</h1>
                                    {profile ? (
                                        <div className="profile-card">
                                            <div className="profile-info">
                                                <h2>{profile.businessName}</h2>
                                                <p><strong>Email:</strong> {profile.businessEmail}</p>
                                                <p><strong>Phone:</strong> {profile.businessPhone}</p>
                                                <p><strong>Status:</strong> {profile.isApproved ? (
                                                    <span className="status-approved">✓ Approved</span>
                                                ) : (
                                                    <span className="status-pending">⏳ Pending Approval</span>
                                                )}</p>
                                                <p><strong>Commission Rate:</strong> {profile.commission}%</p>
                                                <p><strong>Total Sales:</strong> {profile.totalSales} ETB</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="no-data">Loading profile...</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </SellerOnly>
    );
};

export default SellerDashboardRBAC;
