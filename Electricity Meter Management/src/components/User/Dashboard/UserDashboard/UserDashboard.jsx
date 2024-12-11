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
  const user = useSelector((state) => state.user);
  const userMeters = useSelector((state) => state.user.meter_numbers);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMeter, setCurrentMeter] = useState("");
  const [meterData, setMeterData] = useState([]);
  const [consumption, setConsumption] = useState(0);
  const [energySaving, setEnergySaving] = useState(0);
  const [costSaving, setCostSaving] = useState(0);
  const [lastMonthDate, setLastMonthDate] = useState();
  const [prevMonthDate, setPrevMonthDate] = useState();
  const [avg, setAvg] = useState(0);
  const currDate = new Date();

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

    let lastMonth = {};
    let prevMonth = {};
    const sortedData = meterData.sort((a, b) => {
      new Date(b.reading_date) - a.reading_date;
    });
    for (let i in sortedData) {
      const date = new Date(sortedData[i].reading_date);
      const dateP = new Date(sortedData[parseInt(i) + 1].reading_date);
      if (
        date.getMonth() <= curr.getMonth() &&
        date.getFullYear() <= curr.getFullYear()
      ) {
        lastMonth = sortedData[i];
        prevMonth = sortedData[parseInt(i) + 1];
        setLastMonthDate(date);
        setPrevMonthDate(dateP);
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
      const costSP =
        ((lastMonth.billing_amount - prevMonth.billing_amount) /
          prevMonth.billing_amount) *
        100;
      setCostSaving(costSP.toFixed(2));
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
  }, [meterData]);

  return (
    <div className="dashboard">
      <div className="dashboard__kpi">
        <div className="kpi__card">
          <h3>
            Meter Number
            <p>{`Consumer No: ${user.id}`}</p>
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
            <p>
              {lastMonthDate
                ? lastMonthDate.toLocaleString("default", { month: "long" })
                : "Last Month"}
            </p>
          </h3>
          <p
            className="des"
            style={{ color: energySaving < 0 ? "rgb(0, 172, 9)" : "red" }}
          >
            {consumption} units
          </p>
        </div>

        <div className="kpi__card">
          <h3>
            Energy Usage
            <p className="des">
              {lastMonthDate
                ? `${prevMonthDate.toLocaleString("default", {
                    month: "long",
                  })} to ${lastMonthDate.toLocaleString("default", {
                    month: "long",
                  })}`
                : "Previous Month"}
            </p>
          </h3>
          <p
            className="des"
            style={{ color: energySaving < 0 ? "rgb(0, 172, 9)" : "red" }}
          >
            {energySaving > 0
              ? `${energySaving}% \u2191`
              : `${energySaving * -1}% \u2193`}
          </p>
        </div>

        <div className="kpi__card">
          <h3>
            Cost Saving
            <p className="des">
              {lastMonthDate
                ? `${prevMonthDate.toLocaleString("default", {
                    month: "long",
                  })} to ${lastMonthDate.toLocaleString("default", {
                    month: "long",
                  })}`
                : "Previous Month"}
            </p>
          </h3>
          <p
            className="des"
            style={{ color: costSaving < 0 ? "rgb(0, 172, 9)" : "red" }}
          >
            {costSaving > 0
              ? `${costSaving}%  \u2193`
              : `${costSaving * -1}% \u2191`}
          </p>
        </div>

        <div className="kpi__card">
          <h3>
            Avg Consumption <p className="des">Per Month</p>
            {/* {`Year: ${currDate.toLocaleString('default', { year: 'numeric' })}`} */}
          </h3>
          <p
            className="des"
            style={{ color: energySaving < 0 ? "rgb(0, 172, 9)" : "red" }}
          >
            {avg} units
          </p>
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
