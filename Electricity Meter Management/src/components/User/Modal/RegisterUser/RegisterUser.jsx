// import styles from './Register.module.css'
import { useState } from "react";
import "./RegisterUser.css";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import url from "../../../../Url";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const RegisterUser = ({ setIsOpen }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState(["", "", "", "", "", "", ""]);
  const [isError, setIsError] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
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
    // setIsError(false)
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
    // setIsError(false)
  };

  const validatePass = () => {
    let newError = [...errors];
    if (pass === "") {
      newError[2] = "This field is Required";
      setIsError(true);
    } else if(pass.length<7){
      newError[2] = 'Min length should be 7'
      setIsError(true)
    }
    setErrors(newError);
  };

  const handlePass = (e) => {
    setPass(e.target.value);
    errors[2] = "";
    setErrors(errors);
    setIsError(false)
  };

  const validateConfirmPass = () => {
    let newErrors = [...errors];
    if (pass !== confirmPass) {
      newErrors[3] = "Password does not match";
      setIsError(true);
    }
    setErrors(newErrors);
  };

  const handleConfirmPass = (e) => {
    setConfirmPass(e.target.value);
    errors[3] = "";
    setErrors(errors);
    // setIsError(false)
  };

  const validateContact = () => {
    let newErrors = [...errors];
    const contactRe = /^[6-9][0-9]{9}$/;
    if (contact.trim() != "" && contactRe.test(contact)) {
      newErrors[4] = "";
    } else if (!contactRe.test(contact) && contact != "") {
      newErrors[4] = "Invalid Number";
      setIsError(true);
    } else {
      newErrors[4] = "This field is required";
      setIsError(true);
    }
    setErrors(newErrors);
  };

  const handleContact = (e) => {
    setContact(e.target.value.trim());
    errors[4] = "";
    setErrors(errors);
    // setIsError(false)
  };

  const validateAddress = () => {
    let newErrors = [...errors];
    if (address.length > 150) {
      newErrors[5] = "Max Length 150 Characters";
      setIsError(true);
    } else if (address === "") {
      newErrors[5] = "This field is required";
      setIsError(true);
    }
    setErrors(newErrors);
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
    errors[5] = "";
    setErrors(errors);
    // setIsError(false)
  };

  const validateCity = () => {
    let newErrors = [...errors];
    const cityRe = /^[A-Z][a-z ]+$/;
    if (city.trim() != "" && cityRe.test(city.trim())) {
      newErrors[6] = "";
    } else if (!cityRe.test(city.trim()) && city.trim() != "") {
      newErrors[6] = "Invalid City Name";
      setIsError(true);
    } else if (city.length > 80) {
      newErrors[6] = "Max Length 80 Characters";
      setIsError(true);
    } else {
      newErrors[6] = "This field is required";
      setIsError(true);
    }
    setErrors(newErrors);
  };

  const handleCity = (e) => {
    setCity(e.target.value.trim());
    errors[6] = "";
    setErrors(errors);
    setIsError(false);
  };

  const registerUser = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${url}/register/user`, {
        name:name, 
        email:email,
        password:pass,
        contact: contact,
        city:city,
        address:address
      });
      setIsLoading(false);
      toast.success('Registration Successful', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });

        setIsOpen(false)
      // console.log(res.data)
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      const msg = error.response.data.message;
      const msgCap = capitalizeFirstLetter(msg)
      toast.error(msgCap, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });


    }
  };

  return (
    <>
      <div className="darkBG" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Sign Up</h5>
          </div>
          <form onSubmit={registerUser}>
            <div className="form__input">
              {/* name  */}
              <div className="personal_info">
                <div className="label">
                  <label htmlFor="name">
                    Name{" "}
                    <span style={{ color: "red", verticalAlign: "super" }}>
                      *
                    </span>
                  </label>
                  <span className="error__input">{errors[0]}</span>
                </div>

                <input
                  autoFocus
                  type="text"
                  name=""
                  id="name"
                  placeholder="Name"
                  onChange={handleName}
                  onBlur={validateName}
                />
              </div>
              {/* email  */}
              <div className="personal_info">
                <div className="label">
                  <label htmlFor="email">
                    Email{" "}
                    <span style={{ color: "red", verticalAlign: "super" }}>
                      *
                    </span>
                  </label>
                  <span className="error__input">{errors[1]}</span>
                </div>

                <input
                  type="email"
                  name=""
                  id="email"
                  placeholder="Email"
                  onChange={handleEmail}
                  onBlur={validateEmail}
                />
              </div>
              {/* password  */}
              <div className="personal_info">
                <div className="label">
                  <label htmlFor="password">
                    Password{" "}
                    <span style={{ color: "red", verticalAlign: "super" }}>
                      *
                    </span>
                  </label>
                  <span className="error__input">{errors[2]}</span>
                </div>

                <input
                autoComplete="off"
                  type="text"
                  id="password"
                  placeholder="Password"
                  onChange={handlePass}
                  onBlur={validatePass}
                />
              </div>
              {/* confirm password  */}
              <div className="personal_info">
                <div className="label">
                  <label htmlFor="confirm_password">
                    {" "}
                    Confirm Password{" "}
                    <span style={{ color: "red", verticalAlign: "super" }}>
                      *
                    </span>
                  </label>
                  <span className="error__input">{errors[3]}</span>
                </div>

                <input
                  type="password"
                  id="confirm_password"
                  placeholder="Confirm Password"
                  onChange={handleConfirmPass}
                  onBlur={validateConfirmPass}
                />
              </div>
              {/* contact  */}
              <div className="personal_info">
                <div className="label">
                  <label htmlFor="contact">
                    {" "}
                    Contact{" "}
                    <span style={{ color: "red", verticalAlign: "super" }}>
                      *
                    </span>
                  </label>
                  <span className="error__input">{errors[4]}</span>
                </div>

                <input
                  type="text"
                  id="contact"
                  placeholder="Contact"
                  onChange={handleContact}
                  onBlur={validateContact}
                />
              </div>
              {/* address  */}
              <div className="personal_info">
                <div className="label">
                  <label htmlFor="address">
                    {" "}
                    Address{" "}
                    <span style={{ color: "red", verticalAlign: "super" }}>
                      *
                    </span>
                  </label>
                  <span className="error__input">{errors[5]}</span>
                </div>

                <input
                  type="text"
                  id="address"
                  placeholder="Address"
                  onChange={handleAddress}
                  onBlur={validateAddress}
                />
              </div>
              {/* city  */}
              <div className="personal_info">
                <div className="label">
                  <label htmlFor="city">
                    {" "}
                    City{" "}
                    <span style={{ color: "red", verticalAlign: "super" }}>
                      *
                    </span>{" "}
                  </label>{" "}
                  <span className="error__input">{errors[6]}</span>
                </div>

                <input
                  type="text"
                  id="city"
                  placeholder="City"
                  onChange={handleCity}
                  onBlur={validateCity}
                />
              </div>
            </div>

            <button type="submit" disabled={isError}>
              {isLoading ? (
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="20"
                  visible={true}
                />
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterUser;
