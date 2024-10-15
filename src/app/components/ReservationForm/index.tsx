import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Button,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import useHttp from "@/app/Hooks/useHttp";
import clienteservice from "@/app/services/clienteService";
import { BookDTO } from "@/app/models/Book";
import { ReservationDTO } from "@/app/models/Reservation";

interface ReservationFormProps {
    reservation: ReservationDTO;
    setReservation: (reservation: ReservationDTO) => void;
    handleAddReservation: (values: ReservationDTO) => void;
}

const defaultReservation: ReservationDTO = {
    Id: "",
    UserName: "",
    ReservationDate: new Date(),
    BookIds: [],
    UserId: "",
};

const validationSchema = Yup.object({
    UserName: Yup.string().required("Nome do Cliente é obrigatório"),
    ReservationDate: Yup.date()
        .required("Data de reserva é obrigatória")
        .typeError("Formato de data inválido"),
});

const ReservationForm: React.FC<ReservationFormProps> = ({
    reservation = defaultReservation,
    setReservation,
    handleAddReservation,
}) => {
    const [books, setBooks] = useState<BookDTO[]>([]);
    const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);

    const formik = useFormik({
        initialValues: reservation,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting, setTouched }) => {
            
            setTouched({
                UserName: true,
                ReservationDate: true,
            });

            let formattedDate = "";
            try {
                const date = new Date(values.ReservationDate);
                if (!isNaN(date.getTime())) {
                    formattedDate = date.toISOString();
                } else {
                    throw new Error("Data inválida");
                }
            } catch (error) {
                console.error("Formato de data inválido", error);
                setSubmitting(false);
                return;
            }

            const reservationData = {
                ...values,
                ReservationDate: formattedDate,
                BookIds: selectedBookIds,
            };

            handleAddReservation({
                ...reservationData,
                ReservationDate: new Date(reservationData.ReservationDate),
            });
            setReservation({
                ...reservationData,
                ReservationDate: new Date(reservationData.ReservationDate),
            });
            setSelectedBookIds([]);
            setSubmitting(true);
        },
    });

    const { request } = useHttp();
    const clienteServiceInstance = clienteservice(request);

    const handleChange = (event: SelectChangeEvent<typeof selectedBookIds>) => {
        const {
            target: { value },
        } = event;
        setSelectedBookIds(typeof value === "string" ? value.split(",") : value);
    };

    useEffect(() => {
        const getBooks = async () => {
            let allBooks: BookDTO[] = [];
            let currentPage = 1;
            let pageSize = 1;

            try {
                while (allBooks.length < pageSize) {
                    const response = await clienteServiceInstance.getBooks(currentPage);
                    if (response && response.Data) {
                        allBooks = [...allBooks, ...response.Data];
                        pageSize = response.TotalCount;
                    }
                    currentPage++;
                }
                setBooks(allBooks);
                if (allBooks.length > 0) {
                    setSelectedBookIds([allBooks[0].Id]);
                }
            } catch (error) {
                console.error("Erro ao carregar os livros:", error);
            }
        };
        getBooks();
    }, []);

    return (
        <form
            onSubmit={formik.handleSubmit}
            style={{
                padding: "2rem",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
        >
            <Typography variant="h5" align="center" marginBottom={2}>
                {reservation?.Id === "" ? "Reservar um Livro" : "Editar Reserva"}
            </Typography>
            <Grid container spacing={2} className={`w-full gap-20`}>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        label="Nome do Cliente"
                        variant="outlined"
                        id="UserName"
                        name="UserName"
                        value={formik.values.UserName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.UserName && Boolean(formik.errors.UserName)}
                        helperText={formik.touched.UserName && formik.errors.UserName}
                        disabled={true}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor:
                                        formik.touched.UserName && Boolean(formik.errors.UserName)
                                            ? "red"
                                            : "inherit",
                                },
                            },
                        }}
                    />
                </Grid>

                <Grid size={12}>
                    <TextField
                        fullWidth
                        label="Data de Reserva"
                        type="datetime-local"
                        variant="outlined"
                        id="ReservationDate"
                        name="ReservationDate"
                        value={formik.values.ReservationDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.ReservationDate &&
                            Boolean(formik.errors.ReservationDate)
                        }
                        helperText={
                            formik.touched.ReservationDate
                                ? (formik.errors.ReservationDate as string)
                                : ""
                        }
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor:
                                        formik.touched.ReservationDate &&
                                        Boolean(formik.errors.ReservationDate)
                                            ? "red"
                                            : "inherit",
                                },
                            },
                        }}
                    />
                </Grid>

                <Grid size={12}>
                    <InputLabel
                        id="demo-simple-select-label"
                        sx={{
                            marginBottom: "0.5rem",
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "18px",
                        }}
                    >
                        Livros
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedBookIds}
                        onChange={handleChange}
                        multiple
                        renderValue={(selected) =>
                            selected
                                .map(
                                    (id) => books.find((book) => book.Id === id)?.BookName || id
                                )
                                .join(", ")
                        }
                        className={`w-full`}
                    >
                        {books.map((book) => (
                            <MenuItem key={book.Id} value={book.Id}>
                                {book.BookName}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid size={12}>
                    <Button fullWidth type="submit" variant="contained" color="primary">
                        {reservation.Id === "" ? "Reservar Livro" : "Atualizar Reserva"}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ReservationForm;
