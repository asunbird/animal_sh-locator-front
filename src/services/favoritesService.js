import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

function transformShelterToFavorite(shelter) {
  const lat = shelter.lat || (shelter.center && shelter.center.lat);
  const lon = shelter.lon || (shelter.center && shelter.center.lon);
  const tags = shelter.tags || {};

  const body = {
    location: {
      latitude: lat,
      longitude: lon,
    },
  };

  if (tags.name) body.name = tags.name;
  if (tags['addr:housenumber'] || tags['addr:street'] || tags['addr:city']) {
    body.address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
      .filter(Boolean)
      .join(' ');
  }
  if (tags.website) body.website = tags.website;
  if (tags.phone) body.phone = tags.phone;
  if (tags.email) body.email = tags.email;
  if (tags.opening_hours) body.hours = tags.opening_hours;
  if (tags.google_maps_url) body.googleMapsUrl = tags.google_maps_url;
  if (tags.apple_maps_url) body.appleMapsUrl = tags.apple_maps_url;

  return body;
}

export async function saveFavorite(shelter) {
  try {
    const body = transformShelterToFavorite(shelter);
    const response = await axios.post(`${API_URL}/favorites`, body);
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
    const transformedFavorites = favorites.map(transformShelterToFavorite);
    const response = await axios.post(`${API_URL}/favorites/sync`, { favorites: transformedFavorites }, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to sync favorites', { cause: error });
  }
}
