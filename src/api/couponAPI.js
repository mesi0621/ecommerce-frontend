import api from './client';

/**
 * Coupon API
 */
const couponAPI = {
    // Validate coupon
    validateCoupon: (code, userId, subtotal, shippingFee = 0) => {
        return api.post('/coupons/validate', {
            code,
            userId,
            subtotal,
            shippingFee
        });
    },

    // Record coupon usage
    useCoupon: (couponId, userId, orderId, discountAmount) => {
        return api.post('/coupons/use', {
            couponId,
            userId,
            orderId,
            discountAmount
        });
    },

    // Get all coupons (Admin)
    getAllCoupons: (active, page = 1, limit = 50) => {
        return api.get('/coupons', {
            params: { active, page, limit }
        });
    },

    // Create coupon (Admin)
    createCoupon: (couponData) => {
        return api.post('/coupons', couponData);
    },

    // Update coupon (Admin)
    updateCoupon: (id, updates) => {
        return api.put(`/coupons/${id}`, updates);
    },

    // Delete coupon (Admin)
    deleteCoupon: (id) => {
        return api.delete(`/coupons/${id}`);
    }
};

export default couponAPI;
