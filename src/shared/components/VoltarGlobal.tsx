// src/shared/components/VoltarGlobal.tsx

import { Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface VoltarGlobalProps {
   destino?: string;
   texto?: string;
   drawerOpen?: boolean; // 👈 nova prop
}

export default function VoltarGlobal({ destino, texto, drawerOpen = false }: VoltarGlobalProps) {

   const navigate = useNavigate();

   return (
      <Box
         sx={{
            position: 'fixed',
            top: '110px', // altura logo abaixo do drawer
            left: drawerOpen ? '330px' : '20px',
            zIndex: 1300, // acima de tudo, sem bloquear drawer
         }}
      >
         <Button
            onClick={() => destino ? navigate(destino) : navigate(-1)}
            startIcon={<ArrowBackIcon sx={{ width: 40, height: 40 }} />}
            sx={{
               color: '#481d74',
               fontWeight: 'bold',
               textTransform: 'none',
               backgroundColor: 'transparent',
               '&:hover': {
                  backgroundColor: '#f3e9ff',
               },
            }}
         >
            {texto}
         </Button>
      </Box>
   );
}
