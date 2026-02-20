import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authAPI from '../api/authAPI';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Decode JWT and extract user info
    const decodeToken = useCallback((token) => {
        try {
            const decoded = jwtDecode(token);
            return {
                userId: decoded.userId,
                email: decoded.email,
                username: decoded.username,
                role: decoded.role || 'guest',
                permissions: decoded.permissions || [],
                exp: decoded.exp
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }, []);

    // Check if token is expired
    const isTokenExpired = useCallback((token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    }, []);

    // Load user from localStorage on mount
    useEffect(() => {
        const initAuth = () => {
            const token = localStorage.getItem('auth-token');

            if (token && !isTokenExpired(token)) {
                const userData = decodeToken(token);
                if (userData) {
                    setUser(userData);
                    setRole(userData.role);
                    setPermissions(userData.permissions);
                    setIsAuthenticated(true);
                }
            } else {
                // Clear expired token
                localStorage.removeItem('auth-token');
                setRole('guest');
            }

            setLoading(false);
        };

        initAuth();
    }, [decodeToken, isTokenExpired]);

    // Login function
    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);

            if (response.data.success && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('auth-token', token);

                const userData = decodeToken(token);
                if (userData) {
                    setUser(userData);
                    setRole(userData.role);
                    setPermissions(userData.permissions);
                    setIsAuthenticated(true);
                }

                return { success: true, user: userData };
            }

            return { success: false, error: response.data.error || 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    // Signup function
    const signup = async (userData) => {
        try {
            const response = await authAPI.signup(userData);

            if (response.data.success && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('auth-token', token);

                const decodedUser = decodeToken(token);
                if (decodedUser) {
                    setUser(decodedUser);
                    setRole(decodedUser.role);
                    setPermissions(decodedUser.permissions);
                    setIsAuthenticated(true);
                }

                return { success: true, user: decodedUser };
            }

            return { success: false, error: response.data.error || 'Signup failed' };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Signup failed'
            };
        }
    };

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem('auth-token');
        setUser(null);
        setRole('guest');
        setPermissions([]);
        setIsAuthenticated(false);
    }, []);

    // Check if user has specific role
    const hasRole = useCallback((requiredRole) => {
        if (!role) return false;
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(role);
        }
        return role === requiredRole;
    }, [role]);

    // Check if user has specific permission
    const hasPermission = useCallback((requiredPermission) => {
        if (!permissions || permissions.length === 0) return false;

        // Admin has all permissions
        if (role === 'admin') return true;

        if (Array.isArray(requiredPermission)) {
            return requiredPermission.some(perm => permissions.includes(perm));
        }

        return permissions.includes(requiredPermission);
    }, [permissions, role]);

    // Check if user can perform action on resource
    const canAccess = useCallback((resource, action, scope = 'own') => {
        if (role === 'admin') return true;

        const permission = scope === 'all'
            ? `${resource}.${action}.all`
            : `${resource}.${action}.own`;

        return hasPermission(permission) || hasPermission(`${resource}.${action}`);
    }, [role, hasPermission]);

    // Get user display name
    const getDisplayName = useCallback(() => {
        if (!user) return 'Guest';
        return user.username || user.email || 'User';
    }, [user]);

    // Get role display name
    const getRoleDisplayName = useCallback(() => {
        const roleNames = {
            admin: 'Administrator',
            seller: 'Seller',
            customer: 'Customer',
            delivery: 'Delivery Staff',
            support: 'Support Staff',
            finance: 'Finance Staff',
            guest: 'Guest'
        };
        return roleNames[role] || 'User';
    }, [role]);

    // Check if user is admin
    const isAdmin = useCallback(() => role === 'admin', [role]);

    // Check if user is seller
    const isSeller = useCallback(() => role === 'seller', [role]);

    // Check if user is customer
    const isCustomer = useCallback(() => role === 'customer', [role]);

    // Check if user is delivery staff
    const isDelivery = useCallback(() => role === 'delivery', [role]);

    // Check if user is support staff
    const isSupport = useCallback(() => role === 'support', [role]);

    // Check if user is finance staff
    const isFinance = useCallback(() => role === 'finance', [role]);

    // Check if user is guest
    const isGuest = useCallback(() => !isAuthenticated || role === 'guest', [isAuthenticated, role]);

    const value = {
        // State
        user,
        role,
        permissions,
        loading,
        isAuthenticated,

        // Actions
        login,
        signup,
        logout,

        // Permission checks
        hasRole,
        hasPermission,
        canAccess,

        // Utility functions
        getDisplayName,
        getRoleDisplayName,

        // Role checks
        isAdmin,
        isSeller,
        isCustomer,
        isDelivery,
        isSupport,
        isFinance,
        isGuest
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Custom hook to check permission
export const usePermission = (permission) => {
    const { hasPermission } = useAuth();
    return hasPermission(permission);
};

// Custom hook to check role
export const useRole = (role) => {
    const { hasRole } = useAuth();
    return hasRole(role);
};

export default AuthContext;
