/**
 * Utility functions for managing recently viewed products
 */

const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 20;

/**
 * Add a product to recently viewed list
 * @param {Object} product - Product object with id, name, image, new_price, old_price
 */
export const addToRecentlyViewed = (product) => {
    try {
        // Get existing list
        const stored = localStorage.getItem(STORAGE_KEY);
        let recentProducts = stored ? JSON.parse(stored) : [];

        // Remove product if it already exists
        recentProducts = recentProducts.filter(p => p.id !== product.id);

        // Add product to the beginning with timestamp
        recentProducts.unshift({
            id: product.id,
            name: product.name,
            image: product.image,
            new_price: product.new_price,
            old_price: product.old_price,
            category: product.category,
            viewedAt: Date.now()
        });

        // Keep only MAX_ITEMS
        recentProducts = recentProducts.slice(0, MAX_ITEMS);

        // Save back to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentProducts));
    } catch (error) {
        console.error('Error adding to recently viewed:', error);
    }
};

/**
 * Get recently viewed products
 * @param {number} limit - Maximum number of products to return
 * @returns {Array} Array of recently viewed products
 */
export const getRecentlyViewed = (limit = MAX_ITEMS) => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const products = JSON.parse(stored);
        return products.slice(0, limit);
    } catch (error) {
        console.error('Error getting recently viewed:', error);
        return [];
    }
};

/**
 * Clear all recently viewed products
 */
export const clearRecentlyViewed = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing recently viewed:', error);
    }
};

/**
 * Remove a specific product from recently viewed
 * @param {number} productId - Product ID to remove
 */
export const removeFromRecentlyViewed = (productId) => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        let products = JSON.parse(stored);
        products = products.filter(p => p.id !== productId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
        console.error('Error removing from recently viewed:', error);
    }
};
