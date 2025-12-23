import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../component/ProductCard';
import HomeBanner from '../component/HomeBanner';
import { AuthDataContext } from '../context/authContext';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get category from URL
  const getCategoryFromPath = () => {
    const path = location.pathname;
    
    if (path === '/') return 'All';
    if (path === '/sale') return 'Sale';
    
    // Extract category from /category/xyz path
    const categoryMatch = path.match(/\/category\/(.+)/);
    if (categoryMatch) {
      const category = categoryMatch[1];
      // Capitalize first letter
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    return 'All';
  };

  const [activeCategory, setActiveCategory] = useState(getCategoryFromPath());

  const categories = [
    'All', 'Men', 'Women', 'Kids', 'Jordan', 'Like', 'SKMS', 'Sport', 'Sale'
  ];

    let { serverUrl } = useContext(AuthDataContext)
   useEffect(() => {
    setActiveCategory(getCategoryFromPath());
    fetchProducts();
  }, [location.pathname]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch all products
      const allResponse = await axios.get(`${serverUrl}/api/products`);
      setProducts(allResponse.data.products || []);
      
      // Fetch featured products
      const featuredResponse = await axios.get(`${serverUrl}/api/products?featured=true`);
      setFeaturedProducts(featuredResponse.data.products || []);
      
      // Fetch sale products
      const saleResponse = await axios.get(`${serverUrl}/api/products?onSale=true`);
      setSaleProducts(saleResponse.data.products || []);
      
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProductsByCategory = () => {
    if (activeCategory === 'All') return products;
    if (activeCategory === 'Sale') return saleProducts;
    return products.filter(product => product.category === activeCategory);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    
    // Update URL based on category
    if (category === 'All') {
      navigate('/');
    } else if (category === 'Sale') {
      navigate('/sale');
    } else {
      navigate(`/category/${category.toLowerCase()}`);
    }
  };

  // Don't show banner on category pages
  const showBanner = location.pathname === '/';

  return (
    <div className="min-h-screen">
      {/* Banner - Only show on home page */}
      {showBanner && <HomeBanner />}
      
      {/* Category-specific heading */}
      {!showBanner && (
        <div className="bg-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">
              {activeCategory === 'Sale' ? 'Sale Products' : `${activeCategory} Collection`}
            </h1>
            <p className="text-gray-300">
              {activeCategory === 'All' ? 'All Products' : 
               activeCategory === 'Sale' ? 'Limited time offers' : 
               `Browse our ${activeCategory.toLowerCase()} collection`}
            </p>
          </div>
        </div>
      )}

      {/* Featured Products Section - Only show on home page */}
      {showBanner && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
            {loading ? (
              <div className="text-center py-12">Loading featured products...</div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No featured products available
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sale Products Section - Only show on home page */}
      {showBanner && (
        <section className="py-12 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Sale Products</h2>
              <div className="text-red-400 animate-pulse">
                ⚡ Limited Time Offer
              </div>
            </div>
            {loading ? (
              <div className="text-center py-12">Loading sale products...</div>
            ) : saleProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {saleProducts.slice(0, 4).map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No products on sale
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories Filter - Always show */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {showBanner && (
            <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          )}
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full transition-colors ${activeCategory === category 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mb-4"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              {/* Category info */}
              {!showBanner && filterProductsByCategory().length > 0 && (
                <div className="mb-6 text-center">
                  <p className="text-gray-600">
                    Showing {filterProductsByCategory().length} product{filterProductsByCategory().length !== 1 ? 's' : ''} 
                    in {activeCategory === 'Sale' ? 'sale' : activeCategory.toLowerCase()} category
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filterProductsByCategory().map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {filterProductsByCategory().length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😕</div>
                  <h3 className="text-xl font-bold mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">
                    No products available in {activeCategory.toLowerCase()} category
                  </p>
                  <button
                    onClick={() => handleCategoryClick('All')}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Browse All Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section - Only show on home page */}
      {showBanner && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
                <p className="text-gray-600">Free delivery on orders over $50</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">↩️</div>
                <h3 className="font-bold text-lg mb-2">30-Day Returns</h3>
                <p className="text-gray-600">Easy returns within 30 days</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
                <p className="text-gray-600">100% secure payment processing</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;