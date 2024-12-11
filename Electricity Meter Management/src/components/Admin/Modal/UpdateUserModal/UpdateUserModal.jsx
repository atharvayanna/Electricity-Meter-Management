import { useEffect, useState } from "react";
import "./UpdateUserModal.css";
import axios from "axios";
import url from "../../../../Url";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateUserModal = ({ props }) => {
  const token = useSelector((state) => state.accessToken);
  const parts = token.split(".");
  const payload = JSON.parse(atob(parts[1]));
  const userRole = payload.role_id;
  const { newUser, user, setIsOpen, fetchData, setUpdateUserStatus } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consumerNo, setConsumerNo] = useState("");
  const [contact, setContact] = useState();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState();
  const [errors, setErrors] = useState([" ", " ", " "]);
  const [isError, setIsError] = useState(true);
  let prevRole = 3;

  async function updateUser() {
    try {
      const res = await axios.put(
        `${url}/user/${user.id}`,
        {
          name: name,
          email: email,
          contact: contact,
          city: city,
          address: address,
        },
        {
          headers: {
            Authorization: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      setIsOpen(false);
      fetchData();
      setUpdateUserStatus([user, res.data.message]);
    } catch (error) {
      console.log(error.response);
    }
  }

  async function addUser() {
    try {
      const res = await axios.post(
        `${url}/user/create`,
        {
          name: name,
          email: email,
          contact: contact,
          city: city,
          address: address,
        },
        {
          headers: {
            Authorization: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      setIsOpen(false);
      fetchData();
      console.log(res.data);
      // setUpdateUserStatus([user,res.data.message])
    } catch (error) {
      console.log(error.response);
    }
  }

  async function changeRole() {
    try {
      const res = await axios.patch(
        `${url}/user/changeRole/${consumerNo}`,
        {
          role_id: parseInt(role),
        },
        {
          headers: {
            Authorization: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const validateName = () => {
    let newErrors = [...errors];
    const nameRe = /^[a-zA-Z ]+$/;
    if (name.trim() != "" && nameRe.test(name.trim())) {
      newErrors[0] = "";
    } else if (!nameRe.test(name.trim()) && name.trim() != "") {
      newErrors[0] = "Invalid Name";
      setIsError(true);
    } else if (name.length > 80) {
      newErrors[0] = "Max Length 100 Characters";
    } else {
      newErrors[0] = "This field is required";
      setIsError(true);
    }

    setErrors(newErrors);
  };

  const handleName = (e) => {
    setName(e.target.value);
    errors[0] = "";
    setErrors(errors);
    setIsError(false);
  };

  const validateEmail = () => {
    let newError = [...errors];
    const emailRe = /^[a-zA-z0-9._-]+@[a-zA-z]+\.[a-zA-z]{2,}\.?[a-z]{0,3}$/;
    if (email.trim() != "" && emailRe.test(email.trim())) {
      newError[1] = "";
    } else if (!emailRe.test(email.trim()) && email.trim() != "") {
      newError[1] = "Invalid Email";
      setIsError(true);
    } else {
      newError[1] = "This field is required";
      setIsError(true);
    }
    setErrors(newError);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    errors[1] = "";
    setErrors(errors);
    setIsError(false);
  };

  const validateConsumption = () => {
    let newErrors = [...errors];
    if (consumerNo.trim() === "") {
      newErrors[5] = "This field is required";
    }
  };

  const handleConsumerNo = (e) => {
    setConsumerNo(e.target.value);
    errors[5] = "";
    setErrors(errors);
  };

  const validateContact = () => {
    let newErrors = [...errors];
    const contactRe = /^[6-9][0-9]{9}$/;
    if (contact.toString() != "" && contactRe.test(contact)) {
      newErrors[2] = "";
    } else if (!contactRe.test(contact) && contact != "") {
      newErrors[2] = "Invalid Number";
      setIsError(true);
    } else {
      newErrors[2] = "This field is required";
      setIsError(true);
    }
    setErrors(newErrors);
  };

  const handleContact = (e) => {
    setContact(e.target.value);
    errors[2] = "";
    setErrors(errors);
    setIsError(false);
  };

  const validateAddress = () => {
    let newErrors = [...errors];
    if (address.length > 150) {
      newErrors[3] = "Max Length 150 Characters";
      setIsError(true);
    } else if (address === "") {
      newErrors[3] = "This field is required";
      setIsError(true);
    }
    setErrors(newErrors);
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
    errors[3] = "";
    setErrors(errors);
  };

  const validateCity = () => {
    let newErrors = [...errors];
    // const cityRe = /^[A-Z][a-z ]+$/;
    // if (city.trim() != "" && cityRe.test(city.trim())) {
    //   newErrors[4] = "";
    // } else if (!cityRe.test(city.trim()) && city.trim() != "") {
    //   newErrors[4] = "Invalid City Name";
    //   setIsError(true);
    // } else
    if (city.length > 80) {
      newErrors[4] = "Max Length 80 Characters";
      setIsError(true);
    } else if (city.trim() === "") {
      newErrors[4] = "This field is required";
      setIsError(true);
    }
    setErrors(newErrors);
  };

  const handleCity = (e) => {
    setCity(e.target.value);
    errors[4] = "";
    setErrors(errors);
    setIsError(false);
  };

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const handleUser = () => {
    if (newUser) {
      addUser();
    } else {
      updateUser();
      if (prevRole !== role) changeRole();
    }
  };

  useEffect(() => {
    if (!newUser) {
      console.log(user.role_id);
      setConsumerNo(user.id);
      setName(user.name);
      setEmail(user.email);
      setContact(user.contact);
      setAddress(user.address);
      setCity(user.city);
      setRole(user.role_id);
      prevRole = user.role_id;
    }
  }, []);

  return (
    <>
      <div className="darkBG" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">
              {props.newUser ? "Add New User" : "Update Existing User"}
            </h5>
          </div>

          <div className="update__user">
            <div className="user__ids">
              <div className="user__consumer__no">
                <label htmlFor="consumer_no">Consumer No:</label>
                <input
                  type="text"
                  name=""
                  id="consumer_no"
                  placeholder="C001"
                  value={consumerNo}
                  readOnly={!newUser}
                  onChange={handleConsumerNo}
                  disabled
                />
              </div>

              <div className="user__name">
                <div className="user__label">
                  <label htmlFor="name">Name:</label>
                  <span style={{ color: "red" }}>{errors[0]}</span>
                </div>

                <input
                  type="text"
                  id="name"
                  autoFocus
                  placeholder="John Doe"
                  value={name}
                  onChange={handleName}
                  onBlur={validateName}
                />
              </div>
            </div>

            <div className="user__ids">
              <div className="user__email">
                <div className="user__label">
                  <label htmlFor="email">Email: </label>
                  <span style={{ color: "red" }}>{errors[1]}</span>
                </div>

                <input
                  type="text"
                  id="email"
                  placeholder="eg. johndoe@gmail.com"
                  value={email}
                  onChange={handleEmail}
                  onBlur={validateEmail}
                />
              </div>
              <div className="user__contact">
                <div className="user__label">
                  <label htmlFor="contact">Contact:</label>
                  <span style={{ color: "red" }}>{errors[2]}</span>
                </div>

                <input
                  type="number"
                  id="contact"
                  placeholder="9899999999"
                  value={contact}
                  onChange={handleContact}
                  onBlur={validateContact}
                />
              </div>
            </div>

            <div className="user__ids">
              <div className="user__address">
                <div className="user__label">
                  <label htmlFor="address">Address:</label>
                  <span style={{ color: "red" }}>{errors[3]}</span>
                </div>

                <textarea
                  name=""
                  id="address"
                  rows={2}
                  value={address}
                  onChange={handleAddress}
                  onBlur={validateAddress}
                ></textarea>
              </div>
              <div className="user__city">
                <div className="user_city">
                  <div className="user__label">
                    <label htmlFor="city">City:</label>
                    <span style={{ color: "red" }}>{errors[4]}</span>
                  </div>

                  <input
                    type="text"
                    name=""
                    id="city"
                    placeholder="Pune"
                    value={city}
                    onChange={handleCity}
                    onBlur={validateCity}
                  />
                </div>
                <div className="user_role">
                  <label htmlFor="role">Role:</label>
                  <select
                    name=""
                    id="role"
                    value={role}
                    disabled={parseInt(userRole) !== 1}
                    onChange={handleRole}
                    
                  >
                    <option value={3}>User</option>
                    <option value={2}>Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <button onClick={handleUser} disabled={isError}>
              {newUser ? "Add User" : "Update User"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateUserModal;
