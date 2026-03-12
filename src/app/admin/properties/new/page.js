'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PropertyForm } from '@/components/dashboard/properties/PropertyForm';
import { FadeIn } from '@/components/shared/animations/FadeIn';

export default function NewPropertyPage() {
  return (
    <div>
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/properties"
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Property</h1>
            <p className="text-gray-600 mt-1 dark:text-gray-400">Create a new property listing</p>
          </div>
        </div>
      </FadeIn>

      {/* Form */}
      <FadeIn delay={0.1}>
        <PropertyForm />
      </FadeIn>
    </div>
  );
}
