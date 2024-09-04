"use client";
import React, { useEffect } from 'react';
import { BookDTO } from '@/app/models/Book';
import { useState } from 'react';
import clienteservice from '@/app/services/clienteService';
import BookForm from '../Form';
import Table from '../Table';
import { log } from 'console';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Books: React.FC = () => {
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

    const handleAddBook = async (values : BookDTO) => {
        const today = new Date().toISOString().split('T')[0];
        let publishDate: Date;
        console.log(values);
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

            const fetchBooks = async () => {
                try {
                    const response = await clienteservice.getBooks();
                    setBooks(response.Result);
                } catch (error) {
                    console.error(error);
                }
            };

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

                    await clienteservice.createBook(bookData);
                    setBooks([...books, bookData]);

                    setCurrentBook({
                        Id: '',
                        BookName: '',
                        Price: 0,
                        Category: '',
                        Author: '',
                        Date: new Date().toISOString().split('T')[0]
                    });
                    fetchBooks();
                    setShowToast('add');

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

                    await clienteservice.updateBooks(Id, bookData);
                    setBooks([...books, bookData]);

                    setCurrentBook({
                        Id: '',
                        BookName: '',
                        Price: 0,
                        Category: '',
                        Author: '',
                        Date: new Date().toISOString().split('T')[0]
                    });
                    fetchBooks();
                    setShowToast('update');
                } catch (error) {
                    setShowToast('errorupdate');
                }
            }
        } catch (error) {
            console.error("Date handling error:", error);
        }
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await clienteservice.getBooks();
                setBooks(response.Result);
            } catch (error) {
                setShowToast('fetch');
            }
        };
        fetchBooks();
    }, []);

    return (
        
        <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',

            alignItems: 'center',
            height: '100%',
            backgroundColor: '#f7f8fa'
        }}>
            <ToastContainer pauseOnHover={false} draggable={false} autoClose={0}/>
            <BookForm books={currentBook} setBooks={setCurrentBook} handleAddBook={handleAddBook} />
            <Table books={books} setBooks={setBooks} SetCurrentBook={setCurrentBook} />
        </div>
    );
};

export default Books;
