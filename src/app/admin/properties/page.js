'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Eye,
  Loader2,
  SlidersHorizontal,
  MapPin,
  Building2,
  IndianRupee,
  ImageOff,
} from 'lucide-react';
import { propertyAPI } from '@/lib/api';
import { FadeIn } from '@/components/shared/animations/FadeIn';
import { PROPERTY_TYPES, PROPERTY_STATUS } from '@/lib/constants';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function PropertiesAdminPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
      fetchProperties();
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: 'Delete Property?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6 lg:p-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Properties
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your property listings</p>
          </div>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </Link>
        </div>
      </FadeIn>

      {/* Search */}
      <FadeIn delay={0.1}>
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </FadeIn>

      {/* Properties Table */}
      <FadeIn delay={0.2}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No properties found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600">
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
                  {properties.map((property, index) => {
                    const statusConfig = getStatusConfig(property.status);
                    const primaryImage = property.images?.find(img => img.isPrimary)?.url ||
                      property.images?.[0]?.url;

                    return (
                      <motion.tr
                        key={property._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-xl overflow-hidden shrink-0">
                              {primaryImage ? (
                                <img src={primaryImage} alt={property.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageOff className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{property.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="w-3.5 h-3.5" />
                                {property.location?.city}
                              </div>
                              {property.isFeatured && (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-1">
                                  <Star className="w-3 h-3 fill-amber-500" />
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                            {getTypeLabel(property.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                            <IndianRupee className="w-4 h-4" />
                            {property.price?.amount?.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                            statusConfig?.color === 'green' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            statusConfig?.color === 'red' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                              'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              statusConfig?.color === 'green' ? 'bg-green-500' :
                              statusConfig?.color === 'red' ? 'bg-red-500' : 'bg-amber-500'
                            }`} />
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
                              className={`p-2 rounded-lg transition-all cursor-pointer ${
                                property.isFeatured
                                  ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                                  : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                              title={property.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                            >
                              <Star className={`w-4 h-4 ${property.isFeatured ? 'fill-current' : ''}`} />
                            </button>
                            <Link
                              href={`/admin/properties/${property._id}/edit`}
                              className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => confirmDelete(property._id)}
                              className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
