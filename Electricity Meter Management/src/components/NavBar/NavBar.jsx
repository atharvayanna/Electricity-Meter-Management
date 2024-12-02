// import React from 'react'
import { useNavigate } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
  const navigate = useNavigate();
  const navigateHome = () =>{
    navigate('/user')
  }
  
  return (
    <nav>
        <div className="navbar">
          <div className="navbar__logo" onClick={navigateHome}>
            <img width="34" height="34" src="https://img.icons8.com/color/48/energy-isolation.png" alt="energy-isolation"/>
            <span>DigiMeter</span>
          </div>

          <div className="navbar__content">
            <div className="profile"><i className="fa-solid fa-user"></i></div>
            <i className="fa-solid fa-right-from-bracket" ></i>
          </div>
        </div>
    </nav>
  )
}

export default NavBar