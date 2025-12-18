import React from 'react';
import background from '../../../assets/images/backgrounds/principal.png';

export default function ObraPage() {
   return (
      <div className="background" style={{ backgroundImage: `url(${background})` }}>
         <div className="container">
            <h1 className="title">Página inicial das obras</h1>
         </div>
      </div>
   );
}