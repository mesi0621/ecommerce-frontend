import React, { useState, useEffect } from 'react';
import './AdminAnalytics.css';

const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        salesData: [],
        topProducts: [],
        revenueByCategory: [],
        orderStats: {},
        customerStats: {}
    });
    const [timeRange, setTimeRange] = useState('7days');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/admin/analytics?range=${timeRange}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setAnalytics(data.data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="analytics-loading">Loading analytics...</div>;
    }

    return (
        <div className="admin-analytics">
            <div className="analytics-header">
                <h2>Advanced Analytics Dashboard</h2>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="time-range-select">
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="1year">Last Year</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <h3>Total Revenue</h3>
                    <p className="metric-value">${analytics.orderStats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                    <span className="metric-change positive">+12.5%</span>
                </div>
                <div className="metric-card">
                    <h3>Total Orders</h3>
                    <p className="metric-value">{analytics.orderStats?.totalOrders || 0}</p>
                    <span className="metric-change positive">+8.3%</span>
                </div>
                <div className="metric-card">
                    <h3>Average Order Value</h3>
                    <p className="metric-value">${analytics.orderStats?.averageOrderValue?.toFixed(2) || '0.00'}</p>
                    <span className="metric-change negative">-2.1%</span>
                </div>
                <div className="metric-card">
                    <h3>New Customers</h3>
                    <p className="metric-value">{analytics.customerStats?.newCustomers || 0}</p>
                    <span className="metric-change positive">+15.7%</span>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                {/* Sales Chart */}
                <div className="chart-card">
                    <h3>Sales Trend</h3>
                    <div className="simple-chart">
                        {analytics.salesData?.map((item, index) => (
                            <div key={index} className="chart-bar">
                                <div
                                    className="bar-fill"
                                    style={{ height: `${(item.value / Math.max(...analytics.salesData.map(d => d.value))) * 100}%` }}
                                ></div>
                                <span className="bar-label">{item.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="chart-card">
                    <h3>Top Selling Products</h3>
                    <div className="top-products-list">
                        {analytics.topProducts?.map((product, index) => (
                            <div key={index} className="top-product-item">
                                <span className="product-rank">#{index + 1}</span>
                                <span className="product-name">{product.name}</span>
                                <span className="product-sales">{product.sales} sold</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Revenue by Category */}
            <div className="category-revenue">
                <h3>Revenue by Category</h3>
                <div className="category-bars">
                    {analytics.revenueByCategory?.map((cat, index) => (
                        <div key={index} className="category-bar-item">
                            <span className="category-name">{cat.category}</span>
                            <div className="category-bar-container">
                                <div
                                    className="category-bar-fill"
                                    style={{ width: `${(cat.revenue / Math.max(...analytics.revenueByCategory.map(c => c.revenue))) * 100}%` }}
                                ></div>
                            </div>
                            <span className="category-value">${cat.revenue.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Status Distribution */}
            <div className="order-status-section">
                <h3>Order Status Distribution</h3>
                <div className="status-grid">
                    <div className="status-item pending">
                        <span className="status-count">{analytics.orderStats?.pending || 0}</span>
                        <span className="status-label">Pending</span>
                    </div>
                    <div className="status-item confirmed">
                        <span className="status-count">{analytics.orderStats?.confirmed || 0}</span>
                        <span className="status-label">Confirmed</span>
                    </div>
                    <div className="status-item shipped">
                        <span className="status-count">{analytics.orderStats?.shipped || 0}</span>
                        <span className="status-label">Shipped</span>
                    </div>
                    <div className="status-item delivered">
                        <span className="status-count">{analytics.orderStats?.delivered || 0}</span>
                        <span className="status-label">Delivered</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
