import React, { useState, useEffect } from 'react';
import './CSS/SellerDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || '${API_BASE_URL}';

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [sellerProfile, setSellerProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [earnings, setEarnings] = useState({
        totalSales: 0,
        totalEarnings: 0,
        pendingPayouts: 0,
        commission: 10
    });
    const [analytics, setAnalytics] = useState({
        totalProducts: 0,
        activeProducts: 0,
        pendingProducts: 0,
        totalOrders: 0,
        completedOrders: 0
    });

    // New product form
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        new_price: '',
        old_price: '',
        description: '',
        image: '',
        stock: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        fetchSellerData();
    }, [activeTab]);

    const fetchSellerData = async () => {
        setLoading(true);
        try {
            await fetchSellerProfile();

            if (activeTab === 'overview') {
                await fetchDashboardStats();
            } else if (activeTab === 'products') {
                await fetchMyProducts();
            } else if (activeTab === 'orders') {
                await fetchMyOrders();
            } else if (activeTab === 'earnings') {
                await fetchEarnings();
            }
        } catch (error) {
            console.error('Error fetching seller data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSellerProfile = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('${API_BASE_URL}/seller/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setSellerProfile(data.data);
            }
        } catch (error) {
            console.error('Error fetching seller profile:', error);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('auth-token');

            // Fetch products
            const productsRes = await fetch('${API_BASE_URL}/products/seller/my-products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const productsData = await productsRes.json();

            if (productsData.success) {
                const prods = productsData.data;
                setAnalytics({
                    totalProducts: prods.length,
                    activeProducts: prods.filter(p => p.isApproved).length,
                    pendingProducts: prods.filter(p => !p.isApproved).length,
                    totalOrders: 0,
                    completedOrders: 0
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const fetchMyProducts = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('${API_BASE_URL}/products/seller/my-products', {
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

    const fetchMyOrders = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('${API_BASE_URL}/orders/seller/my-orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        }
    };

    const fetchEarnings = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('${API_BASE_URL}/seller/earnings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setEarnings(data.data);
            }
        } catch (error) {
            console.error('Error fetching earnings:', error);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('${API_BASE_URL}/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            const data = await response.json();
            if (data.success) {
                alert('Product submitted for approval!');
                setNewProduct({
                    name: '',
                    category: '',
                    new_price: '',
                    old_price: '',
                    description: '',
                    image: '',
                    stock: ''
                });
                fetchMyProducts();
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
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
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
                fetchMyProducts();
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
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                alert('Product deleted successfully!');
                fetchMyProducts();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const renderOverview = () => (
        <div className="seller-overview">
            <h2>Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>{analytics.totalProducts}</h3>
                        <p>Total Products</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>{analytics.activeProducts}</h3>
                        <p>Active Products</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>{analytics.pendingProducts}</h3>
                        <p>Pending Approval</p>
                    </div>
                </div>
                <div className="stat-card highlight">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>${sellerProfile?.totalSales?.toFixed(2) || '0.00'}</h3>
                        <p>Total Sales</p>
                    </div>
                </div>
            </div>

            {/* Seller Profile Info */}
            {sellerProfile && (
                <div className="profile-card">
                    <h3>Your Seller Profile</h3>
                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="label">Business Name:</span>
                            <span className="value">{sellerProfile.businessName}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Email:</span>
                            <span className="value">{sellerProfile.businessEmail}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Phone:</span>
                            <span className="value">{sellerProfile.businessPhone}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Commission Rate:</span>
                            <span className="value">{sellerProfile.commission}%</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Status:</span>
                            <span className={`status-badge ${sellerProfile.isApproved ? 'approved' : 'pending'}`}>
                                {sellerProfile.isApproved ? 'Approved' : 'Pending Approval'}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Rating:</span>
                            <span className="value">⭐ {sellerProfile.rating}/5.0</span>
                        </div>
                    </div>
                    <button className="btn-edit-profile" onClick={() => setActiveTab('profile')}>
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );

    const renderProducts = () => (
        <div className="seller-products">
            <h2>My Products</h2>

            {/* Add Product Form */}
            <div className="add-product-section">
                <h3>Add New Product</h3>
                <form onSubmit={handleAddProduct} className="product-form">
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
                        placeholder="Price"
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
                        type="number"
                        placeholder="Stock Quantity"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Image filename (e.g., product_1.png)"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Product Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows="3"
                    />
                    <button type="submit" className="btn-submit">Add Product</button>
                </form>
            </div>

            {/* Products List */}
            <div className="products-list">
                <h3>Your Products ({products.length})</h3>
                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} />
                            <div className="product-info">
                                <h4>{product.name}</h4>
                                <p className="product-category">{product.category}</p>
                                <p className="product-price">${product.new_price}</p>
                                <p className="product-stock">Stock: {product.stock || 'N/A'}</p>
                                <span className={`status-badge ${product.isApproved ? 'approved' : 'pending'}`}>
                                    {product.isApproved ? 'Active' : 'Pending Approval'}
                                </span>
                                <div className="product-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => {
                                            const newPrice = prompt('Enter new price:', product.new_price);
                                            if (newPrice) {
                                                handleUpdateProduct(product.id, { new_price: parseFloat(newPrice) });
                                            }
                                        }}
                                    >
                                        Edit Price
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="seller-orders">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p className="no-data">No orders yet</p>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Customer</th>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.orderNumber}</td>
                                <td>{order.userId?.username || 'N/A'}</td>
                                <td>{order.items?.length || 0} items</td>
                                <td>${order.total.toFixed(2)}</td>
                                <td>
                                    <span className={`status-badge ${order.orderStatus}`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    const renderEarnings = () => (
        <div className="seller-earnings">
            <h2>Earnings & Payouts</h2>
            <div className="earnings-grid">
                <div className="earning-card">
                    <h3>Total Sales</h3>
                    <p className="amount">${earnings.totalSales?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="earning-card">
                    <h3>Your Earnings</h3>
                    <p className="amount">${earnings.totalEarnings?.toFixed(2) || '0.00'}</p>
                    <span className="note">After {earnings.commission}% commission</span>
                </div>
                <div className="earning-card">
                    <h3>Pending Payouts</h3>
                    <p className="amount">${earnings.pendingPayouts?.toFixed(2) || '0.00'}</p>
                </div>
            </div>
            <div className="payout-info">
                <h3>Payout Information</h3>
                <p>Payouts are processed monthly on the 1st of each month.</p>
                <p>Commission Rate: {earnings.commission}%</p>
                <button className="btn-request-payout">Request Payout</button>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="seller-profile-edit">
            <h2>Edit Profile</h2>
            {sellerProfile && (
                <form className="profile-form">
                    <div className="form-group">
                        <label>Business Name</label>
                        <input type="text" defaultValue={sellerProfile.businessName} />
                    </div>
                    <div className="form-group">
                        <label>Business Email</label>
                        <input type="email" defaultValue={sellerProfile.businessEmail} />
                    </div>
                    <div className="form-group">
                        <label>Business Phone</label>
                        <input type="tel" defaultValue={sellerProfile.businessPhone} />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" defaultValue={sellerProfile.address?.street} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" defaultValue={sellerProfile.address?.city} />
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <input type="text" defaultValue={sellerProfile.address?.state} />
                        </div>
                    </div>
                    <button type="submit" className="btn-save">Save Changes</button>
                </form>
            )}
        </div>
    );

    return (
        <div className="seller-dashboard">
            <div className="seller-sidebar">
                <div className="sidebar-header">
                    <h2>Seller Panel</h2>
                    {sellerProfile && (
                        <p className="seller-name">{sellerProfile.businessName}</p>
                    )}
                </div>
                <nav className="seller-nav">
                    <button
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="icon">📊</span>
                        <span>Dashboard</span>
                    </button>
                    <button
                        className={activeTab === 'products' ? 'active' : ''}
                        onClick={() => setActiveTab('products')}
                    >
                        <span className="icon">📦</span>
                        <span>My Products</span>
                    </button>
                    <button
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={() => setActiveTab('orders')}
                    >
                        <span className="icon">🛒</span>
                        <span>Orders</span>
                    </button>
                    <button
                        className={activeTab === 'earnings' ? 'active' : ''}
                        onClick={() => setActiveTab('earnings')}
                    >
                        <span className="icon">💰</span>
                        <span>Earnings</span>
                    </button>
                    <button
                        className={activeTab === 'profile' ? 'active' : ''}
                        onClick={() => setActiveTab('profile')}
                    >
                        <span className="icon">👤</span>
                        <span>Profile</span>
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={() => window.location.href = '/'}>
                        <span className="icon">🏠</span>
                        <span>Back to Shop</span>
                    </button>
                </div>
            </div>

            <div className="seller-content">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'products' && renderProducts()}
                        {activeTab === 'orders' && renderOrders()}
                        {activeTab === 'earnings' && renderEarnings()}
                        {activeTab === 'profile' && renderProfile()}
                    </>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;

