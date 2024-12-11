import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import url from "../../../Url";
import "./MeterTable.css";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import UpdateMeterReadingsModal from "../../Admin/Modal/UpdateMeterReadingsModal.jsx/UpdateMeterReadingsModal";

const MeterTable = () => {
  const token = useSelector((state) => state.accessToken);
  const user = useSelector((state) => state.user);
  const userMeters = useSelector((state) => state.user.meter_numbers);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMeter, setCurrentMeter] = useState("");
  const [meterData, setMeterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");
  const [isOpen, setIsOpen] = useState(false);

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
      setMeterData(formattedData);
      setTotalRecords(formattedData.length);
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

  const searchResult = () => {
    let filteredData = [...meterData];
    if (searchQuery) {
      filteredData = meterData.filter((e) => {
        return (
          e.reading_value.toString().includes(searchQuery) ||
          e.billing_amount.toString().includes(searchQuery) ||
          e.paymentStatus.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          e.formattedDate.includes(searchQuery)
        );
      });
    }

    return filteredData;
  };

  const getPaginatedData = () => {
    let filteredData = [...meterData];

    // if (searchQuery) {
    //   filteredData = meterData.filter((e) => {
    //     return (
    //       e.reading_value.toString().includes(searchQuery) ||
    //       e.billing_amount.toString().includes(searchQuery) ||
    //       e.paymentStatus.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    //       e.formattedDate.includes(searchQuery)
    //     );
    //   });
    // }
    filteredData = searchResult();

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

  const handleAddRecord = () => {
    setIsOpen(true);
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

  useEffect(() => {
    setTotalRecords(searchResult().length);
  }, [searchQuery]);

  return (
    <div className="meter__table">
      {isOpen && (
        <UpdateMeterReadingsModal
          props={{
            setIsOpen,
            reading: { user_id: user.id, meter_number: currentMeter },
            newRecord: true,
            newUserRecord: false,
            fetchData,
          }}
        />
      )}
      <div className="table__functions">
        <div className="title">
          <h2>Consumption Data</h2>
        </div>
        <div className="functions">
          <div className="meter_select">
            <select name="" id="" onChange={handleCurrentMeter}>
              {userMeters.map((e, index) => (
                <option value={e} key={index}>
                  {" "}
                  {e}{" "}
                </option>
              ))}
            </select>
          </div>
          <div className="sort">
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
            id="user_search"
            placeholder="Search"
            onChange={handleSearch}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
        </div>
        {/* <div className="functions">
          <button onClick={handleAddRecord}>Add Bill</button>
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
            id="user_search"
            placeholder="Search"
            onChange={handleSearch}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div> */}
      </div>
      <div className="table">
        <div className="table__container">
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
                  return (
                    <tr key={index}>
                      <td>{e.formattedDate}</td>
                      <td>{e.reading_value} units</td>
                      <td>{e.billing_amount} Rs</td>
                      <td>{e.paymentStatus}</td>
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
      </div>

      <div className="pagination">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1 || totalRecords === 0}
        >
          &#x226A;
        </button>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || totalRecords === 0}
        >
          &#x003C;
        </button>
        <span>
          Page {currentPage} of {totalPages()}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages() || totalRecords === 0}
        >
          &#x003E;
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages() || totalRecords === 0}
        >
          &#x226B;
        </button>
      </div>
    </div>
  );
};

export default MeterTable;
