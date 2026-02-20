import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import './CSS/ResetPassword.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [verifyingToken, setVerifyingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: []
    });

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link. Please request a new password reset.');
            setVerifyingToken(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/auth/verify-reset-token/${token}`);
                const data = await response.json();

                if (data.success) {
                    setTokenValid(true);
                    setUserInfo(data.data);
                } else {
                    setError(data.error || 'Invalid or expired reset token.');
                }
            } catch (error) {
                console.error('Token verification error:', error);
                setError('Network error. Please check your connection and try again.');
            } finally {
                setVerifyingToken(false);
            }
        };

        verifyToken();
    }, [token]);

    const checkPasswordStrength = (password) => {
        const checks = {
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const score = Object.values(checks).filter(Boolean).length;
        const feedback = [];

        if (!checks.length) feedback.push('At least 6 characters');
        if (!checks.uppercase) feedback.push('One uppercase letter');
        if (!checks.lowercase) feedback.push('One lowercase letter');
        if (!checks.numbers) feedback.push('One number');
        if (!checks.special) feedback.push('One special character (recommended)');

        return { score, feedback, checks };
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');

        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            message: 'Password reset successful! Please login with your new password.'
                        }
                    });
                }, 3000);
            } else {
                setError(data.error || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = (score) => {
        if (score <= 2) return '#ef4444';
        if (score <= 3) return '#f59e0b';
        if (score <= 4) return '#3b82f6';
        return '#10b981';
    };

    const getPasswordStrengthText = (score) => {
        if (score <= 2) return 'Weak';
        if (score <= 3) return 'Fair';
        if (score <= 4) return 'Good';
        return 'Strong';
    };

    const isFormValid = () => {
        return (
            formData.password &&
            formData.confirmPassword &&
            formData.password === formData.confirmPassword &&
            passwordStrength.score >= 3 // Require at least "Good" strength
        );
    };

    if (verifyingToken) {
        return (
            <div className="reset-password">
                <div className="reset-password-container">
                    <div className="loading-state">
                        <div className="loading-spinner large"></div>
                        <h2>Verifying Reset Link...</h2>
                        <p>Please wait while we verify your password reset link.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="reset-password">
                <div className="reset-password-container">
                    <div className="error-state">
                        <div className="error-icon">❌</div>
                        <h2>Invalid Reset Link</h2>
                        <p>{error}</p>
                        <div className="error-actions">
                            <Link to="/forgot-password" className="btn-primary">
                                Request New Reset Link
                            </Link>
                            <Link to="/login" className="btn-secondary">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="reset-password">
                <div className="reset-password-container">
                    <div className="success-state">
                        <div className="success-icon">✅</div>
                        <h2>Password Reset Successful!</h2>
                        <p>Your password has been successfully reset.</p>
                        <p>Redirecting to login page...</p>
                        <div className="success-actions">
                            <Link to="/login" className="btn-primary">
                                Login Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password">
            <div className="reset-password-container">
                <div className="reset-password-header">
                    <h1>Reset Your Password</h1>
                    {userInfo && (
                        <p>
                            Setting new password for <strong>{userInfo.email}</strong>
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your new password"
                            required
                            disabled={loading}
                        />

                        {formData.password && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div
                                        className="strength-fill"
                                        style={{
                                            width: `${(passwordStrength.score / 5) * 100}%`,
                                            backgroundColor: getPasswordStrengthColor(passwordStrength.score)
                                        }}
                                    ></div>
                                </div>
                                <div className="strength-info">
                                    <span
                                        className="strength-text"
                                        style={{ color: getPasswordStrengthColor(passwordStrength.score) }}
                                    >
                                        {getPasswordStrengthText(passwordStrength.score)}
                                    </span>
                                    {passwordStrength.feedback.length > 0 && (
                                        <div className="strength-feedback">
                                            <span>Missing: {passwordStrength.feedback.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your new password"
                            required
                            disabled={loading}
                            className={
                                formData.confirmPassword &&
                                    formData.password !== formData.confirmPassword
                                    ? 'error'
                                    : ''
                            }
                        />
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <span className="field-error">Passwords do not match</span>
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
                        disabled={!isFormValid() || loading}
                        className="submit-btn"
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Resetting Password...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>

                <div className="reset-password-footer">
                    <p>
                        Remember your password?{' '}
                        <Link to="/login" className="login-link">
                            Back to Login
                        </Link>
                    </p>
                </div>

                <div className="security-tips">
                    <h4>🔒 Password Security Tips</h4>
                    <ul>
                        <li>Use a unique password you haven't used elsewhere</li>
                        <li>Include a mix of letters, numbers, and symbols</li>
                        <li>Avoid personal information like names or birthdays</li>
                        <li>Consider using a password manager</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;