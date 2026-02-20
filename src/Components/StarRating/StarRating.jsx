import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating = 0, onRatingChange, readonly = false, size = 'medium' }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (!readonly) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoverRating(0);
        }
    };

    const displayRating = hoverRating || rating;

    return (
        <div className={`star-rating ${size} ${readonly ? 'readonly' : 'interactive'}`}>
            {[1, 2, 3, 4, 5].map((value) => (
                <button
                    key={value}
                    type="button"
                    className={`star ${value <= displayRating ? 'filled' : 'empty'}`}
                    onClick={() => handleClick(value)}
                    onMouseEnter={() => handleMouseEnter(value)}
                    onMouseLeave={handleMouseLeave}
                    disabled={readonly}
                    aria-label={`${value} star${value > 1 ? 's' : ''}`}
                >
                    ★
                </button>
            ))}
            {readonly && rating > 0 && (
                <span className="rating-value">{rating.toFixed(1)}</span>
            )}
        </div>
    );
};

export default StarRating;
