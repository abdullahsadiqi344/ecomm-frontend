import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaEye, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/cartcontext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);
    
    const result = await addToCart(product, 1);
    
    if (result.success) {
      // Optional: Show success message
      console.log(result.message);
    } else {
      alert(result.message);
    }
    
    setIsAdding(false);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  const displayPrice = product.onSale && product.salePrice 
    ? product.salePrice 
    : product.price;

  const originalPrice = product.onSale ? product.price : null;

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden h-64">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Sale Badge */}
        {product.onSale && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            SALE
          </div>
        )}
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 rounded text-xs font-bold">
            FEATURED
          </div>
        )}
        
        {/* Quick Actions */}
        <div className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              title="Add to cart"
            >
              <FaShoppingCart />
            </button>
            <button
              onClick={handleQuickView}
              className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
              title="Quick view"
            >
              <FaEye />
            </button>
            <button
              className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
              title="Add to wishlist"
            >
              <FaHeart />
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">${displayPrice}</span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({product.reviewsCount || 0})
            </span>
          </div>
          
          <div className="text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock})</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors ${product.stock === 0 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-gray-800'}`}
        >
          {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;