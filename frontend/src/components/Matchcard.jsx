/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const MatchCard = ({ eventName, inPlay, team1, team2, exEventId, setCricketData, eventTime }) => {

  const handleEventClick = () => {
    setCricketData({eventName, inPlay, team1, team2, exEventId})
  }
    const renderPrice = (priceObj) => (
      <span className="font-bold mx-5 text-center">{priceObj.price}</span>
    );
  
    return (
        <>
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th
            scope="row"
            className="px-6 py-4 font-extrabold text-sm cursor-pointer text-blue-600 whitespace-nowrap dark:text-white"
          >
            <Link to={`/cricket/${exEventId}`} onClick={handleEventClick}>
              {eventName} <span className='mx-5 text-xs text-green-500'>{inPlay ? 'Inplay': ''}</span>
              <p className="text-gray-400 font-semibold text-xs">{new Date(eventTime).toLocaleString()}</p>
            </Link>
          </th>
          <td className="hidden sm:table-cell px-6 py-4 text-center">
          <div className="flex justify-evenly items-center">
            <div className="bg-blue-300 w-20">
                {renderPrice(team1.back[0], team1)}
            </div>
            <div className="bg-red-300 w-20">
                {renderPrice(team1.lay[1], team1)}
            </div>
            </div>
          </td>
          <td className="hidden sm:table-cell px-6 py-4 text-center">
            <div className="flex justify-evenly items-center">
            <div className="bg-blue-300 w-20">
                {renderPrice(team2.back[0], team1)}
            </div>
            <div className="bg-red-300 w-20">
                {renderPrice(team2.lay[1], team1)}
            </div>
            </div>
          </td>
        </tr>
      </>
    );
  };

  

export default MatchCard