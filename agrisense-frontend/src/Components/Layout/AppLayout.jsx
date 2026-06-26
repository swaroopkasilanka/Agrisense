import { Outlet } from "react-router-dom";
import Sidebar from "../Navigation/Sidebar";
import Navigation from "../Navigation/Navigation";

function AppLayout() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="container-fluid" style={{ marginLeft: 260 }}>
        <Navigation />
        <div className="px-4 py-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
