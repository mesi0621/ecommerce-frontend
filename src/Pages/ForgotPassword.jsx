import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CSS/ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setIsSubmitted(true);

                // Show dev info in development
                if (data.dev) {
                    console.log('Development Reset Info:', data.dev);
                    setMessage(
                        data.message +
                        '\n\nDevelopment Mode: Check console for reset link.'
                    );
                }
            } else {
                setError(data.error || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isFormValid = email && validateEmail(email);

    return (
        <div className="forgot-password">
            <div className="forgot-password-container">
                <div className="forgot-password-header">
                    <h1>Forgot Password</h1>
                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                disabled={loading}
                                className={error && !validateEmail(email) ? 'error' : ''}
                            />
                            {email && !validateEmail(email) && (
                                <span className="field-error">Please enter a valid email address</span>
                            )}
                        </div>

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className="submit-btn"
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Sending Reset Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="success-message">
                        <div className="success-icon">✅</div>
                        <h3>Check Your Email</h3>
                        <p>{message}</p>
                        <div className="success-actions">
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail('');
                                    setMessage('');
                                }}
                                className="resend-btn"
                            >
                                Send Another Email
                            </button>
                        </div>
                    </div>
                )}

                <div className="forgot-password-footer">
                    <p>
                        Remember your password?{' '}
                        <Link to="/login" className="login-link">
                            Back to Login
                        </Link>
                    </p>
                    <p>
                        Don't have an account?{' '}
                        <Link to="/login" className="signup-link">
                            Sign Up
                        </Link>
                    </p>
                </div>

                <div className="security-notice">
                    <h4>🔒 Security Notice</h4>
                    <ul>
                        <li>Reset links expire after 1 hour for your security</li>
                        <li>If you don't receive an email, check your spam folder</li>
                        <li>Only the most recent reset link will work</li>
                        <li>Contact support if you continue having issues</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;