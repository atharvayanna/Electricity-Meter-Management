import { useEffect} from "react";
import NavBar from "../NavBar/NavBar";
import SideBarNavigator from "../NavBar/SideBarNavigator/SideBarNavigator";
import Home from "./Home";
import "./User.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import url from "../../Url";
import { setUser } from "../../redux/appSlice";

const User = () => {
  const {state} = useLocation();
  const token = useSelector(state=>state.accessToken);
  const dispatch = useDispatch()
  useEffect(()=>{
    if(state){
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

    const parts = token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    const userId = payload.user_id;

    async function fetchProfile() {
      try{
      const res = await axios.get(`${url}/profile/user/${userId}`,{
        headers:{
          Authorization:`${token}`,
          "ngrok-skip-browser-warning": "69420"
        }
      })
      // console.log(res.data.userDetails)

      dispatch(setUser({userDetails:res.data.userDetails}))
      

    } catch(error){
      console.log(error)
    }}
    fetchProfile();

  },[])

  return (
    <>
      <ToastContainer/>
      <NavBar />

      <div className="user">
        <SideBarNavigator />
        <Home />
      </div>
    </>
  );
};

export default User;
