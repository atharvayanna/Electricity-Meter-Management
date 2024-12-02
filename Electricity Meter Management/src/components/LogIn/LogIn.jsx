import SideBg from '../../assets/LogIn bg2.svg';
import './LogIn.css'
import { useNavigate } from 'react-router-dom'

const LogIn = () => {
    const navigate = useNavigate();

    const handleLogin = (e)=>{
        e.preventDefault();
        navigate('/user');
    }
  return (
    <div className="login">
        <div className="login__sidebar">
            <div className="login__logo">
                <img width="48" height="48" src="https://img.icons8.com/color/48/energy-isolation.png" alt="energy-isolation"/>
                <span>DigiMeter</span>
            </div>
            <div className="sidebar__img">
                <img src={SideBg} alt="" />
            </div>
        </div>

        <div className="login__form">
            <div className="form">
                <h1>Login</h1>
                <p className='welcome'>Welcome Back</p>
                <form onSubmit={handleLogin}>
                    <label htmlFor="username">Username</label>
                    <input autoFocus type="text" name="" id="username" placeholder='e.g johndoe@gmail.com'/>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="" id="password" placeholder='Password'/>
                    <button type='submit'>Login</button>
                </form>
                <div className="login__newuser">
                    <p className='newuser'>New to DigiMeter? <span>Register New User</span></p>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default LogIn