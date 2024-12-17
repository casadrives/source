import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG } from '../config/mapbox';

interface Marker {
  coordinates: [number, number];
  type: 'pickup' | 'dropoff' | 'driver' | 'driver-busy';
}

interface LocationMapProps {
  className?: string;
  center?: [number, number];
  markers?: Marker[];
  showRoute?: boolean;
}

// Set Mapbox access token
mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

export function LocationMap({ 
  className = '', 
  center = MAPBOX_CONFIG.defaultCenter,
  markers = [], 
  showRoute = false 
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center,
      zoom: MAPBOX_CONFIG.defaultZoom,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.AttributionControl({
      compact: true
    }));

    return () => {
      map.current?.remove();
    };
  }, []);

  // Rest of the component remains the same...
  
  return (
    <div 
      ref={mapContainer} 
      className={`${className} relative bg-gray-100`}
      style={{ minHeight: '300px' }}
    />
  );
}