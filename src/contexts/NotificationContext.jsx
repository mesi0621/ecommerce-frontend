import React, { createContext, useContext, useState, useEffect } from 'react';
import notificationAPI from '../api/notificationAPI';

const NotificationContext = createContext({
    notifications: [],
    unreadCount: 0,
    loading: false,
    fetchNotifications: () => { },
    fetchUnreadCount: () => { },
    markAsRead: (id) => { },
    markAllAsRead: () => { },
    deleteNotification: (id) => { },
    clearAll: () => { }
});

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async (page = 1, limit = 20) => {
        try {
            setLoading(true);
            const response = await notificationAPI.getNotifications(page, limit);
            if (response.success) {
                if (page === 1) {
                    setNotifications(response.data);
                } else {
                    setNotifications(prev => [...prev, ...response.data]);
                }
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await notificationAPI.getUnreadCount();
            if (response.success) {
                setUnreadCount(response.count);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await notificationAPI.markAsRead(notificationId);
            if (response.success) {
                setNotifications(prev =>
                    prev.map(notification =>
                        notification._id === notificationId
                            ? { ...notification, isRead: true }
                            : notification
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await notificationAPI.markAllAsRead();
            if (response.success) {
                setNotifications(prev =>
                    prev.map(notification => ({ ...notification, isRead: true }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const response = await notificationAPI.deleteNotification(notificationId);
            if (response.success) {
                const deletedNotification = notifications.find(n => n._id === notificationId);
                setNotifications(prev => prev.filter(n => n._id !== notificationId));
                if (deletedNotification && !deletedNotification.isRead) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const clearAll = async () => {
        try {
            const response = await notificationAPI.clearAll();
            if (response.success) {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error clearing all notifications:', error);
        }
    };

    // Auto-fetch unread count every 30 seconds
    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, []);

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;