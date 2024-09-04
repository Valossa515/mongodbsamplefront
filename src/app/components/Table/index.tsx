import { BookDTO } from '@/app/models/Book';
import clienteservice from '@/app/services/clienteService';
import React, { useEffect, useState } from 'react';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TableProps {
    books: BookDTO[];
    setBooks: React.Dispatch<React.SetStateAction<BookDTO[]>>;
    SetCurrentBook: React.Dispatch<React.SetStateAction<BookDTO>>;
}

const TableComponent: React.FC<TableProps> = ({ books, SetCurrentBook, setBooks }) => {
    const [tableData, setTableData] = useState(books);

    function formatDateInput(value: string) {
        return value.split('T')[0];
    }

    useEffect(() => {
        setTableData(books);
    }, [books]);

    const handleUpdate = (index: number) => {
        const bookSelected = tableData.filter((item, i) => i === index);
        SetCurrentBook(bookSelected[0]);
    };

    const handleDelete = async (id: string) => {
        await clienteservice.deleteBooks(id);
        setBooks((prevBooks) => prevBooks.filter((book) => book.Id !== id));
    };

    return (
        <TableContainer component={Paper} style={{ marginTop: '2rem', maxWidth: '1000px', overflowX: 'auto' }}>
            <Table>
                <TableHead>
                    <TableRow style={{ backgroundColor: '#0070f3' }}>
                        <TableCell style={{ color: '#fff', padding: '1rem', border: '1px solid #ddd' }}>Id</TableCell>
                        <TableCell style={{ color: '#fff', padding: '1rem', border: '1px solid #ddd' }}>Book Name</TableCell>
                        <TableCell style={{ color: '#fff', padding: '1rem', border: '1px solid #ddd' }}>Author</TableCell>
                        <TableCell style={{ color: '#fff', padding: '1rem', border: '1px solid #ddd' }}>Category</TableCell>
                        <TableCell style={{ color: '#fff', padding: '1rem', border: '1px solid #ddd' }}>Price</TableCell>
                        <TableCell style={{ color: '#fff', padding: '1rem', border: '1px solid #ddd' }}>Date</TableCell>
                        <TableCell style={{ color: '#fff', padding: '1rem', border: '1px solid #ddd' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell style={{ padding: '1rem', border: '1px solid #ddd' }}>{row.Id}</TableCell>
                            <TableCell style={{ padding: '1rem', border: '1px solid #ddd' }}>{row.BookName}</TableCell>
                            <TableCell style={{ padding: '1rem', border: '1px solid #ddd' }}>{row.Author}</TableCell>
                            <TableCell style={{ padding: '1rem', border: '1px solid #ddd' }}>{row.Category}</TableCell>
                            <TableCell style={{ padding: '1rem', border: '1px solid #ddd' }}>{row.Price}</TableCell>
                            <TableCell style={{ padding: '1rem', border: '1px solid #ddd' }}>{row.Date ? formatDateInput(row.Date.toString()) : ''}</TableCell>
                            <TableCell style={{ padding: '1rem', border: '1px solid #ddd' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={() => handleUpdate(index)} color="primary" aria-label="update">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(row.Id)} color="secondary" aria-label="delete" style={{ marginLeft: '1rem' }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableComponent;
