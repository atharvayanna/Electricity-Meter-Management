import { useEffect, useState } from "react";
import "./MeterTableUsers.css";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import url from "../../../../Url";
import UpdateMeterReadingsModal from "../../Modal/UpdateMeterReadingsModal.jsx/UpdateMeterReadingsModal";
import {
  deleteMeterRecord,
  getAllMeterRecord,
} from "../../../../redux/slices/admin/adminSlice";
import { capitalizeStr } from "../../../../utils/utils";
import { showToast } from "../../../../utils/toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MeterTableUsers = () => {
  const token = useSelector((state) => state.accessToken);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recordUpdateStatus, setRecordUpdateStatus] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [allMetersData, setAllMetersData] = useState([]);
  const [reading, setReading] = useState();
  const [sortOption, setSortOption] = useState("dateDesc");

  async function fetchData() {
    setIsLoading(true);
    const action = await dispatch(getAllMeterRecord());

    if (getAllMeterRecord.fulfilled.match(action)) {
      const formattedData = action.payload.meterRecords.map((e) => {
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
    } else if (getAllMeterRecord.rejected.match(action)) {
      console.log(action);
    }
    setIsLoading(false);
  }

  const searchResult = () => {
    let filteredData = [...allMetersData];
    if (searchQuery) {
      filteredData = allMetersData.filter((e) => {
        return (
          e.user_id.toString().includes(searchQuery) ||
          e.meter_number.toString().includes(searchQuery) ||
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.reading_value.toString().includes(searchQuery) ||
          e.billing_amount.toString().includes(searchQuery) ||
          e.paymentStatus.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          e.formattedDate.includes(searchQuery)
        );
      });
    }

    return filteredData;
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

  const getPaginatedData = () => {
    let filteredData = searchResult();
    filteredData = sortData(filteredData);
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

  const handleDeleteReading = async (reading_id) => {
    const action = await dispatch(deleteMeterRecord(reading_id));
    if (deleteMeterRecord.fulfilled.match(action)) {
      const filteredData = allMetersData.filter(
        (ele) => ele.reading_id !== reading_id
      );
      setAllMetersData(filteredData);
      showToast('Reading deleted successfully', 'success')
    } else if(deleteMeterRecord.rejected.match(action)){
      showToast('Failed to delete reading', 'error')
    }
    // try {
    //   const res = await axios.patch(
    //     `${url}/meterRecord/${reading_id}`,
    //     {},
    //     {
    //       headers: {
    //         Authorization: `${token}`,
    //         "ngrok-skip-browser-warning": "69420",
    //       },
    //     }
    //   );
    //   console.log(res.data);

    //   const filteredData = allMetersData.filter(
    //     (ele) => ele.reading_id !== reading_id
    //   );
    //   setAllMetersData(filteredData);
    // } catch (error) {
    //   console.log(error.response);
    // }
  };

  const handleUpdateReading = async (reading_id) => {
    try {
      setIsOpen(true);
      setReading(allMetersData.find((ele) => ele.reading_id === reading_id));
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTotalRecords(searchResult().length);
  }, [searchQuery]);

  useEffect(() => {
    if (recordUpdateStatus) showToast(`${recordUpdateStatus[1]}`, "success");
  }, [recordUpdateStatus]);

  return (
    <div className="meterdata__users">
      <ToastContainer />
      {isOpen && (
        <UpdateMeterReadingsModal
          props={{
            setIsOpen,
            reading,
            newRecord: false,
            fetchData,
            newUserRecord: false,
            setRecordUpdateStatus,
          }}
        />
      )}
      {/* <UpdateMeterReadingsModal props={{setIsOpen}}/> */}
      <div className="table__functions">
        <div className="title">
          <h2>Meter Readings</h2>
        </div>

        <div className="functions">
          <select id="sortOption" value={sortOption} onChange={handleSort}>
            <option value="dateDesc">Date &#x2193;</option>
            <option value="dateAsc">Date &#x2191;</option>
            <option value="billAmountAsc">Bill &#x2191;</option>
            <option value="billAmountDesc">Bill &#x2193;</option>
          </select>

          <div className="search">
            <input
              type="text"
              name=""
              id=""
              placeholder="Search"
              onChange={handleSearch}
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>
      {/* <h3>Meter Readings</h3> */}
      <div className="meterdata__table">
        <table className="table__user">
          <thead>
            <th>Consumer No</th>
            <th>Meter No</th>
            <th>Name</th>
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
                    <td>{capitalizeStr(e.name)}</td>
                    <td>{e.formattedDate}</td>
                    <td>{e.reading_value} units</td>
                    <td>{e.billing_amount} Rs</td>
                    <td>{e.paymentStatus}</td>
                    <td>
                      <div className="actions">
                        <button
                          id="update_user"
                          onClick={() => {
                            handleUpdateReading(e.reading_id);
                          }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          id="delete_user"
                          onClick={() => handleDeleteReading(e.reading_id)}
                        >
                          <i className="fa-sharp fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {searchResult().length === 0 && !isOpen && (
                <div className="no__record">
                  <p>No Record Present</p>
                </div>
              )}
            </tbody>
          )}
        </table>
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

export default MeterTableUsers;
