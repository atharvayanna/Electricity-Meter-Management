import './AllUsers.css'
import NavBar from '../../NavBar/NavBar'
import SideBarNavigator from '../../NavBar/SideBarNavigator/SideBarNavigator'
import UsersTable from './UsersTable/UsersTable'
import UpdateUserModal from '../Modal/UpdateUserModal/UpdateUserModal'

const AllUsers = () => {
  return (
    <>
      <NavBar />

      <div className="admin">
        {/* <UpdateUserModal /> */}
        <SideBarNavigator />
        <div className="admin__all-users">
          <UsersTable/>
        </div>
      </div>
    </>
  )
}

export default AllUsers