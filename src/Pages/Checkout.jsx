import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { useToastContext } from '../Context/ToastContext';
import './CSS/Checkout.css';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { all_product, cartItems, getTotalCartAmount, userId, refreshCart } = useContext(ShopContext);
    const toast = useToastContext();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        region: '',
        postalCode: ''
    });
    const [bankTransferDetails, setBankTransferDetails] = useState(null);
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);

    useEffect(() => {
        // Guest restriction - require login to access checkout
        if (!isAuthenticated) {
            toast.info('Please login to proceed to checkout');
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        // Check if cart is empty
        if (getTotalCartAmount() === 0) {
            toast.warning('Your cart is empty!');
            navigate('/cart');
            return;
        }

        // Fetch payment methods
        fetchPaymentMethods();
    }, [isAuthenticated, getTotalCartAmount, navigate, toast]);

    const fetchPaymentMethods = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/payments/methods`);
            const data = await response.json();
            if (data.success) {
                setPaymentMethods(data.data);

                // Always default to Cash on Delivery if available
                const codMethod = data.data.find(m => m.name === 'cash_on_delivery');
                console.log('Payment methods loaded:', data.data.map(m => `${m.displayName} (${m.name})`));

                if (codMethod) {
                    setSelectedPayment('cash_on_delivery');
                    console.log('✅ Selected payment method: cash_on_delivery');
                } else if (data.data.length > 0) {
                    // Fallback to first method if Cash on Delivery not available
                    setSelectedPayment(data.data[0].name);
                    console.log('⚠️ Cash on Delivery not available, selected:', data.data[0].name);
                } else {
                    console.log('❌ No payment methods available');
                }
            }
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    };

    const handlePaymentMethodChange = (methodName) => {
        setSelectedPayment(methodName);

        // If bank transfer is selected, generate bank details
        if (methodName === 'bank_transfer') {
            const referenceCode = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            setBankTransferDetails({
                bankName: process.env.REACT_APP_BANK_NAME || 'Commercial Bank of Ethiopia',
                accountNumber: process.env.REACT_APP_BANK_ACCOUNT || '1000123456789',
                accountName: process.env.REACT_APP_BANK_ACCOUNT_NAME || 'Modo E-Commerce',
                referenceCode: referenceCode,
                amount: total
            });
        } else {
            setBankTransferDetails(null);
            setReceiptFile(null);
            setReceiptPreview(null);
        }
    };

    const handleReceiptUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }

            setReceiptFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value
        });
    };

    const handlePlaceOrder = async () => {
        console.log('🛒 Place order clicked with payment method:', selectedPayment);
        console.log('🛒 Available payment methods:', paymentMethods.map(m => `${m.displayName} (${m.name})`));

        // Safety check: ensure we have a valid payment method selected
        if (!selectedPayment) {
            toast.warning('Please select a payment method');
            return;
        }

        // Validate that the selected payment method exists in available methods
        const isValidMethod = paymentMethods.some(m => m.name === selectedPayment);
        if (!isValidMethod) {
            console.error('❌ Invalid payment method selected:', selectedPayment);
            toast.error('Invalid payment method selected. Please refresh the page and try again.');
            return;
        }

        console.log('✅ Payment method validation passed:', selectedPayment);

        // Validate shipping address
        if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address ||
            !shippingAddress.city || !shippingAddress.region) {
            toast.warning('Please fill in all required shipping address fields');
            return;
        }

        // Validate bank transfer receipt if bank transfer is selected
        if (selectedPayment === 'bank_transfer' && !receiptFile) {
            toast.warning('Please upload your payment receipt');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('auth-token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

            // STEP 1: Sync cart with backend before creating order
            console.log('🔄 Syncing cart with backend...');
            console.log('🔄 Frontend cart items:', cartItems);

            const syncResponse = await fetch(`${apiUrl}/cart/${userId}/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    frontendCart: cartItems
                })
            });

            const syncData = await syncResponse.json();
            console.log('🔄 Cart sync response:', syncData);

            if (!syncData.success) {
                throw new Error('Failed to sync cart: ' + (syncData.error || 'Unknown error'));
            }

            // Verify cart has items after sync
            if (!syncData.data || !syncData.data.items || syncData.data.items.length === 0) {
                throw new Error('Cart is empty after synchronization. Please add items to your cart and try again.');
            }

            console.log('✅ Cart synchronized successfully');

            // STEP 2: Create order
            const orderResponse = await fetch(`${apiUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    shippingAddress,
                    paymentMethod: selectedPayment,
                    notes: selectedPayment === 'bank_transfer' ? `Reference: ${bankTransferDetails.referenceCode}` : ''
                })
            });

            const orderData = await orderResponse.json();

            if (!orderData.success) {
                throw new Error(orderData.error || 'Failed to create order');
            }

            const order = orderData.data;

            // STEP 3: Upload receipt if bank transfer
            if (selectedPayment === 'bank_transfer' && receiptFile) {
                const formData = new FormData();
                formData.append('receipt', receiptFile);
                formData.append('orderId', order._id);
                formData.append('referenceCode', bankTransferDetails.referenceCode);

                const uploadResponse = await fetch(`${apiUrl}/payments/bank-transfer/upload-receipt`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const uploadData = await uploadResponse.json();
                if (!uploadData.success) {
                    throw new Error('Failed to upload receipt');
                }
            }

            // STEP 4: Process payment
            console.log('🔄 About to process payment with method:', selectedPayment);
            const paymentResponse = await fetch(`${apiUrl}/payments/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: order._id,
                    paymentMethod: selectedPayment,
                    paymentDetails: {
                        email: shippingAddress.email || '',
                        firstName: shippingAddress.fullName.split(' ')[0],
                        lastName: shippingAddress.fullName.split(' ').slice(1).join(' '),
                        phoneNumber: shippingAddress.phone,
                        referenceNumber: selectedPayment === 'bank_transfer' ? bankTransferDetails.referenceCode : undefined
                    }
                })
            });

            console.log('📤 Payment request sent:', {
                orderId: order._id,
                paymentMethod: selectedPayment,
                paymentDetails: {
                    email: shippingAddress.email || '',
                    firstName: shippingAddress.fullName.split(' ')[0],
                    lastName: shippingAddress.fullName.split(' ').slice(1).join(' '),
                    phoneNumber: shippingAddress.phone
                }
            });

            const paymentData = await paymentResponse.json();

            if (!paymentData.success) {
                throw new Error(paymentData.error || 'Failed to process payment');
            }

            // Handle different payment methods
            if (selectedPayment === 'cash_on_delivery') {
                // Refresh cart to sync with backend (cart cleared after payment)
                if (refreshCart) {
                    await refreshCart();
                }
                // Redirect to success page
                toast.success('Order placed successfully! You will receive confirmation shortly.');
                setTimeout(() => navigate('/profile'), 2000);
            } else if (selectedPayment === 'bank_transfer') {
                // Refresh cart
                if (refreshCart) {
                    await refreshCart();
                }
                toast.success('Order placed! Your payment is pending admin verification.');
                setTimeout(() => navigate('/profile'), 2000);
            } else if (paymentData.data.payment.paymentUrl || paymentData.data.payment.approvalUrl) {
                // Redirect to payment gateway
                const paymentUrl = paymentData.data.payment.paymentUrl || paymentData.data.payment.approvalUrl;
                toast.info('Redirecting to payment gateway...');
                setTimeout(() => {
                    window.location.href = paymentUrl;
                }, 1500);
            } else {
                // Refresh cart for other payment methods
                if (refreshCart) {
                    await refreshCart();
                }
                toast.success('Order placed successfully!');
                setTimeout(() => navigate('/profile'), 2000);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Failed to process order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const subtotal = getTotalCartAmount();
    const tax = subtotal * 0.15; // 15% tax
    const shippingFee = subtotal > 1000 ? 0 : 50;
    const total = subtotal + tax + shippingFee;

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            <div className="checkout-content">
                <div className="checkout-left">
                    {/* Shipping Address */}
                    <div className="checkout-section">
                        <h2>Shipping Address</h2>
                        <form className="checkout-form">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={shippingAddress.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={shippingAddress.phone}
                                    onChange={handleInputChange}
                                    placeholder="+251912345678"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={shippingAddress.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Region *</label>
                                    <input
                                        type="text"
                                        name="region"
                                        value={shippingAddress.region}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={shippingAddress.postalCode}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </form>
                    </div>

                    {/* Payment Method */}
                    <div className="checkout-section">
                        <h2>Payment Method</h2>
                        <div className="payment-methods">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method._id}
                                    className={`payment-method ${selectedPayment === method.name ? 'selected' : ''}`}
                                    onClick={() => handlePaymentMethodChange(method.name)}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method.name}
                                        checked={selectedPayment === method.name}
                                        onChange={() => handlePaymentMethodChange(method.name)}
                                    />
                                    <div className="payment-info">
                                        <span className="payment-icon">{method.icon}</span>
                                        <div>
                                            <strong>{method.displayName}</strong>
                                            <p>{method.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bank Transfer Details */}
                        {selectedPayment === 'bank_transfer' && bankTransferDetails && (
                            <div className="bank-transfer-details">
                                <h3>Bank Transfer Instructions</h3>
                                <div className="bank-info">
                                    <div className="info-row">
                                        <span className="label">Bank Name:</span>
                                        <span className="value">{bankTransferDetails.bankName}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Account Name:</span>
                                        <span className="value">{bankTransferDetails.accountName}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Account Number:</span>
                                        <span className="value">{bankTransferDetails.accountNumber}</span>
                                    </div>
                                    <div className="info-row highlight">
                                        <span className="label">Reference Code:</span>
                                        <span className="value">{bankTransferDetails.referenceCode}</span>
                                    </div>
                                    <div className="info-row highlight">
                                        <span className="label">Amount to Transfer:</span>
                                        <span className="value">${bankTransferDetails.amount.toFixed(2)} ETB</span>
                                    </div>
                                </div>

                                <div className="transfer-instructions">
                                    <p><strong>Instructions:</strong></p>
                                    <ol>
                                        <li>Transfer the exact amount to the account above</li>
                                        <li>Use the reference code in your transfer description</li>
                                        <li>Take a screenshot of your payment receipt</li>
                                        <li>Upload the receipt below</li>
                                        <li>Admin will verify and confirm your payment</li>
                                    </ol>
                                </div>

                                <div className="receipt-upload">
                                    <label htmlFor="receipt">Upload Payment Receipt *</label>
                                    <input
                                        type="file"
                                        id="receipt"
                                        accept="image/*"
                                        onChange={handleReceiptUpload}
                                        required
                                    />
                                    {receiptPreview && (
                                        <div className="receipt-preview">
                                            <img src={receiptPreview} alt="Receipt preview" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setReceiptFile(null);
                                                    setReceiptPreview(null);
                                                }}
                                                className="remove-receipt"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="checkout-right">
                    {/* Order Summary */}
                    <div className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="order-items">
                            {all_product.map((product) => {
                                if (cartItems[product.id] > 0) {
                                    return (
                                        <div key={product.id} className="order-item">
                                            <img src={product.image} alt={product.name} />
                                            <div className="item-details">
                                                <p className="item-name">{product.name}</p>
                                                <p className="item-quantity">Qty: {cartItems[product.id]}</p>
                                            </div>
                                            <p className="item-price">${product.new_price * cartItems[product.id]}</p>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <div className="order-totals">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="total-row">
                                <span>Tax (15%):</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping:</span>
                                <span>{shippingFee === 0 ? 'Free' : `$${shippingFee}`}</span>
                            </div>
                            <hr />
                            <div className="total-row total">
                                <strong>Total:</strong>
                                <strong>${total.toFixed(2)}</strong>
                            </div>
                        </div>

                        <button
                            className="place-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
