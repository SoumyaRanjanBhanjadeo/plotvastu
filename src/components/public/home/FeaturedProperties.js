'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, ArrowRight, Heart } from 'lucide-react';
import { FadeIn } from '@/components/shared/animations/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/shared/animations/StaggerContainer';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { PROPERTY_TYPES } from '@/lib/constants';

function PropertyCard({ property }) {
  const typeLabel = PROPERTY_TYPES.find(t => t.value === property.type)?.label || property.type;
  const primaryImage = property.images?.find(img => img.isPrimary)?.url || 
                       property.images?.[0]?.url || 
                       '/placeholder-property.jpg';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow"
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
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
            {typeLabel}
          </span>
          {property.isFeatured && (
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>

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
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{property.location?.city}, {property.location?.state}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{property.area?.value} {property.area?.unit}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">
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

export function FeaturedProperties() {
  const { properties, loading, error } = useFeaturedProperties(6);

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Featured Properties
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover Your Perfect{' '}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Property
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our handpicked selection of premium properties. 
            From plots to villas, find what suits your needs.
          </p>
        </FadeIn>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured properties available at the moment.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <StaggerItem key={property._id}>
                <PropertyCard property={property} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* View All Button */}
        <FadeIn delay={0.4} className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            View All Properties
            <ArrowRight className="w-5 h-5" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
