
import {Bars} from 'react-loader-spinner' 

const Loader = () => {
  return (
        <Bars
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            speed={7}
        />
  )
}

export default Loader