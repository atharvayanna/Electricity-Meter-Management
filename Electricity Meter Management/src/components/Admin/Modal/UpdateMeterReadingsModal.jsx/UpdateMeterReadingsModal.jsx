import axios from "axios";
import "./UpdateMeterReadingsModal.css";
import { useEffect, useState } from "react";
import url from "../../../../Url";
import { useSelector } from "react-redux";

const UpdateMeterReadingsModal = ({ props }) => {
  const token = useSelector((state) => state.accessToken);
  const { setIsOpen, reading, newRecord, newUserRecord, fetchData } = props;
  const [userId, setUserID] = useState("");
  const [meterNo, setMeterNo] = useState("");
  const [date, setDate] = useState("");
  const [consumption, setConsumption] = useState("");
  const [billAmount, setBillAmount] = useState();
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errors, setErrors] = useState(["", ""]);
  const [isError, setIsError] = useState(true);
  const currDate = new Date();

  async function addRecord() {
    try {
      const res = await axios.post(
        `${url}/meterRecord/createMeterRecord`,
        {
          user_id: userId,
          meter_number: meterNo,
          reading_date: date.split("T")[0],
          reading_value: consumption,
          is_paid: paymentStatus === "Paid" ? "yes" : "No",
        },
        {
          headers: {
            Authorization: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      console.log("Meter record added:", res.data);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateRecord() {
    try {
      console.log(reading.reading_id);
      const res = await axios.put(
        `${url}/meterRecord/${reading.reading_id}`,
        {
          reading_value: consumption,
          reading_date: date.split("T")[0],
          billing_amount: billAmount,
          is_paid: paymentStatus === "Paid" ? "yes" : "No",
        },
        {
          headers: {
            Authorization: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      fetchData();
      setIsOpen(false);
    } catch (error) {
      console.log(error.response);
    }
  }

  const handleUpdateReading = () => {
    if (newRecord) {
      addRecord();
    } else {
      updateRecord();
    }
  };

  const validateUserId = () => {
    let newErrors = [...errors];
    if (userId.toString() === "") {
      newErrors[0] = "This field is required"; 
      setIsError(true);
    } else {
      newErrors[0] = "";
    }
    setErrors(newErrors);
  };

  const handleUserId = (e) => {
    setUserID(e.target.value.trim());
    errors[0] = "";
    setErrors(errors);
    setIsError(false);
  };

  const validateMeterNo = () => {
    let newErrors = [...errors];
    const meterNoRe = /^M[0-9]{13}$/;
    if (meterNo.toString() != "" && meterNoRe.test(meterNo)) {
      newErrors[1] = "";
    } else if (!meterNoRe.test(meterNo) && meterNo != "") {
      newErrors[1] = "Invalid Number";
      setIsError(true);
    } else {
      newErrors[1] = "This field is required";
      setIsError(true);
    }
    setErrors(newErrors);
  };

  const handleMeterNo = (e) => {
    setMeterNo(e.target.value.trim());
    errors[1] = "";
    setErrors(errors);
    setIsError(false);
  };

  const validateDate = () => {
    let newError = [...errors];
    if (date == "") {
      newError[2] = "This field is required";
      setIsError(true);
    } else {
      newError[2] = '';
      setIsError(false)
    }
    setErrors(newError);
  };

  const handleDate = (e) => {
    setDate(e.target.value);
    setIsError(false);
    errors[2] = "";
    setErrors(errors);
  };

  const validateConsumption = () => {
    let newErrors = [...errors];
    const consumpRe = /^[0-9]$/;
    if (consumption === "") {
      newErrors[3] = "This field is required";
      setIsError(true);
    }

    setErrors(newErrors);
  };

  const handleConsumption = (e) => {
    setConsumption(e.target.value);
    setBillAmount(e.target.value * 5);
    errors[3] = "";
    setIsError(false);
    setErrors(errors);
  };
  const handleBillAmount = (e) => setBillAmount(e.target.value);
  const handlePaymentStatus = (e) => setPaymentStatus(e.target.value);

  useEffect(() => {
    if (!newRecord) {
      const datestr = new Date(reading.reading_date);
      setUserID(reading.user_id);
      setMeterNo(reading.meter_number);
      setDate(datestr.toISOString().split("T")[0]);
      setConsumption(reading.reading_value);
      setBillAmount(reading.billing_amount);
      setPaymentStatus(reading.paymentStatus);
    }

    if (!newUserRecord) {
      setUserID(reading.user_id);
      setMeterNo(reading.meter_number);
    }
  }, []);

  return (
    <>
      <div className="darkBG" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">
              {newRecord ? "Add Meter Record" : "Update Meter Record"}
            </h5>
          </div>
          <div className="meter__record">
            <div className="user__details">
              <div className="consumer_no">
                <div className="user__label">
                  <label htmlFor="user_id">Consumer No:</label>
                  <span style={{ color: "red", fontSize: '0.8rem' }}>{errors[0]}</span>
                </div>

                <input
                  type="text"
                  value={userId}
                  autoFocus
                  onChange={handleUserId}
                  onBlur={validateUserId}
                  placeholder="Consumer No"
                  disabled={!newRecord}
                />
              </div>
              <div className="meter_no">
                <div className="user__label">
                  <label htmlFor="meter_no">Meter No:</label>
                  <span style={{ color: "red", fontSize: '0.8rem' }}>{errors[1]}</span>
                </div>
                <input
                  type="text"
                  id="meter_no"
                  placeholder="Meter Number"
                  value={meterNo}
                  onChange={handleMeterNo}
                  onBlur={validateMeterNo}
                  disabled={!newRecord}
                />
              </div>
            </div>
            <div className="user__details">
              <div className="reading__date">
                <div className="user__label">
                  <label htmlFor="date">Date:</label>
                  <span style={{ color: "red", fontSize: '0.8rem' }}>{errors[2]}</span>
                </div>

                <input
                  type="date"
                  max={currDate.toISOString().split("T")[0]}
                  placeholder="Date"
                  value={date}
                  onChange={handleDate}
                  onBlur={validateDate}
                />
              </div>
              <div className="date__consumption">
                <div className="user__label">
                  <label htmlFor="consumption">Consumption (units):</label>
                  <span style={{ color: "red", fontSize: '0.8rem' }}>{errors[3]}</span>
                </div>

                <input
                  type="text"
                  name="consumption"
                  id="consumption"
                  placeholder="Consumption"
                  value={consumption}
                  onChange={handleConsumption}
                  onBlur={validateConsumption}
                />
              </div>
            </div>
            <div className="user__details">
              <div className="bill_amount">
                <label htmlFor="bill">Bill Amount (Rs):</label>
                <input
                  type="number"
                  placeholder="Bill Amount"
                  min={150}
                  max={100000}
                  value={billAmount}
                  onChange={handleBillAmount}
                  disabled
                />
              </div>
              <div className="payment_status">
                <label htmlFor="status">Payment Status:</label>
                <select
                  name="status"
                  id="status"
                  value={paymentStatus}
                  onChange={handlePaymentStatus}
                  disabled={!newUserRecord}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
            <button onClick={handleUpdateReading} disabled={isError}>
              {newRecord ? "Add Meter Record" : "Update Record"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateMeterReadingsModal;
