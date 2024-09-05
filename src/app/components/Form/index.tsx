import React from 'react';
import { BookDTO } from '@/app/models/Book';
import CurrencyInput from 'react-currency-input-field';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Grid, TextField, Button, Typography } from '@mui/material';

interface BookFormProps {
    books: BookDTO;
    setBooks: (books: BookDTO) => void;
    handleAddBook: (values: BookDTO) => void;
}

const validationSchema = Yup.object({
    BookName: Yup.string().required('Book Name is required'),
    Author: Yup.string().required('Author is required'),
    Price: Yup.number().required('Price is required').positive('Price must be positive'),
    Category: Yup.string().required('Category is required'),
    Date: Yup.date().required('Publish Date is required').typeError('Invalid date format'),
});

const BookForm: React.FC<BookFormProps> = ({ books, setBooks, handleAddBook }) => {
    const formik = useFormik({
        initialValues: books,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting }) => {
            let formattedDate = '';
            try {
                const date = new Date(values.Date);
                if (!isNaN(date.getTime())) {
                    formattedDate = date.toISOString(); 
                } else {
                    throw new Error("Invalid date");
                }
            } catch (error) {
                console.error("Invalid date format", error);
                setSubmitting(false);
                return;
            }

            const bookData = {
                ...values,
                Date: formattedDate,
            };
            handleAddBook(bookData);
            setBooks(bookData);
            setSubmitting(true);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <Typography variant="h5" align="center" marginBottom={2}>
                {books.Id === '' ? 'Cadastrar um Book' : 'Editar Book'}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="bookName"
                        name="BookName"
                        label="Book Name"
                        value={formik.values.BookName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.BookName && Boolean(formik.errors.BookName)}
                        helperText={formik.touched.BookName && formik.errors.BookName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="author"
                        name="Author"
                        label="Author"
                        value={formik.values.Author}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.Author && Boolean(formik.errors.Author)}
                        helperText={formik.touched.Author && formik.errors.Author}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CurrencyInput
                        id="price"
                        name="Price"
                        value={formik.values.Price}
                        decimalsLimit={2}
                        prefix="$"
                        placeholder="Enter the price"
                        onValueChange={(value) => formik.setFieldValue("Price", value || 0)}
                        onBlur={formik.handleBlur}
                        style={{
                            width: '100%',
                            padding: '16.5px 14px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            color: '#333',
                        }}
                    />
                    {formik.touched.Price && formik.errors.Price ? (
                        <div style={{ color: 'red', marginTop: '0.5rem' }}>{formik.errors.Price}</div>
                    ) : null}
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="category"
                        name="Category"
                        label="Category"
                        value={formik.values.Category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.Category && Boolean(formik.errors.Category)}
                        helperText={formik.touched.Category && formik.errors.Category}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="date"
                        name="Date"
                        type="datetime-local"
                        value={formik.values.Date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.Date && Boolean(formik.errors.Date)}
                        helperText={formik.touched.Date && formik.errors.Date}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {books.Id === '' ? 'Add Book' : 'Update Book'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default BookForm;
