'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Square, Heart, ArrowRight } from 'lucide-react';
import { PROPERTY_TYPES, PROPERTY_STATUS } from '@/lib/constants';

export function PropertyCard({ property }) {
  const typeLabel = PROPERTY_TYPES.find(t => t.value === property.type)?.label || property.type;
  const statusConfig = PROPERTY_STATUS.find(s => s.value === property.status);
  const primaryImage = property.images?.find(img => img.isPrimary)?.url || 
                       property.images?.[0]?.url || 
                       '/placeholder-property.jpg';

  const statusColors = {
    green: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    red: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    yellow: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
            {typeLabel}
          </span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[statusConfig?.color] || 'bg-gray-100 text-gray-700'}`}>
            {statusConfig?.label || property.status}
          </span>
        </div>

        {/* Favorite Button */}
        {/* <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
          <Heart className="w-5 h-5" />
        </button> */}

        {/* Price Overlay */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-2xl font-bold text-white">
            {property.formattedPrice || `₹${property.price?.amount?.toLocaleString('en-IN')}`}
          </span>
          {property.price?.negotiable && (
            <span className="ml-2 text-sm text-green-300">Negotiable</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1">{property.location?.address}, {property.location?.city}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{property.area?.value} {property.area?.unit}</span>
          </div>
          {property.views > 0 && (
            <span className="text-gray-400 dark:text-gray-500">{property.views} views</span>
          )}
        </div>

        {/* Features Tags */}
        {property.features && property.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                +{property.features.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {property.formattedPrice || `₹${property.price?.amount?.toLocaleString('en-IN')}`}
            </span>
          </div>
          <Link
            href={`/properties/${property._id}`}
            className="flex items-center gap-1 text-blue-600 font-medium hover:gap-2 transition-all"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
