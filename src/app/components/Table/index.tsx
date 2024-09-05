import { BookDTO } from '@/app/models/Book';
import clienteservice from '@/app/services/clienteService';
import React, { useEffect, useState } from 'react';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TableProps {
    books: BookDTO[];
    setBooks: React.Dispatch<React.SetStateAction<BookDTO[]>>;
    SetCurrentBook: React.Dispatch<React.SetStateAction<BookDTO>>;
}

const TableComponent: React.FC<TableProps> = ({ books, SetCurrentBook, setBooks }) => {
    const [tableData, setTableData] = useState<BookDTO[]>([]);
    const [showToastError, setShowToastError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    function formatDateInput(value: string) {
        return value.split('T')[0];
    }

    useEffect(() => {
        if (showToastError) {
            toast.success("Book deleted successfully", {
                onClose: () => setShowToastError(false),
                position: "top-right",
                autoClose: 2000,
                pauseOnFocusLoss: false,
            });
        }
    }, [showToastError]);

    useEffect(() => {
        fetchBooks(page, pageSize);
    }, [page]);

    useEffect(() => {
        setTableData(books);
    }, [books]);

    const handleUpdate = (index: number) => {
        const bookSelected = tableData.filter((item, i) => i === index);
        SetCurrentBook(bookSelected[0]);
    };

    const handleOpenModal = (id: string) => {
        setDeleteId(id);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await clienteservice.deleteBooks(deleteId);
                setBooks((prevBooks) => prevBooks.filter((book) => book.Id !== deleteId));
                setShowToastError(true); // This should trigger the toast
            } catch (error) {
                console.error("Error deleting book:", error);
            }
            handleCloseModal();
        }
    };

    const fetchBooks = async (page: number, pageSize: number) => {
        try {
            const response = await clienteservice.getBooks(page, pageSize);
            
            if (response && response.data) {
                console.log('Books response:', response.data);

                const books = response.data.Data || [];
                const totalCount = response.data.TotalCount || 0;
    
                setBooks(books);
                setTotalCount(totalCount);
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <>
           <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Pagination
                    count={Math.ceil(totalCount / pageSize)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>
            
            <TableContainer component={Paper} style={{ marginTop: '2rem', maxWidth: '1000px', overflowX: 'auto' }}>
                <ToastContainer pauseOnHover={false} draggable={false} autoClose={0}/>
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
                        {Array.isArray(tableData) && tableData.map((row, index) => (
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
                                        <IconButton onClick={() => handleOpenModal(row.Id)} color="secondary" aria-label="delete" style={{ marginLeft: '1rem' }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this book?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TableComponent;
