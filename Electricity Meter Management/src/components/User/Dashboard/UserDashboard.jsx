import NavBar from "../../NavBar/NavBar"
import SideBarNavigator from "../../NavBar/SideBarNavigator/SideBarNavigator"

const UserDashboard = () => {
  return (
    <>
        <NavBar/>
        <div className="User">
            <SideBarNavigator/>
            <div>
              <p>Dashboard</p>
            </div>
        </div>
    </>
  )
}

export default UserDashboard