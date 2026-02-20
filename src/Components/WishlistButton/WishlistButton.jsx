import React, { useState, useEffect } from 'react';
import './WishlistButton.css';
import wishlistAPI from '../../api/wishlistAPI';
import { useToast } from '../../hooks/useToast';

const WishlistButton = ({ productId, size = 'medium' }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        checkWishlistStatus();
    }, [productId]);

    const checkWishlistStatus = async () => {
        const token = localStorage.getItem('auth-token');
        if (!token) return;

        try {
            const response = await wishlistAPI.getWishlist();
            const wishlist = response.data.data;
            const inWishlist = wishlist.items.some(item => item.productId === productId);
            setIsInWishlist(inWishlist);
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    };

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('auth-token');
        if (!token) {
            toast.info('Please login to add items to wishlist');
            return;
        }

        setLoading(true);
        try {
            if (isInWishlist) {
                await wishlistAPI.removeItem(productId);
                setIsInWishlist(false);
                toast.success('Removed from wishlist');
            } else {
                await wishlistAPI.addItem(productId);
                setIsInWishlist(true);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            toast.error(error.response?.data?.error || 'Failed to update wishlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`wishlist-button ${size} ${isInWishlist ? 'active' : ''} ${loading ? 'loading' : ''}`}
            onClick={handleToggle}
            disabled={loading}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <svg
                className="heart-icon"
                viewBox="0 0 24 24"
                fill={isInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
};

export default WishlistButton;
