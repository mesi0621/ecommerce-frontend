import { useState, useEffect, useCallback } from 'react';
import cartAPI from '../api/cartAPI';
import interactionAPI from '../api/interactionAPI';

/**
 * Hook for shopping cart management
 * Algorithm #10: Cart & Checkout
 */
export const useCart = (userId) => {
    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            fetchCart();
        }
        // eslint-disable-next-line
    }, [userId]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartAPI.getCart(userId);
            setCart(response.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch cart');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const addItem = useCallback(async (productId, quantity, price) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartAPI.addItem(userId, productId, quantity, price);
            setCart(response.data.data);

            // Track cart_add interaction
            await interactionAPI.track(productId, userId, 'cart_add');

            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add item');
            console.error('Error adding item:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const removeItem = useCallback(async (productId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartAPI.removeItem(userId, productId);
            setCart(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to remove item');
            console.error('Error removing item:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const updateQuantity = useCallback(async (productId, quantity) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartAPI.updateItemQuantity(userId, productId, quantity);
            setCart(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update quantity');
            console.error('Error updating quantity:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const applyCoupon = useCallback(async (coupon) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartAPI.applyCoupon(userId, coupon);
            setCart(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to apply coupon');
            console.error('Error applying coupon:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const calculateCheckout = useCallback(async (taxRate = 0.1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartAPI.calculateCheckout(userId, taxRate);
            setTotal(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to calculate checkout');
            console.error('Error calculating checkout:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const clearCart = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartAPI.clearCart(userId);
            setCart(response.data.data);
            setTotal(null);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to clear cart');
            console.error('Error clearing cart:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    return {
        cart,
        total,
        loading,
        error,
        fetchCart,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        calculateCheckout,
        clearCart
    };
};

export default useCart;
