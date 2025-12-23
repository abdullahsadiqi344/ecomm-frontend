import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { userdatacontext } from '../context/Usercontext';
import { FaPlus, FaEdit, FaTrash, FaBox, FaUsers, FaShoppingCart, FaChartBar, FaCloudUploadAlt, FaTimes, FaEye } from 'react-icons/fa';
import { AuthDataContext } from '../context/authContext';

const Admin = () => {
    let { serverUrl } = useContext(AuthDataContext)
  
  const { userdata } = useContext(userdatacontext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: 'Men',
    images: [],
    stock: '10',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'White'],
    featured: false,
    onSale: false
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const fileInputRef = useRef(null);
   //const serverUrl = "http://localhost:60001";

  // Check if user is admin
  const isAdmin = userdata?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/products`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/orders/all`, {
        withCredentials: true
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = files.filter(file => 
      ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)
    );
    
    if (validFiles.length === 0) {
      alert('Please select valid image files (JPEG, PNG, WebP)');
      return;
    }
    
    // Limit to 10 files
    if (validFiles.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const previewUrls = validFiles.map(file => URL.createObjectURL(file));
    setNewProduct(prev => ({
      ...prev,
      images: [...prev.images, ...previewUrls]
    }));
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Upload images to Cloudinary
  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      return []; // Return empty array if no files
    }

    setUploadLoading(true);
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post(
        `${serverUrl}/api/products/upload-images`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        return response.data.imageUrls;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert(error.response?.data?.message || 'Failed to upload images');
      return [];
    } finally {
      setUploadLoading(false);
    }
  };

  // Add product with file upload
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload images first
      const uploadedImageUrls = await uploadImages();
      
      // Combine uploaded images with URL images
      const allImageUrls = [
        ...uploadedImageUrls,
        ...imageUrls.filter(url => url.trim() !== '')
      ];

      if (allImageUrls.length === 0) {
        alert('Please add at least one image (upload or URL)');
        setLoading(false);
        return;
      }

      // Prepare product data
      const productData = {
        ...newProduct,
        images: allImageUrls,
        price: parseFloat(newProduct.price),
        salePrice: newProduct.onSale ? parseFloat(newProduct.salePrice) : undefined,
        stock: parseInt(newProduct.stock),
        sizes: Array.isArray(newProduct.sizes) ? newProduct.sizes : newProduct.sizes.split(',').map(s => s.trim()),
        colors: Array.isArray(newProduct.colors) ? newProduct.colors : newProduct.colors.split(',').map(c => c.trim())
      };

      // Create product
      const response = await axios.post(
        `${serverUrl}/api/products`,
        productData,
        { withCredentials: true }
      );
      
      alert('Product added successfully!');
      setShowAddProduct(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  // Add product with images in one request
  const handleAddProductWithImages = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add files
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });
      
      // Add product data as JSON
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        salePrice: newProduct.onSale ? parseFloat(newProduct.salePrice) : undefined,
        stock: parseInt(newProduct.stock)
      };
      
      formData.append('product', JSON.stringify(productData));

      const response = await axios.post(
        `${serverUrl}/api/products/with-images`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      alert('Product added successfully!');
      setShowAddProduct(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      salePrice: '',
      category: 'Men',
      images: [],
      stock: '10',
      sizes: ['M', 'L', 'XL'],
      colors: ['Black', 'White'],
      featured: false,
      onSale: false
    });
    setSelectedFiles([]);
    setImageUrls(['']);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`${serverUrl}/api/products/${productId}`, {
        withCredentials: true
      });
      
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert('Failed to delete product');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${serverUrl}/api/orders/status/${orderId}`,
        { status },
        { withCredentials: true }
      );
      
      alert('Order status updated!');
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      alert('Failed to update order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Calculate stats - REVENUE ONLY FROM DELIVERED ORDERS
  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  if (!userdata) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please login to access admin panel</h1>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2">Admin privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="text-sm">
            Welcome, <span className="font-semibold">{userdata.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FaChartBar className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">Rs. {totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">(Delivered orders only)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FaShoppingCart className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FaBox className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <FaUsers className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'products' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'orders' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Products Management</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-black text-white rounded-lg flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Product
              </button>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">Product</th>
                      <th className="py-3 text-left">Price</th>
                      <th className="py-3 text-left">Stock</th>
                      <th className="py-3 text-left">Category</th>
                      <th className="py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center">
                            <img 
                              src={product.images?.[0] || 'https://via.placeholder.com/50'} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded mr-3"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium">Rs. {product.price}</p>
                            {product.onSale && (
                              <p className="text-sm text-red-600">Sale: Rs. {product.salePrice}</p> 
                            )}
                          </div>
                        </td>
                        <td className="py-4">{product.stock}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Orders Management</h2>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">Order ID</th>
                      <th className="py-3 text-left">Customer</th>
                      <th className="py-3 text-left">Total</th>
                      <th className="py-3 text-left">Status</th>
                      <th className="py-3 text-left">Date</th>
                      <th className="py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId} className="border-b hover:bg-gray-50">
                        <td className="py-4 font-mono">#{order.orderId?.slice(-8) || 'N/A'}</td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{order.user?.name || 'Guest'}</p>
                            <p className="text-sm text-gray-500">{order.user?.email || order.address?.email || 'No email'}</p>
                          </div>
                        </td>
                        <td className="py-4 font-bold">Rs. {order.totalAmount?.toFixed(2) || '0.00'}</td>
                        <td className="py-4">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                            className="px-3 py-1 border rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4">
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-4">
                          <button 
                            onClick={() => viewOrderDetails(order)}
                            className="px-3 py-1 bg-gray-100 rounded text-sm flex items-center gap-1 hover:bg-gray-200"
                          >
                            <FaEye className="text-gray-600" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Order Details</h2>
                  <button
                    onClick={() => {
                      setShowOrderDetails(false);
                      setSelectedOrder(null);
                    }}
                    className="text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>
                </div>

                {/* Order Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold mb-3">Order Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Order ID:</span> #{selectedOrder.orderId}</p>
                      <p><span className="font-medium">Date:</span> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedOrder.status?.toUpperCase()}
                        </span>
                      </p>
                      <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Customer Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedOrder.user?.name || selectedOrder.address?.fullName || 'N/A'}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.user?.email || selectedOrder.address?.email || 'N/A'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.address?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p>{selectedOrder.address?.street || 'N/A'}</p>
                    <p>{selectedOrder.address?.city}, {selectedOrder.address?.state} {selectedOrder.address?.district}</p>
                    <p>Pakistan</p>
                    <p>Postal Code: {selectedOrder.address?.postalCode || 'N/A'}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4">Order Items ({selectedOrder.items?.length || 0})</h3>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center border-b pb-4">
                        <img
                          src={item.image || 'https://via.placeholder.com/100'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded mr-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.size && (
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                Color: {item.color}
                              </span>
                            )}
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Price: Rs. {item.price?.toFixed(2)} each
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">Rs. {((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                          {item.salePrice && item.salePrice < item.price && (
                            <p className="text-sm text-gray-500 line-through">
                              Rs. {(item.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2 max-w-md ml-auto">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rs. {selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Rs. {selectedOrder.shipping?.toFixed(2) || '0.00'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax (15% GST)</span>
                      <span>Rs. {selectedOrder.tax?.toFixed(2) || '0.00'}</span>
                    </div>
                    
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-Rs. {selectedOrder.discount?.toFixed(2) || '0.00'}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold pt-4 border-t">
                      <span>Total</span>
                      <span>Rs. {selectedOrder.total?.toFixed(2) || selectedOrder.totalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Add New Product</h2>
                  <button
                    onClick={() => {
                      setShowAddProduct(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleAddProduct} className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full border rounded px-3 py-2"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                      required
                      className="w-full border rounded px-3 py-2"
                      rows="3"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Enter product description"
                    />
                  </div>
                  
                  {/* Price & Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (Rs.) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="w-full border rounded px-3 py-2"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category *</label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Like">Like</option>
                        <option value="SKMS">SKMS</option>
                        <option value="Sport">Sport</option>
                        <option value="Sale">Sale</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Sale Options */}
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={newProduct.featured}
                        onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                      />
                      <span className="text-sm">Featured Product</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={newProduct.onSale}
                        onChange={(e) => setNewProduct({...newProduct, onSale: e.target.checked})}
                      />
                      <span className="text-sm">On Sale</span>
                    </label>
                  </div>
                  
                  {newProduct.onSale && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Sale Price (Rs.)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full border rounded px-3 py-2"
                        value={newProduct.salePrice}
                        onChange={(e) => setNewProduct({...newProduct, salePrice: e.target.value})}
                        placeholder="Sale price"
                      />
                    </div>
                  )}
                  
                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full border rounded px-3 py-2"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="10"
                    />
                  </div>
                  
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upload Images from Device
                    </label>
                    
                    {/* File Upload Button */}
                    <div className="mb-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-black transition"
                      >
                        <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload images (Max 10)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WebP up to 5MB each
                        </p>
                      </button>
                    </div>
                    
                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">
                          Selected Files ({selectedFiles.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                <FaTimes className="text-xs" />
                              </button>
                              <p className="text-xs truncate w-20 mt-1">
                                {file.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Image URLs Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Or Add Image URLs
                      </label>
                      {imageUrls.map((url, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            className="flex-1 border rounded px-3 py-2"
                            value={url}
                            onChange={(e) => {
                              const newUrls = [...imageUrls];
                              newUrls[index] = e.target.value;
                              setImageUrls(newUrls);
                              setNewProduct(prev => ({
                                ...prev,
                                images: [...selectedFiles.map(f => URL.createObjectURL(f)), ...newUrls.filter(u => u.trim() !== '')]
                              }));
                            }}
                            placeholder="https://example.com/image.jpg"
                          />
                          {index === imageUrls.length - 1 ? (
                            <button
                              type="button"
                              onClick={() => setImageUrls([...imageUrls, ''])}
                              className="px-3 py-2 bg-gray-100 rounded"
                            >
                              +
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const newUrls = imageUrls.filter((_, i) => i !== index);
                                setImageUrls(newUrls);
                                setNewProduct(prev => ({
                                  ...prev,
                                  images: [...selectedFiles.map(f => URL.createObjectURL(f)), ...newUrls.filter(u => u.trim() !== '')]
                                }));
                              }}
                              className="px-3 py-2 bg-red-100 text-red-600 rounded"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sizes & Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={Array.isArray(newProduct.sizes) ? newProduct.sizes.join(', ') : newProduct.sizes}
                        onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                        placeholder="M, L, XL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Colors (comma separated)</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={Array.isArray(newProduct.colors) ? newProduct.colors.join(', ') : newProduct.colors}
                        onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})}
                        placeholder="Black, White, Red"
                      />
                    </div>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddProduct(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || uploadLoading}
                      className="px-4 py-2 bg-black text-white rounded disabled:opacity-50 flex items-center"
                    >
                      {loading || uploadLoading ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          {uploadLoading ? 'Uploading Images...' : 'Adding Product...'}
                        </>
                      ) : (
                        'Add Product'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddProductWithImages}
                      disabled={loading || uploadLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      Add with Images (Single Request)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;