import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
  // const token = useSelector((state) => state.app.accessToken);
  // const parts = token.split(".");
  // const { role_id } = JSON.parse(atob(parts[1]));
  const userType = useSelector(state => state.app.userType);

  return <div>{userType==='admin' ? <Outlet /> : <Navigate to="/" />}</div>;
};

export default AdminRoute;