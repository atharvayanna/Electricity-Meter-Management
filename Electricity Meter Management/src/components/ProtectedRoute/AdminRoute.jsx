
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
  const userType = useSelector(state=>state.userType);
  return (
  <div>
    {userType==='admin' ? <Outlet /> : <Navigate to="/" />}
  </div>);
};

export default AdminRoute;
