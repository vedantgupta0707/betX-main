/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import React from 'react'
import FancyBody from './FancyBody'

const FancyBet = ({betType, fancyData}) => {

    
  return (
    <div>
        <table className="w-full mt-10 sm:w-5/6 mx-auto text-sm text-left rtl:text-right text-gray-900 dark:text-gray-400">
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
            {
                fancyData.map((fancy, index) => (
                    <FancyBody
                        key={index}
                        fancyName={fancy.marketName}
                        fancyId={fancy.marketId}
                        matchOdds={fancy.oddsData.runners}
                        status={fancy.oddsData.status}
                    />
                ))
            }

        </table>
    </div>
  )
}

export default FancyBet