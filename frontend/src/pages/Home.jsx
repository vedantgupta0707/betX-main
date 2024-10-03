/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import MatchCard from '../components/Matchcard';
import ImageSlider from '../components/ImageSlider';
import image3 from '../assets/image3.jpeg'
import image4 from '../assets/image4.jpeg'
import Loader from './Loader';

const images = [image3, image4]

const Home = ({setCricketData}) => {
  const [data, setData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [loading, setLoader] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      const response = await fetch('http://localhost:8000/cricket');
      const data = await response.json();
      if(response.status === 200){
        setData(data);
        setLoader(false);
        setDataLoaded(true);
      }else{
        setLoader(false);
      }
    };
    // const intervalId = setInterval(() => {
    //   fetchData();
    // },
    // 5000);
    // return () => clearInterval(intervalId);
    fetchData();
  }, []);

  if(loading ){
    return(
      <div className='flex items-center h-[100vh] w-[100vw] justify-center'>
        <Loader />
      </div>
    )
  }

  return (
    
<>
<div className="relative overflow-x-auto">
    <ImageSlider images={images}/>
    <table className="w-full sm:w-5/6 mx-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3 text-base">
                  Match Names
                </th>
                <th scope="col" className="hidden sm:table-cell text-base px-6 py-3 text-center">

                  <span>Team 1</span>
                  <div className="subcolumns flex justify-evenly">
                    <span className='text-green-500'>Back</span>
                    <span className='text-red-400'>Lay</span>
                  </div>
                </th>
                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-base text-center">
                  <span>Team 2</span>
                  <div className="subcolumns flex justify-evenly">
                    <span className='text-green-500'>Back</span>
                    <span className='text-red-400'>Lay</span>
                  </div>
                </th>
                
            </tr>
        </thead>
        <tbody className='w-full'>
        {data.map((match, index) => (
            <MatchCard
            key={index}
            eventName={match.eventName}
            eventTime={match.eventTime}
            inPlay={match.oddsData.inPlay}
            team1={match.oddsData.runners[0].price}
            team2={match.oddsData.runners[1].price}
            exEventId= {match.exEventId}
            setCricketData={setCricketData}
            />
        ))}
        </tbody>

    </table>
</div>
</>
  );
};

export default Home;
