'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { FormSelect } from '@/components/shared/FormSelect';
import { PROPERTY_TYPES } from '@/lib/constants';

export function PropertyFilter({ filters, onFilterChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = async (key, value) => {
    // Validate min price
    if (key === 'minPrice') {
      const minPrice = Number(value);
      if (minPrice < 0) {
        await Swal.fire({
          title: 'Invalid Price',
          text: 'Minimum price cannot be below 0.',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
        return;
      }
    }

    // Validate max price
    if (key === 'maxPrice') {
      const maxPrice = Number(value);
      const minPrice = Number(localFilters.minPrice);
      if (maxPrice < 0) {
        await Swal.fire({
          title: 'Invalid Price',
          text: 'Maximum price cannot be below 0.',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
        return;
      }
      if (localFilters.minPrice && maxPrice < minPrice) {
        await Swal.fire({
          title: 'Invalid Price Range',
          text: 'Maximum price cannot be less than minimum price.',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
        return;
      }
    }

    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      type: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      city: '',
      search: '',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(v => v !== '');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="relative border rounded-xl focus-within:ring-2 focus:outline-none focus-within:ring-blue-500">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={localFilters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-4 flex flex-wrap items-center gap-3">
        {/* Property Type */}
        <div className="w-40">
          <FormSelect
            options={[{ value: '', label: 'All Types' }, ...PROPERTY_TYPES]}
            value={localFilters.type || ''}
            onChange={(value) => handleChange('type', value)}
            placeholder="Type"
          />
        </div>

        {/* City Input */}
        <input
          type="text"
          placeholder="City"
          value={localFilters.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-500 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
        />

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={localFilters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-500 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-28 appearance-none"
            style={{ MozAppearance: 'textfield' }}
          />
          <span className="text-gray-400 dark:text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max Price"
            value={localFilters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-500 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-28 appearance-none"
            style={{ MozAppearance: 'textfield' }}
          />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReset}
            className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-white rounded-xl transition-colors cursor-pointer bg-red-500 hover:bg-red-600"
          >
            <X className="w-4 h-4" />
            Reset
          </motion.button>
        )}

        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto flex items-center gap-2 px-4 py-3 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          {isExpanded ? 'Less Filters' : 'More Filters'}
        </button>
      </div>

      {/* Expanded Filters */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {/* Status */}
            <FormSelect
              label="Status"
              options={[
                { value: '', label: 'All Status' },
                { value: 'available', label: 'Available' },
                { value: 'sold', label: 'Sold' },
                { value: 'reserved', label: 'Reserved' },
              ]}
              value={localFilters.status || ''}
              onChange={(value) => handleChange('status', value)}
            />

            {/* Sort By */}
            <FormSelect
              label="Sort By"
              options={[
                { value: 'createdAt', label: 'Newest First' },
                { value: 'price.amount', label: 'Price' },
                { value: 'views', label: 'Most Viewed' },
              ]}
              value={localFilters.sortBy || 'createdAt'}
              onChange={(value) => handleChange('sortBy', value)}
            />

            {/* Sort Order */}
            <FormSelect
              label="Order"
              options={[
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' },
              ]}
              value={localFilters.sortOrder || 'desc'}
              onChange={(value) => handleChange('sortOrder', value)}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
