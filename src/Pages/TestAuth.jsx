import React, { useState } from 'react';
import authAPI from '../api/authAPI';

const TestAuth = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testSignup = async () => {
        setLoading(true);
        try {
            const response = await authAPI.signup({
                username: 'testuser' + Date.now(),
                email: 'test' + Date.now() + '@example.com',
                password: 'test123'
            });
            setResult('✅ Signup Success: ' + JSON.stringify(response.data));
        } catch (error) {
            setResult('❌ Signup Error: ' + error.message);
            console.error('Signup error:', error);
        }
        setLoading(false);
    };

    const testLogin = async () => {
        setLoading(true);
        try {
            const response = await authAPI.login({
                email: 'newuser@test.com',
                password: 'test123'
            });
            setResult('✅ Login Success: ' + JSON.stringify(response.data));
        } catch (error) {
            setResult('❌ Login Error: ' + error.message);
            console.error('Login error:', error);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1>Auth Test Page</h1>
            <button onClick={testSignup} disabled={loading}>Test Signup</button>
            <button onClick={testLogin} disabled={loading} style={{ marginLeft: '10px' }}>Test Login</button>
            <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0' }}>
                {loading ? 'Loading...' : result}
            </div>
        </div>
    );
};

export default TestAuth;
