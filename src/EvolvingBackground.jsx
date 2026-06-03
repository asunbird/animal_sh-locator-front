import { useState, useEffect } from 'react';
import './EvolvingBackground.css';

const backgroundImages = [
  new URL('./assets/BGs/Desktop - Level-0.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-1.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-2.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-3.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-4.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-5.svg', import.meta.url).href,
  new URL('./assets/BGs/Desktop - Level-6.svg', import.meta.url).href,
];

const EvolvingBackground = ({ children }) => {
  const [level, setLevel] = useState(0); // Starts at index 0

  useEffect(() => {
    // 60000ms = 1 minute per level, 180000ms = 3 minutes per level
    const timePerLevel = 5000;
    const maxLevel = backgroundImages.length - 1;

    const timer = setInterval(() => {
      setLevel((prevLevel) => {
        if (prevLevel >= maxLevel) {
          clearInterval(timer);
          return prevLevel;
        }
        return prevLevel + 1;
      });
    }, timePerLevel);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container">
      {/* Background Layers */}
      <div className="background-wrapper">
        {backgroundImages.map((imgSrc, index) => (
          <div
            key={index}
            // Add the 'active' class only to the current level's image
            className={`bg-layer ${index === level ? 'active' : ''}`}
            style={{ backgroundImage: `url(${imgSrc})` }}
          />
        ))}
      </div>

      {/* Your Actual App Content */}
      <div className="app-content">
        {children}
      </div>
    </div>
  );
};

export default EvolvingBackground;