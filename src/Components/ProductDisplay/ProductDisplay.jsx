import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from '../../Context/ShopContext'
import { useToastContext } from '../../Context/ToastContext'

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const toast = useToastContext();

  // State for selected size and quantity
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Available sizes
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Calculate rating stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<img key={i} src={star_icon} alt="star" />);
      } else {
        stars.push(<img key={i} src={star_dull_icon} alt="star" />);
      }
    }
    return stars;
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.warning('Please select a size');
      return;
    }

    try {
      // Add to cart with the specified quantity
      for (let i = 0; i < quantity; i++) {
        const result = await addToCart(product.id);

        // Check if operation failed
        if (result && !result.success && !result.isGuest) {
          toast.error(result.error || 'Failed to add to cart');
          return;
        }
      }

      // Show success feedback
      setAddedToCart(true);

      // Check if user is guest
      const token = localStorage.getItem('auth-token');
      if (!token) {
        toast.success(`${quantity} item(s) added to cart! Login to checkout.`);
      } else {
        toast.success(`${quantity} item(s) added to cart!`);
      }

      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 100)) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className='productdisplay'>
      <div className='productdisplay-left'>
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img src={product.image} alt="" className="productdisplay-main-img" />
        </div>
      </div>
      <div className='productdisplay-right'>
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          {renderStars(product.rating || 4)}
          <p>({product.reviewCount || 122})</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.old_price}</div>
          <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          {product.description || 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment'}
        </div>

        {/* Stock availability */}
        <div className="productdisplay-stock">
          {product.stock > 0 ? (
            <p className="in-stock">✓ In Stock ({product.stock} available)</p>
          ) : (
            <p className="out-of-stock">✗ Out of Stock</p>
          )}
        </div>

        {/* Size selection */}
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {sizes.map((size) => (
              <div
                key={size}
                className={selectedSize === size ? 'size-selected' : ''}
                onClick={() => handleSizeSelect(size)}
                style={{ cursor: 'pointer' }}
              >
                {size}
              </div>
            ))}
          </div>
          {selectedSize && <p className="selected-size-text">Selected: {selectedSize}</p>}
        </div>

        {/* Quantity selector */}
        <div className="productdisplay-quantity">
          <h1>Quantity</h1>
          <div className="quantity-selector">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="quantity-btn"
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= (product.stock || 100)}
              className="quantity-btn"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || addedToCart}
          className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
        >
          {addedToCart ? '✓ ADDED TO CART' : 'ADD TO CART'}
        </button>

        <p className='productdisplay-right-category'>
          <span>Category :</span> {product.category || 'Fashion'}
        </p>
        <p className='productdisplay-right-category'>
          <span>Tags :</span> {product.tags ? product.tags.join(', ') : 'Modern, Latest'}
        </p>
      </div>
    </div>
  )
}

export default ProductDisplay
