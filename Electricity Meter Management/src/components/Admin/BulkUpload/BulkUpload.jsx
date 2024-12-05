import './BulkUpload.css'
import NavBar from '../../NavBar/NavBar'
import SideBarNavigator from '../../NavBar/SideBarNavigator/SideBarNavigator'

const BulkUpload = () => {
  return (
    <>
      <NavBar />

      <div className="admin">
        <SideBarNavigator />
        <div>
          Bulk Upload
        </div>
      </div>
    </>
  )
}

export default BulkUpload