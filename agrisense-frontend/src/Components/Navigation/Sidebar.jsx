import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaSeedling,
  FaChartLine,
  FaCloudSun,
  FaRobot,
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
  return (
     <div
      className="bg-dark text-white vh-100 p-3 position-fixed"
      style={{ width: "260px" }}
    >
      <div className="mb-4 text-center">
        <h3 className="fw-bold text-success">
          AgriSense
        </h3>

        <small className="text-light">
          Smart Farming AI
        </small>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link text-white sidebar-link${isActive ? ' active' : ''}`}
          >
            <FaHome className="me-2" />
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/crop-advisor"
            className={({ isActive }) => `nav-link text-white sidebar-link${isActive ? ' active' : ''}`}
          >
            <FaSeedling className="me-2" />
            Crop Advisor
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/yield-prediction"
            className={({ isActive }) => `nav-link text-white sidebar-link${isActive ? ' active' : ''}`}
          >
            <FaChartLine className="me-2" />
            Yield Prediction
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/weather"
            className={({ isActive }) => `nav-link text-white sidebar-link${isActive ? ' active' : ''}`}
          >
            <FaCloudSun className="me-2" />
            Weather Insights
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/ai-assistant"
            className={({ isActive }) => `nav-link text-white sidebar-link${isActive ? ' active' : ''}`}
          >
            <FaRobot className="me-2" />
            AI Assistant
          </NavLink>
        </li>

        <li className="nav-item mt-4">
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link text-white sidebar-link${isActive ? ' active' : ''}`}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </NavLink>
        </li>

      </ul>
    </div>
  )
}

export default Sidebar