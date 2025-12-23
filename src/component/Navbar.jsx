import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaUserCircle,
  FaShoppingBag,
  FaChevronDown,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaTimes,
  FaBars,
  FaSignOutAlt,
  FaBox,
  FaHome,
  FaShoppingCart,
  FaTshirt,
} from "react-icons/fa";

import Logo from "../assets/vcart logo.png";
import { useCart } from "../context/cartcontext";
import { userdatacontext } from "../context/Usercontext";

const NikeStyleNavbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { userdata, logout, isAuthenticated } = useContext(userdatacontext);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Men");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const categories = [
    { name: "Men", path: "/category/men" },
    { name: "Women", path: "/category/women" },
    { name: "Kids", path: "/category/kids" },
    { name: "Jordan", path: "/category/jordan" },
    { name: "Like", path: "/category/like" },
    { name: "Sport", path: "/category/sport" },
    { name: "Sale", path: "/sale" },
  ];

  const getUserName = () => {
    if (!userdata) return "User";
    if (userdata.name) return userdata.name.split(" ")[0];
    if (userdata.email) return userdata.email.split("@")[0];
    return "User";
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.name);
    navigate(cat.path);
    setIsMenuOpen(false);
  };

  const handleMobileNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      {/* TOP BAR */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            {/* LEFT SIDE - Desktop only */}
            <div className="hidden md:flex items-center space-x-6">
              <button className="flex items-center hover:text-gray-300">
                <FaMapMarkerAlt className="mr-1 text-xs" />
                Find Store
              </button>
              <Link to="/help" className="flex items-center hover:text-gray-300">
                <FaQuestionCircle className="mr-1 text-xs" />
                Help
              </Link>
            </div>

            {/* RIGHT SIDE - Auth + Cart */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* User Section - Desktop */}
              {isAuthenticated ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center hover:text-gray-300"
                  >
                    <FaUserCircle className="mr-2" />
                    <span className="hidden sm:inline">
                      Hi, {getUserName()}
                    </span>
                    <FaChevronDown className="ml-1 text-xs" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-xl border z-50">
                      <div className="p-4 border-b">
                        <p className="font-semibold truncate">
                          {userdata?.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {userdata?.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 rounded"
                        >
                          <FaUser className="mr-3" /> Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 rounded"
                        >
                          <FaBox className="mr-3" /> Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 mt-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <FaSignOutAlt className="mr-3" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center hover:text-gray-300"
                >
                  <FaUser className="mr-1" /> Sign in
                </Link>
              )}

              {/* Cart - Always visible */}
              <Link to="/cart" className="relative hover:text-gray-300">
                <FaShoppingBag />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User Icon - Mobile only */}
              <button
                className="md:hidden"
                onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
              >
                <FaUserCircle />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} className="w-10" alt="logo" />
            <span className="text-2xl font-bold">LIKE</span>
          </Link>

          {/* Categories - Desktop */}
          <div className="hidden lg:flex space-x-8">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat)}
                className={`uppercase text-sm font-medium ${
                  activeCategory === cat.name
                    ? "text-black border-b-2 border-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md ml-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full"
                placeholder="Search"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU - Only appears when hamburger is clicked */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          {/* Mobile Search */}
          <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full"
                placeholder="Search products..."
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </form>
          </div>

          {/* Mobile Categories */}
          <div className="p-4 border-b">
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex items-center justify-between w-full p-3 rounded ${
                    activeCategory === cat.name
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="font-medium">{cat.name}</span>
                  <FaChevronDown className="text-xs transform rotate-270" />
                </button>
              ))}
            </div>
          </div>

          {/* Mobile User Section */}
          <div className="p-4 border-b">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                  <FaUserCircle className="text-2xl mr-3" />
                  <div className="flex-1">
                    <p className="font-semibold truncate">{userdata?.name}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {userdata?.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleMobileNavClick("/profile")}
                    className="flex items-center justify-center p-3 border rounded hover:bg-gray-50"
                  >
                    <FaUser className="mr-2" /> Profile
                  </button>
                  <button
                    onClick={() => handleMobileNavClick("/orders")}
                    className="flex items-center justify-center p-3 border rounded hover:bg-gray-50"
                  >
                    <FaBox className="mr-2" /> Orders
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full p-3 text-red-600 border border-red-600 rounded hover:bg-red-50"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleMobileNavClick("/login")}
                  className="w-full p-3 bg-black text-white rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleMobileNavClick("/register")}
                  className="w-full p-3 border border-black rounded-lg"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile Quick Links */}
          <div className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => handleMobileNavClick("/")}
                className="flex items-center w-full p-3 hover:bg-gray-100 rounded"
              >
                <FaHome className="mr-3" /> Home
              </button>
              <button
                onClick={() => handleMobileNavClick("/cart")}
                className="flex items-center w-full p-3 hover:bg-gray-100 rounded"
              >
                <FaShoppingCart className="mr-3" /> Cart
                {cartCount > 0 && (
                  <span className="ml-auto bg-black text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleMobileNavClick("/help")}
                className="flex items-center w-full p-3 hover:bg-gray-100 rounded"
              >
                <FaQuestionCircle className="mr-3" /> Help
              </button>
              <button
                onClick={() => handleMobileNavClick("/stores")}
                className="flex items-center w-full p-3 hover:bg-gray-100 rounded"
              >
                <FaMapMarkerAlt className="mr-3" /> Find Store
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NikeStyleNavbar;