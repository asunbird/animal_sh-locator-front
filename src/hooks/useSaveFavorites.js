import { useState, useEffect } from 'react';

// Custom Hook: useSaveFavorites
// Hooks must be at the top level of a React component or custom Hook
export const useSaveFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('paws_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('paws_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle function: adds or removes a shelter from favorites
  const toggleFavorite = (shelter) => {
    setFavorites((prev) => {
      const isFav = prev.some((f) => f.id === shelter.id);
      if (isFav) {
        // Remove from favorites
        return prev.filter((f) => f.id !== shelter.id);
      } else {
        // Add to favorites
        return [...prev, shelter];
      }
    });
  };

  // Check if a shelter is in favorites
  const isFavorite = (shelterId) => {
    return favorites.some((f) => f.id === shelterId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};



