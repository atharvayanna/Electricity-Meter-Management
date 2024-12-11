import SideBarNavigator from "../NavBar/SideBarNavigator/SideBarNavigator";
import NavBar from "../NavBar/NavBar";
import "./Admin.css";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import url from "../../Url";
import { setUser } from "../../redux/appSlice";
import AdminDashboard from "./Dashboard/AdminDashboard";

const Admin = () => {
  const token = useSelector((state) => state.accessToken);
  const dispatch = useDispatch();
  const { state } = useLocation();

  useEffect(() => {
    const parts = token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    const userId = payload.user_id;

    async function fetchProfile() {
      try {
        const res = await axios.get(`${url}/profile/user/${userId}`, {
          headers: {
            Authorization: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });
        // console.log(res.data.userDetails)

        dispatch(setUser({ userDetails: res.data.userDetails }));
      } catch (error) {
        console.log(error);
      }
    }

    if (state) {
      fetchProfile();
      toast.success(state.Msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
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
