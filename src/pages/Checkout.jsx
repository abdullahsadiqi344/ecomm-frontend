// pages/Checkout.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartcontext';
import { userdatacontext } from '../context/Usercontext';
import axios from 'axios';
import { 
  FaCreditCard, 
  FaPaypal, 
  FaTruck, 
  FaCheckCircle,
  FaLock,
  FaShieldAlt,
  FaUser,
  FaPhone,
  FaShoppingBag
} from 'react-icons/fa';
import { AuthDataContext } from '../context/authContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, fetchCart } = useCart();
  const { userdata } = useContext(userdatacontext);
  
  // FIXED: Hardcode server URL directly
    let { serverUrl } = useContext(AuthDataContext)
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Get coupon data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('cartCheckoutData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setCouponCode(data.couponCode || '');
        setDiscount(data.discount || 0);
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
  }, []);

  // Pakistani shipping options
  const shippingOptions = [
    { 
      id: 'standard', 
      name: 'Standard Delivery', 
      cost: 200, 
      days: '5-7 business days',
      provider: 'Pakistan Post'
    },
    { 
      id: 'express', 
      name: 'Express Delivery', 
      cost: 500, 
      days: '2-3 business days',
      provider: 'TCS/Leopards'
    },
    { 
      id: 'free', 
      name: 'Free Delivery', 
      cost: 0, 
      days: '7-10 business days',
      provider: 'Pakistan Post',
      minOrder: 5000
    }
  ];

  // Pakistani payment methods
  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery' },
    { id: 'credit_card', name: 'Credit/Debit Card' },
    { id: 'jazzcash', name: 'JazzCash' },
    { id: 'easypaisa', name: 'EasyPaisa' },
    { id: 'paypal', name: 'PayPal' }
  ];

  // Pakistani cities
  const pakistaniCities = [
    'Islamabad', 'Karachi', 'Lahore', 'Rawalpindi', 'Faisalabad', 'Multan',
    'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Sukkur',
    'Abbottabad', 'Bahawalpur', 'Mardan', 'Swat', 'Gilgit', 'Skardu'
  ];

  // Pakistani provinces
  const pakistaniProvinces = [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir'
  ];

  // Shipping address form
  const [shippingAddress, setShippingAddress] = useState({
    fullName: userdata?.name || '',
    email: userdata?.email || '',
    phone: '+92',
    street: '',
    city: '',
    state: '',
    district: '',
    postalCode: '',
    country: 'Pakistan'
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // Shipping method
  const [selectedShipping, setSelectedShipping] = useState(
    cartTotal >= 5000 ? shippingOptions[2] : shippingOptions[0]
  );
  
  // Coupon code
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Calculate totals in PKR
  const subtotal = cartTotal;
  const shippingCost = selectedShipping.cost;
  const tax = (subtotal + shippingCost) * 0.15;
  const total = subtotal + shippingCost + tax - discount;

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    if (!value.startsWith('+92')) {
      value = '+92' + value.replace(/^\+?92?/, '');
    }
    
    setShippingAddress({
      ...shippingAddress,
      phone: value
    });
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'street', 'city', 'state', 'district'];
    
    for (const field of required) {
      if (!shippingAddress[field]?.trim()) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation - accept +92 followed by 10 digits
    const phoneRegex = /^\+92\d{10}$/;
    const cleanPhone = shippingAddress.phone.replace(/\s/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid Pakistani phone number (+92 followed by 10 digits)');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (orderCompleted) {
      navigate('/orders');
      return;
    }

    if (!validateForm()) return;
    
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        userId: userdata?._id,
        address: {
          ...shippingAddress,
          phone: shippingAddress.phone
        },
        paymentMethod,
        shippingMethod: selectedShipping,
        couponCode: couponCode || undefined,
        discount,
        items: cart.map(item => ({
          productId: item.productId || item._id,
          name: item.name,
          price: item.price,
          salePrice: item.salePrice,
          quantity: item.quantity,
          size: item.size || '',
          color: item.color || '',
          image: item.image || ''
        })),
        subtotal,
        shipping: shippingCost,
        tax,
        discount,
        total,
        currency: 'PKR'
      };

      console.log('Sending order to:', `${serverUrl}/api/orders/place`);
      console.log('Order data:', orderData);

      const response = await axios.post(
        `${serverUrl}/api/orders/place`,
        orderData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Order response:', response.data);

      if (response.data.success) {
        // Mark order as completed
        setOrderCompleted(true);
        setOrderDetails(response.data.order);
        
        // Clear the cart immediately
        await clearCart();
        
        // Clear localStorage
        localStorage.removeItem('cartCheckoutData');
        
        // Set success state to show confirmation
        setSuccess(true);
        
        // Force refresh cart data
        fetchCart();
        
        // Reset form after showing success
        setTimeout(() => {
          setShippingAddress({
            fullName: userdata?.name || '',
            email: userdata?.email || '',
            phone: '+92',
            street: '',
            city: '',
            state: '',
            district: '',
            postalCode: '',
            country: 'Pakistan'
          });
          setCouponCode('');
          setDiscount(0);
        }, 100);
        
      } else {
        setError(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error details:', {
        message: error.message,
        config: error.config,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        // Server responded with error
        setError(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // Request made but no response
        setError('No response from server. Please check if backend is running.');
      } else {
        // Other errors
        setError('Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show success page if order was completed
  if (success || orderCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-lg font-semibold mb-2">Order ID: #{orderDetails.orderId}</p>
                <p className="text-gray-600 mb-4">
                  A confirmation email has been sent to {shippingAddress.email}
                </p>
                <p className="text-gray-600">
                  Estimated delivery: {selectedShipping.days}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-left">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-gray-600">{shippingAddress.fullName}</p>
                <p className="text-gray-600">{shippingAddress.street}</p>
                <p className="text-gray-600">
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.district}
                </p>
                <p className="text-gray-600">Pakistan</p>
              </div>
              
              <div className="text-left">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <p className="text-gray-600">Items: Rs. {subtotal.toFixed(2)}</p>
                <p className="text-gray-600">Shipping: Rs. {shippingCost.toFixed(2)}</p>
                <p className="text-gray-600">Tax: Rs. {tax.toFixed(2)}</p>
                {discount > 0 && (
                  <p className="text-green-600">Discount: -Rs. {discount.toFixed(2)}</p>
                )}
                <p className="text-lg font-bold mt-2">Total: Rs. {total.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart if cart is empty (shouldn't happen if order just completed)
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <FaShoppingBag className="text-6xl text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Your order has been placed successfully!</p>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaTruck className="mr-2" />
                Shipping Address (Pakistan)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <FaUser className="inline mr-2 text-gray-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingAddress.email}
                    onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                    required
                    placeholder="example@gmail.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <FaPhone className="inline mr-2 text-gray-400" />
                    Phone Number *
                  </label>
                  <div className="flex">
                    <div className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l">
                      +92
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone.replace('+92', '')}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '');
                        const limitedDigits = digits.slice(0, 10);
                        setShippingAddress({
                          ...shippingAddress,
                          phone: '+92' + limitedDigits
                        });
                      }}
                      className="flex-1 border rounded-r px-3 py-2"
                      required
                      placeholder="3001234567"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Format: +92 followed by 10 digits (e.g., +923001234567)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Street/House No. *</label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                    required
                    placeholder="House #123, Street #4"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">District/Tehsil *</label>
                  <input
                    type="text"
                    name="district"
                    value={shippingAddress.district}
                    onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                    required
                    placeholder="District/Tehsil"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <select
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select City</option>
                    {pakistaniCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Province *</label>
                  <select
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Province</option>
                    {pakistaniProvinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="44000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    value="Pakistan"
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
              
              <div className="space-y-3">
                {shippingOptions.map(option => {
                  const isFreeEligible = option.id === 'free' && cartTotal >= option.minOrder;
                  const isDisabled = option.id === 'free' && !isFreeEligible;
                  
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                        selectedShipping.id === option.id ? 'border-black bg-gray-50' : 
                        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping.id === option.id}
                          onChange={() => !isDisabled && setSelectedShipping(option)}
                          className="mr-3"
                          disabled={isDisabled}
                        />
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-gray-600">{option.days}</p>
                          <p className="text-xs text-gray-500">{option.provider}</p>
                        </div>
                      </div>
                      <p className="font-bold">
                        {option.cost === 0 ? 'FREE' : `Rs. ${option.cost.toFixed(2)}`}
                      </p>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaCreditCard className="mr-2" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <label 
                    key={method.id}
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      {method.id === 'credit_card' && <FaCreditCard className="mr-3 text-xl" />}
                      {method.id === 'paypal' && <FaPaypal className="mr-3 text-xl text-blue-500" />}
                      <span className="font-medium">{method.name}</span>
                      {(method.id === 'cod' || method.id === 'jazzcash' || method.id === 'easypaisa') && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Popular
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center border-b pb-4">
                    <img
                      src={item.image || 'https://via.placeholder.com/50'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      {item.size && (
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-600">Color: {item.color}</p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">
                      Rs. {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {selectedShipping.cost === 0 ? 'FREE' : `Rs. ${shippingCost.toFixed(2)}`}
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
                
                <div className="flex justify-between text-lg font-bold pt-4 border-t">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FaLock className="mr-2" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaShieldAlt className="mr-2" />
                  <span>SSL encrypted</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Processing Order...
                </>
              ) : (
                `Place Order - Rs. ${total.toFixed(2)}`
              )}
            </button>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/cart')}
              className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              ← Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;