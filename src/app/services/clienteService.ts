import axios from "axios";
import { BookDTO } from "../models/Book";
import { BACKEND_URL } from "../utils/system";
interface LoginResponse {
    token: string;
    id: number;
}

interface RegisterResponse {
    Id: string;
    Sucesso: boolean;
    Mensagem: string;
    Status: number;
}

const clienteservice = {
    createBook: async (book: BookDTO) => {
        try {
            const response = await axios.post(`${BACKEND_URL}books/cadastro`, book, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (e) {
            console.error(e);
        }
    },

    getBooks: async (page = 1, pageSize = 10) => {
        try {
            const response = await axios.get(`${BACKEND_URL}books`, {
                params: {
                    page: page,
                    pageSize: pageSize
                }
            });

            return response;
        } catch (e) {
            console.error("Error fetching books:", e);
            throw e;
        }
    },

    updateBooks: async (id: string, book: BookDTO) => {
        try
        {
            const response = await axios.put(`${BACKEND_URL}books/${id}`, book, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        }
        catch(e)
        {
            console.error(e);
        }
    },

    deleteBooks: async (id: string) => {
        try
        {
            const response = await axios.delete(`${BACKEND_URL}books/${id}`);
            return response.data;
        }
        catch(e)
        {
            console.error(e);
        }
    },

    login: async (email: string, password: string): Promise<LoginResponse | null>  => {
        try {
            const response = await axios.post(`${BACKEND_URL}users/login`, {
              email,
              password,
              headers: {
                'Content-Type': 'application/json',
              },
              
            }).then(response => response.data);
            return response.Result.Token;
          } catch (error) {
            console.error('Error:', error);
            return null;
          }
    },

    register: async (name: string, email: string, password: string, confirmPassword: string): Promise<RegisterResponse | null> => {
        try {
          const response = await axios.post(`${BACKEND_URL}users/register`, {
            name,
            email,
            password,
            confirmPassword,
          }).then(response => response.data);;
          return response.Result;
        } catch (error) {
          console.error('Error:', error);
          return null;
        }
      }
};

export default clienteservice;