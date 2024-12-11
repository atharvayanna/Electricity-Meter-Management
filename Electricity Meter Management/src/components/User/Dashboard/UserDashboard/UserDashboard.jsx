import "./UserDashboard.css";
import BarChart from "../../Charts/BarChart";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "../../../../Url";
import LineChart from "../../Charts/LineChart";
import { net } from "@amcharts/amcharts4/core";

const UserDashboard = () => {
  const token = useSelector((state) => state.accessToken);
  const userMeters = useSelector((state) => state.user.meter_numbers);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMeter, setCurrentMeter] = useState("");
  const [meterData, setMeterData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [consumption, setConsumption] = useState(0);
  const [energySaving, setEnergySaving] = useState(0);
  const [costSaving, setCostSaving] = useState(0);
  const [lastMonthDate, setLastMonthDate] = useState();
  const [prevMonthDate, setPrevMonthDate] = useState();
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
  }

  const calculateKpi = () => {
    const curr = new Date();
    const lmd = new Date();
    const pmd = new Date();

    // lmd.setMonth(curr.getMonth() - 1);
    // setLastMonthDate(lmd);
    // pmd.setMonth(lmd.getMonth() - 1);
    // setPrevMonthDate(pmd);

    let lastMonth = {};
    let prevMonth = {};
    const sortedData = meterData.sort((a, b) => {
      new Date(b.reading_date) - a.reading_date;
    });
    for (let i in sortedData) {
      const date = new Date(sortedData[i].reading_date);
      const dateP = new Date(sortedData[parseInt(i) + 1].reading_date)
      if (
        date.getMonth() <= curr.getMonth() &&
        date.getFullYear() <= curr.getFullYear()
      ) {
        lastMonth = sortedData[i];
        prevMonth = sortedData[parseInt(i) + 1];
        setLastMonthDate(date);
        setPrevMonthDate(dateP)
        break;
      }
    }
    if (lastMonth.reading_date) {
      setConsumption(lastMonth.reading_value);
      const saving =
        ((lastMonth.reading_value - prevMonth.reading_value) /
          prevMonth.reading_value) *
        100;

      setEnergySaving(saving.toFixed(2));
      const cost = lastMonth.billing_amount - prevMonth.billing_amount;
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

    setAvg((avgS / avgM).toFixed(2));
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

  useEffect(() => {
    calculateKpi();
    setChartData(meterData);
  }, [meterData]);

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
            Consumption{" "}
            <p>{lastMonthDate? lastMonthDate.toLocaleString("default", { month: "long" }): 'Last Month'}</p>
          </h3>
          <p>{consumption} units</p>
        </div>

        <div className="kpi__card">
          <h3>
            {energySaving>=0? 'Energy Saving': 'Energy Expenditure'}
            <p
              className="des"
              style={{ color: energySaving > 0 ? "rgb(0, 172, 9)" : "red" }}
            >{lastMonthDate? `${prevMonthDate.toLocaleString("default", {
              month: "long",
            })} to ${lastMonthDate.toLocaleString("default", {
              month: "long",
            })}`: "Previous Month"}</p>
          </h3>
          <p className="des">{energySaving>=0? energySaving: energySaving*-1}%</p>
        </div>

        <div className="kpi__card">
          <h3>
            {costSaving>=0? 'Cost Efficiency':'Cost Inefficiency'}
            <p
              className="des"
              style={{ color: costSaving > 0 ? "rgb(0, 172, 9)" : "red" }}
            >{lastMonthDate? `${prevMonthDate.toLocaleString("default", {
              month: "long",
            })} to ${lastMonthDate.toLocaleString("default", {
              month: "long",
            })}`: "Previous Month"}</p>
          </h3>
          <p className="des">{costSaving>=0? costSaving:costSaving*-1} Rs</p>
        </div>

        <div className="kpi__card">
          <h3>
            Avg Consumption <p className="des">{currentMeter}</p>
          </h3>
          <p className="des">{avg} units</p>
        </div>
      </div>
      <div className="dashboard__charts">
        <div className="charts__barchart">
          <BarChart props={{ meterData }} />
        </div>

        <div className="charts__linechart">
          <LineChart props={{ meterData }} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
