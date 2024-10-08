"use client"
import clienteservice from '@/app/services/clienteService';
import React, { useEffect, useState } from 'react';
import { BookDTO } from '@/app/models/Book';
import BookForm from '../Form';
import Table from '../Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Grid, Paper } from '@mui/material';
import useHttp from '@/app/Hooks/useHttp';

const Books: React.FC = () => {
    const { request } = useHttp();
    const clienteServiceInstance = clienteservice(request);

    const [currentBook, setCurrentBook] = useState<BookDTO>({
        Id: '',
        BookName: '',
        Price: 0,
        Category: '',
        Author: '',
        Date: ''
    });

    const [books, setBooks] = useState<BookDTO[]>([]);
    const [showToast, setShowToast] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [page] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        if (showToast === 'add') {
            toast.success("Book added successfully", {
                onClose: () => setShowToast(''),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
        if (showToast === 'update') {
            toast.success("Book updated successfully", {
                onClose: () => setShowToast(''),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
        if (showToast === 'erroadd') {
            toast.error("Error adding book", {
                onClose: () => setShowToast(''),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
        if (showToast === 'errorupdate') {
            toast.error("Error updating book", {
                onClose: () => setShowToast(''),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
        if (showToast === 'fetch') {
            toast.error("Error fetching books", {
                onClose: () => setShowToast(''),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
    }, [showToast]);

    const handleAddBook = async (values: BookDTO) => {
        const today = new Date().toISOString().split('T')[0];
        let publishDate: Date;

        try {
            publishDate = new Date(values.Date);

            if (isNaN(publishDate.getTime())) {
                throw new Error("Invalid date format");
            }

            const formattedPublishDate = publishDate.toISOString().split('T')[0];

            if (formattedPublishDate < today) {
                alert('Publish Date cannot be earlier than today.');
                return;
            }

            const formattedDate = publishDate.toISOString();

            if (currentBook.Id === '') {
                try {
                    const bookData: BookDTO = {
                        Id: '',
                        BookName: values.BookName,
                        Author: values.Author,
                        Price: values.Price,
                        Category: values.Category,
                        Date: formattedDate
                    };

                    await clienteServiceInstance.createBook(bookData).then(() => {
                        setShowToast('add');
                    }).catch(() => {
                        setShowToast('erroadd');
                    });

                    setCurrentBook({
                        Id: '',
                        BookName: '',
                        Price: 0,
                        Category: '',
                        Author: '',
                        Date: new Date().toISOString().split('T')[0]
                    });

                    fetchBooks(page, pageSize);

                } catch (error) {
                    setShowToast('erroadd');
                }
            } else {
                const Id = currentBook.Id;
                try {
                    const bookData = {
                        Id: Id,
                        BookName: values.BookName,
                        Author: values.Author,
                        Price: values.Price,
                        Category: values.Category,
                        Date: formattedDate
                    };

                    await clienteServiceInstance.updateBooks(Id, bookData);
                    setBooks([...books, bookData]);

                    setCurrentBook({
                        Id: '',
                        BookName: '',
                        Price: 0,
                        Category: '',
                        Author: '',
                        Date: new Date().toISOString().split('T')[0]
                    });
                    fetchBooks(page, pageSize);
                    setShowToast('update');
                } catch (error) {
                    setShowToast('errorupdate');
                }
            }
        } catch (error) {
            console.error("Date handling error:", error);
        }
    };

    const fetchBooks = async (page: number, pageSize: number) => {
        try {
            const response = await clienteServiceInstance.getBooks(page, pageSize);

            if (response) {
                const books = response.Data || [];
                const totalCount = response.TotalCount || 0;

                setBooks(books);
                setTotalCount(totalCount);
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            setShowToast('fetch');
        }
    };

    useEffect(() => {
        if (localStorage.getItem('authToken') !== "" && localStorage.getItem('authToken') !== null) {
            fetchBooks(page, pageSize);
        }}, []);

    return (
        <Container maxWidth="md" style={{ padding: '2rem 0' }}>
            <ToastContainer pauseOnHover={false} draggable={false} autoClose={0} />
            <Paper elevation={3} style={{ padding: '2rem', borderRadius: '8px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <BookForm books={currentBook} setBooks={setCurrentBook} handleAddBook={handleAddBook} />
                    </Grid>
                    <Grid item xs={12}>
                        <Table books={books} setBooks={setBooks} SetCurrentBook={setCurrentBook} />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Books;
