import './App.css'
import { Routes,Route } from 'react-router-dom'
import LogIn from './components/LogIn/LogIn'
// import UserDashboard from './components/User/Dashboard/UserDashboard'
import User from './components/User/User'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/'element={<LogIn/>} />
        <Route path='/user' element={<User/>}>
          {/* <Route path='dashboard' element={<UserDashboard/>}/> */}
        </Route>
      </Routes>
      <div></div>
    </>
  )
}

export default App
