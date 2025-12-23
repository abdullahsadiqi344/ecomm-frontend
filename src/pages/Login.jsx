import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import axios from "axios";
import { userdatacontext } from "../context/Usercontext.jsx";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase.js";
import google from "../assets/google.png";
import { AuthDataContext } from "../context/authContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  
  const context = useContext(userdatacontext);
  const getcurrentuser = context?.getcurrentuser || (() => {
    console.warn("getcurrentuser not available in context");
    return Promise.resolve();
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popupType, setPopupType] = useState("error");

  // ✅ CORRECT PORT: Should be 6000, not 60001
    let { serverUrl } = useContext(AuthDataContext)

  const showNotification = (message, type = "error") => {
    setErrorMessage(message);
    setPopupType(type);
    setShowPopup(true);
  };

  // Normal Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      console.log("Calling login endpoint:", `${serverUrl}/api/auth/login`);
      
      const response = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      
      console.log("Login response:", response.data);
      
      if (getcurrentuser) {
        await getcurrentuser();
      }
      
      showNotification("Login successful!", "success");
      setTimeout(() => navigate("/"), 1000);
      
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);
      
      let message = "Login failed. Please try again.";
      if (err.response?.status === 400) {
        message = err.response?.data?.message || "Invalid email or password";
      } else if (err.response?.status === 404) {
        message = "User not found. Please sign up first.";
      }
      
      showNotification(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED: Google Login Function
  const handleGoogleLogin = async () => {
    if (!auth || !provider) {
      showNotification("Firebase not configured", "error");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        showNotification("Google account data missing", "error");
        return;
      }

      console.log("Google user:", {
        name: user.displayName,
        email: user.email,
        uid: user.uid
      });

      // ✅ FIXED: Use correct endpoint - SINGLE CALL to google/login
      // The endpoint should handle both signup and login
      const response = await axios.post(
        `${serverUrl}/api/auth/google/login`, // ✅ Correct endpoint
        {
          name: user.displayName,
          email: user.email,
          uid: user.uid
        },
        { withCredentials: true }
      );

      console.log("Google login response:", response.data);

      // Update user context
      if (getcurrentuser) {
        await getcurrentuser();
      }

      showNotification("Google login successful!", "success");
      setTimeout(() => navigate("/", { replace: true }), 1000);
      
    } catch (error) {
      console.error("Google login error:", error);
      
      if (error.code === "auth/popup-closed-by-user") {
        showNotification("Google signup popup closed", "error");
      } else if (error.response?.status === 404) {
        showNotification("Endpoint not found. Check backend routes.", "error");
      } else if (error.response?.data?.message) {
        showNotification(error.response.data.message, "error");
      } else {
        showNotification("Google login failed. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Popup auto-hide
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start relative">
      {showPopup && (
        <div className={`absolute top-5 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeInOut z-50 ${
          popupType === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {errorMessage}
        </div>
      )}

      <div className="w-full h-[100px] flex items-center justify-center flex-col gap-[10px] mt-8">
        <span className="text-[25px] font-semibold">Login Page</span>
        <span className="text-[16px] text-gray-300">Welcome! Please login to continue</span>
      </div>

      <div className="max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border-[1px] border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center">
        <div className="w-[90%] h-[90%] flex flex-col items-center justify-start gap-5">
          {/* Google Login Button */}
          <button
            type="button"
            disabled={isLoading}
            className="w-[90%] h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-3 hover:bg-[#42656c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGoogleLogin}
          >
            <img className="w-6 h-6" src={google} alt="google" />
            <span>{isLoading ? "Processing..." : "Login with Google"}</span>
          </button>

          {/* Divider */}
          <div className="w-full flex items-center justify-center gap-3">
            <div className="flex-grow h-px bg-[#96969635]"></div>
            <span className="text-gray-400">OR</span>
            <div className="flex-grow h-px bg-[#96969635]"></div>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="w-full flex flex-col items-center justify-center gap-4"
          >
            <input
              type="email"
              className="w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent placeholder-gray-400 px-4 font-medium focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Email Address"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={isLoading}
            />
            
            <div className="w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent placeholder-gray-400 px-4 font-medium focus:outline-none focus:border-blue-500 transition-colors pr-12"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <IoEye size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-[50px] rounded-lg flex items-center justify-center text-[17px] font-semibold transition-colors mt-2 ${
                isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-[#6060f5] hover:bg-[#5050f5]"
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-gray-300 mt-2">
            Don't have an account?{" "}
            <span
              className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 hover:underline transition-colors"
              onClick={() => !isLoading && navigate("/signup")}
            >
              Sign up here
            </span>
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
          .animate-fadeInOut {
            animation: fadeInOut 5s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Login;