import { useEffect, useState } from "react";
import "./UsersTable.css";
import { useDispatch, useSelector } from "react-redux";
import { RotatingLines } from "react-loader-spinner";
import UpdateUserModal from "../../Modal/UpdateUserModal/UpdateUserModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { capitalizeStr } from "../../../../utils/utils";
import { getAllUsers } from "../../../../redux/slices/admin/adminSlice";
import { deleteUser, addMeter } from "../../../../redux/slices/admin/handleUsers";
import { showToast } from "../../../../utils/toast";

const UsersTable = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userUpdateStatus, setUpdateUserStatus] = useState(false);
  const [user, setUser] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    const action = await dispatch(getAllUsers());
    if (getAllUsers.fulfilled.match(action)) {
      setUsers(action.payload.userData);
      setTotalRecords(action.payload.userData.length);
    } else if (getAllUsers.rejected.match(action)) {
      console.log(action);
    }
    setIsLoading(false);
  };

  async function handleAddUser() {
    setIsNewUser(true);
    setUser({});
    setIsOpen(true);
  }

  async function handleUpdateUser(user_id) {
    setIsNewUser(false);
    setUser(users.find((ele) => ele.id === user_id));
    setIsOpen(true);
  }

  async function handleDeleteUser(user_id) {
    const deletedUser = users.find((ele) => ele.id === user_id);
    const action = await dispatch(deleteUser(deletedUser));

    if (deleteUser.fulfilled.match(action)) {
      const filterActiveUsers = users.filter((ele) => {
        return ele.id !== user_id;
      });
      setUsers(filterActiveUsers);
      showToast(
        `${capitalizeStr(deletedUser.name)} deleted succesfully`,
        "success"
      );
    } else if(deleteUser.rejected.match(action)) {
      showToast(`Delete ${capitalizeStr(deletedUser.name)} failed`, "error");
    }
  }

  async function addUserMeter(e) {
    const action = await dispatch(addMeter(e))
    if(addMeter.fulfilled.match(action)){
      showToast(`${action.payload.userData.meter_number} assigned to ${capitalizeStr(e.name)}`, 'success');
    } else if(addMeter.rejected.match(action)){
      showToast(`Failed to add meter to ${capitalizeStr(e.name)}`, 'error')
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const searchResult = () => {
    let filteredData = users?.length > 0 ? [...users] : [];
    if (searchQuery) {
      filteredData = users.filter((e) => {
        return (
          e.id.toString().includes(searchQuery) ||
          e.name.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.email
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          e.contact.toString().includes(searchQuery) ||
          e.city.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filteredData;
  };

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

  const handleAddMeter = (e) => {
    Swal.fire({
      icon: "question",
      title: `Do you want to add a new meter to ${e.name}?`,
      text: `Email: ${e.email}`,
      showCancelButton: true,
      confirmButtonText: "Add Meter",
      confirmButtonColor: "#008000",
      cancelButtonText: "Cancel",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        addUserMeter(e);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTotalRecords(searchResult().length);
  }, [searchQuery]);

  useEffect(() => {
    if (userUpdateStatus) {
      showToast(userUpdateStatus[1], 'success')
    }
  }, [userUpdateStatus]);

  return (
    <div className="table__users">
      <ToastContainer />
      {isOpen && (
        <UpdateUserModal
          props={{
            newUser: isNewUser,
            setIsOpen,
            user,
            fetchData,
            setUpdateUserStatus,
          }}
        />
      )}
      <div className="table__functions">
        <div className="title">
          <h2>All Users</h2>
        </div>
        <div className="functions">
          <button onClick={handleAddUser}>Add User</button>
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
                    <td>{capitalizeStr(e.name)}</td>
                    <td>{e.email}</td>
                    <td>{e.contact}</td>
                    <td>{capitalizeStr(e.city)}</td>
                    <td>
                      <div className="actions">
                        <button
                          id="add_meter"
                          title="Add Meter"
                          onClick={() => handleAddMeter(e)}
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                          id={`update_user${index}`}
                          title="Update User"
                          onClick={() => handleUpdateUser(e.id)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          id={`delete_user${index}`}
                          title="Delete User"
                          onClick={() => {
                            handleDeleteUser(e.id);
                          }}
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

export default UsersTable;
