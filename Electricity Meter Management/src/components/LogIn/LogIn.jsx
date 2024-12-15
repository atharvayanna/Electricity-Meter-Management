import SideBg from "../../assets/LogIn bg2.svg";
import "./LogIn.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserType, setAccessToken, setUser,} from "../../redux/appSlice";
import { ToastContainer,} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import RegisterUser from "../User/Modal/RegisterUser/RegisterUser";
import { loginUser, getUserProfile } from "../../redux/slices/loginSlice";
import { showToast } from "../../utils/toast";

const LogIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState(["", ""]);
  const [isloading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loginDisable, setLoginDisable] = useState(true);

  const usernameValidation = () => {
    let newError = [...errors];
    const emailRe = /^[a-zA-z0-9._-]+@[a-zA-z]+\.[a-zA-z]{2,}\.?[a-z]{0,3}$/;
    if (username.trim() != "" && emailRe.test(username.trim())) {
      newError[0] = "";
      setLoginDisable(false)
    } else if (!emailRe.test(username.trim()) && username.trim() != "") {
      newError[0] = "Invalid Email";
      setLoginDisable(true)
    } else {
      newError[0] = "This field is required";
      setLoginDisable(true)
    }
    setErrors(newError);
  };

  const passValidation = () => {
    let newError = [...errors];
    if (pass === "") {
      newError[1] = "This Field is required";
      setLoginDisable(true)
    } else {
      newError[1] = "";
    }
    setErrors(newError);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value.trim());
    errors[0] = "";
    setErrors(errors);
    if(errors[1]==='' && errors[0]==='') setLoginDisable(false)
  };

  const handlePass = (e) => {
    setPass(e.target.value);
    errors[1] = "";
    setErrors(errors);
    if(errors[0]==='') setLoginDisable(false)
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === "") {
      usernameValidation();
      return;
    } else if (pass === "") {
      passValidation();
      return;
    }

    setIsLoading(true);
    const credentials = { email: username, password: pass };
    const action = await dispatch(loginUser(credentials));

    if (loginUser.fulfilled.match(action)) {      
      const { token } = action.payload;
      const parts = token.split(".");
      const {user_id, role_id}= JSON.parse(atob(parts[1]));
      dispatch(setAccessToken({ accessToken: token }));

      const actionUserProfile = await dispatch(getUserProfile(user_id));
      if(getUserProfile.fulfilled.match(actionUserProfile)){
        dispatch(setUser({ userDetails: actionUserProfile.payload.userDetails }))
      }

      if (role_id === 3) {
        dispatch(setUserType({ userType: "user" }));
        navigate("/user", { state: { Msg: "Login Successful" } });
      } else if (role_id === 1 || role_id === 2) {
        dispatch(setUserType({ userType: "admin" }));
        navigate("/admin", { state: { Msg: "Login Successful" } });
      }
    } else{
      const errorMessage = action.payload.message || "Login failed";
      showToast(errorMessage, 'error')
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    errors[0] = ''
    setErrors(errors);
  };

  useEffect(() => {
    dispatch(setAccessToken({ accessToken: "" }));
    dispatch(setUserType({ userType: "" }));
    dispatch(setUser({userDetails:{}}));
    localStorage.setItem("loginToastShown", false);
  }, []);

  return (
    <div className="login">
      {isOpen && <RegisterUser setIsOpen={setIsOpen} />}
      <ToastContainer />
      <div className="login__sidebar">
        <div className="login__logo">
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/color/48/energy-isolation.png"
            alt="energy-isolation"
          />
          <span>DigiMeter</span>
        </div>
        <div className="sidebar__img">
          <img src={SideBg} alt="" />
        </div>
      </div>

      <div className="login__form">
        <div className="form">
          <h1>Login</h1>
          <p className="welcome">Welcome Back</p>
          <form onSubmit={handleLogin}>
            <div className="title">
              <label htmlFor="username">Email <span style={{color:'red', verticalAlign:'super'}}>*</span> </label>
              <span>{errors[0]}</span>
            </div>
            <input
              autoFocus
              type="text"
              name=""
              id="username"
              placeholder="e.g johndoe@gmail.com"
              value={username}
              onChange={handleUsername}
              onBlur={usernameValidation}
            />
            <div className="title">
              <label htmlFor="password">Password <span style={{color:'red', verticalAlign:'super'}}>*</span> </label>
              <span>{errors[1]}</span>
            </div>
            <input
              type="password"
              name=""
              id="password"
              placeholder="Password"
              value={pass}
              onChange={handlePass}
              onBlur={passValidation}
            />
            <button type="submit" disabled={loginDisable}>
              {isloading ? (
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="20"
                  visible={true}
                />
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="login__newuser">
            <p className="newuser">
              New to DigiMeter?{" "}
              <span onClick={openModal}>Register New User</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
