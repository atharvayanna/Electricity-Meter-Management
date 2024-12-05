import './Dashboard.css'
import NavBar from "../../NavBar/NavBar"
import SideBarNavigator from "../../NavBar/SideBarNavigator/SideBarNavigator"
import UserDashboard from './UserDashboard/UserDashboard'


const Dashboard = () => {
  

  return (
    <>
        <NavBar/>
        <div className="user">
            <SideBarNavigator/>
            <div className="dashboard__content">
              <UserDashboard/>
            </div>
        </div>
    </>
  )
}

export default Dashboard