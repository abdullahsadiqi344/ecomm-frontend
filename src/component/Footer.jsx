import React from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaGithub,
  FaHeart,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaWhatsapp
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaShoppingBag className="text-3xl text-blue-400" />
              <h2 className="text-2xl font-bold">Like</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premier destination for fashion and Like. We bring you the latest trends 
              with quality and affordability in mind.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="hover:text-pink-400 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                <FaGithub className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-blue-500 pl-3">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Shop
                </a>
              </li>
              <li>
                <a href="/categories" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Categories
                </a>
              </li>
              <li>
                <a href="/sale" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Sale
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-green-500 pl-3">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="/returns" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-purple-500 pl-3">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-purple-400 mt-1" />
                <p className="text-gray-400 text-sm">
                  123 Fashion Street, Like District<br />
                  Karachi, Pakistan
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-purple-400" />
                <a href="tel:+923067176212" className="text-gray-400 hover:text-white transition-colors">
                  +923067176212
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-purple-400" />
                <a href="mailto:abdullahsadiqi698@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  info@Like.com
                </a>
              </div>
              {/* WhatsApp Contact */}
              <div className="flex items-center space-x-3">
                <FaWhatsapp className="text-green-400" />
                <a 
                  href="https://wa.me/923067176212?text=Hello%20LIKE,%20I%20have%20a%20question%20about..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span>+923067176212</span>
                  <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded group-hover:bg-green-700 transition-colors">
                    WhatsApp
                  </span>
                </a>
              </div>
            </div>
            
            {/* Newsletter Subscription */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Subscribe to Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Like. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-gray-400 text-sm">
              Accepted Payments:
              <div className="flex space-x-2 mt-2">
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs">
                  Visa
                </div>
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs">
                  MC
                </div>
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs">
                  PayPal
                </div>
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs">
                  COD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-gray-400">Developed with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span className="text-gray-400">by</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30"></div>
                <div className="relative px-6 py-3 bg-gray-800 rounded-lg">
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Abdullah Sadiqi
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaGithub />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <FaLinkedin />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <FaTwitter />
                </a>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">
              Full Stack Developer | React Specialist | E-commerce Expert
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923067176212?text=Hello%20SLike,%20I%20need%20help%20with..."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50 group"
        aria-label="Chat on WhatsApp"
      >
        <div className="relative">
          <FaWhatsapp className="text-2xl" />
          <div className="absolute -right-2 -top-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping">
            <span className="text-xs">!</span>
          </div>
        </div>
        <div className="absolute left-14 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Chat with us on WhatsApp
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
            <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      </a>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 z-50"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;