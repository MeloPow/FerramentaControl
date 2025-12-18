import React from 'react';
import background from '../../../assets/images/backgrounds/principal.png';

export default function MovimentacaoPage() {
   return (
      <div className="background" style={{ backgroundImage: `url(${background})` }}>
         <div className="container">
            <h1 className="title">Página inicial das movimentacoes das ferramentas</h1>
         </div>
      </div>
   );
}