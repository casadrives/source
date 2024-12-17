import React, { useRef, useEffect } from 'react';
import { MapPin, Loader, Navigation } from 'lucide-react';
import { useAddressSearch } from '../hooks/useAddressSearch';

interface AddressInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: { name: string; coordinates: [number, number] }) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  useCurrentLocation?: boolean;
  onUseCurrentLocation?: () => void;
  error?: string;
}

export function AddressInput({
  label,
  value,
  onChange,
  onSelect,
  icon,
  placeholder,
  useCurrentLocation,
  onUseCurrentLocation,
  error
}: AddressInputProps) {
  const { query, setQuery, suggestions, isLoading, error: searchError } = useAddressSearch();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update query when value changes externally
  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon || <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setQuery(e.target.value);
          }}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-${useCurrentLocation ? '10' : '3'} py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
        />
        {useCurrentLocation && onUseCurrentLocation && (
          <button
            type="button"
            onClick={onUseCurrentLocation}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
          >
            <Navigation className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Suggestions Dropdown */}
      {(isLoading || suggestions.length > 0) && query && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Loader className="h-5 w-5 animate-spin mx-auto mb-2" />
              <span>Searching addresses...</span>
            </div>
          ) : (
            <ul className="py-2">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect({
                        name: suggestion.place_name,
                        coordinates: suggestion.center
                      });
                      setQuery('');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{suggestion.place_name}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}