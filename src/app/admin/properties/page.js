'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { propertyAPI } from '@/lib/api';
import { FadeIn } from '@/components/shared/animations/FadeIn';
import { PROPERTY_TYPES, PROPERTY_STATUS } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function PropertiesAdminPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAllAdmin({ search: searchQuery });
      setProperties(response.data.data);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchQuery]);

  const handleDelete = async (id) => {
    try {
      await propertyAPI.delete(id);
      toast.success('Property deleted successfully');
      setDeleteConfirm(null);
      fetchProperties();
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await propertyAPI.toggleFeatured(id);
      toast.success('Featured status updated');
      fetchProperties();
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const getTypeLabel = (type) => PROPERTY_TYPES.find(t => t.value === type)?.label || type;
  const getStatusConfig = (status) => PROPERTY_STATUS.find(s => s.value === status);

  return (
    <div>
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your property listings</p>
          </div>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </Link>
        </div>
      </FadeIn>

      {/* Search */}
      <FadeIn delay={0.1}>
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </FadeIn>

      {/* Properties Table */}
      <FadeIn delay={0.2}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">No properties found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Property</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {properties.map((property) => {
                    const statusConfig = getStatusConfig(property.status);
                    const primaryImage = property.images?.find(img => img.isPrimary)?.url || 
                                         property.images?.[0]?.url;

                    return (
                      <tr key={property._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-xl overflow-hidden shrink-0">
                              {primaryImage ? (
                                <img src={primaryImage} alt={property.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">{property.title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{property.location?.city}</p>
                              {property.isFeatured && (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-1">
                                  <Star className="w-3 h-3 fill-amber-600" />
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                            {getTypeLabel(property.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900 dark:text-white">
                            ₹{property.price?.amount?.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            statusConfig?.color === 'green' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                            statusConfig?.color === 'red' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                            'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                          }`}>
                            {statusConfig?.label || property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Eye className="w-4 h-4" />
                            {property.views}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleFeatured(property._id)}
                              className={`p-2 rounded-lg transition-colors ${
                                property.isFeatured 
                                  ? 'bg-amber-100 text-amber-600' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={property.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                            >
                              <Star className={`w-4 h-4 ${property.isFeatured ? 'fill-current' : ''}`} />
                            </button>
                            <Link
                              href={`/admin/properties/${property._id}/edit`}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(property._id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
