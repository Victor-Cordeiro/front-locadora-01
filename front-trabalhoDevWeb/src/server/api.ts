import axios from "axios";

// Configuração do axios com a URL base
export const api = axios.create({
  baseURL: "http://localhost:8080",  // Substitua pela sua URL do backend
});

// Interceptador de requisição (não há necessidade de validação de token ou login)
api.interceptors.request.use(
  (config) => {
    // Configurações adicionais podem ser feitas aqui, se necessário
    return config;
  },
  (error) => {
    console.error("Error in API request:", error);
    return Promise.reject(error);
  }
);

// Interceptador de resposta (simples, sem lógica de autenticação)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error in API response:", error);
    return Promise.reject(error);
  }
);

export default api;
