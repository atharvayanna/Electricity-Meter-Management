import { Route,Routes } from "react-router-dom"
import ProtectedRoute from "./components/User/ProtectedRoute/ProtectedRoute"
import User from "./components/User/User"
import UserDashboard from "./components/User/Dashboard/UserDashboard"
import LogIn from "./components/LogIn/LogIn"

const Router = () => {
  return (
    <Routes>
        <Route path='/'element={<LogIn/>} />
          <Route element={<ProtectedRoute/>}>
            <Route path='/user' element={<User/>}/>
            <Route path='/user/dashboard' element={<UserDashboard />}/>
          </Route>
      </Routes>
  )
}

export default Router