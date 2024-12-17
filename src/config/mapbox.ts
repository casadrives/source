// Mapbox configuration
export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
  style: import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12',
  defaultCenter: [6.13, 49.61], // Luxembourg City
  defaultZoom: 13,
};

// Validate Mapbox configuration
if (!MAPBOX_CONFIG.accessToken) {
  throw new Error('Mapbox access token is required. Please set VITE_MAPBOX_TOKEN in your environment variables.');
}

export const validateMapboxToken = async () => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=${MAPBOX_CONFIG.accessToken}`
    );
    
    if (!response.ok) {
      throw new Error('Invalid Mapbox access token');
    }
    
    return true;
  } catch (error) {
    console.error('Mapbox token validation failed:', error);
    return false;
  }
};