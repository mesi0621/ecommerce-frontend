import { useState, useEffect } from 'react';
import productAPI from '../api/productAPI';

/**
 * Hook for product recommendations
 * Algorithms: #6 (Recommendations), #13 (Personalization)
 */
export const useRecommendations = (productId, limit = 4) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (productId) {
            fetchRecommendations();
        }
        // eslint-disable-next-line
    }, [productId, limit]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productAPI.getRecommendations(productId, limit);
            const productsData = response.data.data || [];

            // Use products directly - external URLs work as-is
            setRecommendations(productsData);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch recommendations');
            console.error('Error fetching recommendations:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        recommendations,
        loading,
        error,
        refetch: fetchRecommendations
    };
};

/**
 * Hook for personalized recommendations
 * Algorithm #13: Personalization
 */
export const usePersonalizedRecommendations = (userId, limit = 10) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            fetchPersonalized();
        }
        // eslint-disable-next-line
    }, [userId, limit]);

    const fetchPersonalized = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productAPI.getPersonalized(userId, limit);
            const productsData = response.data.data || [];

            // Use products directly - external URLs work as-is
            setRecommendations(productsData);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch personalized recommendations');
            console.error('Error fetching personalized recommendations:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        recommendations,
        loading,
        error,
        refetch: fetchPersonalized
    };
};

export default useRecommendations;
