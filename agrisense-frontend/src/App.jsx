import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Components/Login/AuthContext";
import ProtectedRoute from "../ProtectedRoute";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/DashboardComponent/Dashboard";
import WeatherInsights from "./Components/Weather Component/WeatherInsights";
import AppLayout from "./Components/Layout/AppLayout";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/weather" element={<WeatherInsights />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
