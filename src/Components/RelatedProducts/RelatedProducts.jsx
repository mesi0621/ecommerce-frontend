import React from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import { useRecommendations } from '../../hooks/useRecommendations';

const RelatedProducts = ({ productId, category }) => {
  // Algorithm #6: Recommendation Algorithm (Content-Based Filtering)
  const { recommendations, loading, error } = useRecommendations(productId, 4);

  if (loading) {
    return (
      <div className='relatedproducts'>
        <h1>Related Products</h1>
        <hr />
        <div className="relatedproducts-item">
          <p>Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='relatedproducts'>
        <h1>Related Products</h1>
        <hr />
        <div className="relatedproducts-item">
          <p>Unable to load recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relatedproducts'>
      <h1>You May Also Like</h1>
      <hr />
      <div className="relatedproducts-item">
        {recommendations.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
      {recommendations.length === 0 && (
        <p style={{ textAlign: 'center', padding: '20px' }}>
          No similar products found
        </p>
      )}
    </div>
  );
};

export default RelatedProducts;
