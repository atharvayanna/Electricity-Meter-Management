import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
  const token = useSelector((state) => state.app.accessToken);
  const parts = token.split(".");
  const { role_id } = JSON.parse(atob(parts[1]));

  return <div>{(role_id===1 || role_id===2) ? <Outlet /> : <Navigate to="/" />}</div>;
};

export default AdminRoute;
