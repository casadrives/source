import { MAPBOX_CONFIG } from '../config/mapbox';

export async function reverseGeocode(longitude: number, latitude: number) {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
      `access_token=${MAPBOX_CONFIG.accessToken}&` +
      'country=lu&' + // Limit to Luxembourg
      'types=address,poi&' + // Only addresses and points of interest
      'language=fr,en,de,lu' // Support multiple languages
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    return data.features[0];
  } catch (error) {
    console.error('Error getting address:', error);
    throw error;
  }
}

export async function searchAddress(query: string) {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
      `access_token=${MAPBOX_CONFIG.accessToken}&` +
      'country=lu&' +
      'types=address,poi&' +
      'language=fr,en,de,lu'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address suggestions');
    }

    const data = await response.json();
    return data.features;
  } catch (error) {
    console.error('Error searching address:', error);
    throw error;
  }
}