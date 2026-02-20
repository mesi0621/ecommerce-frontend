import { useState } from 'react';
import productAPI from '../api/productAPI';
import { getProductImage } from '../utils/imageHelper';

/**
 * Hook for product search
 * Algorithms: #2 (Search), #7 (Ranking), #14 (Search Optimization)
 */
export const useSearch = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState(null);

    const search = async (query, filters = {}) => {
        try {
            setLoading(true);
            setError(null);
            setSuggestions(null);

            const response = await productAPI.search(query, filters);
            const productsData = response.data.data || [];

            // Convert image filenames to actual image paths
            const productsWithImages = productsData.map(product => ({
                ...product,
                image: getProductImage(product.image)
            }));

            setResults(productsWithImages);

            // Handle suggestions for zero results
            if (response.data.suggestions) {
                setSuggestions(response.data.suggestions);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Search failed');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setResults([]);
        setSuggestions(null);
        setError(null);
    };

    return {
        results,
        loading,
        error,
        suggestions,
        search,
        clearResults
    };
};

export default useSearch;
