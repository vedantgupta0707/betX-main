/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MatchBet from '../components/MatchBet';
import Loader from './Loader'
import FancyBet from '../components/FancyBet';


const matchDetails = () => {

    const [matchData, setMatchData] = useState({})
    const [loading, setLoading] = useState(true); 
    const location = useLocation();
    const event_id = location.pathname.split('/')[2]
    
    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try{
            const response = await fetch(`http://localhost:8000/cricket/${event_id}`);
            if(response.status === 200){
              const data = await response.json();
              setMatchData(data);
              setLoading(false);
            }
            else{
              console.log('error')
              setLoading(false);
            }
          }
          catch(err){
            console.log(err)
            setLoading(false);
          }
        };
        fetchData();
    }, []);

    if(loading){
      return(
        <div className='flex items-center h-[100vh] w-[100vw] justify-center'>
          <Loader />
        </div>
      )
    }

  return (
    <>
      <div className='relative overflow-x-auto'>
        <MatchBet 
          betType={"MATCH ODDS"}
          team1Name={matchData.event_details.eventName.split(' v ')[0]}
          team2Name={matchData.event_details.eventName.split(' v ')[1]}
          matchOdds={matchData.matchOddsData[0].oddsData.runners}
          eventId={matchData.matchOddsData[0].exEventId}
          eventName={matchData.matchOddsData[0].eventName}
          isTrue={false}
          isFancy={false}
        />
        <MatchBet
          betType={"BOOK MAKER"}
          team1Name={matchData.event_details.eventName.split(' v ')[0]}
          team2Name={matchData.event_details.eventName.split(' v ')[1]}
          matchOdds={matchData.bookmakersData[0].oddsData.runners}
          eventId={matchData.bookmakersData[0].exEventId}
          eventName={matchData.bookmakersData[0].eventName}
          isTrue={true}
          isFancy={false}
        />
        <FancyBet
          betType={"FANCY"}
          fancyData={matchData.fancyData}
        />
      </div>
    </>
  )
}

export default matchDetails