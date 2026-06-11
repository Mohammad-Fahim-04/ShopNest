import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = '/api/products?';

        if (search) url += `search=${search}&`;
        if (category) url += `category=${category}&`;
        if (gender) url += `gender=${gender}&`;

        if (priceRange === '0-999') url += 'minPrice=0&maxPrice=999&';
        if (priceRange === '1000-1999') url += 'minPrice=1000&maxPrice=1999&';
        if (priceRange === '2000-4999') url += 'minPrice=2000&maxPrice=4999&';

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    setVisibleCount(8);
  }, [search, category, gender, priceRange]);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="shop-container">
      <h2>All Products</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="shop-filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="shirt">Shirt</option>
          <option value="t-shirt">T-Shirt</option>
          <option value="hoodie">Hoodie</option>
          <option value="pants">Pants</option>
          <option value="shoes">Shoes</option>
          <option value="jacket">Jacket</option>
        </select>

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">All Gender</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>

        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
          <option value="">All Prices</option>
          <option value="0-999">₹0 - ₹999</option>
          <option value="1000-1999">₹1000 - ₹1999</option>
          <option value="2000-4999">₹2000 - ₹4999</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div style={{ color: '#f97316', marginTop: '40px' }}>
          No products found.
        </div>
      ) : (
        <>
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {visibleCount < products.length && (
            <button
              className="btn more-products-btn"
              onClick={() => setVisibleCount((prev) => prev + 8)}
            >
              More Products
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;