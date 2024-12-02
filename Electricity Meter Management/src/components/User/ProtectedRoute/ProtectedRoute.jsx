import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = () => {
    const [isAuth, setIsAuth] = useState(true)
    console.log(Outlet)
    return (
        <div>
            {isAuth? <Outlet />:<Navigate to='/'/>}
        </div>
    )
}

export default ProtectedRoute