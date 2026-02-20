import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Forbidden.css';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="forbidden-page">
            <div className="forbidden-content">
                <div className="forbidden-icon">🚫</div>
                <h1>403</h1>
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
                <p className="forbidden-description">
                    This page requires specific permissions or roles that your account doesn't have.
                    If you believe this is an error, please contact an administrator.
                </p>
                <div className="forbidden-actions">
                    <button className="btn-primary" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/')}>
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;
