import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useSelector } from "react-redux";

const NavBar = () => {
  const userType = useSelector(state=>state.userType)
  const navigate = useNavigate();
  const navigateHome = () => {
    if(userType=='user') navigate("/user")
    else navigate('/admin')
  };

  const logout = () => {
    navigate("/");
  };

  const user = useSelector((state) => state.user);

  return (
    <nav>
      <div className="navbar">
        <div className="navbar__logo" onClick={navigateHome}>
          <img
            width="34"
            height="34"
            src="https://img.icons8.com/color/48/energy-isolation.png"
            alt="energy-isolation"
          />
          <span>DigiMeter</span>
        </div>

        <div className="navbar__content">
          <div className="profile">
            <i className="fa-solid fa-user"></i>
            <div className="usercard">
              <div className="usercard__details">
                <span>Name:</span>
                <span>{user?.name}</span>
              </div>
              <div className="usercard__details">
                <span>Email:</span>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
          <div className="logout">
            <i className="fa-solid fa-right-from-bracket" onClick={logout}></i>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
