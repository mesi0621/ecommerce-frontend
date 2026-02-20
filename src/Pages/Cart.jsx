import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Cart.css';
import { ShopContext } from '../Context/ShopContext';
import { useToastContext } from '../Context/ToastContext';
import CouponInput from '../Components/CouponInput/CouponInput';
import remove_icon from '../Components/Assets/cart_cross_icon.png';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { all_product, cartItems, removeFromCart, getTotalCartAmount, addToCart } = useContext(ShopContext);
  const toast = useToastContext();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { isAuthenticated, user, isGuest } = useAuth();

  const userId = user?.userId;

  const handleCheckout = () => {
    const total = getFinalTotal();

    if (total === 0) {
      toast.warning('Your cart is empty!');
      return;
    }

    // Guest restriction - require login to checkout
    if (!isAuthenticated || isGuest()) {
      toast.info('Please login to proceed to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    // Pass coupon data to checkout
    navigate('/checkout', {
      state: {
        appliedCoupon
      }
    });
  };

  const handleCouponApplied = (couponData) => {
    setAppliedCoupon(couponData);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
  };

  const getSubtotal = () => {
    return getTotalCartAmount();
  };

  const getShippingFee = () => {
    const subtotal = getSubtotal();
    return subtotal > 1000 ? 0 : 50;
  };

  const getDiscount = () => {
    return appliedCoupon ? appliedCoupon.discount : 0;
  };

  const getFinalTotal = () => {
    const subtotal = getSubtotal();
    const shipping = getShippingFee();
    const discount = getDiscount();
    return Math.max(0, subtotal + shipping - discount);
  };

  const handleIncreaseQuantity = async (productId) => {
    try {
      const result = await addToCart(productId);
      if (result && result.success) {
        toast.success('Quantity updated');
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleDecreaseQuantity = (productId) => {
    removeFromCart(productId);
    toast.info('Quantity updated');
  };

  const handleRemoveItem = (productId) => {
    const product = all_product.find(p => p.id === productId);
    const quantity = cartItems[productId];

    // Remove all quantities
    for (let i = 0; i < quantity; i++) {
      removeFromCart(productId);
    }
    toast.success(`${product?.name || 'Item'} removed from cart`);
  };

  // Check if cart is empty
  const cartItemsArray = all_product.filter(product => cartItems[product.id] > 0);
  const isCartEmpty = cartItemsArray.length === 0;

  if (isCartEmpty) {
    return (
      <div className='cart'>
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add items to your cart to see them here</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className='cart'>
      <div className="cart-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((product) => {
        if (cartItems[product.id] > 0) {
          return (
            <div key={product.id}>
              <div className="cart-format">
                <img src={product.image} alt={product.name} className='cart-icon-product-icon' />
                <p className="cart-product-title">{product.name}</p>
                <p className="cart-product-price">${product.new_price}</p>

                <div className="cart-quantity-controls">
                  <button
                    className="quantity-btn decrease"
                    onClick={() => handleDecreaseQuantity(product.id)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className='cart-quantity'>{cartItems[product.id]}</span>
                  <button
                    className="quantity-btn increase"
                    onClick={() => handleIncreaseQuantity(product.id)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <p className="cart-item-total">${(product.new_price * cartItems[product.id]).toFixed(2)}</p>

                <img
                  className='cart-remove-icon'
                  src={remove_icon}
                  onClick={() => handleRemoveItem(product.id)}
                  alt="Remove item"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cart-down">
        <div className="cart-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cart-total-item">
              <p>Subtotal</p>
              <p>${getSubtotal().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-item">
              <p>Shipping Fee</p>
              <p>{getShippingFee() === 0 ? 'Free' : `$${getShippingFee().toFixed(2)}`}</p>
            </div>
            <hr />
            {appliedCoupon && (
              <>
                <div className="cart-total-item cart-discount">
                  <p>Discount ({appliedCoupon.code})</p>
                  <p className="discount-amount">-${getDiscount().toFixed(2)}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-item">
              <h3>Total</h3>
              <h3>${getFinalTotal().toFixed(2)}</h3>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <CouponInput
            userId={userId}
            subtotal={getSubtotal()}
            shippingFee={getShippingFee()}
            onCouponApplied={handleCouponApplied}
            onCouponRemoved={handleCouponRemoved}
            appliedCoupon={appliedCoupon}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
