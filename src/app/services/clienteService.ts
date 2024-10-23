import axios, { AxiosRequestConfig } from "axios";
import { BookDTO } from "../models/Book";
import { BACKEND_URL } from "../utils/system";
import { ReservationDTO } from "../models/Reservation";

interface GetBooksResponse {
  Data: BookDTO[]; // Array of BookDTOs
  TotalCount: number; // Total count of books
}
export interface SingleReservationResponse {
  Result: ReservationDTO;
  Status: number;
  Message: string | null;
  Errors: string | null;
  TraceId: string | null;
}
export interface GetReservationsResponse {
  Data: ReservationDTO[];
  TotalCount: number;
}

export interface RegisterResponse {
  Sucesso: boolean;
  Mensagem: string;
}

export interface LoginResponse {
  Result: {
    Token: string; // Token format
    Success: boolean;
    Message: string;
  };
}

// Modify clienteservice to not use hooks directly
const clienteservice = (
  request: <T>(url: string, config: AxiosRequestConfig) => Promise<T | null>
) => {

  const createBook = async (book: BookDTO): Promise<void> => {
    const token = localStorage.getItem("authToken");
    console.log("Token:", token);
    await request(`${BACKEND_URL}books/cadastro`, {
      method: "POST",
      data: book,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : undefined
      },
    });
  };

  const createReservation = async (reservation: ReservationDTO): Promise<void> => {
    const token = localStorage.getItem("authToken");
    await request(`${BACKEND_URL}reservations/cadastro`, {
      method: "POST",
      data: reservation,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : undefined
      },
    });
  };

  const getBooks = async (
    page = 1,
    pageSize = 10
  ): Promise<GetBooksResponse | null> => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await request<GetBooksResponse>(
        `${BACKEND_URL}books?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : undefined,
          },
        }
      );

      return response;
    } catch (error: any) {
      // Verifica se o erro é 401 (não autorizado)
      if (error.response && error.response.status === 401) {
        // Redireciona para a página de erro 401
        window.location.href = "/error?statusCode=401";
      } else {
        // Caso outro erro ocorra, você pode lidar aqui
        console.error("Ocorreu um erro ao buscar os livros:", error);
      }
      return null;
    }
  };

  const getReservations = async (
    page = 1,
    pageSize = 10
  ): Promise<GetReservationsResponse | null> => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await request<GetReservationsResponse>(
        `${BACKEND_URL}reservations?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : undefined
          },
        }
      );
      return response;
    }
    catch (error: any) {
      if (error.response && error.response.status === 401) {
        // Redireciona para a página de erro 401
        window.location.href = "/error?statusCode=401";
      } else {
        // Caso outro erro ocorra, você pode lidar aqui
        console.error("Ocorreu um erro ao buscar as reservas:", error);
      }
      return null;
    }
  };

  const updateBooks = async (id: string, book: BookDTO): Promise<void> => {
    const token = localStorage.getItem("authToken");
    await request(`${BACKEND_URL}books/${id}`, {
      method: "PUT",
      data: book,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : undefined
      },
    });
  };

  const updateReservations = async (id: string, reservation: ReservationDTO): Promise<void> => {
    const token = localStorage.getItem("authToken");
    await request(`${BACKEND_URL}reservations/devolucao/${id}`, {
      method: "PUT",
      data: reservation,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : undefined
      },
    });
  };

  const getReservationByIdOrUserName = async (
    userName?: string
): Promise<GetReservationsResponse | SingleReservationResponse | null> => {
    const token = localStorage.getItem("authToken");
    try {
        const response = await request<GetReservationsResponse | SingleReservationResponse>(
            `${BACKEND_URL}reservations/search?userName=${userName}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : undefined,
                },
            }
        );

        return response;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            // Redireciona para a página de erro 401
            window.location.href = "/error?statusCode=401";
        } else {
            console.error("Ocorreu um erro ao buscar as reservas:", error);
        }
        return null;
    }
};

  const deleteBooks = async (id: string): Promise<void> => {
    const token = localStorage.getItem("authToken");
    await request(`${BACKEND_URL}books/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : undefined
      },
    });
  };

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse | null> => {
    try {
      const response = await request<LoginResponse>(`${BACKEND_URL}users/login`, {
        method: "POST",
        data: { email, password },
        headers: { "Content-Type": "application/json" },
      });

      if (response && response.Result && response.Result.Token) {
        localStorage.setItem("authToken", response.Result.Token);
        return response;
      } else {
        throw new Error("Login falhou. Token não encontrado.");
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      window.location.href = "/error?statusCode=500";
      return null;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<RegisterResponse> => {
    try {
      const response = await request<{ Result: RegisterResponse }>(`${BACKEND_URL}users/register`, {
        method: "POST",
        data: { name, email, password, confirmPassword },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Resposta da API de registro:", response);

      const result = response?.Result;

      if (!result || !result.Sucesso) {
        return { Sucesso: false, Mensagem: "Falha no registro. Tente novamente." };
      }

      return result;
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error);
      window.location.href = "/error?statusCode=500";
      return { Sucesso: false, Mensagem: "Ocorreu um erro inesperado. Tente novamente." };
    }
  };

  return { createBook, createReservation, getBooks, updateBooks, deleteBooks, login, register, getReservations, updateReservations, getReservationByIdOrUserName };
};

export default clienteservice;
