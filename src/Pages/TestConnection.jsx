import React, { useState, useEffect } from 'react';
import productAPI from '../api/productAPI';

const TestConnection = () => {
    const [status, setStatus] = useState('Testing...');
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        testConnection();
    }, []);

    const testConnection = async () => {
        try {
            console.log('Testing backend connection...');
            setStatus('Connecting to backend...');

            const response = await productAPI.getAll();
            console.log('Response:', response);

            if (response.data && response.data.success) {
                setStatus(`✅ Connected! Found ${response.data.count} products`);
                setProducts(response.data.data.slice(0, 3)); // Show first 3
            } else {
                setStatus('❌ Backend responded but no data');
            }
        } catch (err) {
            console.error('Connection error:', err);
            setError(err.message);
            setStatus('❌ Connection failed');
        }
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial' }}>
            <h1>Backend Connection Test</h1>
            <h2>{status}</h2>

            {error && (
                <div style={{ color: 'red', padding: '20px', background: '#fee' }}>
                    <h3>Error:</h3>
                    <pre>{error}</pre>
                </div>
            )}

            {products.length > 0 && (
                <div>
                    <h3>Sample Products:</h3>
                    {products.map(product => (
                        <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                            <p><strong>ID:</strong> {product.id}</p>
                            <p><strong>Name:</strong> {product.name}</p>
                            <p><strong>Price:</strong> ${product.new_price}</p>
                            <p><strong>Image:</strong> {product.image}</p>
                        </div>
                    ))}
                </div>
            )}

            <button onClick={testConnection} style={{ padding: '10px 20px', marginTop: '20px' }}>
                Test Again
            </button>
        </div>
    );
};

export default TestConnection;
