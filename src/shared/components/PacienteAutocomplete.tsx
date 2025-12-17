// src/shared/components/PacienteAutocomplete.tsx

import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { Paciente } from '../../features/Paciente/types/Paciente';
import { usePacientesAtivos } from '../../features/Paciente/hooks/usePacientesAtivos';
import { SxProps, Theme } from '@mui/material/styles';

interface PacienteAutocompleteProps {
   onSelecionar: (paciente: Paciente) => void;
   pacienteSelecionadoId?: number | null;
   sx?: SxProps<Theme>; // 🔧 permite personalizar estilo externamente
}

const PacienteAutocomplete: React.FC<PacienteAutocompleteProps> = ({ onSelecionar, pacienteSelecionadoId, sx }) => {
   const [inputValue, setInputValue] = useState('');
   const { pacientes, carregando } = usePacientesAtivos();

   const pacienteSelecionado = pacientes.find(p => p.id === pacienteSelecionadoId) || null;

   useEffect(() => {
      const paciente = pacientes.find(p => p.id === pacienteSelecionadoId);
      if (paciente) {
         setInputValue(paciente.nome_completo);
      } else {
         setInputValue('');
      }
   }, [pacienteSelecionadoId, pacientes]);

   return (
      <Autocomplete
         options={pacientes}
         sx={sx}
         getOptionLabel={(option) => option.nome_completo}
         value={pacienteSelecionado}
         onChange={(event, novoPaciente) => {
            if (novoPaciente) {
               onSelecionar(novoPaciente);
            } else {
               onSelecionar({ id: null, nome_completo: '' } as Paciente);
            }
         }}
         inputValue={inputValue}
         onInputChange={(event, novoValor) => setInputValue(novoValor)}
         loading={carregando}
         renderInput={(params) => (
            <TextField
               {...params}
               label="Buscar paciente"
               placeholder="Digite o nome do paciente"
               fullWidth
               InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                     <>
                        {carregando ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                     </>
                  )
               }}
            />
         )}
         isOptionEqualToValue={(option, value) => option.id === value.id}
      />
   );
};

export default PacienteAutocomplete;