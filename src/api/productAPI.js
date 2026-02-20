import api from './client';

/**
 * Product API - All 15 E-Commerce Algorithms
 */
const productAPI = {
    // Algorithm #1: Product Catalog Management
    getAll: (filters = {}) => {
        return api.get('/products', { params: filters });
    },

    getById: (id, userId = null) => {
        const params = userId ? { userId } : {};
        return api.get(`/products/${id}`, { params });
    },

    // Algorithm #2: Product Search
    search: (query, filters = {}) => {
        return api.get('/products/search', {
            params: { q: query, ...filters }
        });
    },

    // Algorithm #6: Recommendations (Content-Based Filtering)
    getRecommendations: (productId, limit = 4) => {
        return api.get(`/products/${productId}/recommendations`, {
            params: { limit }
        });
    },

    // Algorithm #8: Popularity (Best Sellers)
    getPopular: (limit = 10) => {
        return api.get('/products/popular', { params: { limit } });
    },

    // Algorithm #8: Trending Products
    getTrending: (limit = 10, days = 7) => {
        return api.get('/products/trending', {
            params: { limit, days }
        });
    },

    // Algorithm #13: Personalization
    getPersonalized: (userId, limit = 10) => {
        return api.get(`/products/personalized/${userId}`, {
            params: { limit }
        });
    },

    // Get product statistics
    getStats: (productId, days = 30) => {
        return api.get(`/products/${productId}/stats`, {
            params: { days }
        });
    },

    // Admin: Create product
    create: (productData) => {
        return api.post('/products', productData);
    },

    // Admin: Update product
    update: (id, updates) => {
        return api.put(`/products/${id}`, updates);
    },

    // Admin: Delete product
    delete: (id) => {
        return api.delete(`/products/${id}`);
    }
};

export default productAPI;
