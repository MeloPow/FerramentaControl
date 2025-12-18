import React from 'react';
import background from '../../../assets/images/backgrounds/principal.png';

export default function ColaboradorPage() {
   return (
      <div className="background" style={{ backgroundImage: `url(${background})` }}>
         <div className="container">
            <h1 className="title">Página inicial dos colaboradores</h1>
         </div>
      </div>
   );
}