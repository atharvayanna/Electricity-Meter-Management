import { Route,Routes } from "react-router-dom"
import UserRoute from "./components/ProtectedRoute/UserRoute"
import User from "./components/User/User"
import Dashboard from "./components/User/Dashboard/Dashboard"
import LogIn from "./components/LogIn/LogIn"
import MeterData from "./components/User/MeterData/MeterData"
import AdminRoute from "./components/ProtectedRoute/AdminRoute"
import Admin from "./components/Admin/Admin"
import AllUsers from "./components/Admin/AllUsers/AllUsers"
import MeterDataUsers from "./components/Admin/MeterDataUsers/MeterDataUsers"
import BulkUpload from "./components/Admin/BulkUpload/BulkUpload"

const Router = () => {
  return (
    <Routes>
        <Route path='/'element={<LogIn/>} />
        <Route element={<UserRoute/>}>
          <Route path='/user' element={<User />}/>
          <Route path='/user/dashboard' element={<Dashboard />}/>
          <Route path='/user/meter-data' element={<MeterData />}/>
        </Route>
        <Route element={<AdminRoute/>}>
          <Route path="/admin" element={<Admin/>}/>
          <Route path='/admin/users' element={<AllUsers/>}/>
          <Route path='/admin/meter-data' element={<MeterDataUsers/>}/>
          <Route path="/admin/bulk-upload" element={<BulkUpload/>}/>
        </Route>
        

      </Routes>
  )
}

export default Router