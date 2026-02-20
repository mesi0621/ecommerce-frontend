import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            if (onSearch) {
                onSearch(query.trim());
            } else {
                // Navigate to shop with search query
                navigate(`/?search=${encodeURIComponent(query.trim())}`);
            }
        }
    };

    const handleClear = () => {
        setQuery('');
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <form className={`search-bar ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>

            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            {query && (
                <button
                    type="button"
                    className="clear-button"
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    ×
                </button>
            )}

            <button type="submit" className="search-button" aria-label="Search">
                Search
            </button>
        </form>
    );
};

export default SearchBar;
