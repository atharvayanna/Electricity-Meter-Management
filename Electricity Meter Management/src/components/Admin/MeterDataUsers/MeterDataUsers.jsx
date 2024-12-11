import "./MeterDataUsers.css";
import NavBar from "../../NavBar/NavBar";
import SideBarNavigator from "../../NavBar/SideBarNavigator/SideBarNavigator";
import MeterTableUsers from "./MeterTableUsers/MeterTableUsers";
import UpdateMeterReadingsModal from "../Modal/UpdateMeterReadingsModal.jsx/UpdateMeterReadingsModal";

const MeterDataUsers = () => {
  return (
    <>
      <NavBar />

      <div className="admin">
        <SideBarNavigator />
        {/* <UpdateMeterReadingsModal/> */}
        <div className="metertable__users">
          <MeterTableUsers/>
        </div>
      </div>
    </>
  );
};

export default MeterDataUsers;
