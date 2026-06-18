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
          const data = await fetchUserFavorites(token);
          console.log('[useSaveFavorites] Received from backend:', data);

          const favArray = data.items || data.favorites || [];
          console.log('[useSaveFavorites] Setting favorites array:', favArray);
          setFavorites(favArray);
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
    const shelterId = shelter.id || shelter._id;
    console.log('[toggleFavorite] Toggling shelter:', shelterId);

    setFavorites((prev) => {
      const isFav = prev.some((f) => (f.id || f._id) === shelterId);
      if (isFav) {
        console.log('[toggleFavorite] Removing from favorites');
        return prev.filter((f) => (f.id || f._id) !== shelterId);
      } else {
        console.log('[toggleFavorite] Adding to favorites');
        return [...prev, shelter];
      }
    });

    if (token) {
      try {
        const isFav = favorites.some((f) => (f.id || f._id) === shelterId);
        if (isFav) {
          console.log('[toggleFavorite] Calling removeFavorite with ID:', shelterId);
          await removeFavorite(shelterId, token);
        } else {
          console.log('[toggleFavorite] Calling saveFavorite');
          await saveFavorite(shelter, token);
        }
      } catch (error) {
        console.error('Failed to sync favorite with backend:', error);
        setFavorites((prev) => {
          const stillExists = prev.some((f) => (f.id || f._id) === shelterId);
          if (!stillExists) {
            return prev.filter((f) => (f.id || f._id) !== shelterId);
          }
          return prev;
        });
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



