import api from './client';

/**
 * Cart API - Algorithm #10: Cart & Checkout
 */
const cartAPI = {
    // Get user's cart
    getCart: (userId) => {
        return api.get(`/cart/${userId}`);
    },

    // Update entire cart
    updateCart: (userId, items, coupon = null) => {
        return api.post('/cart', { userId, items, coupon });
    },

    // Add item to cart
    addItem: (userId, productId, quantity, price) => {
        return api.post(`/cart/${userId}/items`, {
            productId,
            quantity,
            price
        });
    },

    // Remove item from cart
    removeItem: (userId, productId) => {
        return api.delete(`/cart/${userId}/items/${productId}`);
    },

    // Update item quantity
    updateItemQuantity: (userId, productId, quantity) => {
        return api.patch(`/cart/${userId}/items/${productId}`, {
            quantity
        });
    },

    // Apply coupon
    applyCoupon: (userId, coupon) => {
        return api.post(`/cart/${userId}/coupon`, coupon);
    },

    // Calculate checkout total (Algorithm #10)
    calculateCheckout: (userId, taxRate = 0.1) => {
        return api.post('/cart/checkout', { userId, taxRate });
    },

    // Clear cart
    clearCart: (userId) => {
        return api.delete(`/cart/${userId}`);
    }
};

export default cartAPI;
