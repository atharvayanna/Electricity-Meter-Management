import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import url from "../../../Url";
import "./MeterTable.css";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";

const MeterTable = () => {
  const token = useSelector((state) => state.accessToken);
  const user = useSelector(state=>state.user);
  const userMeters = useSelector((state) => state.user.meter_numbers);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMeter, setCurrentMeter] = useState("");
  const [meterData, setMeterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("dateAsc");

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
      setMeterData(res.data.meter_readings);
      setTotalRecords(res.data.meter_readings.length);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  const sortData = (data) => {
    switch (sortOption) {
      case "dateAsc":
        return data.sort(
          (a, b) => new Date(a.reading_date) - new Date(b.reading_date)
        );
      case "dateDesc":
        return data.sort(
          (a, b) => new Date(b.reading_date) - new Date(a.reading_date)
        );
      case "billAmountAsc":
        return data.sort((a, b) => a.billing_amount - b.billing_amount);
      case "billAmountDesc":
        return data.sort((a, b) => b.billing_amount - a.billing_amount);
      default:
        return data;
    }
  };

  const handleCurrentMeter = (e) => {
    setCurrentMeter(e.target.value);
  };

  const totalPages = () => {
    return Math.ceil(totalRecords / itemsPerPage);
  };

  const getPaginatedData = () => {
    let filteredData = [...meterData];

    if (searchQuery) {
      filteredData = meterData.filter((e) => {
        const paymentStatus = e.is_paid === "No" ? "Unpaid" : "Paid";
        const date = new Date(e.reading_date);

        return (
          e.reading_value.toString().includes(searchQuery) ||
          e.billing_amount.toString().includes(searchQuery) ||
          paymentStatus.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          date
            .toLocaleDateString("en-GB")
            .split("/")
            .join("-")
            .includes(searchQuery)
        );
      });
    }

    filteredData = sortData(filteredData);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages());
  };

  useEffect(() => {
    setIsLoading(true);
    setCurrentMeter(userMeters[0]);
  }, []);

  useEffect(() => {
    if (currentMeter === "") {
      return;
    }
    fetchData();
  }, [currentMeter]);

  return (
    <div className="meter__table">
      <div className="table__functions">
        <div className="functions">
          <button>Add Bill</button>
          <select name="" id="" onChange={handleCurrentMeter}>
            {userMeters.map((e, index) => (
              <option value={e} key={index}>
                {" "}
                {e}{" "}
              </option>
            ))}
          </select>
          <select id="sortOption" value={sortOption} onChange={handleSort}>
            <option value="dateDesc">Date &#x2193;</option>
            <option value="dateAsc">Date &#x2191;</option>
            <option value="billAmountAsc">Bill &#x2191;</option>
            <option value="billAmountDesc">Bill &#x2193;</option>
          </select>
        </div>
        <div className="search">
          <input
            type="text"
            name=""
            id=""
            placeholder="Search"
            onChange={handleSearch}
          />
          <button>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <div className="table">
        <h3>Consumption Data</h3>
        <table className="table__user">
          <thead>
            <tr>
              <th>Date</th>
              <th>Consumption</th>
              <th>Bill Amount </th>
              <th>Payment Status</th>
            </tr>
          </thead>

          {isLoading ? (
            <div className="loader">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="50"
                visible={true}
              />
            </div>
          ) : (
            <tbody>
              {getPaginatedData().map((e, index) => {
                const date = new Date(e.reading_date);
                return (
                  <tr key={index}>
                    <td>
                      {date.toLocaleDateString("en-GB").split("/").join("-")}
                    </td>
                    <td>{e.reading_value} units</td>
                    <td>{e.billing_amount}</td>
                    <td>{e.is_paid === "No" ? "Unpaid" : "Paid"}</td>
                  </tr>
                );
              })}

              {meterData.length === 0 && (
                <div className="no__record">
                  <p>No Record Present</p>
                </div>
              )}
            </tbody>
          )}
        </table>
      </div>

      <div className="pagination">
        <button onClick={handleFirstPage} disabled={currentPage === 1}>
          &#x226A;
        </button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          &#x003C;
        </button>
        <span>
          Page {currentPage} of {totalPages()}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages()}
        >
          &#x003E;
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages()}
        >
          &#x226B;
        </button>
      </div>
    </div>
  );
};

export default MeterTable;
