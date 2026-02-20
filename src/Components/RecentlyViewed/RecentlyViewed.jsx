import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RecentlyViewed.css';

const RecentlyViewed = ({ currentProductId, maxItems = 10 }) => {
    const [recentProducts, setRecentProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadRecentlyViewed();
    }, [currentProductId]);

    const loadRecentlyViewed = () => {
        try {
            const stored = localStorage.getItem('recentlyViewed');
            if (stored) {
                const products = JSON.parse(stored);
                // Filter out current product if viewing product page
                const filtered = currentProductId
                    ? products.filter(p => p.id !== currentProductId)
                    : products;
                setRecentProducts(filtered.slice(0, maxItems));
            }
        } catch (error) {
            console.error('Error loading recently viewed:', error);
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return 'Over a week ago';
    };

    if (recentProducts.length === 0) {
        return (
            <div className="recently-viewed">
                <div className="recently-viewed-container">
                    <div className="recently-viewed-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <h3>No Recently Viewed Products</h3>
                        <p>Products you view will appear here</p>
                        <button onClick={() => navigate('/')}>
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="recently-viewed">
            <div className="recently-viewed-container">
                <div className="recently-viewed-header">
                    <h2 className="recently-viewed-title">Recently Viewed</h2>
                    <p className="recently-viewed-subtitle">
                        Continue where you left off
                    </p>
                </div>

                <div className="recently-viewed-grid">
                    {recentProducts.map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="recently-viewed-item"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="recently-viewed-image"
                            />
                            <div className="recently-viewed-info">
                                <h3 className="recently-viewed-name">{product.name}</h3>
                                <div className="recently-viewed-price">
                                    <span className="recently-viewed-new-price">
                                        ${product.new_price}
                                    </span>
                                    {product.old_price && (
                                        <span className="recently-viewed-old-price">
                                            ${product.old_price}
                                        </span>
                                    )}
                                </div>
                                <div className="recently-viewed-viewed-time">
                                    Viewed {formatTimeAgo(product.viewedAt)}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentlyViewed;
