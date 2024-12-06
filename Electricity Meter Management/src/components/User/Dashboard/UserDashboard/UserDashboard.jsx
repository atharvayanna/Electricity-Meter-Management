import "./UserDashboard.css";
import BarChart from "../../Charts/BarChart";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "../../../../Url";

const UserDashboard = () => {
  const token = useSelector((state) => state.accessToken);
  const userMeters = useSelector((state) => state.user.meter_numbers);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMeter, setCurrentMeter] = useState("");
  const [meterData, setMeterData] = useState([]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const res = await axios.get(`${url}/meterReading/user/${currentMeter}`, {
        headers: {
          Authorization: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      setIsLoading(false);
      const formattedData = res.data.meter_readings.map((e) => {
        const paymentStatus = e.is_paid === "No" ? "Unpaid" : "Paid";
        const date = new Date(e.reading_date);
        const formattedDate = date
          .toLocaleDateString("en-GB")
          .split("/")
          .join("-");

        return {
          ...e,
          paymentStatus,
          formattedDate,
        };
      });
      const sortedData = formattedData.sort(
        (a, b) => new Date(b.reading_date) - new Date(a.reading_date)
      );
      setMeterData(sortedData);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  const handleCurrentMeter = (e) => {
    setCurrentMeter(e.target.value);
  };

  useEffect(() => {
    setCurrentMeter(userMeters[0]);
  }, []);

  useEffect(() => {
    if (currentMeter === "") return;
    // fetchData()
  }, [currentMeter]);

  return (
    <div className="dashboard">
      <div className="dashboard__kpi">
        <div className="kpi__card">
          <h3>
            Meter Number <p>User ID</p>
          </h3>
          <select name="" id="" onChange={handleCurrentMeter}>
            {userMeters.map((e, index) => (
              <option value={e} key={index}>
                {" "}
                {e}{" "}
              </option>
            ))}
          </select>
        </div>

        <div className="kpi__card">
          <h3>
            Consumption <p>Last Month</p>
          </h3>
          <p>150units</p>
        </div>

        <div className="kpi__card">
          <h3>
            Energy Saving <p className="des">Compared to last month</p>
          </h3>
          <p className="des">20%</p>
        </div>

        <div className="kpi__card">
          <h3>
            Cost Saving <p className="des">Compared to last month</p>
          </h3>
          <p className="des">20%</p>
        </div>

        <div className="kpi__card">
          <h3>
            Avg Consumption <p className="des">{currentMeter}</p>
          </h3>
          <p className="des">20%</p>
        </div>
      </div>
      <div className="dashboard__barchart">
        <BarChart />
      </div>
    </div>
  );
};

export default UserDashboard;
