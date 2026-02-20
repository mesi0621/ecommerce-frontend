import React, { createContext, useState, useEffect } from 'react';
import productAPI from '../api/productAPI';
import cartAPI from '../api/cartAPI';
import interactionAPI from '../api/interactionAPI';
import { getProductImage } from '../utils/imageHelper';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    // State
    const [allProducts, setAllProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // Get user ID from auth token or localStorage
    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            // Decode token to get user ID
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserId(payload.userId);
            } catch (error) {
                console.error('Error decoding token:', error);
                setUserId(null);
            }
        } else {
            setUserId(null);
            // Load guest cart from localStorage
            loadGuestCart();
        }
    }, []);

    // Load guest cart from localStorage
    const loadGuestCart = () => {
        try {
            const guestCart = localStorage.getItem('guest-cart');
            if (guestCart) {
                setCartItems(JSON.parse(guestCart));
            }
        } catch (error) {
            console.error('Error loading guest cart:', error);
        }
    };

    // Save guest cart to localStorage
    const saveGuestCart = (cart) => {
        try {
            localStorage.setItem('guest-cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving guest cart:', error);
        }
    };

    // Fetch all products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch cart when userId is available
    useEffect(() => {
        if (userId) {
            syncGuestCartToBackend();
            fetchCart();
        }
    }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync guest cart to backend when user logs in
    const syncGuestCartToBackend = async () => {
        try {
            const guestCart = localStorage.getItem('guest-cart');
            if (guestCart) {
                const guestCartItems = JSON.parse(guestCart);
                console.log('Syncing guest cart to backend:', guestCartItems);

                // Add each item from guest cart to backend
                for (const [productId, quantity] of Object.entries(guestCartItems)) {
                    if (quantity > 0) {
                        const product = allProducts.find(p => p.id === Number(productId));
                        if (product) {
                            await cartAPI.addItem(userId, Number(productId), quantity, product.new_price);
                        }
                    }
                }

                // Clear guest cart after syncing
                localStorage.removeItem('guest-cart');
                console.log('Guest cart synced and cleared');
            }
        } catch (error) {
            console.error('Error syncing guest cart:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            console.log('Fetching products from backend...');
            const response = await productAPI.getAll();
            console.log('Backend response:', response);

            // The API returns { success: true, data: [products] }
            const products = response.data.data || [];
            console.log(`Received ${products.length} products from backend`);

            // Add image URLs to products
            const productsWithImages = products.map(product => {
                const imagePath = getProductImage(product.image);
                console.log(`Product ${product.id}: ${product.image} -> ${imagePath}`);
                return {
                    ...product,
                    image: imagePath
                };
            });

            console.log('Products with images:', productsWithImages.slice(0, 2));
            setAllProducts(productsWithImages);
        } catch (error) {
            console.error('Error fetching products:', error);
            console.error('Error details:', error.response || error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCart = async () => {
        if (!userId) return;

        try {
            const response = await cartAPI.getCart(userId);
            const cart = response.data.data;

            // Convert cart items to object format
            const cartObj = {};
            if (cart && cart.items) {
                cart.items.forEach(item => {
                    cartObj[item.productId] = item.quantity;
                });
            }
            setCartItems(cartObj);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (itemId) => {
        const token = localStorage.getItem('auth-token');

        // Guest user - add to local cart
        if (!token || !userId) {
            console.log('Guest user - adding to local cart');
            const newCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
            setCartItems(newCart);
            saveGuestCart(newCart);
            return { success: true, isGuest: true };
        }

        // Logged in user - add to backend cart
        try {
            // Find product
            const product = allProducts.find(p => p.id === itemId);
            if (!product) {
                console.error('Product not found:', itemId);
                return { success: false, error: 'Product not found' };
            }

            console.log('Adding to cart:', { userId, itemId, product });

            // Update local state first for immediate feedback
            setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

            // Update backend
            const response = await cartAPI.addItem(userId, itemId, 1, product.new_price);
            console.log('Cart API response:', response);

            // Refresh cart from backend to sync state
            await fetchCart();

            // Track interaction (fire and forget - don't block)
            interactionAPI.track(itemId, userId, 'cart_add').catch(err => {
                console.error('Error tracking interaction (non-blocking):', err.message);
            });

            return { success: true };
        } catch (error) {
            console.error('Error adding to cart:', error);
            console.error('Error details:', error.response?.data || error.message);

            // Revert local state on error
            setCartItems((prev) => {
                const newCart = { ...prev };
                if (newCart[itemId] > 1) {
                    newCart[itemId]--;
                } else {
                    delete newCart[itemId];
                }
                return newCart;
            });

            return { success: false, error: error.message };
        }
    };

    const removeFromCart = async (itemId) => {
        const token = localStorage.getItem('auth-token');

        // Guest user - remove from local cart
        if (!token || !userId) {
            const newQuantity = (cartItems[itemId] || 0) - 1;
            if (newQuantity <= 0) {
                const newCart = { ...cartItems };
                delete newCart[itemId];
                setCartItems(newCart);
                saveGuestCart(newCart);
            } else {
                const newCart = { ...cartItems, [itemId]: newQuantity };
                setCartItems(newCart);
                saveGuestCart(newCart);
            }
            return;
        }

        // Logged in user - remove from backend cart
        try {
            const newQuantity = (cartItems[itemId] || 0) - 1;

            if (newQuantity <= 0) {
                // Remove item completely
                setCartItems((prev) => {
                    const newCart = { ...prev };
                    delete newCart[itemId];
                    return newCart;
                });
                await cartAPI.removeItem(userId, itemId);
            } else {
                // Decrease quantity
                setCartItems((prev) => ({ ...prev, [itemId]: newQuantity }));
                await cartAPI.updateItemQuantity(userId, itemId, newQuantity);
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = allProducts.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const contextValue = {
        all_product: allProducts,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        loading,
        userId,
        refreshProducts: fetchProducts,
        refreshCart: fetchCart
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
