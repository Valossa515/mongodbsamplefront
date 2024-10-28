import useAuthToken from '@/app/Hooks/useAuthToken';
import useHttp from '@/app/Hooks/useHttp';
import { ReservationDTO } from '@/app/models/Reservation';
import clienteservice, { GetReservationsResponse, SingleReservationResponse } from '@/app/services/clienteService';
import { Button, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

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
    const [searchTerm, setSearchTerm] = useState('');
    const { request } = useHttp();
    const clienteServiceInstance = clienteservice(request);
    const { roles, isTokenDecoded } = useAuthToken();
    const [isAdmin, setIsAdmin] = useState(false);

    function isWithin7Days(reservationDate: Date, returnDate: Date): boolean {
        const diffTime = Math.abs(returnDate.getTime() - reservationDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }

    useEffect(() => {
        if (isTokenDecoded && roles.includes('ADMIN')) {
            setIsAdmin(true);
        }
    }, [roles, isTokenDecoded]);

    useEffect(() => {
        setTableData(reservations);
    }, [reservations]);

    useEffect(() => {
        fetchReservations(page, pageSize);
    }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const fetchReservations = async (page: number, pageSize: number, userName?: string) => {
        try {
            let response: GetReservationsResponse | SingleReservationResponse | null;

            if (userName) {
                response = await clienteServiceInstance.getReservationByIdOrUserName(userName);
            } else {
                response = await clienteServiceInstance.getReservations(page, pageSize);
            }

            if (response) {
                // Verifica se a resposta é do tipo SingleReservationResponse
                if ('Result' in response) {
                    const reservations = response.Result || []; // Acessa 'Result' se disponível
                    setReservations(Array.isArray(reservations) ? reservations : []); // Atualiza as reservas
                    setTotalCount(Array.isArray(reservations) ? reservations.length : 0); // Atualiza a contagem total com o tamanho do array de reservas
                } else if ('Data' in response) { // Verifica se a resposta é do tipo GetReservationsResponse
                    const reservations = response.Data || []; // Acessa 'Data' se disponível
                    setReservations(Array.isArray(reservations) ? reservations : []); // Atualiza as reservas
                    setTotalCount(reservations.length); // Atualiza a contagem total
                } else {
                    console.error('Invalid response format:', response);
                }
            } else {
                console.error('Response is null or undefined');
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            // Se o campo de busca estiver vazio, talvez você queira buscar todas as reservas
            fetchReservations(page, pageSize);
        } else {
            fetchReservations(page, pageSize, searchTerm);
        }
    };

    function formatDateInput(value: string) {
        return value.split('T')[0];
    }

    const handleUpdate = async (index: number, newStatus: string) => {
        const reservation = tableData[index];
        if (reservation) {
            try {
                await clienteServiceInstance.updateReservations(reservation.Id, { ...reservation, Status: newStatus });
                reservation.Status = newStatus;
                setTableData([...tableData]);
            } catch (error) {
                console.error("Error updating reservation:", error);
            }
        }
    };

    function renderTable() {
        return (
            <TableRow className="text-gray-300 bg-gradient-to-r from-blue-500 to-blue-800">
                <TableCell className="px-6 py-4 text-sm text-gray-300">Nome</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-300">Data de Reserva</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-300">Data de Devolução</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-300">Status</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-300">Ações</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-300">Prazo</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-300">Livros</TableCell>
            </TableRow>
        );
    };
    function renderTableData() {
        return (
            <TableBody>
                {Array.isArray(reservations) && reservations.map((row, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-purple-200' : 'bg-purple-100'}>
                        <TableCell className="text-left p-4">{row.UserName ? row.UserName : 'Nome não disponível'}</TableCell>
                        <TableCell className="text-left p-4">{row.ReservationDate ? formatDateInput(new Date(row.ReservationDate).toISOString()) : ''}</TableCell>
                        <TableCell className="text-left p-4">{row.ReturnDate ? formatDateInput(new Date(row.ReturnDate).toISOString()) : ''}</TableCell>
                        <TableCell className="text-left p-4">{row.Status ? row.Status : 'Indefinido'}</TableCell>
                        <TableCell className="text-left p-4">
                            {row.Status === 'Active' ? (
                                <>
                                    <Button variant="contained" color="secondary" onClick={() => handleUpdate(index, 'Completed')} className="mr-2">Devolver</Button>
                                    <Button variant="contained" color="error" onClick={() => handleUpdate(index, 'Canceled')}>Cancelar</Button>
                                </>
                            ) : (
                                <span>
                                    {row.Status === 'Completed'
                                        ? 'Reserva concluída.'
                                        : row.Status === 'Expired'
                                            ? 'Reserva expirada.'
                                            : 'Reserva cancelada.'}
                                </span>
                            )}
                        </TableCell>
                        <TableCell className="text-left p-4">
                            {row.ReservationDate && row.ReturnDate && isWithin7Days(new Date(row.ReservationDate), new Date(row.ReturnDate)) ? (
                                <span className="text-green-500">🟢</span>
                            ) : (
                                <span className="text-red-500">🔴</span>
                            )}
                        </TableCell>
                        <TableCell className="text-left p-4">
                            {row.Books && row.Books.length > 0 ? (
                                <ul className="list-disc pl-6">
                                    {row.Books.map((book, index) => (
                                        <li key={index} className="mb-2 text-blue-600 hover:underline">{book.BookName}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-gray-500">Nenhum livro reservado.</span>
                            )}
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
            <TextField
                label="Nome"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.trim() === '') {
                        fetchReservations(page, pageSize);
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
                className="mb-4"
            />
            <Button variant="contained" color="primary" onClick={handleSearch} className="mb-4">
                Buscar
            </Button>
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
