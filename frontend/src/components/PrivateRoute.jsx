import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../pages/Loader'

const PrivateRoute = () => {
  const {id} = useSelector((state) => state.user.currentUser) ?? null;


  if (id === null) {
    return <Loader/>
  }
  return id ? <Outlet/> : <Navigate to='/login'/>
}

export default PrivateRoute