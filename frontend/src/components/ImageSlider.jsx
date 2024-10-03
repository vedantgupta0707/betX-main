/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const ImageSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const goToNextSlide = () => {
    const index = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    const intervalId = setInterval(goToNextSlide, 4000);
    return () => clearInterval(intervalId);
  }, [currentImageIndex]);

  return (
    <div className="relative w-full sm:w-5/6 mx-auto mt-28">
      <img
        src={images[currentImageIndex]}
        alt={`Slide ${currentImageIndex + 1}`}
        className="object-fill sm:object-cover w-full h-72 mx-auto transition-opacity duration-1000"
      />
    </div>
  );
};

export default ImageSlider;
