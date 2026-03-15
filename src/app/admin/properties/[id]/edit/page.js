'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { propertyAPI } from '@/lib/api';
import { PropertyForm } from '@/components/dashboard/properties/PropertyForm';
import { FadeIn } from '@/components/shared/animations/FadeIn';
import toast from 'react-hot-toast';

export default function EditPropertyPage() {
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertyAPI.getById(params.id);
        setProperty(response.data.data);
      } catch (error) {
        toast.error('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Property not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/properties"
            className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
            <p className="text-gray-600 mt-1">Update property details</p>
          </div>
        </div>
      </FadeIn>

      {/* Form */}
      <FadeIn delay={0.1}>
        <PropertyForm initialData={property} />
      </FadeIn>
    </div>
  );
}
