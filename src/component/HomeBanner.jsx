// src/components/HomeBanner.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';
import video from '../assets/video.mp4'
const HomeBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef(null);
  const slideInterval = useRef(null);

  // Banner content - 1 video and 3 images
  const slides = [
    {
      type: 'video',
      src: video,
      title: 'NEW COLLECTION 2024',
      subtitle: 'Discover the Latest Trends',
      buttonText: 'Shop Now',
      color: 'from-blue-600/70 to-purple-600/70'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'RUNNING SHOES',
      subtitle: 'Up to 40% Off',
      buttonText: 'Explore',
      color: 'from-green-600/70 to-blue-600/70'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'ATHLEISURE WEAR',
      subtitle: 'Comfort Meets Style',
      buttonText: 'Discover',
      color: 'from-orange-600/70 to-red-600/70'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'LIMITED EDITION',
      subtitle: 'Exclusive Designs',
      buttonText: 'View Collection',
      color: 'from-purple-600/70 to-pink-600/70'
    }
  ];

  // Auto slide every 7 seconds
  useEffect(() => {
    if (isPlaying) {
      slideInterval.current = setInterval(() => {
        nextSlide();
      }, 7000);
    }
    
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isPlaying, currentSlide]);

  // Handle video play/pause
  useEffect(() => {
    if (slides[currentSlide].type === 'video' && videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentSlide, isVideoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleVideoPlay = () => {
    if (slides[currentSlide].type === 'video') {
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Video Slide */}
          {slide.type === 'video' ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src={slide.src}
                muted
                loop
                autoPlay
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              
              {/* Video Controls */}
              <button
                onClick={toggleVideoPlay}
                className="absolute bottom-6 right-6 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
              >
                {isVideoPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
            </div>
          ) : (
            /* Image Slide */
            <div className="relative w-full h-full">
              <img
                src={slide.src}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent`} />
            </div>
          )}
          
          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-fadeInUp">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fadeInUp animation-delay-200">
                  {slide.subtitle}
                </p>
                <button className="bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 animate-fadeInUp animation-delay-400">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-10' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Control */}
      <button
        onClick={toggleAutoPlay}
        className="absolute bottom-8 right-4 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
      >
        {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/30">
        <div 
          className="h-full bg-white transition-all duration-700 ease-linear"
          style={{ 
            width: isPlaying ? '100%' : '0%',
            animation: isPlaying ? 'progress 7s linear infinite' : 'none'
          }}
        />
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
};

export default HomeBanner;