import SideBarNavigator from "../NavBar/SideBarNavigator/SideBarNavigator";
import NavBar from "../NavBar/NavBar";
import "./Admin.css";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./Dashboard/AdminDashboard";
import { showToast } from "../../utils/toast";

const Admin = () => {
  const { state } = useLocation();
  const hasShownToast = JSON.parse(localStorage.getItem("loginToastShown"));

  useEffect(() => {
    if (state && !hasShownToast) {
      showToast(state.Msg, "success");
      localStorage.setItem("loginToastShown", true);
    }
  }, []);

  return (
    <>
      <NavBar />
      <ToastContainer />
      <div className="admin">
        <SideBarNavigator />
        <div className="admin__dashboard">
          <AdminDashboard />
        </div>
      </div>
    </>
  );
};

export default Admin;
