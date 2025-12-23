import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaArrowLeft, 
  FaShoppingBag,
  FaTruck,
  FaShieldAlt
} from 'react-icons/fa';
import { useCart } from '../context/cartcontext';
import { userdatacontext } from '../context/Usercontext';

const Cartpage = () => {
  const { cart, cartTotal, removeFromCart, updateCartItem, clearCart, loading } = useCart();
  const { userdata } = useContext(userdatacontext);
  const navigate = useNavigate();
  
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  // Coupon code
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Pakistan shipping options (for display only)
  const shippingOptions = [
    { 
      id: 'standard', 
      name: 'Standard Delivery', 
      cost: 200, 
      days: '5-7 business days'
    },
    { 
      id: 'express', 
      name: 'Express Delivery', 
      cost: 500, 
      days: '2-3 business days'
    },
    { 
      id: 'free', 
      name: 'Free Delivery', 
      cost: 0, 
      days: '7-10 business days',
      minOrder: 5000
    }
  ];
  
  // Default to standard shipping
  const shippingCost = cartTotal >= 5000 ? 0 : 200;
  const tax = (cartTotal + shippingCost) * 0.15; // 15% GST
  const total = cartTotal + shippingCost + tax - discount;

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    // Pakistani e-commerce coupons
    const coupons = {
      'PAK10': 0.1, // 10% discount
      'PAK500': 500, // 500 PKR discount
      'WELCOME': 0.2 // 20% discount for new customers
    };

    const coupon = coupons[couponCode.toUpperCase()];
    
    if (coupon) {
      if (typeof coupon === 'number') {
        if (coupon < 1) {
          // Percentage discount
          const discountAmount = cartTotal * coupon;
          setDiscount(discountAmount);
          alert(`${coupon * 100}% discount applied!`);
        } else {
          // Fixed amount discount
          setDiscount(coupon);
          alert(`${coupon} PKR discount applied!`);
        }
      }
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (!userdata) {
      if (window.confirm('Please login to checkout. Redirect to login page?')) {
        navigate('/login');
      }
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setCheckoutLoading(true);
    
    // Store coupon data in localStorage
    const checkoutData = {
      couponCode,
      discount
    };
    
    localStorage.setItem('cartCheckoutData', JSON.stringify(checkoutData));
    
    // Navigate to checkout page
    setTimeout(() => {
      setCheckoutLoading(false);
      navigate('/checkout');
    }, 500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <FaShoppingBag className="text-6xl text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some products to get started!</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cart.length} items)</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:w-2/3">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Cart Items</h2>
              
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex flex-col md:flex-row border-b pb-6">
                    {/* Product Image */}
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <img
                        src={item.image || 'https://via.placeholder.com/150'}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="md:w-3/4 md:pl-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link 
                            to={`/product/${item.productId}`}
                            className="text-lg font-semibold hover:text-black transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-gray-600 mt-1">Rs. {item.price.toFixed(2)}</p>
                          
                          {/* Variants */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.size && (
                              <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                Color: {item.color}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 ml-4"
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          
                          <span className="px-4 py-2 min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={loading}
                            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>
                        
                        <div className="text-lg font-semibold">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between mt-6 pt-6 border-t">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Continue Shopping
                </button>
                
                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Apply Coupon</h3>
              <p className="text-sm text-gray-600 mb-3">
                Try: PAK10 (10% off), PAK500 (500 PKR off), WELCOME (20% off)
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 border rounded px-3 py-2 uppercase"
                />
                <button
                  onClick={applyCoupon}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className="text-green-600 text-sm mt-2">
                  {couponCode === 'PAK10' || couponCode === 'WELCOME' 
                    ? `${(discount/cartTotal*100).toFixed(0)}% discount applied!` 
                    : `Rs. ${discount.toFixed(2)} discount applied!`}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <FaShoppingBag className="mr-2" />
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>
              
              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                      <img
                        src={item.image || 'https://via.placeholder.com/50'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity} × Rs. {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={cartTotal >= 5000 ? 'text-green-600' : ''}>
                    {cartTotal >= 5000 ? 'FREE' : 'Rs. 200.00'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (15% GST)</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-Rs. {discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Shipping Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaTruck className="mr-2" />
                  <span>
                    {cartTotal >= 5000 
                      ? 'Free Shipping Applied!'
                      : 'Standard Shipping: Rs. 200'}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaShieldAlt className="mr-2" />
                  <span>Cash on Delivery Available</span>
                </div>
                {cartTotal < 5000 && (
                  <p className="text-sm text-blue-600 mt-2">
                    Add Rs. {(5000 - cartTotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || loading}
                className="w-full mt-6 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {checkoutLoading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Processing...
                  </>
                ) : (
                  `Proceed to Checkout - Rs. ${total.toFixed(2)}`
                )}
              </button>
              
              {/* Login Reminder */}
              {!userdata && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 text-center">
                    Please login to complete your purchase
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full mt-2 px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                  >
                    Login Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cartpage;