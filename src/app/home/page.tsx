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

    const fetchAllBooks = async () => {
      setLoading(true);
      let allBooks: BookDTO[] = [];
      let page = 1;
      let hasMoreBooks = true;

      try {
        while (hasMoreBooks) {
          const response = await clienteservice.getBooks(page);  // Assumindo que getBooks aceita um parâmetro de página
          if (response && response.data && Array.isArray(response.data.Data)) {
            allBooks = [...allBooks, ...response.data.Data];
            page++;
            // Verifica se ainda há mais livros para buscar (baseado na resposta da API)
            hasMoreBooks = response.data.Data.length > 0;  // Ajuste conforme a API retorna dados
          } else {
            console.error("A resposta não é uma lista de livros:", response.data);
            hasMoreBooks = false;  // Para evitar um loop infinito
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
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
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
          <Box sx={{ maxWidth: '900px' }}>
            <Slider {...settings}>
              {books.map((book) => (
                <div key={book.Id} style={{ padding: '0 10px' }}>
                  <div style={{ border: '1px solid #ddd', padding: '16px', textAlign: 'center' }}>
                    <Typography variant="h6">{book.BookName}</Typography>
                    <Typography variant="body2">Autor: {book.Author}</Typography>
                    <Typography variant="body2">Categoria: {book.Category}</Typography>
                    <Typography variant="body2">Preço: R${book.Price.toFixed(2)}</Typography>
                    <Typography variant="body2">Data de cadastro: {format(parseISO(book.Date), 'dd/MM/yyyy')}</Typography>
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
