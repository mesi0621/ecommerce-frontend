import React, { useState } from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div
          className={`descriptiobox-nav-box ${activeTab === 'description' ? '' : 'fade'}`}
          onClick={() => setActiveTab('description')}
          style={{ cursor: 'pointer' }}
        >
          Description
        </div>
        <div
          className={`descriptiobox-nav-box ${activeTab === 'reviews' ? '' : 'fade'}`}
          onClick={() => setActiveTab('reviews')}
          style={{ cursor: 'pointer' }}
        >
          Reviews (122)
        </div>
      </div>
      <div className="descriptionbox-description">
        {activeTab === 'description' ? (
          <>
            <p>An e-commerce website is an online platform that facilitates buying and selling products or services over the internet. It serves as a virtual marketplace where businesses and individuals showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
            <p>E-commerce websites typically display products or services with detailed descriptions, images, prices, and any available variables (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
          </>
        ) : (
          <div>
            <p><strong>Customer Reviews</strong></p>
            <p>⭐⭐⭐⭐⭐ "Great product! Highly recommended." - John D.</p>
            <p>⭐⭐⭐⭐ "Good quality, fast shipping." - Sarah M.</p>
            <p>⭐⭐⭐⭐⭐ "Exactly as described. Very satisfied!" - Mike R.</p>
            <p style={{ marginTop: '20px', color: '#666' }}>
              Review functionality will be fully integrated with the backend review system.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DescriptionBox
