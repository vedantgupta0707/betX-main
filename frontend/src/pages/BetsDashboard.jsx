import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const BetsDashboard = () => {
  const [bets, setBets] = useState([]);
  const {id, password} = useSelector(state => state.user.currentUser);
  

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const res = await fetch('http://localhost:8000/bets?open_only=true', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            id: id,
            password: password,
          },
        });
        const data = await res.json();
        setBets(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBets();
  }, []);

  return (
    <div className='relative overflow-x-auto'>
      <div className="container mx-auto mt-32 p-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Bets Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bets.map((bet, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300"
            >
              <p className="text-xl font-semibold mb-2 text-gray-700">Bet Type: {bet.bet_type}</p>
              <p className="text-md font-semibold p-1 text-gray-600">Team: {bet.team_name}</p>
              <p className="text-gray-600 p-1">Amount: Rs {bet.amount}</p>
              <p className="text-gray-600 p-1">Rate: {bet.rate}</p>
              <p className="text-green-600 font-bold p-1">Win Amount: Rs {bet.rate * bet.amount}</p>
              <p className="text-gray-600 p-1">Created At: {new Date(bet.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BetsDashboard;
