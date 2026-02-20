import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'
import WishlistButton from '../WishlistButton/WishlistButton'

const Item = (props) => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className='item'>
      <div className="item-image-container">
        <Link to={`/product/${props.id}`} onClick={handleClick}>
          <img src={props.image} alt="" />
        </Link>
        <div className="wishlist-button-container">
          <WishlistButton productId={props.id} size="small" />
        </div>
      </div>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">
          ${props.new_price}
        </div>
        <div className="item-price-old">
          ${props.old_price}
        </div>
      </div>
    </div>
  )
}

export default Item
