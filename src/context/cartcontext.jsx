// context/cartcontext.jsx - UPDATED API ENDPOINTS
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { userdatacontext } from './Usercontext';
import { AuthDataContext } from './authContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const { userdata  } = useContext(userdatacontext); // Added default
  const isAuthenticated = !!userdata;
    let { serverUrl } = useContext(AuthDataContext)

  // Load cart from backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load from localStorage for guests
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        updateCartTotals(parsedCart);
      }
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/cart`, {
        withCredentials: true
      });
      setCart(response.data.cart || []);
      setCartCount(response.data.cartCount || 0);
      setCartTotal(response.data.cartTotal || 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
      // If 401, user not logged in
      if (error.response?.status === 401) {
        console.log("User not authenticated for cart");
      }
    }
  };

  const updateCartTotals = (cartItems) => {
    const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const total = cartItems.reduce((sum, item) => 
      sum + ((item.price || 0) * (item.quantity || 1)), 0
    );
    setCartCount(count);
    setCartTotal(total);
  };

  const addToCart = async (product, quantity = 1, size = '', color = '') => {
    setLoading(true);
    
    try {
      if (isAuthenticated) {
        // Add to backend
        const response = await axios.post(
          `${serverUrl}/api/cart/add`,
          {
            productId: product._id,
            quantity: parseInt(quantity),
            size,
            color
          },
          { withCredentials: true }
        );
        
        setCart(response.data.cart);
        setCartCount(response.data.cartCount);
        setCartTotal(response.data.cartTotal);
      } else {
        // Add to localStorage for guests
        const existingItemIndex = cart.findIndex(item => 
          item.productId === product._id && 
          item.size === size && 
          item.color === color
        );

        let newCart;
        if (existingItemIndex >= 0) {
          newCart = [...cart];
          newCart[existingItemIndex].quantity += quantity;
        } else {
          newCart = [...cart, {
            _id: Date.now().toString(), // Temporary ID
            productId: product._id,
            name: product.name,
            price: product.salePrice || product.price,
            quantity,
            size,
            color,
            image: product.images?.[0] || ''
          }];
        }

        setCart(newCart);
        updateCartTotals(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
      
      return { success: true, message: "Added to cart" };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to add to cart" 
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        await axios.delete(`${serverUrl}/api/cart/${itemId}`, { // Changed endpoint
          withCredentials: true
        });
        await fetchCart(); // Refresh cart
      } else {
        const newCart = cart.filter(item => item._id !== itemId);
        setCart(newCart);
        updateCartTotals(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
      
      return { success: true, message: "Item removed from cart" };
    } catch (error) {
      console.error("Error removing from cart:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to remove item" 
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      if (isAuthenticated) {
        await axios.put(`${serverUrl}/api/cart/${itemId}`, { // Changed endpoint
          quantity: parseInt(quantity)
        }, {
          withCredentials: true
        });
        await fetchCart();
      } else {
        const newCart = cart.map(item => 
          item._id === itemId ? { ...item, quantity: parseInt(quantity) } : item
        );
        setCart(newCart);
        updateCartTotals(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
      
      return { success: true, message: "Cart updated" };
    } catch (error) {
      console.error("Error updating cart:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to update cart" 
      };
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await axios.delete(`${serverUrl}/api/cart/clear`, {
          withCredentials: true
        });
      }
      
      setCart([]);
      setCartCount(0);
      setCartTotal(0);
      localStorage.removeItem('guestCart');
      
      return { success: true, message: "Cart cleared" };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to clear cart" 
      };
    }
  };

  const value = {
    cart,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};