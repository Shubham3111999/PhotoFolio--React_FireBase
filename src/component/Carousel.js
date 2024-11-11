
import React from 'react';
import '../css/Carousel.css';

const Carousel = ({ imageSelected, onClose,setImageSelected ,images}) => {

  const next=()=>{
    let currentIndex=images.indexOf(imageSelected);

    if(currentIndex==images.length-1){
      
      setImageSelected(images.at(0))   //reset to 0 index image
    }else{
      
      setImageSelected(images.at(++currentIndex))
    }

   
  }

  const prev=()=>{
    let currentIndex=images.indexOf(imageSelected);
    setImageSelected(images.at(--currentIndex))  //handle negative value

  }

  return (
    <div className="overlay">

      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>✕</button>
        <img src={imageSelected.url} alt={imageSelected.title} className="overlay-image" />

        <div className="overlay-controls">
          <button className="prev-button" onClick={prev}>‹</button>
          <button className="next-button" onClick={next}>›</button>
        </div>
      </div>

    </div>
  );
};

export default Carousel;
