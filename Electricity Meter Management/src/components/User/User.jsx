import NavBar from "../NavBar/NavBar"
import SideBarNavigator from "../NavBar/SideBarNavigator/SideBarNavigator"


const User = () => {
  return (
    <>
        <NavBar/>
        <div className="User">
            <SideBarNavigator/>
            <div>User name</div>
        </div>
    </>
  )
}

export default User