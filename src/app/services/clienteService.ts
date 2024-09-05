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
    }
};

export default clienteservice;