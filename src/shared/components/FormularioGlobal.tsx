// src/shared/components/FormularioGlobal.tsx

import React from 'react';
import { Box } from '@mui/material';
import imagii from '../../assets/images/background2.png'

interface FormularioCardProps {
   children: React.ReactNode;
   width?: number | string;
}

export const FormularioCard: React.FC<FormularioCardProps> = ({ children, width = 600 }) => {
   return (
      <Box
         sx={{
            position: 'relative',
            width: '100%',
            maxWidth: width,
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px 24px 40px 24px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            backgroundImage: `url(${imagii})`,
         }}
      >
         <Box
            sx={{
               backgroundColor: '#481d74',
               height: '60px',
               width: '100%',
               position: 'absolute',
               top: 0,
               left: 0,
               borderTopLeftRadius: '16px',
               borderTopRightRadius: '16px',
               pointerEvents: 'none', // ✅ ESSENCIAL
            }}
         />
         <Box sx={{ mt: 6 }}>{children}</Box>
      </Box>
   );
};

export default FormularioCard;