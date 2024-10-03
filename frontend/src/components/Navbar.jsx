import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import { logout } from "../state/actions/userSlice";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const navItems = [
    { id: 1, label: 'Home', link: '/' },
    { id: 2, label: 'Open-Bets', link: '/bets' },
    { id: 3, label: 'Bet-History', link: '#' },
    { id: 4, label: 'Soccer', link: '#' },
  ];
  

const Navbar = () => {
    const currentUser = useSelector(state => state.user.currentUser)
    const id = currentUser ? currentUser.id : null;
    const location = useLocation().pathname.includes('/login');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        localStorage.clear();
        dispatch(logout());
        navigate('/')
    }

  return (
    <div >
    <nav className=" border-gray-200 bg-gray-900 fixed top-0 w-full z-10">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
            <a  className="flex items-center space-x-3 rtl:space-x-reverse">
                <img src="https://flowbite.com/docs/images/logo.svg"  className="h-8" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">SP EXCHANGE</span>
            </a>
            { id === null ? 
                (   <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        {location === true ?
                        (<></>):
                        (<Link to="/login" className="px-6 py-2 rounded-full text-white bg-green-500 hover:bg-green-600 focus:outline-none">Login</Link>)
                    }
                        
                    </div>
                ) :
                (
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <button onClick={handleLogout} className="px-6 py-2 rounded-full text-white bg-green-500 hover:bg-green-600 focus:outline-none">Logout</button>
                    </div>
                )
            }
        </div>
    </nav>
    <nav className="bg-gray-700 z-10 fixed w-full mt-16"> {/* Added mt-16 for top margin */}
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
            <div className="flex items-center">
                <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                {navItems.map((item) => (
                    <li key={item.id}>
                    <a href={item.link} className="text-white hover:underline">
                        {item.label}
                    </a>
                    </li>
                ))}
                </ul>
            </div>
        </div>
    </nav>
    </div>



  )
}

export default Navbar