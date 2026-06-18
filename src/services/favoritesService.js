import axios from 'axios';
import { getJwtToken } from './authService';

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

function getAuthHeaders(token) {
  const finalToken = token || getJwtToken();
  const headers = finalToken ? { Authorization: `Bearer ${finalToken}` } : {};
  return headers;
}

export async function saveFavorite(shelter, token) {
  try {
    const headers = getAuthHeaders(token);

    console.log('[saveFavorite] Original shelter from map card:', {
      id: shelter.id,
      tags: shelter.tags,
      hasWebsite: !!shelter.tags?.website,
      hasPhone: !!shelter.tags?.phone,
      hasEmail: !!shelter.tags?.email,
      hasAddress: !!shelter.tags?.['addr:street'],
    });

    const body = transformShelterToFavorite(shelter);

    console.log('[saveFavorite] Transformed body (what gets sent to backend):', JSON.stringify(body, null, 2));

    const response = await axios.post(`${API_URL}/favorites`, body, { headers });

    console.log('[saveFavorite] Response from backend:', JSON.stringify(response.data, null, 2));
    console.log('[saveFavorite] Backend response has all fields?', {
      hasId: !!response.data.id || !!response.data._id,
      hasName: !!response.data.shelter?.name || !!response.data.name,
      hasAddress: !!response.data.shelter?.address || !!response.data.address,
      hasWebsite: !!response.data.shelter?.website || !!response.data.website,
      hasPhone: !!response.data.shelter?.phone || !!response.data.phone,
    });

    return response.data;
  } catch (error) {
    console.error('[saveFavorite] Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.message,
    });
    if (error.response?.status === 401) {
      console.warn('Token unauthorized, falling back to localStorage');
      return null;
    }
    throw new Error(error.response?.data?.message || 'Failed to save favorite', { cause: error });
  }
}

export async function removeFavorite(shelterId, token) {
  try {
    const headers = getAuthHeaders(token);
    const response = await axios.delete(`${API_URL}/favorites/${shelterId}`, { headers });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn('Token unauthorized, falling back to localStorage');
      return null;
    }
    throw new Error(error.response?.data?.message || 'Failed to remove favorite', { cause: error });
  }
}

export async function fetchUserFavorites(token) {
  try {
    const headers = getAuthHeaders(token);
    const response = await axios.get(`${API_URL}/favorites`, { headers });

    console.log('[fetchUserFavorites] Response from backend:', {
      count: response.data.items?.length || response.data.favorites?.length,
      firstItem: response.data.items?.[0] || response.data.favorites?.[0],
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn('Token unauthorized, falling back to localStorage');
      return { favorites: [] };
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch favorites', { cause: error });
  }
}

export async function syncLocalStorageFavorites(favorites, token) {
  try {
    const headers = getAuthHeaders(token);
    const transformedFavorites = favorites.map(transformShelterToFavorite);
    const response = await axios.post(`${API_URL}/favorites/sync`, { favorites: transformedFavorites }, { headers });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn('Favorites sync not authorized');
    } else {
      console.warn('Favorites sync not available:', error.response?.status);
    }
    return null;
  }
}
