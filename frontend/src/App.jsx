import "./App.css";
import Navbar from "./components/Navbar";
import { useState } from "react";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Dashboard";
import AdminRoute from "./components/AdminRoute";
import MatchDetails from "./pages/MatchDetails";
import AdminLogin from "./pages/AdminLogin";
import {ToastContainer} from "react-toastify";
import BetsDashboard from "./pages/BetsDashboard";
import PrivateRoute from "./components/PrivateRoute";


function App() {
	const [cricketData, setCricketData] = useState('');
	
	return (
		<>

			<Navbar/>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
			/>
			<Routes>
				<Route path="/" element={<Home setCricketData={setCricketData}/>}/>
				<Route path="/login" element={<Login/>}/>
				<Route path="/admin/login" element={<AdminLogin/>}/>
				{/* <Route element={<AdminRoute/>}> */}
					<Route path="/admin" element={<AdminDashboard/>}/>
				{/* </Route> */}
				<Route path="/cricket/:exEventId" element={<MatchDetails cricketData={cricketData}/>}/>
				<Route element={<PrivateRoute/>}>
					<Route path="/bets" element={<BetsDashboard/>}/>
				</Route>
			</Routes>
			
		</>
	);
}

export default App;
