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
        Name: '',
        Price: 0,
        Category: '',
        Author: '',
        Date: new Date(),
    });

    const [books, setBooks] = useState<BookDTO[]>([]);

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if(currentBook.Id === '') {
            try {
                const bookData = {
                    Id: '',
                    Name: currentBook.Name,
                    Author: currentBook.Author,
                    Price: currentBook.Price,
                    Category: currentBook.Category,
                    Date: currentBook.Date,
                };
    
                await clienteservice.createBook(bookData);
                
                setBooks([...books, bookData]);
    
                setCurrentBook({
                    Id: '',
                    Name: '',
                    Price: 0,
                    Category: '',
                    Author: '',
                    Date: new Date(),
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
                    Id,
                    Name: currentBook.Name,
                    Author: currentBook.Author,
                    Price: currentBook.Price,
                    Category: currentBook.Category,
                    Date: currentBook.Date,
                };
    
                await clienteservice.updateBooks(Id, bookData);
                
                setBooks([...books, bookData]);
    
                setCurrentBook({
                    Id: '',
                    Name: '',
                    Price: 0,
                    Category: '',
                    Author: '',
                    Date: new Date(),
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
    
    console.log(books);
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
