import './MeterTableUsers.css'

const MeterTableUsers = () => {
  return (
    <div className="meterdata__users">
      <div className="table__functions">
        <div className="meterdata__functions">
          <button>Add User</button>
        </div>
        <div className="search">
          <input type="text" name="" id="" placeholder="Search" />
          <button>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <h3>Meter Readings</h3>
      <div className="meterdata__table">
        <table className="table__user">
          <thead>
            <th>Date</th>
            <th>Consumer No</th>
            <th>Meter No</th>
            <th>Consumption</th>
            <th>Bill Amount</th>
            <th>Payment Status</th>
            <th id="actions__th">Actions</th>
          </thead>
          <tbody>
            <tr>
              <td>19-10-2024</td>
              <td>C123</td>
              <td>M123</td>
              <td>200 units</td>
              <td>990 Rs</td>
              <td>Paid</td>
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
            <td>19-10-2024</td>
              <td>C123</td>
              <td>M123</td>
              <td>200 units</td>
              <td>990 Rs</td>
              <td>Paid</td>
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
            <td>19-10-2024</td>
              <td>C123</td>
              <td>M123</td>
              <td>200 units</td>
              <td>990 Rs</td>
              <td>Paid</td>
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
            <td>19-10-2024</td>
              <td>C123</td>
              <td>M123</td>
              <td>200 units</td>
              <td>990 Rs</td>
              <td>Paid</td>
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

export default MeterTableUsers;
