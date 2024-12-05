
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserRoute = () => {
    const userType = useSelector(state=>state.userType)
    return (
        <div>
            {userType==='user'? <Outlet />:<Navigate to='/'/>}
        </div>
    )
}

export default UserRoute