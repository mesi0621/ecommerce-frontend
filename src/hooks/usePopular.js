import { useState, useEffect } from 'react';
import productAPI from '../api/productAPI';
import { getProductImage } from '../utils/imageHelper';

/**
 * Hook for popular/best-selling products
 * Algorithm #8: Popularity Algorithm
 */
export const usePopular = (limit = 10) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPopular();
        // eslint-disable-next-line
    }, [limit]);

    const fetchPopular = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productAPI.getPopular(limit);
            const productsData = response.data.data || [];

            // Convert image filenames to actual image paths
            const productsWithImages = productsData.map(product => ({
                ...product,
                image: getProductImage(product.image)
            }));

            setProducts(productsWithImages);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch popular products');
            console.error('Error fetching popular products:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        refetch: fetchPopular
    };
};

/**
 * Hook for trending products
 * Algorithm #8: Popularity Algorithm (Time-based)
 */
export const useTrending = (limit = 10, days = 7) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTrending();
        // eslint-disable-next-line
    }, [limit, days]);

    const fetchTrending = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productAPI.getTrending(limit, days);
            const productsData = response.data.data || [];

            // Convert image filenames to actual image paths
            const productsWithImages = productsData.map(product => ({
                ...product,
                image: getProductImage(product.image)
            }));

            setProducts(productsWithImages);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch trending products');
            console.error('Error fetching trending products:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        refetch: fetchTrending
    };
};

export default usePopular;
