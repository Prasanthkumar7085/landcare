import React, { useState } from "react";

const ImageComponent = ({ item, currentIndex }: any) => {
  const [imgSrc, setImgSrc] = useState(item?.images[currentIndex]);
  const [isError, setIsError] = useState(false);

  const handleImageError = (e: any) => {
    setImgSrc("/No-Preview-1.jpg");
    setIsError(true);
  };

  const handleLoad = (e: any) => {
    setIsError(false);
  };

  return (
    <img
      className="mapImg"
      src={item?.images[currentIndex]}
      onError={(e) => handleImageError(e)}
      onLoad={(e) => handleLoad(e)}
      alt={`images ${currentIndex + 1}`}
    />
  );
};

export default ImageComponent;
