import { BookDTO } from '@/app/models/Book';
import clienteservice from '@/app/services/clienteService';
import React, { useEffect, useState } from 'react';

interface TableProps {
    books: BookDTO[];
    setBooks: React.Dispatch<React.SetStateAction<BookDTO[]>>;
    SetCurrentBook: React.Dispatch<React.SetStateAction<BookDTO>>;
}

const fieldStyle =
{
     padding: '1rem', border: '1px solid #ddd', color: '#000' 
}

const Table: React.FC<TableProps> = ({ books, SetCurrentBook, setBooks  }) => {
    const [tableData, setTableData] = useState(books);

    function formatDatInput (value: string) {
        return value.split('T')[0];
    }

    console.log(books, tableData);
    
    useEffect(() => {
        setTableData(books);
    }, [books]);

    const handleUpdate = (index: number) => {
        const bookSelected = tableData.filter((item, i) => {
            if (i === index) {
                return item
            }
        });
        SetCurrentBook(bookSelected[0]);
    };

    const handleDelete = async (id: string) => {
        await clienteservice.deleteBooks(id);
        setBooks((prevBooks) => prevBooks.filter((book) => book.Id !== id));
    };

    return (
        <div style={{
            marginTop: '2rem',
            width: '100%',
            maxWidth: '1000px',
            overflowX: 'auto',
        }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: '#fff',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            }}>
                <thead>
                    <tr style={{
                        backgroundColor: '#0070f3',
                        color: '#fff',
                    }}>
                        <th style={fieldStyle}>Id</th>
                        <th style={fieldStyle}>Book Name</th>
                        <th style={fieldStyle}>Author</th>
                        <th style={fieldStyle}>Category</th>
                        <th style={fieldStyle}>Price</th>
                        <th style={fieldStyle}>Date</th>
                        <th style={fieldStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td style={fieldStyle}>{row.Id}</td>
                            <td style={fieldStyle}>{row.BookName}</td>
                            <td style={fieldStyle}>{row.Author}</td>
                            <td style={fieldStyle}>{row.Category}</td>
                            <td style={fieldStyle}>{row.Price}</td>
                            <td style={fieldStyle}>{row.Date ? formatDatInput(row.Date.toString()) : ''}</td>
                            <td style={fieldStyle}>
                                
                                <button onClick={() => handleUpdate(index)}>
                                    Update
                                </button>

                                <button onClick={() => handleDelete(row.Id)} style={{ marginLeft: '1rem' }}>
                                    Delete
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;