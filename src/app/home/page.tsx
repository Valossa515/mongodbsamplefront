"use client";
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import LayoutWithDrawer from '../components/Drawer/LayoutWithDrawer';
import Slider from 'react-slick';
import clienteservice from '../services/clienteService';
import { BookDTO } from '../models/Book';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Box } from '@mui/material';
import { format, parseISO } from 'date-fns';

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<BookDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      window.location.href = '/';
      return;
    }

    const fetchBooks = async () => {
      try {
        const response = await clienteservice.getBooks();
        if (response && response.data && Array.isArray(response.data.Data)) {
          setBooks(response.data.Data);
          console.log("Livros carregados:", response.data.Data);
        } else {
          console.error("A resposta não é uma lista de livros:", response.data);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay : true,
    autoplaySpeed : 2000,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <LayoutWithDrawer>
      <Typography
        variant="h4"
        className="font-bold mb-8"
        sx={{ color: "#e0e0e0" }}
      >
        MongoDB CRUD Sample
      </Typography>
      <Typography variant="body1" className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Bem-vindo à página inicial! Aqui você pode visualizar os livros.
      </Typography>

      {loading ? (
        <Typography variant="body1" className="text-lg text-gray-700 dark:text-gray-300">
          Carregando livros...
        </Typography>
      ) : (
        books.length > 0 ? (
        <Box sx ={{
          maxWidth: '900px'
        }}>
            <Slider {...settings}>
            {books.map((book) => (
              console.log(books),
              <div key={book.Id} style={{ padding: '0 10px' }}>
                <div style={{ border: '1px solid #ddd', padding: '16px', textAlign: 'center' }}>
                  <Typography variant="h6">{book.BookName}</Typography>
                  <Typography variant="body2">Autor: {book.Author}</Typography>
                  <Typography variant="body2">Categoria: {book.Category}</Typography>
                  <Typography variant="body2">Preço: R${book.Price.toFixed(2)}</Typography>
                </div>
              </div>
            ))}
          </Slider>
        </Box>
        
        ) : (
          <Typography variant="body1" className="text-lg text-gray-700 dark:text-gray-300">
            Nenhum livro disponível no momento.
          </Typography>
        )
      )}
    </LayoutWithDrawer>
  );
};

export default HomePage;
