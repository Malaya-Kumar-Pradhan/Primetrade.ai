import Cookies from 'js-cookie'
import {Navigate,Outlet} from 'react-router-dom'

const ProtectedRoute = (...props) =>{
    const token = Cookies.get('jwt_token')
    if(token===undefined){
        return <Navigate to='/login' replace/>
    }
    return <Outlet/>
}

export default ProtectedRoute
