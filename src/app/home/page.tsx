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
import useHttp from '../Hooks/useHttp';

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<BookDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { request } = useHttp();
  const clienteServiceInstance = clienteservice(request);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      window.location.href = '/';
      return;
    }

    const fetchAllBooks = async () => {
      setLoading(true);
      let allBooks: BookDTO[] = [];
      let page = 1;
      let hasMoreBooks = true;

      try {
        while (hasMoreBooks) {
          const response = await clienteServiceInstance.getBooks(page);
          if (response && response.Data && Array.isArray(response.Data)) {
            allBooks = [...allBooks, ...response.Data];
            page++;
            hasMoreBooks = response.Data.length > 0;
          } else {
            console.error("A resposta não é uma lista de livros:", response?.Data);
            hasMoreBooks = false;
          }
        }
        setBooks(allBooks);
      } catch (error) {
        console.error("Erro ao buscar os livros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBooks();
  }, []);

  const settings = {
    dots: books.length > 1,
    infinite: books.length > 1,
    autoplay: books.length > 1,
    autoplaySpeed: 2000,
    speed: 1000,
    slidesToShow: Math.min(3, books.length),
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
          <Box
            sx={{
              maxWidth: '900px',
              margin: '0 auto',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Slider {...settings}>
              {books.map((book) => (
                <div key={book.Id} style={{ padding: '10px' }}>
                  <div
                    style={{
                      border: '1px solid #ddd',
                      padding: '16px',
                      textAlign: 'center',
                      minHeight: '200px',
                      minWidth: '200px',
                      borderRadius: '8px',
                      position: 'relative',
                      backgroundImage: 'url(/assets/images/book-background.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      margin: '0 10px',
                    }}
                  >
                    <Typography
                      variant="h5"
                      style={{
                        textAlign: 'center', 
                        wordWrap: 'break-word', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        maxHeight: '60px', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {book.BookName}
                    </Typography>
                    <Typography variant="body2">Autor: {book.Author}</Typography>
                    <Typography variant="body2">Categoria: {book.Category}</Typography>
                    <Typography variant="body2">Preço: R${book.Price.toFixed(2)}</Typography>
                    <Typography variant="body2">
                      Data de cadastro: {format(parseISO(book.Date), 'dd/MM/yyyy')}
                    </Typography>
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
