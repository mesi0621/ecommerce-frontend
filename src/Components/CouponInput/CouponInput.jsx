import React, { useState } from 'react';
import './CouponInput.css';
import couponAPI from '../../api/couponAPI';
import { useToast } from '../../hooks/useToast';

const CouponInput = ({ userId, subtotal, shippingFee, onCouponApplied, onCouponRemoved, appliedCoupon }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleApply = async () => {
        if (!code.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        if (!userId) {
            toast.error('Please login to use coupons');
            return;
        }

        setLoading(true);

        try {
            const response = await couponAPI.validateCoupon(
                code.trim(),
                userId,
                subtotal,
                shippingFee
            );

            const couponData = response.data.data;
            toast.success(`Coupon applied! You saved $${couponData.discount.toFixed(2)}`);

            if (onCouponApplied) {
                onCouponApplied(couponData);
            }

            setCode('');
        } catch (error) {
            console.error('Error applying coupon:', error);
            const errorMsg = error.response?.data?.error || 'Invalid coupon code';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        if (onCouponRemoved) {
            onCouponRemoved();
        }
        toast.success('Coupon removed');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleApply();
        }
    };

    if (appliedCoupon) {
        return (
            <div className="coupon-input">
                <div className="coupon-applied">
                    <div className="coupon-applied-info">
                        <div className="coupon-applied-icon">✓</div>
                        <div className="coupon-applied-details">
                            <div className="coupon-applied-code">{appliedCoupon.code}</div>
                            <div className="coupon-applied-description">
                                {appliedCoupon.description}
                            </div>
                            <div className="coupon-applied-discount">
                                Discount: -${appliedCoupon.discount.toFixed(2)}
                            </div>
                        </div>
                    </div>
                    <button
                        className="coupon-remove-btn"
                        onClick={handleRemove}
                        type="button"
                    >
                        Remove
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="coupon-input">
            <div className="coupon-input-header">
                <svg className="coupon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c-1.1 0-2-.9-2-2V4c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v4c0 1.1-.9 2-2 2s-2 .9-2 2 .9 2 2 2c1.1 0 2 .9 2 2v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4c0-1.1.9-2 2-2s2-.9 2-2-.9-2-2-2z" />
                </svg>
                <span className="coupon-label">Have a coupon code?</span>
            </div>
            <div className="coupon-input-group">
                <input
                    type="text"
                    className="coupon-input-field"
                    placeholder="Enter coupon code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
                <button
                    className="coupon-apply-btn"
                    onClick={handleApply}
                    disabled={loading || !code.trim()}
                    type="button"
                >
                    {loading ? 'Applying...' : 'Apply'}
                </button>
            </div>
        </div>
    );
};

export default CouponInput;
