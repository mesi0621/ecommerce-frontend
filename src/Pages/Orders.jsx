import React, { useState, useEffect } from 'react';
import './CSS/Orders.css';
import orderAPI from '../api/orderAPI';
import OrderTracking from '../Components/OrderTracking/OrderTracking';
import { useToast } from '../hooks/useToast';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showTracking, setShowTracking] = useState(false);
    const toast = useToast();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchOrders = async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        try {
            const response = await orderAPI.getUserOrders();
            setOrders(response.data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewTracking = (order) => {
        setSelectedOrder(order);
        setShowTracking(true);
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            await orderAPI.cancelOrder(orderId, 'Cancelled by customer');
            toast.success('Order cancelled successfully');
            fetchOrders();
            if (selectedOrder?._id === orderId) {
                setShowTracking(false);
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error.response?.data?.error || 'Failed to cancel order');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return `$${price.toFixed(2)}`;
    };

    const canCancelOrder = (order) => {
        return !['shipped', 'delivered', 'cancelled'].includes(order.orderStatus);
    };

    if (loading) {
        return (
            <div className="orders-container">
                <div className="orders-loading">Loading orders...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="orders-container">
                <div className="orders-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <h2>Please Login</h2>
                    <p>Login to view your orders</p>
                    <Link to="/login">
                        <button className="login-button">Go to Login</button>
                    </Link>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-container">
                <div className="orders-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <h2>No Orders Yet</h2>
                    <p>Start shopping to see your orders here</p>
                    <Link to="/">
                        <button className="continue-shopping">Start Shopping</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1>My Orders</h1>
                <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
            </div>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                <h3>Order #{order.orderNumber}</h3>
                                <p className="order-date">{formatDate(order.createdAt)}</p>
                            </div>
                            <span className={`order-status ${order.orderStatus}`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                            </span>
                        </div>

                        <div className="order-items">
                            {order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="order-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-details">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-quantity">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="item-price">{formatPrice(item.subtotal)}</p>
                                </div>
                            ))}
                            {order.items.length > 3 && (
                                <p className="more-items">+{order.items.length - 3} more items</p>
                            )}
                        </div>

                        <div className="order-footer">
                            <div className="order-total">
                                <span>Total:</span>
                                <strong>{formatPrice(order.total)}</strong>
                            </div>
                            <div className="order-actions">
                                <button
                                    className="track-button"
                                    onClick={() => handleViewTracking(order)}
                                >
                                    Track Order
                                </button>
                                {canCancelOrder(order) && (
                                    <button
                                        className="cancel-button"
                                        onClick={() => handleCancelOrder(order._id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tracking Modal */}
            {showTracking && selectedOrder && (
                <>
                    <div className="tracking-overlay" onClick={() => setShowTracking(false)} />
                    <div className="tracking-modal">
                        <div className="modal-header">
                            <h2>Order #{selectedOrder.orderNumber}</h2>
                            <button
                                className="close-modal"
                                onClick={() => setShowTracking(false)}
                            >
                                ×
                            </button>
                        </div>
                        <OrderTracking order={selectedOrder} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Orders;
