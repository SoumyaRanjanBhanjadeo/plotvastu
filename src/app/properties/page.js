'use client';

import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/public/layout/Header';
import { Footer } from '@/components/public/layout/Footer';
import { LoginModal } from '@/components/public/home/LoginModal';
import { PropertyCard } from '@/components/public/properties/PropertyCard';
import { PropertyFilter } from '@/components/public/properties/PropertyFilter';
import { FadeIn } from '@/components/shared/animations/FadeIn';
import { useProperties } from '@/hooks/useProperties';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function PropertiesPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    type: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    city: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { properties, pagination, loading, error } = useProperties(filters);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Toaster position="top-right" />
      <Header onLoginClick={() => setLoginModalOpen(true)} />
      
      <main className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FadeIn>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Properties
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Browse through our collection of premium properties.
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <FadeIn className="mb-8">
            <PropertyFilter filters={filters} onFilterChange={handleFilterChange} />
          </FadeIn>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {pagination ? (
                <>Showing {properties.length} of {pagination.total} properties</>
              ) : (
                'Loading properties...'
              )}
            </p>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No properties found matching your criteria.</p>
              <button
                onClick={() => handleFilterChange({ type: '', status: '', minPrice: '', maxPrice: '', city: '', search: '' })}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    // Show first, last, current, and neighbors
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= filters.page - 1 && page <= filters.page + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            page === filters.page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === filters.page - 2 ||
                      page === filters.page + 2
                    ) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.pages}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
