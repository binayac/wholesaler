import { useSelector } from "react-redux"
import { Navigate, replace, useLocation } from "react-router-dom"

const PrivateRoute = ({children, role}) => {
    const {user} = useSelector((state) => state.auth)
    const location = useLocation()
    if(!user) {
        alert('You must be logged in!')
        return <Navigate to = "/login" state = {{from:location}} replace />
    }
    if(role && user.role !== role){
        alert('Access Denied')
        return <Navigate to = "/login" state = {{from:location}} replace />
    }
  return children
}

export default PrivateRoute