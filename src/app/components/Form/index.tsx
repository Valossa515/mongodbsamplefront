import React from 'react';
import { BookDTO } from '@/app/models/Book';
import CurrencyInput from 'react-currency-input-field';
import * as Yup from 'yup';
import { useFormik } from 'formik';

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

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        color: '#333',
        backgroundColor: '#f7f7f7',
        outline: 'none',
        fontSize: '1rem',
        "::placeholder": {
            color: '#999', // Cor do placeholder mais suave
        },
        "::selection": {
            color: '#007bff',
            backgroundColor: '#e6f7ff', // Ajusta a cor da seleção de texto
        },
    };

    return (
        <form onSubmit={formik.handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '600px',
            width: '100%',
            margin: '0 auto', // Para centralizar horizontalmente
            padding: '1.5rem',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            backgroundColor: '#fff',
            gap: '1rem', // Espaçamento entre os elementos do formulário
        }}>
            <h1 style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                color: '#333'
            }}>{books.Id === '' ? 'Cadastrar um Book' : 'Editar Book'}</h1>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="bookName" style={{ color: '#333', marginBottom: '0.5rem', display: 'block' }}>Book Name:</label>
                <input
                    type="text"
                    id="bookName"
                    name="BookName"
                    value={formik.values.BookName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter the book name" // Placeholder mais claro
                    style={inputStyle}
                />
                {formik.touched.BookName && formik.errors.BookName ? (
                    <div style={{ color: 'red', marginTop: '0.5rem' }}>{formik.errors.BookName}</div>
                ) : null}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="author" style={{ color: '#333', marginBottom: '0.5rem', display: 'block' }}>Author:</label>
                <input
                    type="text"
                    id="author"
                    name="Author"
                    value={formik.values.Author}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter the author name"
                    style={inputStyle}
                />
                {formik.touched.Author && formik.errors.Author ? (
                    <div style={{ color: 'red', marginTop: '0.5rem' }}>{formik.errors.Author}</div>
                ) : null}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="price" style={{ color: '#333', marginBottom: '0.5rem', display: 'block' }}>Price:</label>
                <CurrencyInput
                    id="price"
                    name="Price"
                    value={formik.values.Price}
                    decimalsLimit={2}
                    prefix="$"
                    placeholder="Enter the price"
                    onValueChange={(value) =>
                        formik.setFieldValue("Price", value || 0)
                    }
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.Price && formik.errors.Price ? (
                    <div style={{ color: 'red', marginTop: '0.5rem' }}>{formik.errors.Price}</div>
                ) : null}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="category" style={{ color: '#333', marginBottom: '0.5rem', display: 'block' }}>Category:</label>
                <input
                    type="text"
                    id="category"
                    name="Category"
                    value={formik.values.Category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter the category"
                    style={inputStyle}
                />
                {formik.touched.Category && formik.errors.Category ? (
                    <div style={{ color: 'red', marginTop: '0.5rem' }}>{formik.errors.Category}</div>
                ) : null}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="date" style={{ color: '#333', marginBottom: '0.5rem', display: 'block' }}>Publish Date:</label>
                <input
                    type="datetime-local"
                    id="date"
                    name="Date"
                    value={formik.values.Date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.Date && formik.errors.Date ? (
                    <div style={{ color: 'red', marginTop: '0.5rem' }}>{formik.errors.Date}</div>
                ) : null}
            </div>

            <button
                type="submit"
                style={{
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                }}
            >
                {books.Id === '' ? 'Add Book' : 'Update Book'}
            </button>
        </form>
    );
};

export default BookForm;