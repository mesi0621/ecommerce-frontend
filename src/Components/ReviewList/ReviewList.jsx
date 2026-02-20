import React, { useState, useEffect } from 'react';
import './ReviewList.css';
import StarRating from '../StarRating/StarRating';
import reviewAPI from '../../api/reviewAPI';
import { useToast } from '../../hooks/useToast';

const ReviewList = ({ productId, refreshTrigger }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('helpfulness');
    const toast = useToast();

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        fetchReviews();
        fetchStats();
    }, [productId, sortBy, refreshTrigger]);

    const fetchReviews = async () => {
        try {
            const response = await reviewAPI.getReviews(productId, sortBy);
            setReviews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await reviewAPI.getReviewStats(productId);
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching review stats:', error);
        }
    };

    const handleVote = async (reviewId, voteType) => {
        try {
            await reviewAPI.voteReview(reviewId, voteType);
            toast.success('Vote recorded');
            fetchReviews();
        } catch (error) {
            console.error('Error voting:', error);
            toast.error('Failed to record vote');
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            await reviewAPI.deleteReview(reviewId, user.id);
            toast.success('Review deleted');
            fetchReviews();
            fetchStats();
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getUserInitial = (userId) => {
        return userId ? userId.charAt(0).toUpperCase() : 'U';
    };

    if (loading) {
        return (
            <div className="review-list">
                <div className="review-list-loading">Loading reviews...</div>
            </div>
        );
    }

    return (
        <div className="review-list">
            <div className="review-list-header">
                <h2 className="review-list-title">
                    Customer Reviews
                    <span className="review-list-count">({reviews.length})</span>
                </h2>
                <div className="review-list-sort">
                    <label htmlFor="sort-reviews">Sort by:</label>
                    <select
                        id="sort-reviews"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="helpfulness">Most Helpful</option>
                        <option value="recent">Most Recent</option>
                        <option value="rating_high">Highest Rating</option>
                        <option value="rating_low">Lowest Rating</option>
                    </select>
                </div>
            </div>

            {stats && stats.totalReviews > 0 && (
                <div className="review-stats">
                    <div className="review-stats-average">
                        <div className="review-stats-number">{stats.averageRating.toFixed(1)}</div>
                        <StarRating rating={stats.averageRating} readonly size="small" />
                        <div className="review-stats-text">{stats.totalReviews} reviews</div>
                    </div>
                    <div className="review-stats-breakdown">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.ratingDistribution[star] || 0;
                            const percentage = stats.totalReviews > 0
                                ? (count / stats.totalReviews) * 100
                                : 0;
                            return (
                                <div key={star} className="review-stats-bar">
                                    <span className="review-stats-stars">{star} stars</span>
                                    <div className="review-stats-progress">
                                        <div
                                            className="review-stats-progress-fill"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="review-stats-count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {reviews.length === 0 ? (
                <div className="review-list-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <h3>No Reviews Yet</h3>
                    <p>Be the first to review this product</p>
                </div>
            ) : (
                <div className="review-items">
                    {reviews.map((review) => (
                        <div key={review._id} className="review-item">
                            <div className="review-item-header">
                                <div className="review-item-user">
                                    <div className="review-item-avatar">
                                        {getUserInitial(review.userId)}
                                    </div>
                                    <div className="review-item-user-info">
                                        <div className="review-item-username">
                                            {review.userId}
                                        </div>
                                        <div className="review-item-date">
                                            {formatDate(review.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} readonly size="small" />
                            </div>

                            <div className="review-item-comment">{review.comment}</div>

                            <div className="review-item-footer">
                                <span className="review-item-helpful">Was this helpful?</span>
                                <div className="review-item-votes">
                                    <button
                                        className="review-vote-btn"
                                        onClick={() => handleVote(review._id, 'upvote')}
                                    >
                                        👍 {review.upvotes}
                                    </button>
                                    <button
                                        className="review-vote-btn"
                                        onClick={() => handleVote(review._id, 'downvote')}
                                    >
                                        👎 {review.downvotes}
                                    </button>
                                </div>
                                {user && user.id === review.userId && (
                                    <button
                                        className="review-delete-btn"
                                        onClick={() => handleDelete(review._id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewList;
