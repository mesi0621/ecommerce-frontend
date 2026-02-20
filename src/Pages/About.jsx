import React from 'react';
import './CSS/About.css';

const About = () => {
    return (
        <div className='about-page'>
            <div className="about-container">
                <div className="about-header">
                    <h1>About MODO</h1>
                    <p className="about-subtitle">Your trusted online fashion destination</p>
                </div>

                <div className="about-content">
                    <section className="about-section">
                        <h2>Our Story</h2>
                        <p>
                            Founded in 2024, MODO has grown to become one of the leading online fashion retailers.
                            We believe that everyone deserves access to quality fashion at affordable prices. Our mission
                            is to make fashion accessible, sustainable, and enjoyable for everyone.
                        </p>
                    </section>

                    <section className="about-section">
                        <h2>What We Offer</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <h3>👔 Men's Fashion</h3>
                                <p>Stylish and comfortable clothing for modern men</p>
                            </div>
                            <div className="feature-card">
                                <h3>👗 Women's Fashion</h3>
                                <p>Trendy and elegant outfits for every occasion</p>
                            </div>
                            <div className="feature-card">
                                <h3>👶 Kids' Collection</h3>
                                <p>Fun and durable clothing for children</p>
                            </div>
                            <div className="feature-card">
                                <h3>🚚 Fast Delivery</h3>
                                <p>Quick and reliable shipping to your doorstep</p>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2>Our Values</h2>
                        <ul className="values-list">
                            <li><strong>Quality:</strong> We source only the best materials and products</li>
                            <li><strong>Affordability:</strong> Great fashion shouldn't break the bank</li>
                            <li><strong>Sustainability:</strong> We care about our planet and future</li>
                            <li><strong>Customer First:</strong> Your satisfaction is our priority</li>
                        </ul>
                    </section>

                    <section className="about-section">
                        <h2>Why Choose Us?</h2>
                        <div className="why-choose">
                            <div className="reason">
                                <span className="icon">✓</span>
                                <div>
                                    <h4>Wide Selection</h4>
                                    <p>Thousands of products across all categories</p>
                                </div>
                            </div>
                            <div className="reason">
                                <span className="icon">✓</span>
                                <div>
                                    <h4>Secure Shopping</h4>
                                    <p>Safe and encrypted payment processing</p>
                                </div>
                            </div>
                            <div className="reason">
                                <span className="icon">✓</span>
                                <div>
                                    <h4>Easy Returns</h4>
                                    <p>Hassle-free return policy within 30 days</p>
                                </div>
                            </div>
                            <div className="reason">
                                <span className="icon">✓</span>
                                <div>
                                    <h4>24/7 Support</h4>
                                    <p>Our team is always here to help you</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
