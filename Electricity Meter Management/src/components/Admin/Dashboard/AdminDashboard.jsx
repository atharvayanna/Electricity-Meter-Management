import './AdminDashboard.css'
import axios from "axios";
import url from "../../../Url";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BarChart from "../Charts/BarChart";
import LineChart from '../Charts/LineChart';
import Histogram from '../Charts/Histogram';
import DefaultLineChart from '../Charts/DefaultLineChart';
import DonutChart from '../Charts/DonutChart';

const AdminDashboard = () => {
  const token = useSelector((state) => state.accessToken);
  const curDate = new Date();
  const lastMonth = new Date(curDate.getFullYear(), curDate.getMonth() - 1, 1); 
  const prevMonth = new Date(curDate.getFullYear(), lastMonth.getMonth() - 1, 1); 

  const [consumption, setConsumption] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [revenueIncrease, setRevenueIncrease] = useState(0);
  const [defaulter, setDefaulter] = useState(0);
  const [defaulterIncrease, setDefaulterIncrease] = useState(0);
  const [meterData, setMeterData] = useState([]);

  async function fetchData() {
    try {
      const res = await axios.get(`${url}/meterRecord`, {
        headers: {
          Authorization: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      const formattedData = res.data.meterRecords.map((e) => {
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
          month: date.getMonth(),
          year: date.getFullYear(),
        };
      });

      setMeterData(formattedData);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const calculateKpi = () => {
    let consumptionLastMonth = 0;
    let revenueLastMonth = 0;
    let defaultAmountLastMonth = 0;

    let revenuePrevMonth = 0;
    let defaultAmountPrevMonth = 0;

    meterData.forEach((record) => {
      const readingDate = new Date(record.reading_date);
      const isLastMonth =
        readingDate.getFullYear() === lastMonth.getFullYear() &&
        readingDate.getMonth() === lastMonth.getMonth();

      const isPrevMonth =
        readingDate.getFullYear() === prevMonth.getFullYear() &&
        readingDate.getMonth() === prevMonth.getMonth();

      if (isLastMonth) {
        consumptionLastMonth += record.reading_value;
        revenueLastMonth += record.billing_amount;

        if (record.paymentStatus === "Unpaid") {
          defaultAmountLastMonth += record.billing_amount;
        }
      }

      if (isPrevMonth) {
        revenuePrevMonth += record.billing_amount;

        if (record.paymentStatus === "Unpaid") {
          defaultAmountPrevMonth += record.billing_amount;
        }
      }
    });

    setConsumption(consumptionLastMonth);
    setRevenue(revenueLastMonth);
    setDefaulter(defaultAmountLastMonth);
    setRevenueIncrease(revenueLastMonth - revenuePrevMonth);
    setDefaulterIncrease(defaultAmountLastMonth - defaultAmountPrevMonth);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (meterData.length > 0) {
      calculateKpi();
    }
  }, [meterData]);

  return (
    <>
      <div className="dashboard__kpi">
        <div className="kpi__card">
          <h3>
            Consumption{" "}
            <p>{lastMonth.toLocaleString("default", { month: "long" })}</p>
          </h3>
          <p>{consumption} units</p>
        </div>

        <div className="kpi__card">
          <h3>
            Revenue
            <p style={{ color: revenueIncrease>=0 ? "rgb(0, 172, 9)" : "red" }}>{lastMonth.toLocaleString("default", { month: "long" })}</p>
          </h3>
          <p>{revenue} Rs</p>
        </div>

        <div className="kpi__card">
          <h3>
            {revenueIncrease>=0 ? 'Revenue Rise':'Revenue Drop'}
            <p
              style={{ color: revenueIncrease>=0 ? "rgb(0, 172, 9)" : "red" }}
            >
              {" "}
              {`${prevMonth.toLocaleString("default", { month: "long" })} to ${lastMonth.toLocaleString("default", { month: "long" })}`}
            </p>
          </h3>
          <p className="des">{revenueIncrease>0? revenueIncrease: revenueIncrease*-1} Rs</p>
        </div>

        <div className="kpi__card">
          <h3>
            Default Amount
            <p
              style={{ color: defaulterIncrease>=0 ? "rgb(0, 172, 9)" : "red" }}
            >
              {lastMonth.toLocaleString("default", { month: "long" })}
            </p>
          </h3>
          <p className="des">{defaulter} Rs</p>
        </div>

        <div className="kpi__card">
          <h3>
            {defaulterIncrease>=0 ? 'Default Rise': 'Default Drop'}
            <p className="des" style={{ color: defaulterIncrease<=0 ? "rgb(0, 172, 9)" : "red" }}>
              {`${prevMonth.toLocaleString("default", { month: "long" })} to ${lastMonth.toLocaleString("default", { month: "long" })}`}
            </p>
          </h3>
          <p className="des">{defaulterIncrease>0? defaulterIncrease: defaulterIncrease*-1} Rs</p>
        </div>
      </div>
      <div className="admin__charts">
        <div className="charts__row">
          <div className="row__chart">
            <BarChart data={meterData}/>
          </div>
          <div className="row__chart">
            <LineChart data={meterData} />
          </div>
        </div>
        <div className="charts__row">
          <div className="row__chart">
            <DonutChart data={meterData}/>
          </div>
          <div className="row__chart">
            <DefaultLineChart data={meterData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;