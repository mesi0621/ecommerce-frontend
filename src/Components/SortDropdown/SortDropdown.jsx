import React, { useState } from 'react';
import './SortDropdown.css';

const SortDropdown = ({ onSortChange, currentSort = 'newest' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A-Z' },
        { value: 'name_desc', label: 'Name: Z-A' },
        { value: 'rating', label: 'Highest Rated' }
    ];

    const currentOption = sortOptions.find(opt => opt.value === currentSort) || sortOptions[0];

    const handleSelect = (value) => {
        onSortChange(value);
        setIsOpen(false);
    };

    return (
        <div className="sort-dropdown">
            <button
                className="sort-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Sort products"
            >
                <span className="sort-label">Sort by:</span>
                <span className="sort-value">{currentOption.label}</span>
                <svg
                    className={`sort-arrow ${isOpen ? 'open' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="sort-overlay" onClick={() => setIsOpen(false)} />
                    <ul className="sort-menu">
                        {sortOptions.map(option => (
                            <li key={option.value}>
                                <button
                                    className={`sort-option ${currentSort === option.value ? 'active' : ''}`}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    {option.label}
                                    {currentSort === option.value && (
                                        <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SortDropdown;
