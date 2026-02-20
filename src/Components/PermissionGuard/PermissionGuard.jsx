import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './PermissionGuard.css';

/**
 * PermissionGuard - Component to protect routes and UI elements based on permissions
 * 
 * Usage:
 * 1. Route Protection:
 *    <PermissionGuard permission="products.create" fallback="/unauthorized">
 *      <CreateProduct />
 *    </PermissionGuard>
 * 
 * 2. UI Element Protection:
 *    <PermissionGuard permission="products.delete" hideOnDenied>
 *      <button>Delete</button>
 *    </PermissionGuard>
 * 
 * 3. Role-based Protection:
 *    <PermissionGuard role="admin" fallback="/home">
 *      <AdminDashboard />
 *    </PermissionGuard>
 * 
 * 4. Multiple Permissions (OR logic):
 *    <PermissionGuard permission={["products.update.own", "products.update.all"]}>
 *      <EditButton />
 *    </PermissionGuard>
 * 
 * 5. Multiple Roles (OR logic):
 *    <PermissionGuard role={["admin", "seller"]}>
 *      <SellerPanel />
 *    </PermissionGuard>
 */

const PermissionGuard = ({
    children,
    permission,
    role,
    requireAuth = false,
    fallback = null,
    hideOnDenied = false,
    showMessage = false,
    customMessage = null,
    loading = null
}) => {
    const {
        isAuthenticated,
        hasPermission,
        hasRole,
        loading: authLoading
    } = useAuth();

    // Show loading state
    if (authLoading) {
        return loading || <div className="permission-guard-loading">Loading...</div>;
    }

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
        if (hideOnDenied) return null;
        if (fallback) return <Navigate to={fallback} replace />;
        if (showMessage) {
            return (
                <div className="permission-guard-denied">
                    {customMessage || 'Please login to access this feature'}
                </div>
            );
        }
        return null;
    }

    // Check role requirement
    if (role) {
        const hasRequiredRole = hasRole(role);
        if (!hasRequiredRole) {
            if (hideOnDenied) return null;
            if (fallback) return <Navigate to={fallback} replace />;
            if (showMessage) {
                return (
                    <div className="permission-guard-denied">
                        {customMessage || 'You do not have permission to access this feature'}
                    </div>
                );
            }
            return null;
        }
    }

    // Check permission requirement
    if (permission) {
        const hasRequiredPermission = hasPermission(permission);
        if (!hasRequiredPermission) {
            if (hideOnDenied) return null;
            if (fallback) return <Navigate to={fallback} replace />;
            if (showMessage) {
                return (
                    <div className="permission-guard-denied">
                        {customMessage || 'You do not have permission to access this feature'}
                    </div>
                );
            }
            return null;
        }
    }

    // User has required permissions/roles
    return <>{children}</>;
};

/**
 * RequireAuth - Shorthand for requiring authentication
 */
export const RequireAuth = ({ children, fallback = '/login' }) => {
    return (
        <PermissionGuard requireAuth fallback={fallback}>
            {children}
        </PermissionGuard>
    );
};

/**
 * RequireRole - Shorthand for requiring specific role
 */
export const RequireRole = ({ children, role, fallback = '/unauthorized' }) => {
    return (
        <PermissionGuard role={role} fallback={fallback}>
            {children}
        </PermissionGuard>
    );
};

/**
 * RequirePermission - Shorthand for requiring specific permission
 */
export const RequirePermission = ({ children, permission, fallback = '/unauthorized' }) => {
    return (
        <PermissionGuard permission={permission} fallback={fallback}>
            {children}
        </PermissionGuard>
    );
};

/**
 * AdminOnly - Shorthand for admin-only content
 */
export const AdminOnly = ({ children, hideOnDenied = true }) => {
    return (
        <PermissionGuard role="admin" hideOnDenied={hideOnDenied}>
            {children}
        </PermissionGuard>
    );
};

/**
 * SellerOnly - Shorthand for seller-only content
 */
export const SellerOnly = ({ children, hideOnDenied = true }) => {
    return (
        <PermissionGuard role="seller" hideOnDenied={hideOnDenied}>
            {children}
        </PermissionGuard>
    );
};

/**
 * CustomerOnly - Shorthand for customer-only content
 */
export const CustomerOnly = ({ children, hideOnDenied = true }) => {
    return (
        <PermissionGuard role="customer" hideOnDenied={hideOnDenied}>
            {children}
        </PermissionGuard>
    );
};

/**
 * StaffOnly - Shorthand for staff-only content (delivery, support, finance)
 */
export const StaffOnly = ({ children, hideOnDenied = true }) => {
    return (
        <PermissionGuard role={["delivery", "support", "finance"]} hideOnDenied={hideOnDenied}>
            {children}
        </PermissionGuard>
    );
};

export default PermissionGuard;
