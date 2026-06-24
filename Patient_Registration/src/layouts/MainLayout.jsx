import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <main className="page-content">
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
