import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "c6b87637016253f93a436222b07d5771"; // Chave pública TMDB
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const useMovieImage = (movieName: string, year?: string) => {
  // Fallback inicial: imagem placeholder com o nome do filme
  const [imageUrl, setImageUrl] = useState<string>(
    `https://placehold.co/400x600/e2e8f0/10476E?text=${encodeURIComponent(movieName || "Filme")}`
  );

  useEffect(() => {
    if (!movieName) return;

    const fetchImage = async () => {
      try {
        const query = year 
            ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}&year=${year}`
            : `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`;

        const response = await axios.get(query);
        
        if (response.data.results && response.data.results.length > 0) {
          const posterPath = response.data.results[0].poster_path;
          if (posterPath) {
            setImageUrl(`${IMAGE_BASE_URL}${posterPath}`);
          }
        }
      } catch (error) {
        // Mantém o fallback se der erro
        console.error("Erro ao buscar imagem TMDB", error);
      }
    };

    fetchImage();
  }, [movieName, year]);

  return imageUrl;
};