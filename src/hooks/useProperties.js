'use client';

import { useState, useEffect, useCallback } from 'react';
import { propertyAPI } from '@/lib/api';

export function useProperties(filters = {}) {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await propertyAPI.getAll(filters);
      setProperties(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, pagination, loading, error, refetch: fetchProperties };
}

export function useFeaturedProperties(limit = 6) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const response = await propertyAPI.getFeatured(limit);
        setProperties(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch featured properties');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { properties, loading, error };
}

export function useProperty(id) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await propertyAPI.getById(id);
        setProperty(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
}
