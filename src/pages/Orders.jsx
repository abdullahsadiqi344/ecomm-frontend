// pages/Orders.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { userdatacontext } from '../context/Usercontext';
import axios from 'axios';
import { 
  FaBox, 
  FaShippingFast, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock,
  FaTruck,
  FaMapMarkerAlt,
  FaCreditCard
} from 'react-icons/fa';

const Orders = () => {
  const { userdata, serverUrl } = useContext(userdatacontext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userdata) {
      fetchOrders();
    }
  }, [userdata]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/orders/my-orders`, {
        withCredentials: true
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'processing':
        return <FaBox className="text-blue-500" />;
      case 'shipped':
        return <FaTruck className="text-purple-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!userdata) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view orders</h1>
          <Link
            to="/login"
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600 mb-8">View and track your orders</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping!
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-black text-white rounded-lg inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id || order.orderId} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">Order #{order.orderId || order._id.slice(-8)}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status}</span>
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Placed on {formatDate(order.orderDate || order.createdAt)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold">${order.totalAmount?.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <img
                          src={item.image || 'https://via.placeholder.com/50'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                            <span>Qty: {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-bold mb-2 flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        Shipping Address
                      </h4>
                      {order.address ? (
                        <div className="text-sm text-gray-600">
                          <p>{order.address.fullName}</p>
                          <p>{order.address.street}</p>
                          <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                          <p>{order.address.country}</p>
                          {order.address.phone && <p>Phone: {order.address.phone}</p>}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">Not specified</p>
                      )}
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h4 className="font-bold mb-2 flex items-center">
                        <FaCreditCard className="mr-2" />
                        Payment
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p className="capitalize">{order.paymentMethod?.replace('_', ' ') || 'Not specified'}</p>
                        <p>Total: ${order.totalAmount?.toFixed(2)}</p>
                        {order.trackingNumber && (
                          <p className="mt-2">
                            Tracking: <span className="font-mono">{order.trackingNumber}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="font-bold mb-2">Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 border border-gray-300 rounded text-sm">
                          View Details
                        </button>
                        {order.status === 'delivered' && (
                          <button className="w-full px-4 py-2 bg-gray-100 rounded text-sm">
                            Leave Review
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button className="w-full px-4 py-2 bg-red-100 text-red-700 rounded text-sm">
                            Cancel Order
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button className="w-full px-4 py-2 bg-black text-white rounded text-sm">
                            Track Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;