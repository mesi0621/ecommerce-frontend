import client from './client';

const wishlistAPI = {
    // Get user's wishlist
    getWishlist: async () => {
        const response = await client.get('/wishlist');
        return response;
    },

    // Add item to wishlist
    addItem: async (productId) => {
        const response = await client.post('/wishlist/items', { productId });
        return response;
    },

    // Remove item from wishlist
    removeItem: async (productId) => {
        const response = await client.delete(`/wishlist/items/${productId}`);
        return response;
    },

    // Clear wishlist
    clearWishlist: async () => {
        const response = await client.delete('/wishlist');
        return response;
    },

    // Move item from wishlist to cart
    moveToCart: async (productId) => {
        const response = await client.post(`/wishlist/items/${productId}/move-to-cart`);
        return response;
    }
};

export default wishlistAPI;
