import React from 'react';
import './CSS/Offices.css';

const Offices = () => {
    const offices = [
        {
            city: 'Addis Ababa',
            country: 'Ethiopia',
            address: 'Bole Road, Main Street',
            phone: '+251 912 345 678',
            email: 'addis@modo.com',
            hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
            isHeadquarters: true
        },
        {
            city: 'Nairobi',
            country: 'Kenya',
            address: 'Westlands, Parklands Road',
            phone: '+254 712 345 678',
            email: 'nairobi@modo.com',
            hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
            isHeadquarters: false
        },
        {
            city: 'Lagos',
            country: 'Nigeria',
            address: 'Victoria Island, Ahmadu Bello Way',
            phone: '+234 812 345 6789',
            email: 'lagos@modo.com',
            hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
            isHeadquarters: false
        },
        {
            city: 'Cape Town',
            country: 'South Africa',
            address: 'V&A Waterfront, Dock Road',
            phone: '+27 21 123 4567',
            email: 'capetown@modo.com',
            hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
            isHeadquarters: false
        }
    ];

    return (
        <div className='offices-page'>
            <div className="offices-container">
                <div className="offices-header">
                    <h1>Our Offices</h1>
                    <p className="offices-subtitle">Visit us at any of our locations across Africa</p>
                </div>

                <div className="offices-content">
                    <div className="offices-grid">
                        {offices.map((office, index) => (
                            <div key={index} className={`office-card ${office.isHeadquarters ? 'headquarters' : ''}`}>
                                {office.isHeadquarters && (
                                    <div className="headquarters-badge">Headquarters</div>
                                )}
                                <div className="office-header">
                                    <h2>{office.city}</h2>
                                    <p className="country">{office.country}</p>
                                </div>
                                <div className="office-details">
                                    <div className="detail-item">
                                        <span className="icon">📍</span>
                                        <div>
                                            <strong>Address</strong>
                                            <p>{office.address}</p>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <span className="icon">📞</span>
                                        <div>
                                            <strong>Phone</strong>
                                            <p>{office.phone}</p>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <span className="icon">📧</span>
                                        <div>
                                            <strong>Email</strong>
                                            <p>{office.email}</p>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <span className="icon">🕐</span>
                                        <div>
                                            <strong>Hours</strong>
                                            <p>{office.hours}</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="directions-btn">Get Directions</button>
                            </div>
                        ))}
                    </div>

                    <div className="offices-info">
                        <div className="info-section">
                            <h2>Visit Us</h2>
                            <p>
                                We welcome visitors to any of our offices. Whether you're a customer, partner, or
                                potential team member, we'd love to meet you in person. Please call ahead to schedule
                                an appointment.
                            </p>
                        </div>

                        <div className="info-section">
                            <h2>Expansion Plans</h2>
                            <p>
                                We're constantly growing and expanding our presence across Africa. Stay tuned for
                                announcements about new office locations in Cairo, Accra, and Dar es Salaam coming soon!
                            </p>
                        </div>

                        <div className="info-section">
                            <h2>Career Opportunities</h2>
                            <p>
                                Interested in joining our team? We're always looking for talented individuals who
                                share our passion for fashion and customer service. Check out our careers page or
                                contact any of our offices for more information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offices;
