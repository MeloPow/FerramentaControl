// src/shared/components/SplashScreen.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../../assets/images/background.png';
import logoImage from '../../assets/images/logo.png';

export default function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate('/painel');
        }, 2000);
        return () => clearTimeout(timeout);
    }, [navigate]);

    return (
        <div
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <img
                src={logoImage}
                alt="Logo Equilibra"
                style={{ width: 600, height: 600 }}
            />
        </div>
    );
}
