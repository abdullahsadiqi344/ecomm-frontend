import React, { useState, useEffect , useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaTruck, FaShieldAlt, FaExchangeAlt } from 'react-icons/fa';
import { useCart } from '../context/cartcontext';
import { AuthDataContext } from '../context/authContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

    let { serverUrl } = useContext(AuthDataContext)

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/products/${id}`);
      setProduct(response.data);
      
      // Set default selections
      if (response.data.sizes && response.data.sizes.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      if (response.data.colors && response.data.colors.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    const result = await addToCart(product, quantity, selectedSize, selectedColor);
    
    if (result.success) {
      alert('Added to cart successfully!');
    } else {
      alert(result.message);
    }
    
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    const result = await handleAddToCart();
    if (result?.success) {
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = product.onSale && product.salePrice 
    ? product.salePrice 
    : product.price;

  const discount = product.onSale 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <span 
            className="hover:text-black cursor-pointer"
            onClick={() => navigate('/')}
          >
            Home
          </span>
          {' > '}
          <span 
            className="hover:text-black cursor-pointer"
            onClick={() => navigate(`/?category=${product.category}`)}
          >
            {product.category}
          </span>
          {' > '}
          <span className="text-black">{product.name}</span>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4">
                <img
                  src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-96 object-contain rounded-lg"
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded ${selectedImage === index ? 'border-black' : 'border-gray-300'}`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Product Header */}
              <div className="mb-4">
                {product.onSale && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold mr-2">
                    {discount}% OFF
                  </span>
                )}
                {product.featured && (
                  <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                    FEATURED
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* SKU */}
              <p className="text-gray-500 text-sm mb-4">SKU: {product.sku}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="text-gray-600">
                  ({product.reviewsCount || 0} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold">${displayPrice}</span>
                  {product.onSale && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.price}
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        Save ${(product.price - product.salePrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded ${selectedColor === color ? 'border-black' : 'border-gray-300 hover:border-black'}`}
                        title={color}
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full mr-2"
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          {color}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-l"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                    className="w-16 py-2 border-t border-b border-gray-300 text-center"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 border border-gray-300 rounded-r"
                  >
                    +
                  </button>
                  <span className="ml-4 text-gray-600">
                    {product.stock} items available
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold flex items-center justify-center ${product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  <FaShoppingCart className="mr-2" />
                  {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
              
              {/* Additional Actions */}
              <div className="flex space-x-4">
                <button className="flex items-center text-gray-600 hover:text-black">
                  <FaHeart className="mr-2" />
                  Add to Wishlist
                </button>
                <button className="flex items-center text-gray-600 hover:text-black">
                  <FaShare className="mr-2" />
                  Share
                </button>
              </div>
              
              {/* Product Features */}
              <div className="mt-8 pt-8 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <FaTruck className="text-2xl mr-3 text-gray-500" />
                    <div>
                      <p className="font-bold">Free Shipping</p>
                      <p className="text-sm text-gray-600">On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaShieldAlt className="text-2xl mr-3 text-gray-500" />
                    <div>
                      <p className="font-bold">2 Year Warranty</p>
                      <p className="text-sm text-gray-600">Quality guaranteed</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaExchangeAlt className="text-2xl mr-3 text-gray-500" />
                    <div>
                      <p className="font-bold">30-Day Returns</p>
                      <p className="text-sm text-gray-600">Easy return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;