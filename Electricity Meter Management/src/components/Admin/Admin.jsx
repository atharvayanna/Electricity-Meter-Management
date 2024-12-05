import SideBarNavigator from "../NavBar/SideBarNavigator/SideBarNavigator"
import NavBar from "../NavBar/NavBar"
import './Admin.css'

const Admin = () => {
  return (
    <>
      <NavBar />

      <div className="admin">
        <SideBarNavigator />
        <div>
          Admin Page
        </div>
      </div>
    </>
  )
}

export default Admin