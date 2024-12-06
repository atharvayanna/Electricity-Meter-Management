import { useEffect, useState } from "react";
import "./MeterTableUsers.css";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import { useSelector } from "react-redux";
import url from "../../../../Url";

const MeterTableUsers = () => {
  const token = useSelector((state) => state.accessToken);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [allMetersData, setAllMetersData] = useState([]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const res = await axios.get(`${url}/meterRecord`, {
        headers: {
          Authorization: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      setIsLoading(false);
      const formattedData = res.data.map((e) => {
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
      setAllMetersData(formattedData);
      setTotalRecords(formattedData.length);
      console.log(res.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  const searchResult =() =>{
    let filteredData = [...allMetersData]
    if(searchQuery){
      filteredData = allMetersData.filter((e) => {
        return (
          e.user_id.toString().includes(searchQuery) ||
          e.meter_number.toString().includes(searchQuery) ||

          e.reading_value.toString().includes(searchQuery) ||
          e.billing_amount.toString().includes(searchQuery) ||
          e.paymentStatus.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          e.formattedDate.includes(searchQuery)
        );
      });
    }

    return filteredData
  }

  const getPaginatedData = () => {
    const filteredData = searchResult();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);

  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = () => {
    return Math.ceil(totalRecords / itemsPerPage);
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
    fetchData();
  }, []);

  useEffect(()=>{
    setTotalRecords(searchResult().length)
  },[searchQuery])

  return (
    <div className="meterdata__users">
      <div className="table__functions">
        <div className="meterdata__functions">
          <button>Add User</button>
        </div>
        <div className="search">
          <input type="text" name="" id="" placeholder="Search" onChange={handleSearch} />
          <button>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <h3>Meter Readings</h3>
      <div className="meterdata__table">
        <table className="table__user">
          <thead>
            <th>Consumer No</th>
            <th>Meter No</th>
            <th>Date</th>
            <th>Consumption</th>
            <th>Bill Amount</th>
            <th>Payment Status</th>
            <th id="actions__th">Actions</th>
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
                    <td>{e.user_id}</td>
                    <td>{e.meter_number}</td>
                    <td>{e.formattedDate}</td>
                    <td>{e.reading_value} units</td>
                    <td>{e.billing_amount} Rs</td>
                    <td>{e.paymentStatus}</td>
                    <td>
                      <div className="actions">
                        <button>
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button>
                          <i className="fa-sharp fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {searchResult().length === 0 && (
                <div className="no__record">
                  <p>No Record Present</p>
                </div>
              )} 
            </tbody>
          )}
        </table>
      </div>

      <div className="pagination">
        <button onClick={handleFirstPage} disabled={currentPage === 1 || totalRecords=== 0}>
          &#x226A;
        </button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1 || totalRecords=== 0}>
          &#x003C;
        </button>
        <span>
          Page {currentPage} of {totalPages()}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages() || totalRecords=== 0}
        >
          &#x003E;
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages() || totalRecords=== 0}
        >
          &#x226B;
        </button>
      </div>
    </div>
  );
};

export default MeterTableUsers;
