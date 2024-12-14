import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
  const userType = useSelector((state) => state.app.userType); // Access userType from Redux state
  const isLoading = useSelector((state) => state.login.isLoading); // Access isLoading from loginSlice
  // const token  =  

  // If the login process is still ongoing, show a loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If userType is not 'admin', redirect to the home page
  if (userType !== 'admin') {
    return <Navigate to="/" />;
  }

  // If userType is 'admin', allow access to protected route
  return <Outlet />;
};

export default AdminRoute;
