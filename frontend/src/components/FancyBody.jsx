/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reduceWalletAmount } from '../state/actions/userSlice';
import './FancyBody.css'


const FancyBody = ({matchOdds, fancyName, marketId, status}) => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const {wallet_balance, id, password} = useSelector(state => state.user.currentUser) | null;
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedOddsType, setSelectedOddsType] = useState(null);
  const isMobile = window.innerWidth < 768;
  const handleDecimalClick = (rate, row, oddsType) => {
    setSelectedRate(rate);
    setSelectedRow(row);
    setSelectedOddsType(oddsType);
    setShowDropdown(true);
  };

  const handleBetAmountButtonClick = (amount) => {
    if(wallet_balance < betAmount){
      toast.error('Insufficient balance');
      return;
    }
    setBetAmount(amount.toString());
  };

  const handlePlaceBet = async() => {
    try{
      if(!id){
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
          event_id: marketId,
          bet_type: selectedOddsType,
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
    <>
        <tbody className='w-full '>
            {matchOdds.map((oddsGroup, rowIndex) => (
                <React.Fragment key={rowIndex}>
                {status === 'SUSPENDED' && (
                   
                        <tr className='flex items-center justify-center'>
                            <td colSpan={3} className="text-center text-red-500 font-semibold">
                            suspended
                            </td>
                        </tr>
                )}
                <tr key={rowIndex} className={status === 'SUSPENDED' ? 'suspended-row' : ''}>
                <td className='px-6 py-3 text-base font-semibold text-gray-600'>
                    {fancyName}
                </td>
                <td className={isMobile ? "text-center": 'px-6 my-2 text-base text-center'}>
                    {
                    isMobile ?
                    (<div className='flex'>
                        <div className={`cursor-pointer w-24 p-2 rounded-lg bg-blue-500 font-bold ${selectedRate === oddsGroup.price.back[0].price ? 'bg-yellow-400' : ''}`}
                        onClick={() => handleDecimalClick(oddsGroup.price.back[0].price, rowIndex, 'back')}
                        >
                        {oddsGroup.price.back[0].price}
                        <p className='font-normal text-sm'>{oddsGroup.price.back[0].size}</p>
                        </div>
                    </div>):
                    (
                        <div className='flex gap-1'>
                        {oddsGroup.price.back.slice().reverse().map((backOdds, i) => (
                            <div
                            key={i}
                            className={`cursor-pointer w-1/3 p-2 rounded-lg font-bold
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
                             <p className='text-sm font-normal'>{backOdds.size}</p>
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
                        <div className={`cursor-pointer w-24 p-2 rounded-lg bg-red-500 font-bold ${selectedRate === oddsGroup.price.lay[0].price ? 'bg-yellow-400' : ''}`}
                        onClick={() => handleDecimalClick(oddsGroup.price.lay[0].price, rowIndex, 'lay')}
                        >
                        {oddsGroup.price.lay[0].price}
                        <p className='font-normal text-sm'>{oddsGroup.price.lay[0].size}</p>
                        </div>
                    </div>):
                    (
                        <div className='flex gap-1'> 
                        {oddsGroup.price.lay.map((layOdds, i) => 
                        ( <div key={i} 
                                className={`cursor-pointer w-1/3 p-1  rounded-lg font-bold
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
                             <p className='text-sm font-normal'>{layOdds.size}</p>
                            </div> 
                        ))} 
                        </div>
                    )}
                    
                </td>
                </tr>

            </React.Fragment>
                        
            ))}
          
        </tbody>
    </>
  )
}

export default FancyBody