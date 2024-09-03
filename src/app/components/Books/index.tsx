"use client";

import React, { useEffect } from 'react';
import { BookDTO } from '@/app/models/Book';
import { useState } from 'react';
import clienteservice from '@/app/services/clienteService';
import BookForm from '../Form';
import Table from '../Table';

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
    console.log(currentBook);

    const handleAddBook = async (e: React.FormEvent) => {
        // Verifica se a data de publicação não é menor que a data atual
    const today = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z'; // Data de hoje em formato ISO 8601
    if (new Date(currentBook.Date).toISOString() < new Date(today).toISOString()) {
        alert('Publish Date cannot be earlier than today.');
        return;
    }

    // Formata a data de publicação no formato ISO 8601
    const formattedDate = new Date(currentBook.Date).toISOString();

        e.preventDefault();
        if(currentBook.Id === '') {
            try {
                const bookData: BookDTO = {
                    Id: '',
                    BookName: currentBook.BookName,
                    Author: currentBook.Author,
                    Price: currentBook.Price,
                    Category: currentBook.Category,
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
                    Date: ''
                })

            } catch (error) {
                console.error(error);
            }
        }
        else
        {
            const Id = currentBook.Id;
            try {
                const bookData = {
                    Id: Id,
                    BookName: currentBook.BookName,
                    Author: currentBook.Author,
                    Price: currentBook.Price,
                    Category: currentBook.Category,
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
                    Date: ''
                })

            } catch (error) {
                console.error(error);
            }    
        }
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try
            {
                const response = await clienteservice.getBooks();
                setBooks(response.Result);
            }
            catch (error)
            {
                console.error(error);
            }
        };
        fetchBooks();
    }, []);
    
    return (
        
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            backgroundColor: '#f7f8fa'
        }}>
            <BookForm books={currentBook} setBooks={setCurrentBook} handleAddBook={handleAddBook} />
            <Table books={books} setBooks={setBooks} SetCurrentBook={setCurrentBook}/>
        </div>
    );
};

export default Books;
