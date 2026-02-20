import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import './ToastContainer.css';

let toastId = 0;

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Listen for custom toast events
        const handleToast = (event) => {
            const { message, type, duration } = event.detail;
            addToast(message, type, duration);
        };

        window.addEventListener('showToast', handleToast);
        return () => window.removeEventListener('showToast', handleToast);
    }, []);

    const addToast = (message, type = 'info', duration = 5000) => {
        const id = ++toastId;
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

// Utility function to show toasts from anywhere in the app
export const showToast = (message, type = 'info', duration = 5000) => {
    const event = new CustomEvent('showToast', {
        detail: { message, type, duration }
    });
    window.dispatchEvent(event);
};

export default ToastContainer;