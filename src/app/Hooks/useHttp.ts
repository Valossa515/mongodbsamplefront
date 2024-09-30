
import axios, { AxiosRequestConfig } from "axios";

const useHttp = () => {
    const request = async (url: string, config: AxiosRequestConfig = {}) => {
        try {
            const response = await axios(url, config);
            return response.data;
        } catch (error) {
            console.error("Erro ao fazer requisição:", error);
            throw error;
        }
    };

    return { request };
};

export default useHttp;
