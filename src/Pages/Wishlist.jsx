import React, { useState, useEffect, useContext } from 'react';
import './CSS/Wishlist.css';
import wishlistAPI from '../api/wishlistAPI';
import { useToast } from '../hooks/useToast';
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const { addToCart } = useContext(ShopContext);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchWishlist();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchWishlist = async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        try {
            const response = await wishlistAPI.getWishlist();
            setWishlistItems(response.data.data.items);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await wishlistAPI.removeItem(productId);
            setWishlistItems(prev => prev.filter(item => item.productId !== productId));
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    const handleMoveToCart = async (productId) => {
        try {
            const result = await addToCart(productId);
            if (result.success) {
                setWishlistItems(prev => prev.filter(item => item.productId !== productId));
                toast.success('Moved to cart');
            } else if (result.requiresAuth) {
                toast.info('Please login to add items to cart');
            } else {
                toast.error(result.error || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Error moving to cart:', error);
            toast.error('Failed to move to cart');
        }
    };

    const handleClearWishlist = async () => {
        if (!window.confirm('Are you sure you want to clear your wishlist?')) {
            return;
        }

        try {
            await wishlistAPI.clearWishlist();
            setWishlistItems([]);
            toast.success('Wishlist cleared');
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            toast.error('Failed to clear wishlist');
        }
    };

    if (loading) {
        return (
            <div className="wishlist-container">
                <div className="wishlist-loading">Loading wishlist...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="wishlist-container">
                <div className="wishlist-empty">
                    <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <h2>Please Login</h2>
                    <p>Login to view your wishlist</p>
                    <Link to="/login">
                        <button className="login-button">Go to Login</button>
                    </Link>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="wishlist-container">
                <div className="wishlist-empty">
                    <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <h2>Your Wishlist is Empty</h2>
                    <p>Add items you love to your wishlist</p>
                    <Link to="/">
                        <button className="continue-shopping">Continue Shopping</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h1>My Wishlist</h1>
                <div className="wishlist-actions">
                    <span className="wishlist-count">{wishlistItems.length} items</span>
                    <button className="clear-wishlist" onClick={handleClearWishlist}>
                        Clear All
                    </button>
                </div>
            </div>

            <div className="wishlist-grid">
                {wishlistItems.map((item) => (
                    <div key={item.productId} className="wishlist-item">
                        <Link to={`/product/${item.productId}`} className="item-image-link">
                            <img src={item.product.image} alt={item.product.name} className="item-image" />
                        </Link>

                        <div className="item-details">
                            <Link to={`/product/${item.productId}`} className="item-name-link">
                                <h3 className="item-name">{item.product.name}</h3>
                            </Link>

                            <div className="item-price">
                                <span className="new-price">${item.product.new_price}</span>
                                {item.product.old_price > item.product.new_price && (
                                    <span className="old-price">${item.product.old_price}</span>
                                )}
                            </div>

                            {item.product.stock > 0 ? (
                                <span className="stock-status in-stock">In Stock</span>
                            ) : (
                                <span className="stock-status out-of-stock">Out of Stock</span>
                            )}

                            <div className="item-actions">
                                <button
                                    className="move-to-cart-btn"
                                    onClick={() => handleMoveToCart(item.productId)}
                                    disabled={item.product.stock === 0}
                                >
                                    Move to Cart
                                </button>
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemove(item.productId)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
