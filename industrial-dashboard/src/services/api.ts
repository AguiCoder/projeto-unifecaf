// Cliente HTTP base
import { API_BASE_URL } from '../constants/endpoints';

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // Status 204 (No Content) não tem body
    if (response.status === 204) {
      return undefined as T;
    }

    // Lê o texto da resposta uma única vez
    const text = await response.text();

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      // Tenta extrair mensagem de erro da resposta
      if (text) {
        try {
          const errorData = JSON.parse(text);
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else {
            errorMessage = text;
          }
        } catch {
          // Se não for JSON, usa o texto como mensagem
          errorMessage = text;
        }
      }
      
      throw new Error(errorMessage);
    }

    // Tenta parsear JSON, mas trata caso de resposta vazia
    if (!text) {
      return undefined as T;
    }
    
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new Error(`Failed to parse response: ${error}`);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${error}`);
    }
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${error}`);
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${error}`);
    }
  }
}

// Instância exportada (não será usada ainda, mas está pronta)
export const apiClient = new ApiClient();
