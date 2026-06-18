import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../provider/authContext';
import { saveFavorite, removeFavorite, fetchUserFavorites } from '../services/favoritesService';

export const useSaveFavorites = () => {
  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('paws_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      if (token) {
        try {
          setIsLoading(true);
          const data = await fetchUserFavorites();
          setFavorites(data.favorites || []);
        } catch (error) {
          console.error('Failed to load favorites from backend:', error);
          const saved = localStorage.getItem('paws_favorites');
          setFavorites(saved ? JSON.parse(saved) : []);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadFavorites();
  }, [token]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem('paws_favorites', JSON.stringify(favorites));
    }
  }, [favorites, token]);

  const toggleFavorite = async (shelter) => {
    setFavorites((prev) => {
      const isFav = prev.some((f) => f.id === shelter.id);
      if (isFav) {
        return prev.filter((f) => f.id !== shelter.id);
      } else {
        return [...prev, shelter];
      }
    });

    if (token) {
      try {
        const isFav = favorites.some((f) => f.id === shelter.id);
        if (isFav) {
          await removeFavorite(shelter.id);
        } else {
          await saveFavorite(shelter);
        }
      } catch (error) {
        console.error('Failed to sync favorite with backend:', error);
      }
    }
  };

  const isFavorite = (shelterId) => {
    return favorites.some((f) => f.id === shelterId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoading,
  };
};



