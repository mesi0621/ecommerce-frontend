import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/SupportDashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const SupportDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isSupport, getDisplayName, logout } = useAuth();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState('tickets');
    const [tickets, setTickets] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [ticketResponse, setTicketResponse] = useState('');

    useEffect(() => {
        if (!isAuthenticated || !isSupport()) {
            toast.error('Access denied. Support staff only.');
            navigate('/');
            return;
        }

        if (activeTab === 'tickets') {
            fetchTickets();
        } else if (activeTab === 'reviews') {
            fetchReviews();
        }
    }, [isAuthenticated, isSupport, navigate, toast, activeTab]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/support/tickets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                setTickets(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:5000/api/support/reviews/flagged', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                setReviews(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleRespondToTicket = async () => {
        if (!ticketResponse.trim()) {
            toast.warning('Please enter a response');
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/support/tickets/${selectedTicket._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ response: ticketResponse })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Response sent successfully');
                setTicketResponse('');
                setShowTicketModal(false);
                fetchTickets();
            } else {
                toast.error(data.error || 'Failed to send response');
            }
        } catch (error) {
            console.error('Error responding to ticket:', error);
            toast.error('Failed to send response');
        }
    };

    const handleResolveTicket = async (ticketId) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/support/tickets/${ticketId}/resolve`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Ticket resolved');
                fetchTickets();
                if (selectedTicket?._id === ticketId) {
                    setShowTicketModal(false);
                }
            } else {
                toast.error(data.error || 'Failed to resolve ticket');
            }
        } catch (error) {
            console.error('Error resolving ticket:', error);
            toast.error('Failed to resolve ticket');
        }
    };

    const handleModerateReview = async (reviewId, action) => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:5000/api/support/reviews/${reviewId}/moderate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action })
            });

            const data = await response.json();
            if (data.success) {
                toast.success(`Review ${action === 'hide' ? 'hidden' : 'approved'}`);
                fetchReviews();
            } else {
                toast.error(data.error || 'Failed to moderate review');
            }
        } catch (error) {
            console.error('Error moderating review:', error);
            toast.error('Failed to moderate review');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTicketStats = () => {
        return {
            total: tickets.length,
            open: tickets.filter(t => t.status === 'open').length,
            in_progress: tickets.filter(t => t.status === 'in_progress').length,
            resolved: tickets.filter(t => t.status === 'resolved').length
        };
    };

    const stats = getTicketStats();

    if (loading) {
        return (
            <div className="support-dashboard">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="support-dashboard">
            <div className="support-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-icon">🎧</div>
                    <h2>Support Portal</h2>
                    <p className="user-name">{getDisplayName()}</p>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tickets')}
                    >
                        <span className="nav-icon">🎫</span>
                        <span>Support Tickets</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        <span className="nav-icon">⭐</span>
                        <span>Review Moderation</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <span className="nav-icon">👤</span>
                        <span>Profile</span>
                    </button>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span>
                    <span>Logout</span>
                </button>
            </div>

            <div className="support-main">
                <div className="dashboard-header">
                    <h1>Support Dashboard</h1>
                    <button
                        className="refresh-btn"
                        onClick={() => activeTab === 'tickets' ? fetchTickets() : fetchReviews()}
                    >
                        🔄 Refresh
                    </button>
                </div>

                {activeTab === 'tickets' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🎫</div>
                                <div className="stat-content">
                                    <h3>{stats.total}</h3>
                                    <p>Total Tickets</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📬</div>
                                <div className="stat-content">
                                    <h3>{stats.open}</h3>
                                    <p>Open</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⏳</div>
                                <div className="stat-content">
                                    <h3>{stats.in_progress}</h3>
                                    <p>In Progress</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✅</div>
                                <div className="stat-content">
                                    <h3>{stats.resolved}</h3>
                                    <p>Resolved</p>
                                </div>
                            </div>
                        </div>

                        <div className="tickets-section">
                            <h2>Support Tickets</h2>
                            {tickets.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📭</div>
                                    <h3>No Tickets</h3>
                                    <p>There are no support tickets at the moment</p>
                                </div>
                            ) : (
                                <div className="tickets-list">
                                    {tickets.map((ticket) => (
                                        <div key={ticket._id} className="ticket-card">
                                            <div className="ticket-header">
                                                <div className="ticket-info">
                                                    <h3>{ticket.subject}</h3>
                                                    <p className="ticket-date">{formatDate(ticket.createdAt)}</p>
                                                </div>
                                                <span className={`ticket-status ${ticket.status}`}>
                                                    {ticket.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="ticket-message">{ticket.message}</p>
                                            <div className="ticket-meta">
                                                <span>Category: {ticket.category}</span>
                                                <span>Priority: {ticket.priority}</span>
                                            </div>
                                            <div className="ticket-actions">
                                                <button
                                                    className="view-btn"
                                                    onClick={() => {
                                                        setSelectedTicket(ticket);
                                                        setShowTicketModal(true);
                                                    }}
                                                >
                                                    View & Respond
                                                </button>
                                                {ticket.status !== 'resolved' && (
                                                    <button
                                                        className="resolve-btn"
                                                        onClick={() => handleResolveTicket(ticket._id)}
                                                    >
                                                        Mark as Resolved
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'reviews' && (
                    <div className="reviews-section">
                        <h2>Flagged Reviews</h2>
                        {reviews.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">⭐</div>
                                <h3>No Flagged Reviews</h3>
                                <p>There are no reviews requiring moderation</p>
                            </div>
                        ) : (
                            <div className="reviews-list">
                                {reviews.map((review) => (
                                    <div key={review._id} className="review-card">
                                        <div className="review-header">
                                            <div className="review-rating">
                                                {'⭐'.repeat(review.rating)}
                                            </div>
                                            <span className="review-date">{formatDate(review.createdAt)}</span>
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                        <div className="review-meta">
                                            <span>Product: {review.productId?.name || 'Unknown'}</span>
                                            <span>User: {review.userId?.username || 'Anonymous'}</span>
                                        </div>
                                        <div className="review-actions">
                                            <button
                                                className="approve-btn"
                                                onClick={() => handleModerateReview(review._id, 'approve')}
                                            >
                                                ✓ Approve
                                            </button>
                                            <button
                                                className="hide-btn"
                                                onClick={() => handleModerateReview(review._id, 'hide')}
                                            >
                                                ✕ Hide
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="profile-section">
                        <h2>Profile Information</h2>
                        <div className="profile-card">
                            <div className="profile-avatar">👤</div>
                            <div className="profile-info">
                                <h3>{getDisplayName()}</h3>
                                <p className="profile-role">Support Staff</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showTicketModal && selectedTicket && (
                <>
                    <div className="modal-overlay" onClick={() => setShowTicketModal(false)} />
                    <div className="ticket-modal">
                        <div className="modal-header">
                            <h2>{selectedTicket.subject}</h2>
                            <button className="close-modal" onClick={() => setShowTicketModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="modal-section">
                                <h3>Ticket Details</h3>
                                <p><strong>Status:</strong> {selectedTicket.status}</p>
                                <p><strong>Category:</strong> {selectedTicket.category}</p>
                                <p><strong>Priority:</strong> {selectedTicket.priority}</p>
                                <p><strong>Created:</strong> {formatDate(selectedTicket.createdAt)}</p>
                            </div>
                            <div className="modal-section">
                                <h3>Message</h3>
                                <p>{selectedTicket.message}</p>
                            </div>
                            {selectedTicket.response && (
                                <div className="modal-section">
                                    <h3>Previous Response</h3>
                                    <p>{selectedTicket.response}</p>
                                </div>
                            )}
                            {selectedTicket.status !== 'resolved' && (
                                <div className="modal-section">
                                    <h3>Send Response</h3>
                                    <textarea
                                        className="response-textarea"
                                        value={ticketResponse}
                                        onChange={(e) => setTicketResponse(e.target.value)}
                                        placeholder="Type your response here..."
                                        rows="5"
                                    />
                                    <div className="modal-actions">
                                        <button className="send-btn" onClick={handleRespondToTicket}>
                                            Send Response
                                        </button>
                                        <button
                                            className="resolve-btn"
                                            onClick={() => handleResolveTicket(selectedTicket._id)}
                                        >
                                            Resolve Ticket
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SupportDashboard;
