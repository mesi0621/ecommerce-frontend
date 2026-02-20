import React, { useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import './NotificationDropdown.css';

const NotificationDropdown = ({ onClose }) => {
    const {
        notifications,
        loading,
        markAllAsRead,
        clearAll,
        fetchNotifications
    } = useNotifications();

    useEffect(() => {
        // Focus first notification for accessibility
        const firstNotification = document.querySelector('.notification-item');
        if (firstNotification) {
            firstNotification.focus();
        }
    }, [notifications]);

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    const handleClearAll = async () => {
        if (window.confirm('Are you sure you want to clear all notifications?')) {
            await clearAll();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div
            className="notification-dropdown"
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-label="Notifications"
        >
            <div className="notification-header">
                <h3>Notifications</h3>
                <div className="notification-actions">
                    {notifications.some(n => !n.isRead) && (
                        <button
                            className="btn-mark-all-read"
                            onClick={handleMarkAllAsRead}
                            title="Mark all as read"
                        >
                            Mark all read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button
                            className="btn-clear-all"
                            onClick={handleClearAll}
                            title="Clear all notifications"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            <div className="notification-list">
                {loading && notifications.length === 0 ? (
                    <div className="notification-loading">
                        <div className="loading-spinner"></div>
                        <span>Loading notifications...</span>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="notification-empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <h4>No notifications</h4>
                        <p>You're all caught up!</p>
                    </div>
                ) : (
                    <>
                        {notifications.map((notification, index) => (
                            <NotificationItem
                                key={notification._id}
                                notification={notification}
                                tabIndex={index === 0 ? 0 : -1}
                            />
                        ))}

                        {notifications.length >= 20 && (
                            <div className="notification-load-more">
                                <button
                                    className="btn-load-more"
                                    onClick={() => fetchNotifications(2)}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Load more'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="notification-footer">
                    <button className="btn-view-all" onClick={onClose}>
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;