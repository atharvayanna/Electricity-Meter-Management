import { useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import SideBarNavigator from "../NavBar/SideBarNavigator/SideBarNavigator";
import Home from "./Home";
import "./User.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/appSlice";
import { showToast } from "../../utils/toast";
import { fetchUserProfile } from "../../redux/slices/user/userSlice";

const User = () => {
  const { state } = useLocation();
  const token = useSelector((state) => state.app.accessToken);
  const dispatch = useDispatch();
  const hasShownToast = JSON.parse(localStorage.getItem("loginToastShown"));

  async function fetchProfile(userId) {
    const action = await dispatch(fetchUserProfile(userId));
    if (fetchUserProfile.fulfilled.match(action)) {
      dispatch(setUser({ userDetails: action.payload.userDetails }));
    } else if (fetchUserProfile.rejected.match(action)) {
      console.log(action);
    }
  }

  useEffect(() => {
    if (state && !hasShownToast) {
      showToast("Login Successful", "success");
      localStorage.setItem("loginToastShown", true);
      const parts = token.split(".");
      const payload = JSON.parse(atob(parts[1]));
      const userId = payload.user_id;
      fetchProfile(userId);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <NavBar />

      <div className="user">
        <SideBarNavigator />
        <Home />
      </div>
    </>
  );
};

export default User;
