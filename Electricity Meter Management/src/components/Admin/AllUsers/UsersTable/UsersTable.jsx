import { useEffect, useState } from "react";
import "./UsersTable.css";
import axios from "axios";
import { useSelector } from "react-redux";
import url from "../../../../Url";
import { RotatingLines } from "react-loader-spinner";

const UsersTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.accessToken);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [totalRecords, setTotalRecords] = useState(0);

  async function fetchData() {
    setIsLoading(true);
    try {
      const res = await axios.get(`${url}/users`, {
        headers: {
          Authorization: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      setIsLoading(false);
      setUsers(res.data);
      setTotalRecords(res.data.length)
      console.log(res.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const searchResult =() =>{
    let filteredData = [...users]
    if(searchQuery){
      filteredData = users.filter((e) => {
        return (
          e.id.toString().includes(searchQuery) ||
          e.name.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.email.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.contact.toString().includes(searchQuery) ||
          e.city.toString().toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="table__users">
      <div className="table__functions">
        <div className="allusers__functions">
          <button>Add User</button>
        </div>
        <div className="search">
          <input type="text" name="" id="" placeholder="Search"  onChange={handleSearch}/>
          <button>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <h3>All Users</h3>
      <div className="table">
        <table className="table__user">
          <thead>
            <th>Consumer No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>City</th>
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
                      <td>{e.id}</td>
                      <td>{e.name}</td>
                      <td>{e.email}</td>
                      <td>{e.contact}</td>
                      <td>{e.city}</td>
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
                    <p>No Record Found</p>
                  </div>
                )}
              </tbody>
            )}
        </table>
      </div>

      <div className="pagination">
        <button onClick={handleFirstPage} disabled={currentPage === 1 || totalRecords===0}>
          &#x226A;
        </button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1 || totalRecords===0}>
          &#x003C;
        </button>
        <span>
          Page {currentPage} of {totalPages()}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages() || totalRecords===0}
        >
          &#x003E;
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages() || totalRecords===0}
        >
          &#x226B;
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
