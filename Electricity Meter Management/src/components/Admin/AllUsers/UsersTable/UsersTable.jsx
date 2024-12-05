import "./UsersTable.css";

const UsersTable = () => {
  return (
    <div className="table__users">
      <div className="table__functions">
        <div className="allusers__functions">
            <button>Add User</button>
        </div>
        <div className="search">
            <input type="text" name="" id="" placeholder="Search"/>
            <button><i className="fa-solid fa-magnifying-glass"></i></button>
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
          <tbody>
            <tr>
              <td>C1234</td>
              <td>John Doe</td>
              <td>johndoe@gmail.com</td>
              <td>9123888888</td>
              <td>Pune</td>
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
            <tr>
              <td>C1234</td>
              <td>John Doe</td>
              <td>johndoe@gmail.com</td>
              <td>9123888888</td>
              <td>Pune</td>
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
            <tr>
              <td>C1234</td>
              <td>John Doe</td>
              <td>johndoe@gmail.com</td>
              <td>9123888888</td>
              <td>Pune</td>
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
            <tr>
              <td>C1234</td>
              <td>John Doe</td>
              <td>johndoe@gmail.com</td>
              <td>9123888888</td>
              <td>Pune</td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
