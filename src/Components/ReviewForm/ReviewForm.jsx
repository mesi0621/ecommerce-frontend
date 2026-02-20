import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewForm.css';
import StarRating from '../StarRating/StarRating';
import reviewAPI from '../../api/reviewAPI';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const toast = useToast();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const maxChars = 1000;
    const charCount = comment.length;
    const charsRemaining = maxChars - charCount;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!rating) {
            setError('Please select a rating');
            return;
        }

        if (comment.trim().length < 10) {
            setError('Review must be at least 10 characters');
            return;
        }

        if (charCount > maxChars) {
            setError(`Review must be less than ${maxChars} characters`);
            return;
        }

        setSubmitting(true);

        try {
            await reviewAPI.addReview(productId, user.userId, rating, comment.trim());
            toast.success('Review submitted successfully!');
            setRating(0);
            setComment('');
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            setError(err.response?.data?.error || 'Failed to submit review');
            toast.error('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setRating(0);
        setComment('');
        setError('');
    };

    if (!isAuthenticated) {
        return (
            <div className="review-form">
                <div className="review-form-login">
                    <p>Please login to write a review</p>
                    <button onClick={() => navigate('/login')}>
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="review-form">
            <div className="review-form-header">
                <h3>Write a Review</h3>
                <p>Share your experience with this product</p>
            </div>

            {error && (
                <div className="review-form-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="review-form-group">
                    <label>
                        Rating<span className="required">*</span>
                    </label>
                    <div className="review-form-rating">
                        <StarRating
                            rating={rating}
                            onRatingChange={setRating}
                            size="large"
                        />
                        {rating > 0 && (
                            <span className="review-form-rating-text">
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="review-form-group">
                    <label htmlFor="review-comment">
                        Your Review<span className="required">*</span>
                    </label>
                    <textarea
                        id="review-comment"
                        className="review-form-textarea"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you think about this product..."
                        maxLength={maxChars + 1}
                    />
                    <div className={`review-form-char-count ${charsRemaining < 100 ? 'warning' : ''} ${charsRemaining < 0 ? 'error' : ''}`}>
                        {charsRemaining} characters remaining
                    </div>
                </div>

                <div className="review-form-actions">
                    <button
                        type="button"
                        className="review-form-btn cancel"
                        onClick={handleCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="review-form-btn submit"
                        disabled={submitting || !rating || charCount < 10 || charCount > maxChars}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
