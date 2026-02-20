import React from 'react';
import Item from '../Item/Item';
import './Popular.css';
import { usePopular } from '../../hooks/usePopular';

const Popular = () => {
  // Algorithm #8: Popularity Algorithm - Get best sellers
  const { products, loading, error } = usePopular(8);

  if (loading) {
    return (
      <div className="popular">
        <h1>POPULAR PRODUCTS</h1>
        <hr />
        <div className="popular-item">
          <p>Loading popular products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popular">
        <h1>POPULAR PRODUCTS</h1>
        <hr />
        <div className="popular-item">
          <p>Error loading products: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popular">
      <h1>POPULAR PRODUCTS</h1>
      <hr />
      <div className="popular-item">
        {products.map((item, i) => {
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
    </div>
  );
};

export default Popular;
