import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PermissionGuard, {
    AdminOnly,
    SellerOnly,
    CustomerOnly,
    StaffOnly,
    RequireAuth
} from '../Components/PermissionGuard';

function RBACTest() {
    const {
        user,
        role,
        permissions,
        isAuthenticated,
        getRoleDisplayName,
        getDisplayName
    } = useAuth();

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: '#ff4141' }}>RBAC Test Page</h1>

            {/* Current User Info */}
            <div style={{
                background: '#f8f9fa',
                padding: '20px',
                marginBottom: '30px',
                borderRadius: '8px',
                border: '2px solid #dee2e6'
            }}>
                <h2>Current User Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '10px' }}>
                    <strong>Authenticated:</strong>
                    <span style={{ color: isAuthenticated ? 'green' : 'red' }}>
                        {isAuthenticated ? '✅ Yes' : '❌ No'}
                    </span>

                    <strong>Display Name:</strong>
                    <span>{getDisplayName()}</span>

                    <strong>Email:</strong>
                    <span>{user?.email || 'N/A'}</span>

                    <strong>User ID:</strong>
                    <span>{user?.userId || 'N/A'}</span>

                    <strong>Role:</strong>
                    <span style={{
                        background: '#ff4141',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                    }}>
                        {role} ({getRoleDisplayName()})
                    </span>

                    <strong>Permissions:</strong>
                    <span>{permissions.length} permissions loaded</span>
                </div>

                {permissions.length > 0 && (
                    <details style={{ marginTop: '15px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                            View All Permissions
                        </summary>
                        <div style={{
                            marginTop: '10px',
                            padding: '10px',
                            background: 'white',
                            borderRadius: '4px',
                            maxHeight: '200px',
                            overflow: 'auto'
                        }}>
                            {permissions.map((perm, index) => (
                                <div key={index} style={{ padding: '2px 0', fontSize: '14px' }}>
                                    • {perm}
                                </div>
                            ))}
                        </div>
                    </details>
                )}
            </div>

            {/* Permission Tests */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Permission Guard Tests</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    Green boxes indicate you have access. Yellow boxes indicate denied access.
                    Some tests may be hidden if you don't have permission.
                </p>

                {/* Test 1: Admin Only */}
                <div style={{
                    border: '2px solid #dee2e6',
                    padding: '15px',
                    margin: '15px 0',
                    borderRadius: '8px'
                }}>
                    <h3>Test 1: Admin Only Content</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        This content should only be visible to users with 'admin' role.
                    </p>

                    <AdminOnly>
                        <div style={{
                            background: '#d4edda',
                            padding: '15px',
                            borderRadius: '4px',
                            border: '1px solid #c3e6cb'
                        }}>
                            ✅ SUCCESS: You can see this because you are an admin
                        </div>
                    </AdminOnly>

                    <AdminOnly hideOnDenied={false} showMessage>
                        <div style={{ padding: '15px' }}>
                            This content is admin-only
                        </div>
                    </AdminOnly>
                </div>

                {/* Test 2: Seller Only */}
                <div style={{
                    border: '2px solid #dee2e6',
                    padding: '15px',
                    margin: '15px 0',
                    borderRadius: '8px'
                }}>
                    <h3>Test 2: Seller Only Content</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        This content should only be visible to users with 'seller' role.
                    </p>

                    <SellerOnly>
                        <div style={{
                            background: '#d4edda',
                            padding: '15px',
                            borderRadius: '4px',
                            border: '1px solid #c3e6cb'
                        }}>
                            ✅ SUCCESS: You can see this because you are a seller
                        </div>
                    </SellerOnly>

                    <SellerOnly hideOnDenied={false} showMessage>
                        <div style={{ padding: '15px' }}>
                            This content is seller-only
                        </div>
                    </SellerOnly>
                </div>

                {/* Test 3: Customer Only */}
                <div style={{
                    border: '2px solid #dee2e6',
                    padding: '15px',
                    margin: '15px 0',
                    borderRadius: '8px'
                }}>
                    <h3>Test 3: Customer Only Content</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        This content should only be visible to users with 'customer' role.
                    </p>

                    <CustomerOnly>
                        <div style={{
                            background: '#d4edda',
                            padding: '15px',
                            borderRadius: '4px',
                            border: '1px solid #c3e6cb'
                        }}>
                            ✅ SUCCESS: You can see this because you are a customer
                        </div>
                    </CustomerOnly>

                    <CustomerOnly hideOnDenied={false} showMessage>
                        <div style={{ padding: '15px' }}>
                            This content is customer-only
                        </div>
                    </CustomerOnly>
                </div>

                {/* Test 4: Staff Only */}
                <div style={{
                    border: '2px solid #dee2e6',
                    padding: '15px',
                    margin: '15px 0',
                    borderRadius: '8px'
                }}>
                    <h3>Test 4: Staff Only Content</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        This content should only be visible to delivery, support, or finance staff.
                    </p>

                    <StaffOnly>
                        <div style={{
                            background: '#d4edda',
                            padding: '15px',
                            borderRadius: '4px',
                            border: '1px solid #c3e6cb'
                        }}>
                            ✅ SUCCESS: You can see this because you are staff (delivery/support/finance)
                        </div>
                    </StaffOnly>

                    <StaffOnly hideOnDenied={false} showMessage>
                        <div style={{ padding: '15px' }}>
                            This content is staff-only
                        </div>
                    </StaffOnly>
                </div>

                {/* Test 5: Specific Permission */}
                <div style={{
                    border: '2px solid #dee2e6',
                    padding: '15px',
                    margin: '15px 0',
                    borderRadius: '8px'
                }}>
                    <h3>Test 5: Specific Permission (products.create)</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        This content requires 'products.create' permission.
                    </p>

                    <PermissionGuard permission="products.create" hideOnDenied>
                        <div style={{
                            background: '#d4edda',
                            padding: '15px',
                            borderRadius: '4px',
                            border: '1px solid #c3e6cb'
                        }}>
                            ✅ SUCCESS: You have 'products.create' permission
                        </div>
                    </PermissionGuard>

                    <PermissionGuard permission="products.create" hideOnDenied={false} showMessage>
                        <div style={{ padding: '15px' }}>
                            This requires products.create permission
                        </div>
                    </PermissionGuard>
                </div>

                {/* Test 6: Multiple Roles (OR logic) */}
                <div style={{
                    border: '2px solid #dee2e6',
                    padding: '15px',
                    margin: '15px 0',
                    borderRadius: '8px'
                }}>
                    <h3>Test 6: Multiple Roles (Admin OR Seller)</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        This content should be visible to either admin or seller.
                    </p>

                    <PermissionGuard role={['admin', 'seller']} hideOnDenied>
                        <div style={{
                            background: '#d4edda',
                            padding: '15px',
                            borderRadius: '4px',
                            border: '1px solid #c3e6cb'
                        }}>
                            ✅ SUCCESS: You are either admin or seller
                        </div>
                    </PermissionGuard>

                    <PermissionGuard role={['admin', 'seller']} hideOnDenied={false} showMessage>
                        <div style={{ padding: '15px' }}>
                            This requires admin or seller role
                        </div>
                    </PermissionGuard>
                </div>

                {/* Test 7: Multiple Permissions (OR logic) */}
                <div style={{
                    border: '2px solid #dee2e6',
                    padding: '15px',
                    margin: '15px 0',
                    borderRadius: '8px'
                }}>
                    <h3>Test 7: Multiple Permissions (products.update.own OR products.update.all)</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        This content requires either 'products.update.own' or 'products.update.all' permission.
                    </p>

                    <PermissionGuard
                        permission={['products.update.own', 'products.update.all']}
                        hideOnDenied
                    >
                        <div style={{
                            background: '#d4edda',
                            padding: '15px',
                            borderRadius: '4px',
                            border: '1px solid #c3e6cb'
                        }}>
                            ✅ SUCCESS: You have product update permission
                        </div>
                    </PermissionGuard>

                    <PermissionGuard
                        permission={['products.update.own', 'products.update.all']}
                        hideOnDenied={false}
                        showMessage
                    >
                        <div style={{ padding: '15px' }}>
                            This requires product update permission
                        </div>
                    </PermissionGuard>
                </div>

                {/* Test 8: Require Authentication */}
                <div style={{
                    border: '2px solid #dee2e6',
                    padding: '15px',
                    margin: '15px 0',
                    borderRadius: '8px'
                }}>
                    <h3>Test 8: Require Authentication</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        This content requires user to be logged in (any role).
                    </p>

                    <RequireAuth fallback="/login">
                        <div style={{
                            background: '#d4edda',
                            padding: '15px',
                            borderRadius: '4px',
                            border: '1px solid #c3e6cb'
                        }}>
                            ✅ SUCCESS: You are authenticated
                        </div>
                    </RequireAuth>
                </div>
            </div>

            {/* Instructions */}
            <div style={{
                background: '#e7f3ff',
                padding: '20px',
                marginTop: '30px',
                borderRadius: '8px',
                border: '2px solid #b3d9ff'
            }}>
                <h2>Testing Instructions</h2>
                <ol style={{ lineHeight: '1.8' }}>
                    <li>Test as <strong>Guest</strong> (not logged in): You should see yellow warning messages</li>
                    <li>Test as <strong>Admin</strong> (bitaaaa2004@gmail.com): You should see all green success boxes</li>
                    <li>Test as <strong>Seller</strong> (meseretmezgebe338@gmail.com): You should see seller-specific content</li>
                    <li>Test as <strong>Customer</strong>: Register a new account and test customer-specific content</li>
                    <li>Check browser console for any errors</li>
                    <li>Check React DevTools to verify AuthContext state</li>
                </ol>
            </div>
        </div>
    );
}

export default RBACTest;
