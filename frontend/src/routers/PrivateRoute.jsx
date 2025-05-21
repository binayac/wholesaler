import { useSelector } from "react-redux"
import { Navigate, replace, useLocation } from "react-router-dom"
import { toast } from "react-toastify";

const PrivateRoute = ({children, role}) => {
    const {user} = useSelector((state) => state.auth)
    const location = useLocation()
    if(!user) {
        toast.info('You must be logged in!')
        return <Navigate to = "/login" state = {{from:location}} replace />
    }
    if(role && user.role !== role){
        toast.info('Access Denied')
        return <Navigate to = "/login" state = {{from:location}} replace />
    }
  return children
}

export default PrivateRoute