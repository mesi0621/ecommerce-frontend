import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Company.css';

const Company = () => {
    return (
        <div className='company-page'>
            <div className="company-container">
                <div className="company-header">
                    <h1>Our Company</h1>
                    <p className="company-subtitle">Building the future of online fashion</p>
                </div>

                <div className="company-content">
                    {/* Mission & Vision */}
                    <section className="company-section">
                        <h2>Our Mission</h2>
                        <p className="mission-text">
                            To make fashion accessible, affordable, and sustainable for everyone. We believe that
                            style should be available to all, regardless of budget or location. Through our platform,
                            we connect customers with quality fashion products while maintaining ethical practices
                            and environmental responsibility.
                        </p>
                    </section>

                    <section className="company-section">
                        <h2>Our Vision</h2>
                        <p className="vision-text">
                            To become the most trusted and loved online fashion destination in Africa, known for
                            our commitment to quality, sustainability, and customer satisfaction. We envision a
                            future where fashion is both accessible and responsible.
                        </p>
                    </section>

                    {/* Company Stats */}
                    <section className="company-section stats-section">
                        <h2>By The Numbers</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-number">10K+</div>
                                <div className="stat-label">Happy Customers</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">5K+</div>
                                <div className="stat-label">Products</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Brands</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">24/7</div>
                                <div className="stat-label">Support</div>
                            </div>
                        </div>
                    </section>

                    {/* Team */}
                    <section className="company-section">
                        <h2>Our Team</h2>
                        <p>
                            We're a diverse team of fashion enthusiasts, tech experts, and customer service
                            professionals dedicated to providing you with the best shopping experience. Our team
                            works tirelessly to curate the latest trends, ensure quality, and deliver exceptional
                            service.
                        </p>
                        <div className="team-values">
                            <div className="value-item">
                                <span className="value-icon">💡</span>
                                <h3>Innovation</h3>
                                <p>Constantly improving our platform and services</p>
                            </div>
                            <div className="value-item">
                                <span className="value-icon">🤝</span>
                                <h3>Integrity</h3>
                                <p>Honest and transparent in all our dealings</p>
                            </div>
                            <div className="value-item">
                                <span className="value-icon">🌟</span>
                                <h3>Excellence</h3>
                                <p>Committed to delivering the highest quality</p>
                            </div>
                        </div>
                    </section>

                    {/* Sustainability */}
                    <section className="company-section sustainability-section">
                        <h2>Sustainability Commitment</h2>
                        <p>
                            We're committed to reducing our environmental impact and promoting sustainable fashion:
                        </p>
                        <ul className="sustainability-list">
                            <li>Partnering with eco-friendly brands</li>
                            <li>Using recyclable packaging materials</li>
                            <li>Reducing carbon footprint in shipping</li>
                            <li>Supporting ethical manufacturing practices</li>
                            <li>Promoting circular fashion through recycling programs</li>
                        </ul>
                    </section>

                    {/* Call to Action */}
                    <section className="company-section cta-section">
                        <h2>Join Our Journey</h2>
                        <p>
                            Whether you're a customer, partner, or potential team member, we'd love to hear from you.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/contact" className="cta-btn primary">Contact Us</Link>
                            <Link to="/" className="cta-btn secondary">Shop Now</Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Company;
