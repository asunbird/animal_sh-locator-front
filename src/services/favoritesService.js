import axios from 'axios';
import { getJwtToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || '';

function extractCoordinates(shelter) {
  // 1. Already transformed { location: { latitude, longitude } }
  if (shelter.location?.latitude != null && shelter.location?.longitude != null) {
    return {
      latitude: Number(shelter.location.latitude),
      longitude: Number(shelter.location.longitude),
    };
  }

  // 2. Flat properties: lat/lon, lat/lng, or latitude/longitude
  const lat = shelter.lat ?? shelter.latitude ?? shelter.center?.lat ?? shelter.position?.lat ?? shelter.coords?.lat ?? shelter.coords?.latitude;
  const lon = shelter.lon ?? shelter.lng ?? shelter.longitude ?? shelter.center?.lon ?? shelter.center?.lng ?? shelter.position?.lng ?? shelter.position?.lon ?? shelter.coords?.lng ?? shelter.coords?.longitude;

  if (lat != null && lon != null) {
    return { latitude: Number(lat), longitude: Number(lon) };
  }

  // 3. GeoJSON geometry.coordinates: [longitude, latitude]
  if (Array.isArray(shelter.geometry?.coordinates) && shelter.geometry.coordinates.length >= 2) {
    return {
      latitude: Number(shelter.geometry.coordinates[1]),
      longitude: Number(shelter.geometry.coordinates[0]),
    };
  }

  return null;
}

function transformShelterToFavorite(rawInput) {
  // Unwrap backend favorite records ({ id, createdAt, shelter: { ... } })
  const shelter = rawInput?.shelter && typeof rawInput.shelter === 'object' ? rawInput.shelter : rawInput;

  const coords = extractCoordinates(shelter);
  if (!coords || Number.isNaN(coords.latitude) || Number.isNaN(coords.longitude)) {
    console.error('[transformShelterToFavorite] Missing valid coordinates in shelter object:', rawInput);
    return null;
  }

  const tags = shelter.tags || {};

  const body = {
    location: {
      latitude: coords.latitude,
      longitude: coords.longitude,
    },
    name: tags.name || shelter.name || 'Unnamed Shelter',
  };

  const address =
    shelter.address ||
    [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
      .filter(Boolean)
      .join(' ');
  if (address) body.address = address;

  const rawWebsite = tags.website || shelter.website;
  if (rawWebsite) {
    body.website = /^https?:\/\//i.test(rawWebsite)
      ? rawWebsite
      : `https://${rawWebsite}`;
  }

  const phone = tags.phone || shelter.phone;
  if (phone) body.phone = String(phone);

  const email = tags.email || shelter.email;
  if (email) body.email = email;

  const hours = tags.opening_hours || shelter.hours;
  if (hours) body.hours = hours;

  const googleMapsUrl = tags.google_maps_url || shelter.googleMapsUrl;
  if (googleMapsUrl) body.googleMapsUrl = googleMapsUrl;

  const appleMapsUrl = tags.apple_maps_url || shelter.appleMapsUrl;
  if (appleMapsUrl) body.appleMapsUrl = appleMapsUrl;

  return body;
}

function getAuthHeaders(token) {
  const finalToken = token || getJwtToken();
  const headers = finalToken ? { Authorization: `Bearer ${finalToken}` } : {};
  return headers;
}

export async function saveFavorite(shelter, token) {
  const body = transformShelterToFavorite(shelter);
  if (!body) {
    throw new Error('Failed to transform shelter to favorite. Missing coordinates or required fields.');
  }

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
  if (!Array.isArray(favorites) || favorites.length === 0) {
    console.warn('No favorites to sync');
    return null;
  }

  // Keep only offline/guest favorites that haven't been saved to the backend yet
  const unsyncedFavorites = favorites.filter((item) => !item.createdAt);

  if (unsyncedFavorites.length === 0) {
    return null;
  }

  try {
    const headers = getAuthHeaders(token);
    const validBodies = favorites
      .map(transformShelterToFavorite)
      .filter(Boolean);

    if (validBodies.length === 0) {
      return null;
    }
    const requests = validBodies.map((body) =>
      axios.post(`${API_URL}/favorites`, body, { headers })
    );
    const responses = await Promise.all(requests);
    return responses.map((res) => res.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn('Favorites sync not authorized');
    } else {
     console.warn(
        'Favorites sync failed:',
        error.response?.status,
        error.response?.data || error.message
      );
    }
    return null;
  }
}


