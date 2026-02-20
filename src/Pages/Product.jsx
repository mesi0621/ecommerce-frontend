import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrum/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import ReviewForm from '../Components/ReviewForm/ReviewForm';
import ReviewList from '../Components/ReviewList/ReviewList';
import RecentlyViewed from '../Components/RecentlyViewed/RecentlyViewed';
import { useProduct } from '../hooks/useProducts';
import interactionAPI from '../api/interactionAPI';
import { addToRecentlyViewed } from '../utils/recentlyViewed';

const Product = () => {
  const { userId } = useContext(ShopContext);
  const { productId } = useParams();
  const [reviewRefresh, setReviewRefresh] = useState(0);

  // Fetch product from backend and track view
  const { product, loading, error } = useProduct(Number(productId), userId);

  // Track view interaction when product loads
  useEffect(() => {
    if (product && userId) {
      interactionAPI.track(product.id, userId, 'view', {
        category: product.category,
        price: product.new_price
      }).catch(err => console.error('Error tracking view:', err));
    }
  }, [product, userId]);

  // Add to recently viewed when product loads
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  const handleReviewSubmitted = () => {
    setReviewRefresh(prev => prev + 1);
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading product...</div>;
  }

  if (error || !product) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Product not found</div>;
  }

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <ReviewForm
          productId={product.id}
          onReviewSubmitted={handleReviewSubmitted}
        />
        <ReviewList
          productId={product.id}
          refreshTrigger={reviewRefresh}
        />
      </div>
      <RecentlyViewed currentProductId={product.id} maxItems={8} />
      <RelatedProducts productId={product.id} category={product.category} />
    </div>
  );
};

export default Product;
