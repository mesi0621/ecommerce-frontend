import React, { useState, useEffect } from 'react';
import './CSS/ComprehensiveAdminDashboard.css';
import AdminAnalytics from '../Components/AdminAnalytics/AdminAnalytics';

const ComprehensiveAdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [activeSubSection, setActiveSubSection] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        stats: {},
        users: [],
        sellers: [],
        products: [],
        orders: [],
        refunds: [],
        categories: [],
        payments: [],
        sellerEarnings: [],
        commission: {},
        settings: {},
        auditLogs: [],
        reports: {}
    });

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        fetchData();
    }, [activeSection, activeSubSection]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth-token');

            switch (activeSection) {
                case 'dashboard':
                    await fetchDashboardStats();
                    break;
                case 'management':
                    await fetchManagementData();
                    break;
                case 'products':
                    await fetchProductsData();
                    break;
                case 'orders':
                    await fetchOrdersData();
                    break;
                case 'categories':
                    await fetchCategories();
                    break;
                case 'financial':
                    await fetchFinancialData();
                    break;
                case 'settings':
                    await fetchSettings();
                    break;
                case 'audit':
                    await fetchAuditLogs();
                    break;
                case 'reports':
                    await fetchReports();
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboardStats = async () => {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:5000/api/admin/analytics?range=30days', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            setData(prev => ({ ...prev, stats: result.data }));
        }
    };

    const fetchManagementData = async () => {
        const token = localStorage.getItem('auth-token');

        if (activeSubSection === 'sellers') {
            const response = await fetch('http://localhost:5000/api/seller/admin/sellers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setData(prev => ({ ...prev, sellers: result.data }));
            }
        } else if (activeSubSection === 'customers' || activeSubSection === 'managers') {
            const response = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setData(prev => ({ ...prev, users: result.data }));
            }
        }
    };

    const fetchProductsData = async () => {
        const token = localStorage.getItem('auth-token');
        const endpoint = activeSubSection === 'approval'
            ? 'http://localhost:5000/api/products/admin/pending'
            : 'http://localhost:5000/api/products';

        const response = await fetch(endpoint, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            setData(prev => ({ ...prev, products: result.data }));
        }
    };

    const fetchOrdersData = async () => {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:5000/api/orders/admin/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            setData(prev => ({ ...prev, orders: result.data }));
        }
    };

    const fetchCategories = async () => {
        setData(prev => ({
            ...prev,
            categories: [
                { id: 1, name: 'Men', productCount: 12, status: 'active' },
                { id: 2, name: 'Women', productCount: 12, status: 'active' },
                { id: 3, name: 'Kids', productCount: 12, status: 'active' }
            ]
        }));
    };

    const fetchFinancialData = async () => {
        const token = localStorage.getItem('auth-token');

        if (activeSubSection === 'payments') {
            const response = await fetch('http://localhost:5000/api/orders/admin/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setData(prev => ({ ...prev, payments: result.data }));
            }
        }
    };

    const fetchSettings = async () => {
        setData(prev => ({
            ...prev,
            settings: {
                siteName: 'E-Commerce Store',
                currency: 'USD',
                taxRate: 10,
                shippingFee: 5,
                defaultCommission: 10
            }
        }));
    };

    const fetchAuditLogs = async () => {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:5000/api/admin/audit-logs', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            setData(prev => ({ ...prev, auditLogs: result.data }));
        }
    };

    const fetchReports = async () => {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:5000/api/admin/analytics?range=30days', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            setData(prev => ({ ...prev, reports: result.data }));
        }
    };

    const handleApproveProduct = async (productId) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/products/${productId}/approve`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                alert('Product approved successfully!');
                fetchProductsData();
            }
        } catch (error) {
            console.error('Error approving product:', error);
            alert('Failed to approve product');
        }
    };

    const handleApproveSeller = async (sellerId) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/seller/admin/sellers/${sellerId}/approve`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                alert('Seller approved successfully!');
                fetchManagementData();
            }
        } catch (error) {
            console.error('Error approving seller:', error);
            alert('Failed to approve seller');
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
            const result = await response.json();
            if (result.success) {
                alert('Order status updated successfully!');
                fetchOrdersData();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    const handleChangeUserRole = async (userId, newRole) => {
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
            const result = await response.json();
            if (result.success) {
                alert('User role updated successfully!');
                fetchManagementData();
            }
        } catch (error) {
            console.error('Error changing role:', error);
            alert('Failed to change user role');
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="loading-spinner">Loading...</div>;
        }

        switch (activeSection) {
            case 'dashboard':
                return <AdminAnalytics />;

            case 'management':
                return renderManagementSection();

            case 'products':
                return renderProductsSection();

            case 'orders':
                return renderOrdersSection();

            case 'categories':
                return renderCategoriesSection();

            case 'financial':
                return renderFinancialSection();

            case 'settings':
                return renderSettingsSection();

            case 'audit':
                return renderAuditSection();

            case 'reports':
                return renderReportsSection();

            default:
                return <div>Select a section from the sidebar</div>;
        }
    };

    const renderManagementSection = () => {
        return (
            <div className="management-section">
                <h2>Management</h2>
                <div className="sub-nav">
                    <button
                        className={activeSubSection === 'sellers' ? 'active' : ''}
                        onClick={() => setActiveSubSection('sellers')}
                    >
                        Sellers
                    </button>
                    <button
                        className={activeSubSection === 'customers' ? 'active' : ''}
                        onClick={() => setActiveSubSection('customers')}
                    >
                        Customers
                    </button>
                    <button
                        className={activeSubSection === 'managers' ? 'active' : ''}
                        onClick={() => setActiveSubSection('managers')}
                    >
                        Managers
                    </button>
                    <button
                        className={activeSubSection === 'roles' ? 'active' : ''}
                        onClick={() => setActiveSubSection('roles')}
                    >
                        Roles
                    </button>
                </div>

                {activeSubSection === 'sellers' && (
                    <div className="sellers-list">
                        <h3>Seller Management</h3>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Business Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Commission</th>
                                    <th>Total Sales</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.sellers.map((seller) => (
                                    <tr key={seller._id}>
                                        <td>{seller.businessName}</td>
                                        <td>{seller.businessEmail}</td>
                                        <td>
                                            <span className={`status-badge ${seller.isApproved ? 'approved' : 'pending'}`}>
                                                {seller.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>{seller.commission}%</td>
                                        <td>${seller.totalSales?.toFixed(2) || '0.00'}</td>
                                        <td>
                                            {!seller.isApproved && (
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleApproveSeller(seller._id)}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {(activeSubSection === 'customers' || activeSubSection === 'managers') && (
                    <div className="users-list">
                        <h3>{activeSubSection === 'customers' ? 'Customer' : 'Manager'} Management</h3>
                        <table className="data-table">
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
                                {data.users
                                    .filter(user => activeSubSection === 'customers' ? user.role === 'customer' : user.role !== 'customer')
                                    .map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleChangeUserRole(user._id, e.target.value)}
                                                    className="role-select"
                                                >
                                                    <option value="customer">Customer</option>
                                                    <option value="seller">Seller</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="manager">Manager</option>
                                                </select>
                                            </td>
                                            <td>
                                                <span className={user.isActive ? 'status-active' : 'status-inactive'}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn-action">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSubSection === 'roles' && (
                    <div className="roles-management">
                        <h3>Role Management</h3>
                        <div className="roles-grid">
                            <div className="role-card">
                                <h4>Admin</h4>
                                <p>Full system access</p>
                                <span className="role-count">2 users</span>
                            </div>
                            <div className="role-card">
                                <h4>Manager</h4>
                                <p>Manage orders and products</p>
                                <span className="role-count">5 users</span>
                            </div>
                            <div className="role-card">
                                <h4>Seller</h4>
                                <p>Sell products</p>
                                <span className="role-count">15 users</span>
                            </div>
                            <div className="role-card">
                                <h4>Customer</h4>
                                <p>Buy products</p>
                                <span className="role-count">150 users</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderProductsSection = () => {
        return (
            <div className="products-section">
                <h2>Products</h2>
                <div className="sub-nav">
                    <button
                        className={activeSubSection === 'list' ? 'active' : ''}
                        onClick={() => setActiveSubSection('list')}
                    >
                        Product List
                    </button>
                    <button
                        className={activeSubSection === 'approval' ? 'active' : ''}
                        onClick={() => setActiveSubSection('approval')}
                    >
                        Product Approval
                    </button>
                </div>

                <div className="products-grid">
                    {data.products.map((product) => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} />
                            <div className="product-info">
                                <h4>{product.name}</h4>
                                <p className="product-category">{product.category}</p>
                                <p className="product-price">${product.new_price}</p>
                                <span className={`status-badge ${product.isApproved ? 'approved' : 'pending'}`}>
                                    {product.isApproved ? 'Approved' : 'Pending'}
                                </span>
                                {!product.isApproved && activeSubSection === 'approval' && (
                                    <button
                                        className="btn-approve"
                                        onClick={() => handleApproveProduct(product.id)}
                                    >
                                        Approve
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderOrdersSection = () => {
        return (
            <div className="orders-section">
                <h2>Orders</h2>
                <div className="sub-nav">
                    <button
                        className={activeSubSection === 'all' ? 'active' : ''}
                        onClick={() => setActiveSubSection('all')}
                    >
                        All Orders
                    </button>
                    <button
                        className={activeSubSection === 'refunds' ? 'active' : ''}
                        onClick={() => setActiveSubSection('refunds')}
                    >
                        Refunds
                    </button>
                </div>

                {activeSubSection === 'all' && (
                    <table className="data-table">
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
                            {data.orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.orderNumber}</td>
                                    <td>{order.userId?.username || 'N/A'}</td>
                                    <td>${order.total.toFixed(2)}</td>
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
                                    <td>
                                        <span className={`payment-badge ${order.paymentStatus}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn-action">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeSubSection === 'refunds' && (
                    <div className="refunds-list">
                        <h3>Refund Requests</h3>
                        <p className="info-message">Refund management system coming soon</p>
                    </div>
                )}
            </div>
        );
    };

    const renderCategoriesSection = () => {
        return (
            <div className="categories-section">
                <h2>Category Management</h2>
                <div className="categories-grid">
                    {data.categories.map((category) => (
                        <div key={category.id} className="category-card">
                            <h3>{category.name}</h3>
                            <p>{category.productCount} products</p>
                            <span className={`status-badge ${category.status}`}>
                                {category.status}
                            </span>
                            <button className="btn-action">Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderFinancialSection = () => {
        return (
            <div className="financial-section">
                <h2>Financial</h2>
                <div className="sub-nav">
                    <button
                        className={activeSubSection === 'payments' ? 'active' : ''}
                        onClick={() => setActiveSubSection('payments')}
                    >
                        Payments
                    </button>
                    <button
                        className={activeSubSection === 'earnings' ? 'active' : ''}
                        onClick={() => setActiveSubSection('earnings')}
                    >
                        Seller Earnings
                    </button>
                    <button
                        className={activeSubSection === 'commission' ? 'active' : ''}
                        onClick={() => setActiveSubSection('commission')}
                    >
                        Commission
                    </button>
                </div>

                {activeSubSection === 'payments' && (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td>{payment.orderNumber}</td>
                                    <td>${payment.total.toFixed(2)}</td>
                                    <td>{payment.paymentMethod}</td>
                                    <td>
                                        <span className={`payment-badge ${payment.paymentStatus}`}>
                                            {payment.paymentStatus}
                                        </span>
                                    </td>
                                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeSubSection === 'earnings' && (
                    <div className="earnings-section">
                        <h3>Seller Earnings</h3>
                        <p className="info-message">Seller earnings tracking coming soon</p>
                    </div>
                )}

                {activeSubSection === 'commission' && (
                    <div className="commission-section">
                        <h3>Commission Settings</h3>
                        <div className="commission-card">
                            <p>Default Commission Rate: <strong>10%</strong></p>
                            <button className="btn-action">Update</button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderSettingsSection = () => {
        return (
            <div className="settings-section">
                <h2>System Settings</h2>
                <div className="settings-form">
                    <div className="form-group">
                        <label>Site Name</label>
                        <input type="text" value={data.settings.siteName} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Currency</label>
                        <input type="text" value={data.settings.currency} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Tax Rate (%)</label>
                        <input type="number" value={data.settings.taxRate} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Shipping Fee ($)</label>
                        <input type="number" value={data.settings.shippingFee} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Default Commission (%)</label>
                        <input type="number" value={data.settings.defaultCommission} readOnly />
                    </div>
                    <button className="btn-save">Save Settings</button>
                </div>
            </div>
        );
    };

    const renderAuditSection = () => {
        return (
            <div className="audit-section">
                <h2>Audit Logs</h2>
                <table className="data-table">
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
                        {data.auditLogs.map((log) => (
                            <tr key={log._id}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.username || 'System'}</td>
                                <td>{log.action}</td>
                                <td>{JSON.stringify(log.details)}</td>
                                <td>{log.ipAddress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderReportsSection = () => {
        return (
            <div className="reports-section">
                <h2>Reports</h2>
                <div className="reports-grid">
                    <div className="report-card">
                        <h3>Sales Report</h3>
                        <p>Total Revenue: ${data.reports.orderStats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                        <button className="btn-action">Download</button>
                    </div>
                    <div className="report-card">
                        <h3>Product Report</h3>
                        <p>Top Products: {data.reports.topProducts?.length || 0}</p>
                        <button className="btn-action">Download</button>
                    </div>
                    <div className="report-card">
                        <h3>Customer Report</h3>
                        <p>New Customers: {data.reports.customerStats?.newCustomers || 0}</p>
                        <button className="btn-action">Download</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="comprehensive-admin-dashboard">
            <div className="vertical-sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={activeSection === 'dashboard' ? 'active' : ''}
                        onClick={() => { setActiveSection('dashboard'); setActiveSubSection(''); }}
                    >
                        <span className="icon">📊</span>
                        <span>Dashboard</span>
                    </button>
                    <button
                        className={activeSection === 'management' ? 'active' : ''}
                        onClick={() => { setActiveSection('management'); setActiveSubSection('sellers'); }}
                    >
                        <span className="icon">👥</span>
                        <span>Management</span>
                    </button>
                    <button
                        className={activeSection === 'products' ? 'active' : ''}
                        onClick={() => { setActiveSection('products'); setActiveSubSection('list'); }}
                    >
                        <span className="icon">📦</span>
                        <span>Products</span>
                    </button>
                    <button
                        className={activeSection === 'orders' ? 'active' : ''}
                        onClick={() => { setActiveSection('orders'); setActiveSubSection('all'); }}
                    >
                        <span className="icon">🛒</span>
                        <span>Orders</span>
                    </button>
                    <button
                        className={activeSection === 'categories' ? 'active' : ''}
                        onClick={() => { setActiveSection('categories'); setActiveSubSection(''); }}
                    >
                        <span className="icon">📑</span>
                        <span>Categories</span>
                    </button>
                    <button
                        className={activeSection === 'financial' ? 'active' : ''}
                        onClick={() => { setActiveSection('financial'); setActiveSubSection('payments'); }}
                    >
                        <span className="icon">💰</span>
                        <span>Financial</span>
                    </button>
                    <button
                        className={activeSection === 'settings' ? 'active' : ''}
                        onClick={() => { setActiveSection('settings'); setActiveSubSection(''); }}
                    >
                        <span className="icon">⚙️</span>
                        <span>Settings</span>
                    </button>
                    <button
                        className={activeSection === 'audit' ? 'active' : ''}
                        onClick={() => { setActiveSection('audit'); setActiveSubSection(''); }}
                    >
                        <span className="icon">📋</span>
                        <span>Audit Logs</span>
                    </button>
                    <button
                        className={activeSection === 'reports' ? 'active' : ''}
                        onClick={() => { setActiveSection('reports'); setActiveSubSection(''); }}
                    >
                        <span className="icon">📈</span>
                        <span>Reports</span>
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={() => window.location.href = '/'}>
                        <span className="icon">🏠</span>
                        <span>Back to Shop</span>
                    </button>
                </div>
            </div>

            <div className="main-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default ComprehensiveAdminDashboard;
