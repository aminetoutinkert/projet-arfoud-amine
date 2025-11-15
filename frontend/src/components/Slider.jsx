// Fichier: frontend/src/components/Slider.jsx

import React, { useState, useEffect } from 'react';
import './Slider.css'; // Importation du CSS pour le slider

const Slider = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fonction pour passer à la diapositive suivante
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Fonction pour passer à la diapositive précédente
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Effet pour le défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change d'image toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, [images.length]);

  if (!images || images.length === 0) {
    return null; // Ne rien afficher si pas d'images
  }

  return (
    <div className='slider'>
      <h1 className='slider-title'>{title}</h1>
      
      <button className='slider-arrow left-arrow' onClick={prevSlide}>
        &#10094;
      </button>
      <button className='slider-arrow right-arrow' onClick={nextSlide}>
        &#10095;
      </button>

      {images.map((image, index) => (
        <div
          className={index === currentIndex ? 'slide active' : 'slide'}
          key={index}
        >
          {index === currentIndex && (
            <img src={image} alt={`Slide ${index + 1}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Slider;
