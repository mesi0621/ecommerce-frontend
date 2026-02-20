import api from './client';

/**
 * Review API - Algorithm #12: Review & Rating
 */
const reviewAPI = {
    // Get product reviews
    getReviews: (productId, sortBy = 'helpfulness', limit = 50) => {
        return api.get(`/reviews/${productId}`, {
            params: { sortBy, limit }
        });
    },

    // Get review statistics
    getReviewStats: (productId) => {
        return api.get(`/reviews/${productId}/stats`);
    },

    // Add review
    addReview: (productId, userId, rating, comment) => {
        return api.post('/reviews', {
            productId,
            userId,
            rating,
            comment
        });
    },

    // Vote on review
    voteReview: (reviewId, voteType) => {
        return api.post(`/reviews/${reviewId}/vote`, { voteType });
    },

    // Delete review
    deleteReview: (reviewId, userId) => {
        return api.delete(`/reviews/${reviewId}`, {
            data: { userId }
        });
    }
};

export default reviewAPI;
