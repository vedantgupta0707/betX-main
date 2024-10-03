import  { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../state/actions/userSlice';
import { toast } from 'react-toastify';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async() => {

    try{
      dispatch(loginStart());
      const response = await fetch(`http://localhost:8000/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'id': username,
                'password': password
            },
            redirect: 'follow'
        });
        console.log(response)
        if(response.status === 200){
          const data = await response.json();
          console.log(data)
          localStorage.setItem('id', data.id);
          toast.success('Login Successful');
          dispatch(loginSuccess(data));
          navigate('/')
        }
        else{
          dispatch(loginFailure());
          toast.error('Invalid Credentials');
        }

    }
    catch(err){
      dispatch(loginFailure());
      console.log(err)
      toast.error('Something went wrong');
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button
          className=" bg-gray-700 hover:bg-gray-600 text-white w-full py-2 px-4 rounded-md  focus:outline-none focus:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
