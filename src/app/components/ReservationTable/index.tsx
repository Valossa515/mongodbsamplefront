import useAuthToken from '@/app/Hooks/useAuthToken';
import useHttp from '@/app/Hooks/useHttp';
import { ReservationDTO } from '@/app/models/Reservation';
import clienteservice from '@/app/services/clienteService';
import { Button, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';// Importe o hook / Certifique-se de importar corretamente

interface ReservationTableProps {
    reservations: ReservationDTO[];
    setReservations: React.Dispatch<React.SetStateAction<ReservationDTO[]>>;
    setCurrentReservation: React.Dispatch<React.SetStateAction<ReservationDTO>>;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
    reservations,
    setReservations,
    setCurrentReservation
}) => {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [tableData, setTableData] = useState<ReservationDTO[]>([]);
    const { request } = useHttp();
    const clienteServiceInstance = clienteservice(request);

    // Adiciona autenticação
    const { roles, isTokenDecoded } = useAuthToken();

    // Estado para verificar se o usuário é ADMIN
    const [isAdmin, setIsAdmin] = useState(false);

    // Decodifica o token para verificar se o usuário tem a role ADMIN
    useEffect(() => {
        // Verificar somente após o token ter sido decodificado
        if (isTokenDecoded && roles.includes('ADMIN')) {
            setIsAdmin(true);
        }
    }, [roles, isTokenDecoded]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }

    useEffect(() => {
        setTableData(reservations);
    }, [reservations]);

    function formatDateInput(value: string) {
        return value.split('T')[0];
    }

    useEffect(() => {
        fetchReservations(page, pageSize);
    }, [page]);

    const handleUpdate = async (index: number, newStatus: string) => {
        const reservation = { ...tableData[index] }; // Cria uma cópia do objeto de reserva
        reservation.Status = newStatus; // Atualiza o Status baseado na nova ação
        try {
            // Atualiza o banco de dados
            await clienteServiceInstance.updateReservations(reservation.Id, reservation);

            // Atualiza o estado da tabela localmente para refletir as mudanças
            const newReservations = [...tableData];
            newReservations[index] = reservation; // Atualiza a reserva na tabela com o novo status
            setTableData(newReservations); // Atualiza o estado da tabela
            setReservations(newReservations); // Atualiza o estado externo da tabela (se necessário)
        }
        catch (error) {
            console.error("Error updating reservation:", error);
        }
    };

    const fetchReservations = async (page: number, pageSize: number) => {
        try {
            const response = await clienteServiceInstance.getReservations(page, pageSize);
            console.log(response);
            if (response) {
                const reservation = response.Data || [];
                const totalCount = response.TotalCount || 0;
                setReservations(reservation);
                setTableData(reservation);
                setTotalCount(totalCount);
            }
            else {
                console.error('Invalid response format:', response);
            }
        }
        catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    function renderTable() {
        return (
            <TableRow className={`text-gray-300 bg-gradient-to-r from-blue-500 to-blue-800`}>
                <TableCell className={`px-6 py-4 text-sm text-gray-300`}>Nome</TableCell>
                <TableCell className={`px-6 py-4 text-sm text-gray-300`}>Data de Reserva</TableCell>
                <TableCell className={`px-6 py-4 text-sm text-gray-300`}>Data de Devolução</TableCell>
                <TableCell className={`px-6 py-4 text-sm text-gray-300`}>Status</TableCell>
                <TableCell className={`px-6 py-4 text-sm text-gray-300`}>Ações</TableCell>
            </TableRow>
        );
    }

    function renderTableData() {
        return (
            <TableBody>
                {Array.isArray(tableData) && tableData.map((row, index) => (
                    <TableRow key={index} className={`${index % 2 === 0 ? 'bg-purple-200' : 'bg-purple-100'}`} >
                        <TableCell className="text-left p-4">{row.UserName}</TableCell>
                        <TableCell className="text-left p-4">{row.ReservationDate ? formatDateInput(row.ReservationDate.toString()) : ''}</TableCell>
                        <TableCell className="text-left p-4">{row.ReturnDate ? formatDateInput(row.ReturnDate.toString()) : ''}</TableCell>
                        <TableCell className="text-left p-4">{row.Status || 'Indefinido'}</TableCell>
                        <TableCell className="text-left p-4">
                            {/* Botões de Ação */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleUpdate(index, 'Active')}
                                className="mr-2"
                                disabled={row.Status === 'Active'} // Desabilitar se o status for 'Active'
                            >
                                Reservar
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleUpdate(index, 'Completed')}
                                className="mr-2"
                                disabled={row.Status !== 'Active'} // Desabilitar se o status não for 'Active'
                            >
                                Devolver
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleUpdate(index, 'Canceled')}
                                disabled={row.Status === 'Canceled'} // Desabilitar se o status for 'Canceled'
                            >
                                Cancelar
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        );
    }

    // Renderize a tabela apenas se o usuário for ADMIN
    if (!isAdmin) {
        return null; // Se não for admin, retorna null e não renderiza nada
    }

    return (
        <div className={`flex flex-col w-full items-center justify-center`}>
            <Pagination
                count={Math.ceil(totalCount / pageSize)}
                page={page}
                color="primary"
                onChange={handlePageChange}
            />
            <TableContainer component={Paper} className={`w-full mt-8 max-w-1000 overflow-x-auto`}>
                <Table className={`w-full rounded-xl overflow-hidden`}>
                    <TableHead className={`text-gray-300 bg-gradient-to-r from-blue-500 to-blue-800`}>
                        {renderTable()}
                    </TableHead>
                    {renderTableData()}
                </Table>
            </TableContainer>
        </div>
    );
};

export default ReservationTable;
