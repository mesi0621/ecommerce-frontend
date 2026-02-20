import React, { useState } from 'react';
import './CSS/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div className='contact-page'>
            <div className="contact-container">
                <div className="contact-header">
                    <h1>Contact Us</h1>
                    <p className="contact-subtitle">We'd love to hear from you</p>
                </div>

                <div className="contact-content">
                    {/* Contact Information */}
                    <div className="contact-info">
                        <h2>Get In Touch</h2>
                        <p>Have a question or feedback? Fill out the form and we'll get back to you as soon as possible.</p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <div className="contact-icon">📧</div>
                                <div>
                                    <h3>Email</h3>
                                    <p>support@modo.com</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">📞</div>
                                <div>
                                    <h3>Phone</h3>
                                    <p>+251 912 345 678</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">📍</div>
                                <div>
                                    <h3>Address</h3>
                                    <p>Addis Ababa, Ethiopia</p>
                                    <p>Bole, Main Street</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">🕐</div>
                                <div>
                                    <h3>Business Hours</h3>
                                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>
                        </div>

                        <div className="social-links">
                            <h3>Follow Us</h3>
                            <div className="social-icons">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <span>📷</span> Instagram
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <span>📘</span> Facebook
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <span>🐦</span> Twitter
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>Send Us a Message</h2>
                        {submitted && (
                            <div className="success-message">
                                ✓ Thank you! Your message has been sent successfully.
                            </div>
                        )}
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject *</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="What is this about?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Tell us more..."
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
