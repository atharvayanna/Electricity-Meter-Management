import './SideBarNavigator.css'
import { useNavigate } from 'react-router-dom';

const SideBarNavigator = () => {
  const navigate = useNavigate();
  const navigateDashboard = ()=>{
    navigate('/user/dashboard')
  }

  return (
    <div className="navigator">
      <div className="navigator__options">
        <div className="dashboard active" onClick={navigateDashboard}>
          <i className="fa-solid fa-chart-simple"></i>
          <p>Dashboard</p>
        </div>
        <div className="meter__data active">
          <i className="fa-solid fa-table"></i>
          <p>History</p>
        </div>
      </div>

    </div>
  )
}

export default SideBarNavigator