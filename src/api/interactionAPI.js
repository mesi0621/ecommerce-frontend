import api from './client';

/**
 * Interaction API - User behavior tracking
 */
const interactionAPI = {
    // Track interaction (view, cart_add, purchase)
    track: (productId, userId, type, metadata = {}) => {
        return api.post('/interactions', {
            productId,
            userId,
            type,
            metadata
        });
    },

    // Get user's interaction history
    getUserInteractions: (userId, type = null, limit = 50) => {
        const params = { limit };
        if (type) params.type = type;
        return api.get(`/interactions/user/${userId}`, { params });
    },

    // Get product statistics
    getProductStats: (productId, days = 30) => {
        return api.get(`/interactions/product/${productId}/stats`, {
            params: { days }
        });
    },

    // Bulk track interactions
    bulkTrack: (interactions) => {
        return api.post('/interactions/bulk', { interactions });
    }
};

export default interactionAPI;
