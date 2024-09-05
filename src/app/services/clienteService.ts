import axios from "axios";
import { BookDTO } from "../models/Book";
import { BACKEND_URL } from "../utils/system";

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
            console.log(e);
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
    
            // Certifique-se de que o formato da resposta está correto
            return response;
        } catch (e) {
            console.error("Error fetching books:", e);
            throw e; // Re-throw the error so it can be caught by the calling function
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
            console.log(e);
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
            console.log(e);
        }
    }
};

export default clienteservice;