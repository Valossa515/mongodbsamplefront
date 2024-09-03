import axios from "axios";
import { BookDTO } from "../models/Book";

const clienteservice = {
    createBook: async (book: BookDTO) => {
        try {
            const response = await axios.post("http://localhost:5124/books/cadastro", book, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (e) {
            console.log(e);
        }
    },

    getBooks: async () => {
        try {
            const response = await axios.get("http://localhost:5124/books");
            return response.data;
        } catch (e) {
            console.log(e);
        }
    },

    updateBooks: async (id: string, book: BookDTO) => {
        try
        {
            const response = await axios.put(`http://localhost:5124/books/${id}`, book, {
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
            const response = await axios.delete(`http://localhost:5124/books/${id}`);
            return response.data;
        }
        catch(e)
        {
            console.log(e);
        }
    }
};

export default clienteservice;