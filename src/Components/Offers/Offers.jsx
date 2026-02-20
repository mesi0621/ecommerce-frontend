import React from 'react'
import { useNavigate } from 'react-router-dom'
import exclusive_image from '../Assets/exclusive_image.png'
import './Offers.css'

const Offers = () => {
  const navigate = useNavigate();

  const handleCheckNow = () => {
    // Navigate to women's category (or you can change to any category)
    navigate('/womens');
  };

  return (
    <div className='offers'>
      <div className="offers-left">
        <h1> Exclusive</h1>
        <h2>Offers For You</h2>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <button onClick={handleCheckNow}>Check Now</button>
      </div>
      <div className="offers-right">
        <img src={exclusive_image} alt="" />
      </div>

    </div>
  )
}

export default Offers
