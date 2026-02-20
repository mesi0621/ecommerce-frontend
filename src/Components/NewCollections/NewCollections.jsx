import React, { useContext } from 'react'
import Item from '../Item/Item';
import './NewCollections.css'
import { ShopContext } from '../../Context/ShopContext';

const NewCollections = () => {
  const { all_product } = useContext(ShopContext);

  // Get the latest 8 products (or first 8 if no date sorting)
  const newCollections = all_product.slice(0, 8);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newCollections.map((item, i) => {
          return <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        })}
      </div>
    </div>
  )
}

export default NewCollections
