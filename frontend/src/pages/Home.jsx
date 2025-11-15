// Fichier: frontend/src/pages/Home.jsx

import React from 'react';
import Slider from '../components/Slider';

// Importation des images depuis le dossier assets
import img1 from '../assets/imgHome1.jpg';
import img2 from '../assets/imgHome2.jpg';
import img3 from '../assets/imgHome3.jpg';
import img4 from '../assets/imgHome4.jpg';
import img5 from '../assets/imgHome5.jpg';

function Home() {
  const sliderImages = [img1, img2, img3, img4, img5];
  const sliderTitle = "ARFOUD: Plateforme Marocaine de Voyages et d'Expériences";

  return (
    <div>
      <Slider images={sliderImages} title={sliderTitle} />
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>Prêt à vous connecter ou vous inscrire pour découvrir nos offres exclusives !</p>
      </div>
    </div>
  );
}

export default Home;