// ...imports stay the same
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/vcart logo.png";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { AuthDataContext } from "../context/authContext";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import google from "../assets/google.png";

const Registration = () => {
  const navigate = useNavigate();
  const { serverUrl } = useContext(AuthDataContext);

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  const [showPopup, setShowPopup] = useState(false);

  const showNotification = (message, type = "error") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
  };

  // ========== FIX 1: Normal email signup ==========
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      showNotification("Password must be at least 8 characters");
      return;
    }

    // Debug: Show what endpoint we're calling
    console.log("Calling endpoint:", `${serverUrl}/api/auth/signup`);

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`, // CHANGED FROM: /api/auth/registeration
        { name, email, password },
        { withCredentials: true }
      );

      console.log("Signup successful:", response.data);
      showNotification("Registration successful!", "success");
      navigate("/login", { replace: true });
    } catch (err) {
      console.log("Signup error details:", err);
      console.log("Error response:", err.response?.data);
      const message =
        err.response?.data?.message || "Registration failed. Try again!";
      showNotification(message, "error");
    }
  };

  // ========== FIX 2: Google signup ==========
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email || !user.displayName) {
        showNotification("Google account data missing", "error");
        return;
      }

      // Debug: Show endpoints
      console.log("Calling Google signup endpoint:", `${serverUrl}/api/auth/google/signup`);

      // Step 1: Create user in backend
      await axios.post(
        `${serverUrl}/api/auth/google/signup`, // CHANGED FROM: /api/auth/GOOGLE_REGISTERATION
        {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        },
        { withCredentials: true }
      );

      // Step 2: Login the user
      console.log("Calling Google login endpoint:", `${serverUrl}/api/auth/google/login`);
      
      const loginResult = await axios.post(
        `${serverUrl}/api/auth/google/login`, // CHANGED FROM: /api/auth/googlelogin
        { 
          name: user.displayName,  // CHANGED: Using actual user data
          email: user.email 
        },
        { withCredentials: true }
      );
      
      console.log("Google login result:", loginResult.data);

      showNotification("Google signup successful!", "success");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Google signup error details:", error);
      
      // Detailed error logging
      if (error.response) {
        console.error("Backend error response:", error.response.data);
        console.error("Backend error status:", error.response.status);
      }
      
      if (error.code === "auth/popup-closed-by-user") {
        showNotification("Google signup popup closed", "error");
      } else if (error.response?.data?.message) {
        showNotification(error.response.data.message, "error");
      } else {
        showNotification("Google signup failed", "error");
      }
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start relative">
      {showPopup && (
        <div
          className={`absolute top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeInOut ${
            popupType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {popupMessage}
        </div>
      )}

      {/* Title */}
      <div className="h-[100px] flex flex-col items-center justify-center gap-2 mt-8">
        <span className="text-2xl font-semibold">Registration Page</span>
        <span className="text-sm text-gray-300">
          Welcome! Create your account
        </span>
      </div>

      {/* Form */}
      <div className="max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center">
        <form
          onSubmit={handleSignup} // CHANGED FROM: handleSignnup
          className="w-[90%] h-[90%] flex flex-col gap-5"
        >
          {/* Google Signup Button */}
          <div
            className="h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-[#42656c] transition-colors"
            onClick={handleGoogleSignup} // CHANGED FROM: Googlesignup
          >
            <img className="w-6 h-6" src={google} alt="google" />
            <span>Sign up with Google</span>
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow h-px bg-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-600"></div>
          </div>

          {/* Name Input */}
          <input
            type="text"
            placeholder="Full Name"
            className="h-[50px] px-5 rounded-lg bg-transparent border border-[#96969635] focus:border-blue-500 focus:outline-none transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email Address"
            className="h-[50px] px-5 rounded-lg bg-transparent border border-[#96969635] focus:border-blue-500 focus:outline-none transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min. 8 characters)"
              className="h-[50px] w-full px-5 rounded-lg bg-transparent border border-[#96969635] focus:border-blue-500 focus:outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEye size={20} /> : <IoEyeOutline size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="h-[50px] bg-[#6060f5] rounded-lg font-semibold hover:bg-[#4a4af0] transition-colors"
          >
            Create Account
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-300">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:text-blue-300 hover:underline"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </form>
      </div>

      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; }
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

export default Registration;