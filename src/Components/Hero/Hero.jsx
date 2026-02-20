import React, { useState, useEffect } from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'
import banner_mens from '../Assets/banner_mens.png'
import banner_women from '../Assets/banner_women.png'
import banner_kids from '../Assets/banner_kids.png'
import exclusive_image from '../Assets/exclusive_image.png'

const Hero = () => {
  // Array of background images to rotate
  const backgroundImages = [
    hero_image,
    banner_mens,
    banner_women,
    banner_kids,
    exclusive_image
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [backgroundImages.length]);

  const handleLatestCollection = () => {
    // Scroll to new collections section
    const newCollectionsSection = document.querySelector('.new-collections');
    if (newCollectionsSection) {
      newCollectionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className="hero-hand-icon">
            <p>new</p>
            <img src={hand_icon} alt="" />
          </div>
          <p>collections</p>
          <p>for everyone</p>
        </div>
        <div className="hero-latest-btn" onClick={handleLatestCollection} style={{ cursor: 'pointer' }}>
          <div>Latest Collection</div>
          <img src={arrow_icon} alt="" />
        </div>

        {/* Image rotation indicators */}
        <div className="hero-indicators">
          {backgroundImages.map((_, index) => (
            <span
              key={index}
              className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
      <div className="hero-right">
        <img
          src={backgroundImages[currentImageIndex]}
          alt="Hero"
          className="hero-rotating-image"
        />
      </div>
    </div>
  )
}

export default Hero
