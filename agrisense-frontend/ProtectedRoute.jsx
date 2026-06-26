import { Navigate } from "react-router-dom";
import { useAuth } from "./src/Components/Login/AuthContext";
    
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "DM Sans, sans-serif",
        color: "#639922",
        fontSize: "14px",
        gap: "10px"
      }}>
        <div style={{
          width: "20px", height: "20px",
          border: "2px solid #e5e7eb",
          borderTopColor: "#639922",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite"
        }} />
        Loading AgriSense...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
