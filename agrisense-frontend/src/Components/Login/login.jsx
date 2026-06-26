// src/Login.jsx  (or src/pages/Login.jsx — wherever yours lives)
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "./firebase"; // adjust path if in pages/
import "./Login.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = ref(db, `users/${user.uid}`);
const userSnap = await get(userRef);

if (!userSnap.exists()) {
  await set(userRef, {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    provider: "google",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  });
} else {
  await set(userRef, {
    ...userSnap.val(),
    lastLoginAt: new Date().toISOString(),
  });
}

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Login popup was closed. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Please allow popups for this site.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ NO useEffect, NO getRedirectResult — popup handles everything above

  return (
    <div className="login-page">
      {/* Left panel — branding */}
      <div className="login-left">
        <div className="login-left-inner">
          <div className="brand">
            <div className="brand-logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 3C16 3 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 3 16 3Z" fill="#639922" />
                <path d="M16 10C16 10 12 15 12 19C12 21.2 13.8 23 16 23C18.2 23 20 21.2 20 19C20 15 16 10 16 10Z" fill="#97C459" />
                <path d="M16 26V30" stroke="#639922" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="brand-name">AgriSense</span>
          </div>

          <div className="left-headline">
            <h1>AI-Powered Intelligence<br />for <span className="accent">Smarter Farming</span></h1>
            <p>Combines machine learning, weather forecasting, and real-time analytics to help farmers make better decisions.</p>
          </div>

          <div className="feature-list">
            <FeatureItem icon="🌾" title="Crop Recommendation" desc="AI suggests best crops for your soil" />
            <FeatureItem icon="📈" title="Yield Prediction" desc="Predict your crop yield with ML models" />
            <FeatureItem icon="🌤" title="Weather Forecasting" desc="7-day weather insights for your farm" />
            <FeatureItem icon="🤖" title="Smart Advisory" desc="Personalized advice for better farming" />
          </div>

          <div className="social-proof">
            <div className="avatars">
              {["RK", "PM", "AS", "JD"].map((initials, i) => (
                <div key={i} className="avatar" style={{ zIndex: 4 - i }}>{initials}</div>
              ))}
            </div>
            <div>
              <p className="proof-title">Trusted by Farmers</p>
              <p className="proof-sub">Join 10,000+ farmers using AgriSense</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="login-right">
        <div className="login-card">
          <div className="card-header">
            <h2>Welcome back!</h2>
            <p>Please login to your account.</p>
          </div>

          <button
            className={`google-btn ${loading ? "loading" : ""}`}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : <GoogleIcon />}
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          {error && <p className="error-msg">{error}</p>}

          <div className="divider"><span>Secure & Private</span></div>

          <div className="trust-badges">
            <span>🔒 Your data is protected</span>
            <span>⚡ Fast & Reliable</span>
          </div>

          <p className="terms">
            By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="feature-item">
      <div className="feature-icon">{icon}</div>
      <div>
        <p className="feature-title">{title}</p>
        <p className="feature-desc">{desc}</p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36.5 24 36.5c-5.3 0-9.7-3.5-11.2-8.2l-6.5 5C9.5 39.9 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6L36.8 39C41.2 35.1 44 29.9 44 24c0-1.3-.1-2.7-.4-4z" />
    </svg>
  );
}
