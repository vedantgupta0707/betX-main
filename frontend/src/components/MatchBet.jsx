import { useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import { useDispatch } from 'react-redux'
import { reduceWalletAmount } from '../state/actions/userSlice'

const MatchBet = ({team1Name, team2Name, matchOdds, eventId, eventName, isTrue, betType}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {wallet_balance, id, password} = useSelector(state => state.user.currentUser) ?? null;
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedOddsType, setSelectedOddsType] = useState(null);
  const [teamName, setTeamName ] = useState('');
  const isMobile = window.innerWidth < 768;

  const handleDecimalClick = (rate, row, oddsType) => {
    setSelectedRate(rate);
    setSelectedRow(row);
    if(row === 0){
      setTeamName(team1Name);
    }
    else{
      setTeamName(team2Name);
    }
    setSelectedOddsType(oddsType);
    setShowDropdown(true);
  };

  const handleBetAmountButtonClick = (amount) => {
    if(wallet_balance < amount){
      toast.error('Insufficient balance');
      return;
    }
    setBetAmount(amount.toString());
  };

  const handlePlaceBet = async() => {
    try{
      console.log(id, password, wallet_balance)
      if(id === null){
        toast.error('Please login to place bet');
        navigate('/login');
        return;
      }
      if(betAmount > wallet_balance){
        toast.error('Insufficient balance');
        return;
      }
      const res = await fetch('http://localhost:8000/bets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'id': id,
          'password': password
        },
        redirect: 'follow',
        body: JSON.stringify({
          event_id: eventId,
          bet_type: selectedOddsType,
          event_name: eventName,
          team_name: teamName,
          rate: selectedRate,
          amount: betAmount,
        }),
      });
      if(res.status === 200){

        const wb = wallet_balance - betAmount;
        dispatch(reduceWalletAmount(wb));
        toast.success('Bet placed successfully');
        navigate('/bets')
      }
      else{
        toast.error('Something went wrong');
      }

    }
    catch(err){
      console.log(err)
    }
    console.log(`Placing bet on ${selectedRate} with amount ${betAmount}`);
    setShowDropdown(false);
    setSelectedRate(null);
    setBetAmount('');
  };

  
    

  return (
    <div className=''>
        <table className={isTrue ? "w-full mt-10 sm:w-5/6 mx-auto text-sm text-left rtl:text-right text-gray-900 dark:text-gray-400": "w-full mt-32 sm:w-5/6 mx-auto text-sm text-left rtl:text-right text-gray-900 dark:text-gray-400"}>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3 text-base">
                  {betType}
                </th>
                <th scope="col" className="hidden sm:table-cell text-base px-6 py-3 text-center">


                  <div className="subcolumns flex justify-evenly">
                    <span className='text-green-500'>Back</span>

                  </div>
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-base text-center">

                  <div className="subcolumns flex justify-evenly">
                    <span className='text-red-400'>Lay</span>
                  </div>
                </th>
                
            </tr>
        </thead>
        <tbody className='w-full'>
        {matchOdds.map((oddsGroup, rowIndex) => (
            <tr key={rowIndex} >
              <td className='px-6 py-3 text-base font-semibold text-gray-600'>
                {rowIndex === 0 ? team1Name : rowIndex === 1 ? team2Name : 'Draw'}
              </td>
              <td className={isMobile ? "text-center": 'px-6 my-2 text-base text-center'}>
                {/* Display back odds */}
                {
                  isMobile ?
                  (<div className='flex'>
                    <div className={`cursor-pointer w-24 p-2 rounded-lg bg-blue-500 ${selectedRate === oddsGroup.price.back[0].price ? 'bg-yellow-400' : ''}`}
                      onClick={() => handleDecimalClick(oddsGroup.price.back[0].price, rowIndex, 'back')}
                    >
                      {oddsGroup.price.back[0].price}
                    </div>
                  </div>):
                  (
                    <div className='flex gap-1'>
                      {oddsGroup.price.back.slice().reverse().map((backOdds, i) => (
                        <div
                          key={i}
                          className={`cursor-pointer w-1/3 p-2 rounded-lg
                          ${
                            selectedRow === rowIndex && selectedOddsType === 'back' && selectedRate === backOdds.price
                            ? 'bg-yellow-300'
                            : i === 0
                            ? 'bg-blue-300' // Replace with the desired color for i=0
                            : i === 1
                            ? 'bg-blue-400' // Replace with the desired color for i=1
                            : i ===2
                            ? 'bg-blue-500'
                            : ``
                          }
                          `}
                          onClick={() => handleDecimalClick(backOdds.price, rowIndex, 'back')}
                        >
                            {backOdds.price}
                        </div>
                      ))}
                      </div>
                  )
                }
                
              </td>
              <td className={isMobile ? "text-center": 'px-6 my-2 text-base text-center'}>
                {/* Display lay odds */}
                {
                  isMobile ?
                  (<div className='flex'>
                    <div className={`cursor-pointer w-24 p-2 rounded-lg bg-red-500 ${selectedRate === oddsGroup.price.lay[0].price ? 'bg-yellow-400' : ''}`}
                      onClick={() => handleDecimalClick(oddsGroup.price.lay[0].price, rowIndex, 'lay')}
                    >
                      {oddsGroup.price.lay[0].price}
                    </div>
                  </div>):
                  (
                    <div className='flex gap-1'> 
                      {oddsGroup.price.lay.map((layOdds, i) => 
                      ( <div key={i} 
                            className={`cursor-pointer w-1/3 p-2  rounded-lg  
                          ${ selectedRow === rowIndex && selectedOddsType === 'lay' && selectedRate === layOdds.price 
                            ? 'bg-yellow-300'
                            : i === 0
                            ? 'bg-red-500' // Replace with the desired color for i=0
                            : i === 1
                            ? 'bg-red-400' // Replace with the desired color for i=1
                            : i ===2
                            ? 'bg-red-300'
                            : ``
                          }`}
                        onClick={() => handleDecimalClick(layOdds.price, rowIndex, 'lay')} > {layOdds.price} 
                        </div> 
                      ))} 
                      </div>
                )}
                
              </td>
            </tr>
          ))}
          
        </tbody>

        </table>
        <div className='flex flex-row w-[50%] mx-auto  justify-center items-center mt-[20px] gap-3'>
        {showDropdown && (
              <div className={`mt-2 flex flex-col gap-1 mx-auto ${selectedOddsType === 'back' ? 'back-odds' : 'lay-odds'}`}>
                <input
                  type='text'
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder='Enter bet amount'
                  className='border px-2 py-1 rounded-md'
                />
                <div className='flex mt-2 justify-center text-center'>
                  {[100, 500, 1000, 5000, 10000].map((amount) => (
                    <button
                      key={amount}
                      className='mr-2 px-2 py-1 bg-gray-300 hover:bg-gray-800 hover:text-white rounded-md'
                      onClick={() => handleBetAmountButtonClick(amount)}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                <div className='flex flex-row gap-3 items-center justify-center '>
                  <button
                  className='mt-2 w-fit px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700'
                  onClick={handlePlaceBet}
                >
                  Place Bet
                </button>
                <button
                  className='mt-2 w-fit px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-800'
                  onClick={() => {setShowDropdown(false); setSelectedRate(null); setBetAmount('')}}
                >
                  cancel
                </button></div>
                
              </div>
            )}
        </div>
        

    </div>
  )
}

export default MatchBet