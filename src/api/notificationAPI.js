const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class NotificationAPI {
    async getNotifications(page = 1, limit = 20, type = null, isRead = null) {
        try {
            const token = localStorage.getItem('auth-token');
            let url = `${API_BASE_URL}/notifications?page=${page}&limit=${limit}`;

            if (type) url += `&type=${type}`;
            if (isRead !== null) url += `&isRead=${isRead}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    async getUnreadCount() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error;
        }
    }

    async markAsRead(notificationId) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    async markAllAsRead() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    async deleteNotification(notificationId) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }

    async clearAll() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${API_BASE_URL}/notifications/clear-all`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Error clearing all notifications:', error);
            throw error;
        }
    }
}

const notificationAPI = new NotificationAPI();
export default notificationAPI;