import { useState, useEffect } from 'react';
import { debounce } from '../utils/debounce';
import { searchAddress } from '../utils/location';

interface AddressFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

export function useAddressSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const features = await searchAddress(searchQuery);
      setSuggestions(features);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
  };
}