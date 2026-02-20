import React, { useState, useEffect } from 'react';
import './CSS/ShopCategory.css';
import Item from '../Components/Item/Item';
import SearchBar from '../Components/SearchBar/SearchBar';
import FilterSidebar from '../Components/FilterSidebar/FilterSidebar';
import SortDropdown from '../Components/SortDropdown/SortDropdown';
import productAPI from '../api/productAPI';

const ShopCategory = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    category: props.category || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    minRating: 0
  });

  // Update filters when props.category changes
  useEffect(() => {
    console.log('ShopCategory - Category prop changed:', props.category);
    setFilters(prev => ({
      ...prev,
      category: props.category || ''
    }));
  }, [props.category]);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, sortBy, filters, props.category]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        search: searchQuery || undefined,
        sort: sortBy,
        category: props.category || filters.category || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        inStock: filters.inStock || undefined,
        minRating: filters.minRating > 0 ? filters.minRating : undefined
      };

      console.log('ShopCategory - Fetching products with params:', params);
      console.log('ShopCategory - Category from props:', props.category);

      const response = await productAPI.getAll(params);
      console.log('ShopCategory - API Response:', response.data);
      console.log('ShopCategory - Products count:', response.data.data?.length || 0);

      // Use products directly - external URLs work as-is
      const productsFromAPI = response.data.data || [];
      setProducts(productsFromAPI);
    } catch (err) {
      console.error('Error fetching products:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, category: props.category || newFilters.category });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  if (loading) {
    return (
      <div className='shop-category'>
        <img className='shopcategory-banner' src={props.banner} alt="" />
        <div className="shopcategory-loading">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='shop-category'>
        <img className='shopcategory-banner' src={props.banner} alt="" />
        <div className="shopcategory-error">
          <p>Error loading products: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />

      {/* Search Bar */}
      <div className="shopcategory-search">
        <SearchBar onSearch={handleSearch} placeholder="Search products..." />
      </div>

      <div className="shopcategory-content">
        {/* Filter Sidebar */}
        <FilterSidebar
          onFilterChange={handleFilterChange}
          initialFilters={{ ...filters, category: props.category }}
        />

        <div className="shopcategory-main">
          {/* Header with count and sort */}
          <div className="shopcategory-header">
            <p className="shopcategory-count">
              <span>Showing {products.length}</span> {products.length === 1 ? 'product' : 'products'}
            </p>
            <SortDropdown onSortChange={handleSortChange} currentSort={sortBy} />
          </div>

          {/* Products Grid */}
          <div className="shopcategory-products">
            {products.length > 0 && console.log('ShopCategory - Rendering products:', products.length, 'First product:', products[0])}
            {products.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && !loading && (
            <div className="shopcategory-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopCategory;
