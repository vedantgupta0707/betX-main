import { Outlet, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import Loader from '../pages/Loader';

const AdminRoute = () => {
  const [is_admin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    
    const fetchAdmin = async () => {
      try {
        const id = localStorage.getItem('id');
        const password = localStorage.getItem('password');
        console.log(id, password)
        const res = await fetch('http://localhost:8000/users/is_admin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'username': id,
            'password': password
          },
          redirect: 'follow'
        });
        if(res.status === 200){
          setIsAdmin(true);
        }
        else{
          navigate('/')
          setIsAdmin(false);
        }

      } catch (err) {
        console.log(err);
      }
    };
    fetchAdmin();
  }, []);

  if (is_admin === false) {
    return <Loader/>;
  }

  return is_admin ? <Outlet/> : <Navigate to='/'/>
}

export default AdminRoute