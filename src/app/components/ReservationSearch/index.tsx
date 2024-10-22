import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { ReservationDTO } from '@/app/models/Reservation';

interface ReservationSearchProps {
    reservations: ReservationDTO[];
    setSearchId: React.Dispatch<React.SetStateAction<string | null>>; // Função para atualizar o ID
}

const ReservationSearch: React.FC<ReservationSearchProps> = ({ reservations, setSearchId }) => {

    const [searchName, setSearchName] = useState(''); // Estado para o nome de busca
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchName(value); // Atualiza o estado de busca
    };
    return (
        <TextField
            label="Buscar pelo nome do cliente"
            variant="outlined"
            value={searchName} // Usa o estado local
            onChange={handleSearchChange} // Chama a função de manipulação de busca
            className="mb-4"
        />
    );
};

export default ReservationSearch;
