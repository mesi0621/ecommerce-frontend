import { useState, useEffect } from 'react';
import productAPI from '../api/productAPI';
import { getProductImage } from '../utils/imageHelper';

/**
 * Hook for fetching products with filters
 * Algorithms: #1 (Catalog), #3 (Filtering), #4 (Sorting)
 */
export const useProducts = (filters = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line
    }, [JSON.stringify(filters)]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productAPI.getAll(filters);
            const productsData = response.data.data || [];

            // Convert image filenames to actual image paths
            const productsWithImages = productsData.map(product => ({
                ...product,
                image: getProductImage(product.image)
            }));

            setProducts(productsWithImages);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch products');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        refetch: fetchProducts
    };
};

/**
 * Hook for fetching single product
 */
export const useProduct = (productId, userId = null) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
        // eslint-disable-next-line
    }, [productId, userId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productAPI.getById(productId, userId);
            const productData = response.data.data;

            // Convert image filename to actual image path
            if (productData && productData.image) {
                productData.image = getProductImage(productData.image);
            }

            setProduct(productData);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch product');
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        product,
        loading,
        error,
        refetch: fetchProduct
    };
};

export default useProducts;
