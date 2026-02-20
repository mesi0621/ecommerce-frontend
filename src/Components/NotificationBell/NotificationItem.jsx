import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import './NotificationItem.css';

const NotificationItem = ({ notification, tabIndex }) => {
    const { markAsRead, deleteNotification } = useNotifications();

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order':
                return '📦';
            case 'product':
                return '📋';
            case 'payment':
                return '💰';
            case 'seller':
                return '🏪';
            case 'admin':
                return '⚙️';
            case 'system':
                return '🔔';
            default:
                return '📢';
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return time.toLocaleDateString();
    };

    const handleClick = async () => {
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }

        // Navigate to link if provided
        if (notification.link) {
            window.location.href = notification.link;
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        await deleteNotification(notification._id);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
        if (event.key === 'Delete' || event.key === 'Backspace') {
            event.preventDefault();
            handleDelete(event);
        }
    };

    return (
        <div
            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={tabIndex}
            role="button"
            aria-label={`${notification.title}. ${notification.isRead ? 'Read' : 'Unread'}. ${getTimeAgo(notification.createdAt)}`}
        >
            <div className="notification-icon">
                <span role="img" aria-hidden="true">
                    {getNotificationIcon(notification.type)}
                </span>
            </div>

            <div className="notification-content">
                <div className="notification-title">
                    {notification.title}
                    {!notification.isRead && (
                        <span className="unread-dot" aria-hidden="true"></span>
                    )}
                </div>
                <div className="notification-message">
                    {notification.message}
                </div>
                <div className="notification-time">
                    {getTimeAgo(notification.createdAt)}
                </div>
            </div>

            <button
                className="notification-delete"
                onClick={handleDelete}
                aria-label="Delete notification"
                title="Delete notification"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6" />
                    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
            </button>
        </div>
    );
};

export default NotificationItem;