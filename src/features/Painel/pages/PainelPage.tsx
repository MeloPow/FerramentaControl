// src/pages/Painel.tsx
import React from 'react';
import '../PainelPageModule.css';
import background from '../../../assets/images/backgrounds/principal.png';

export default function Painel() {
    return (
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
            <div className="container">
                <h1 className="title">Bem-vindo ao FerramentasControl</h1>
                <p className="subtitle">Lista de opções.</p>
            </div>
        </div>
    );
}
