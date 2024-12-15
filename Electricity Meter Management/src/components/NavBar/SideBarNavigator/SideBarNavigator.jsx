import "./SideBarNavigator.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import meter from "../../../assets/meter-22.svg";

const SideBarNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state)=> state.app.userType)

  const navigateHome = () => {
    navigate("/user");
  };
  const navigateDashboard = () => {
    navigate("/user/dashboard");
  };

  const navigateMeterData = () => {
    navigate("/user/meter-data");
  };

  const navigateAdmin = () => {
    navigate("/admin");
  };

  const navigateAdminUsers = () => {
    navigate("/admin/users");
  };

  const navigateAdminMeterReadings = () => {
    navigate("/admin/meter-data");
  };

  const navigateBulkUpload = () => {
    navigate("/admin/bulk-upload");
  };

  return (
    <div className="navigator">
      <div className="navigator__options">
        {user === "user" && (
          <div
            className={
              location.pathname === "/user" ? "dashboard active" : "dashboard"
            }
            onClick={navigateHome}
          >
            <i className="fa-solid fa-house"></i>
            <p>Home</p>
          </div>
        )}
        {user === "user" && (
          <div
            className={
              location.pathname === "/user/dashboard"
                ? "dashboard active"
                : "dashboard"
            }
            onClick={navigateDashboard}
          >
            <i className="fa-solid fa-chart-simple"></i>
            <p>Dashboard</p>
          </div>
        )}
        {user === "user" && (
          <div
            className={
              location.pathname === "/user/meter-data"
                ? "dashboard active"
                : "dashboard"
            }
            onClick={navigateMeterData}
          >
            <i className="fa-solid fa-table"></i>
            <p>Bill Records</p>
          </div>
        )}
        {user === "admin" && (
          <div
            className={
              location.pathname === "/admin" ? "dashboard active" : "dashboard"
            }
            onClick={navigateAdmin}
          >
            <i className="fa-solid fa-chart-simple"></i>
            <p>Dashboard</p>
          </div>
        )}
        {user === "admin" && (
          <div
            className={
              location.pathname === "/admin/users"
                ? "dashboard active"
                : "dashboard"
            }
            onClick={navigateAdminUsers}
          >
            <i className="fa-solid fa-users"></i>
            <p>All Users</p>
          </div>
        )}
        {user === "admin" && (
          <div
            className={
              location.pathname === "/admin/meter-data"
                ? "dashboard active"
                : "dashboard"
            }
            onClick={navigateAdminMeterReadings}
          >
            <img src={meter} alt="" className="meter__svg" />
            <p>Meter Readings</p>
          </div>
        )}
        {user === "admin" && (
          <div
            className={
              location.pathname === "/admin/bulk-upload"
                ? "dashboard active"
                : "dashboard"
            }
            onClick={navigateBulkUpload}
          >
            <i className="fa-solid fa-database"></i>
            <p>Upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBarNavigator;