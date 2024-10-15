"use client";
import useAuthToken from '@/app/Hooks/useAuthToken';
import useHttp from '@/app/Hooks/useHttp';
import { ReservationDTO } from '@/app/models/Reservation';
import clienteservice from '@/app/services/clienteService';
import { Container, Paper } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Grid from '@mui/material/Grid2';
import ReservationForm from '../ReservationForm';
import 'react-toastify/dist/ReactToastify.css';
import ReservationTabale from '../ReservationTable';

const Reserva: React.FC = () => {

    const [reservations, setReservations] = useState<ReservationDTO[]>([]);  // Mudança aqui

    const [currentReservation, setCurrentReservation] = useState<ReservationDTO>({
        Id: '',
        BookIds: [],
        UserId: '',
        UserName: '',
        ReservationDate: new Date()
    });
    const [showToast, setShowToast] = useState('');
    const { request } = useHttp();
    const clienteServiceInstance = clienteservice(request);
    const { userName, token } = useAuthToken();

    useEffect(() => {
        if (showToast === 'add') {
            toast.success("Reserva feita com sucesso", {
                onClose: () => setShowToast(''),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
        if (showToast === 'update') {
            toast.success("Reserva atualizada", {
                onClose: () => setShowToast(''),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
        if (showToast === 'erroadd') {
            toast.error("Erro ao fazer reserva", {
                onClose: () => setShowToast(''),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
        if (showToast === 'errorupdate') {
            toast.error("Erro ao editar reserva", {
                onClose: () => setShowToast(''),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
        if (showToast === 'fetch') {
            toast.error("Erro ao carregar reservas", {
                onClose: () => setShowToast(''),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
    }, [showToast]);

    useEffect(() => {
        setCurrentReservation({
            ...currentReservation,
            UserName: userName || '',
            UserId: token ? jwtDecode(token).sub || '' : '',
        });
    }, [userName, token]);

    const handleAddReservation = async (values: ReservationDTO) => {
        const today = new Date().toISOString().split('T')[0];
        let reservationDate: Date;

        try {
            reservationDate = new Date(values.ReservationDate);

            if (isNaN(reservationDate.getTime())) {
                throw new Error("Invalid date");
            }

            const formattedReservationDate = reservationDate.toISOString().split('T')[0];

            if (formattedReservationDate < today) {
                throw new Error("Data da reserva não pode estar no passado");
            }

            const formattedDate = reservationDate.toISOString();

            if (currentReservation.Id === '') {
                try {
                    const reservationData: ReservationDTO = {
                        Id: '',
                        BookIds: values.BookIds,
                        UserId: token ? jwtDecode(token).sub || '' : '',
                        UserName: userName || '',
                        ReservationDate: reservationDate,
                        ReturnDate: values.ReturnDate,
                    };

                    await clienteServiceInstance.createReservation(reservationData)
                        .then(() => {
                            setShowToast('add');
                        }).catch(() => {
                            setShowToast('erroadd');
                        });

                    setCurrentReservation({
                        Id: '',
                        UserName: '',
                        UserId: '',
                        BookIds: [],
                        ReservationDate: new Date(),
                    });
                }
                catch (error) {
                    console.error("Error adding reservation", error);
                }
            }

        } catch (error) {
            console.error("Invalid date format", error);
            return;
        }
    };

    return (
        <Container maxWidth="md" style={{ padding: '2rem 0' }}>
            <ToastContainer pauseOnHover={false} draggable={false} autoClose={0} />
            <Paper elevation={3} style={{ padding: '2rem', borderRadius: '8px' }}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <ReservationForm reservation={currentReservation} setReservation={setCurrentReservation} handleAddReservation={handleAddReservation} />
                    </Grid>
                    <Grid size={12}>
                        <ReservationTabale
                            reservations={reservations}
                            setReservations={setReservations}
                            setCurrentReservation={setCurrentReservation}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Reserva;
