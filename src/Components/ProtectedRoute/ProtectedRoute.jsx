import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole, requiredPermission, allowedRoles = [] }) => {
    const { isAuthenticated, hasRole, hasPermission } = useAuth();

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check for specific role requirement
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/403" replace />;
    }

    // Check for multiple allowed roles
    if (allowedRoles.length > 0) {
        const hasAllowedRole = allowedRoles.some(role => hasRole(role));
        if (!hasAllowedRole) {
            return <Navigate to="/403" replace />;
        }
    }

    // Check for specific permission requirement
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/403" replace />;
    }

    return children;
};

export default ProtectedRoute;
