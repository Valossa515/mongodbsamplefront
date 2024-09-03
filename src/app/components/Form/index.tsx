import React, { useState } from 'react';
import { BookDTO } from '@/app/models/Book';
import CurrencyInput from 'react-currency-input-field';

interface BookFormProps {
    books: BookDTO;
    setBooks: React.Dispatch<React.SetStateAction<BookDTO>>;
    handleAddBook: (e: React.FormEvent) => void;
}

const BookForm: React.FC<BookFormProps> = ({ books, setBooks, handleAddBook }) => {
    const [formatData, setFormatData] = useState<string>('');

    function formatDatInput (value: string) {
        return value.split('T')[0];
    }

    return (
        <form onSubmit={handleAddBook} style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '400px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            backgroundColor: '#fff'
        }}>
            <h1 style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                color: '#333'
            }}>Cadastrar um Book</h1>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="bookName" style={{ color: '#333', marginBottom: '0.5rem', display: 'block' }}>Book Name:</label>
                <input
                    type="text"
                    id="bookName"
                    value={books.Name}
                    onChange={(e) =>
                        setBooks({ ...books, Name: e.target.value })
                    }
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        color: '#333',
                        backgroundColor: '#f7f7f7',
                        outline: 'none',
                    }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="author" style={{ color: '#333', marginBottom: '0.5rem', display: 'block' }}>Author:</label>
                <input
                    type="text"
                    id="author"
                    value={books.Author}
                    onChange={(e) =>
                        setBooks({ ...books, Author: e.target.value })
                    }
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        color: '#333',
                        backgroundColor: '#f7f7f7',
                        outline: 'none',
                    }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="price" style={{ color: '#333', marginBottom: '0.5rem', display: 'block' }}>Price:</label>
                <CurrencyInput
                    id="price"
                    value={books.Price}
                    decimalsLimit={2}
                    prefix="$"
                    onValueChange={(value) =>
                        setBooks({ ...books, Price: Number(value) || 0 })
                    }
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        color: '#333',
                        backgroundColor: '#f7f7f7',
                        outline: 'none',
                    }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="category" style={{ color: '#333', marginBottom: '0.5rem', display: 'block' }}>Category:</label>
                <input
                    type="text"
                    id="category"
                    value={books.Category}
                    onChange={(e) =>
                        setBooks({ ...books, Category: e.target.value })
                    }
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        color: '#333',
                        backgroundColor: '#f7f7f7',
                        outline: 'none',
                    }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="date" style={{ color: '#333', marginBottom: '0.5rem', display: 'block' }}>Date:</label>
                <input
                    type="date"
                    id="date"
                    value={books.Date ? formatDatInput(books.Date.toString()) : ''}
                    onChange={(e) =>
                        setBooks({ ...books, Date: new Date(e.target.value) })
                    }
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        color: '#333',
                        backgroundColor: '#f7f7f7',
                        outline: 'none',
                    }}
                />
            </div>

            <button type="submit" style={{
                padding: '0.75rem',
                borderRadius: '4px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
            }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005bb5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
            >
                 { books.Id === '' ? 'Add Book' : 'Update Book'}
                 
            </button>
        </form>
    );
};

export default BookForm;