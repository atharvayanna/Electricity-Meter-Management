import { useEffect, useState } from "react"
import NavBar from "../../NavBar/NavBar"
import SideBarNavigator from "../../NavBar/SideBarNavigator/SideBarNavigator"
import './MeterData.css'
import MeterTable from "./MeterTable"

const MeterData = () => {
  return (
    <>
        <NavBar/>
        <div className="user">
            <SideBarNavigator/>
            <div className="meter">
              <MeterTable/>
            </div>
            
        </div>
    </>
  )
}

export default MeterData