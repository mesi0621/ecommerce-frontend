import React from 'react';
import './OrderTracking.css';

const OrderTracking = ({ order }) => {
    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: '📝' },
        { key: 'confirmed', label: 'Confirmed', icon: '✅' },
        { key: 'processing', label: 'Processing', icon: '📦' },
        { key: 'shipped', label: 'Shipped', icon: '🚚' },
        { key: 'delivered', label: 'Delivered', icon: '🎉' }
    ];

    const cancelledStep = { key: 'cancelled', label: 'Cancelled', icon: '❌' };

    const getCurrentStepIndex = () => {
        if (order.orderStatus === 'cancelled') return -1;
        return statusSteps.findIndex(step => step.key === order.orderStatus);
    };

    const currentStepIndex = getCurrentStepIndex();
    const isCancelled = order.orderStatus === 'cancelled';

    const getStepStatus = (index) => {
        if (isCancelled) return 'inactive';
        if (index < currentStepIndex) return 'completed';
        if (index === currentStepIndex) return 'current';
        return 'upcoming';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusHistory = (statusKey) => {
        return order.statusHistory?.find(h => h.status === statusKey);
    };

    return (
        <div className="order-tracking">
            <div className="tracking-header">
                <h3>Order Status</h3>
                <span className={`status-badge ${order.orderStatus}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
            </div>

            {isCancelled ? (
                <div className="tracking-cancelled">
                    <div className="cancelled-icon">{cancelledStep.icon}</div>
                    <h4>{cancelledStep.label}</h4>
                    <p className="cancelled-date">
                        {formatDate(getStatusHistory('cancelled')?.timestamp)}
                    </p>
                    {getStatusHistory('cancelled')?.note && (
                        <p className="cancelled-reason">
                            Reason: {getStatusHistory('cancelled').note}
                        </p>
                    )}
                </div>
            ) : (
                <div className="tracking-timeline">
                    {statusSteps.map((step, index) => {
                        const status = getStepStatus(index);
                        const history = getStatusHistory(step.key);

                        return (
                            <div key={step.key} className={`timeline-step ${status}`}>
                                <div className="step-indicator">
                                    <div className="step-icon">{step.icon}</div>
                                    {index < statusSteps.length - 1 && (
                                        <div className="step-line" />
                                    )}
                                </div>
                                <div className="step-content">
                                    <h4 className="step-label">{step.label}</h4>
                                    {history && (
                                        <>
                                            <p className="step-date">{formatDate(history.timestamp)}</p>
                                            {history.note && (
                                                <p className="step-note">{history.note}</p>
                                            )}
                                        </>
                                    )}
                                    {status === 'upcoming' && (
                                        <p className="step-pending">Pending</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {order.trackingNumber && (
                <div className="tracking-number">
                    <strong>Tracking Number:</strong> {order.trackingNumber}
                </div>
            )}

            {order.estimatedDeliveryDate && !isCancelled && (
                <div className="estimated-delivery">
                    <strong>Estimated Delivery:</strong> {formatDate(order.estimatedDeliveryDate)}
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
