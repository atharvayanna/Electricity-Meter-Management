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
  const [consumption, setConsumption] = useState(0);
  const [energySaving, setEnergySaving] = useState(0);
  const [costSaving, setCostSaving] = useState(0);
  const [avg, setAvg] = useState(0);

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
    calculateKpi();
  }

  const calculateKpi = () => {
    const curr = new Date();
    let lastMonth = {};
    let prevMonth = {};
    const sortedData = meterData.sort((a, b) => {
      new Date(b.reading_date) - a.reading_date;
    });
    for (let i in sortedData) {
      const date = new Date(sortedData[i].reading_date);
      if (
        date.getMonth() <= curr.getMonth() &&
        date.getFullYear() <= curr.getFullYear()
      ) {
        lastMonth = sortedData[i];
        prevMonth = sortedData[parseInt(i) + 1];
        break;
      }
    }
    if (lastMonth.reading_date) {
      setConsumption(lastMonth.reading_value);
      const saving =
        ((lastMonth.reading_value - prevMonth.reading_value) /
          prevMonth.reading_value) * 100;

      setEnergySaving(saving.toFixed(2));
      const cost =
        ((lastMonth.billing_amount - prevMonth.billing_amount) /
          prevMonth.billing_amount) *
        100;
      setCostSaving(cost.toFixed(2));
    }

    const { avgM, avgS } = sortedData.reduce(
      (acc, e) => {
        const date = new Date(e.reading_date);
        if (date.getFullYear() === curr.getFullYear()) {
          acc.avgM += 1;
          acc.avgS += e.reading_value;
        }
        return acc;
      },
      { avgM: 0, avgS: 0 }
    );

    setAvg((avgS/avgM).toFixed(2))
};


  const handleCurrentMeter = (e) => {
    setCurrentMeter(e.target.value);
  };

  useEffect(() => {
    setCurrentMeter(userMeters[0]);
    fetchData();
    // calculateKpi();
  }, []);

  useEffect(() => {
    if (currentMeter === "") return;
    fetchData();
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
          <p>{consumption} units</p>
        </div>

        <div className="kpi__card">
          <h3>
            Energy Saving <p className="des" style={{color:energySaving>0 ? 'rgb(0, 172, 9)':'red'}}>Compared to last month</p>
          </h3>
          <p className="des">{energySaving}%</p>
        </div>

        <div className="kpi__card">
          <h3>
            Cost Saving <p className="des" style={{color:costSaving>0 ? 'rgb(0, 172, 9)':'red'}} > Compared to last month</p>
          </h3>
          <p className="des">{costSaving}%</p>
        </div>

        <div className="kpi__card">
          <h3>
            Avg Consumption <p className="des">{currentMeter}</p>
          </h3>
          <p className="des">{avg} units</p>
        </div>
      </div>
      <div className="dashboard__barchart">
        {/* <BarChart /> */}
      </div>
    </div>
  );
};

export default UserDashboard;
