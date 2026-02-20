import client from './client';

const orderAPI = {
    // Create new order
    createOrder: async (orderData) => {
        const response = await client.post('/orders', orderData);
        return response;
    },

    // Get user's orders
    getUserOrders: async (params = {}) => {
        const response = await client.get('/orders', { params });
        return response;
    },

    // Get order by ID
    getOrderById: async (orderId) => {
        const response = await client.get(`/orders/${orderId}`);
        return response;
    },

    // Cancel order
    cancelOrder: async (orderId, reason) => {
        const response = await client.post(`/orders/${orderId}/cancel`, { reason });
        return response;
    },

    // Confirm payment (for testing/admin)
    confirmPayment: async (orderId, transactionId) => {
        const response = await client.post(`/orders/${orderId}/confirm-payment`, { transactionId });
        return response;
    }
};

export default orderAPI;
