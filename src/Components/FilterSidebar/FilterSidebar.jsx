import React, { useState } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ onFilterChange, initialFilters = {} }) => {
    const [filters, setFilters] = useState({
        category: initialFilters.category || '',
        minPrice: initialFilters.minPrice || '',
        maxPrice: initialFilters.maxPrice || '',
        inStock: initialFilters.inStock || false,
        minRating: initialFilters.minRating || 0
    });

    const [isOpen, setIsOpen] = useState(false);

    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'men', label: 'Men' },
        { value: 'women', label: 'Women' },
        { value: 'kid', label: 'Kids' }
    ];

    const ratings = [
        { value: 0, label: 'All Ratings' },
        { value: 4, label: '4★ & above' },
        { value: 3, label: '3★ & above' },
        { value: 2, label: '2★ & above' }
    ];

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            category: '',
            minPrice: '',
            maxPrice: '',
            inStock: false,
            minRating: 0
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.inStock || filters.minRating > 0;

    return (
        <>
            {/* Mobile Filter Toggle Button */}
            <button className="filter-toggle-mobile" onClick={() => setIsOpen(!isOpen)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
                Filters
                {hasActiveFilters && <span className="filter-badge">{Object.values(filters).filter(v => v && v !== 0).length}</span>}
            </button>

            {/* Mobile Overlay */}
            {isOpen && <div className="filter-overlay" onClick={() => setIsOpen(false)} />}

            {/* Filter Sidebar */}
            <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="filter-header">
                    <h3>Filters</h3>
                    <button className="close-filters-mobile" onClick={() => setIsOpen(false)}>×</button>
                </div>

                {hasActiveFilters && (
                    <button className="clear-filters" onClick={handleClearFilters}>
                        Clear All Filters
                    </button>
                )}

                {/* Category Filter */}
                <div className="filter-section">
                    <h4>Category</h4>
                    <div className="filter-options">
                        {categories.map(cat => (
                            <label key={cat.value} className="filter-option">
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat.value}
                                    checked={filters.category === cat.value}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                />
                                <span>{cat.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="filter-section">
                    <h4>Price Range</h4>
                    <div className="price-inputs">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            min="0"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            min="0"
                        />
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="filter-section">
                    <h4>Rating</h4>
                    <div className="filter-options">
                        {ratings.map(rating => (
                            <label key={rating.value} className="filter-option">
                                <input
                                    type="radio"
                                    name="rating"
                                    value={rating.value}
                                    checked={filters.minRating === rating.value}
                                    onChange={(e) => handleFilterChange('minRating', parseInt(e.target.value))}
                                />
                                <span>{rating.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Stock Filter */}
                <div className="filter-section">
                    <h4>Availability</h4>
                    <label className="filter-option checkbox">
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        />
                        <span>In Stock Only</span>
                    </label>
                </div>

                {/* Mobile Apply Button */}
                <button className="apply-filters-mobile" onClick={() => setIsOpen(false)}>
                    Apply Filters
                </button>
            </aside>
        </>
    );
};

export default FilterSidebar;
