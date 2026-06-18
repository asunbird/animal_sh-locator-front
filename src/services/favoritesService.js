import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export async function saveFavorite(shelter) {
  try {
    const response = await axios.post(`${API_URL}/favorites`, shelter);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save favorite', { cause: error });
  }
}

export async function removeFavorite(shelterId) {
  try {
    const response = await axios.delete(`${API_URL}/favorites/${shelterId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove favorite', { cause: error });
  }
}

export async function fetchUserFavorites() {
  try {
    const response = await axios.get(`${API_URL}/favorites`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch favorites', { cause: error });
  }
}

export async function syncLocalStorageFavorites(favorites, token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(`${API_URL}/favorites/sync`, { favorites }, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to sync favorites', { cause: error });
  }
}
