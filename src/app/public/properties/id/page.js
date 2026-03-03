'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  MapPin, 
  Square, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Share2,
  Heart,
  Loader2,
  Check,
  Building2
} from 'lucide-react';
import { Header } from '@/components/public/layout/Header';
import { Footer } from '@/components/public/layout/Footer';
import { LoginModal } from '@/components/public/home/LoginModal';
import { FadeIn } from '@/components/shared/animations/FadeIn';
import { useProperty } from '@/hooks/useProperties';
import { inquiryAPI } from '@/lib/api';
import { PROPERTY_TYPES, PROPERTY_STATUS, PROPERTY_FEATURES } from '@/lib/constants';
import toast, { Toaster } from 'react-hot-toast';

export default function PropertyDetailPage() {
  const params = useParams();
  const { property, loading, error } = useProperty(params.id);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'inquiry',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await inquiryAPI.create({
        ...inquiryForm,
        propertyId: property._id,
      });
      toast.success('Inquiry submitted successfully! We will contact you soon.');
      setInquiryForm({ name: '', email: '', phone: '', message: '', type: 'inquiry' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header onLoginClick={() => setLoginModalOpen(true)} />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
        <Footer />
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Header onLoginClick={() => setLoginModalOpen(true)} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error || 'Property not found'}</p>
            <Link href="/properties" className="text-blue-600 hover:underline mt-4 inline-block">
              Back to Properties
            </Link>
          </div>
        </div>
        <Footer />
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </>
    );
  }

  const typeLabel = PROPERTY_TYPES.find(t => t.value === property.type)?.label || property.type;
  const statusConfig = PROPERTY_STATUS.find(s => s.value === property.status);
  const primaryImage = property.images?.find(img => img.isPrimary)?.url || property.images?.[0]?.url;

  return (
    <>
      <Toaster position="top-right" />
      <Header onLoginClick={() => setLoginModalOpen(true)} />
      
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <FadeIn>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative h-96 lg:h-125">
                    <img
                      src={primaryImage || '/placeholder-property.jpg'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                        {typeLabel}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        statusConfig?.color === 'green' ? 'bg-green-500 text-white' :
                        statusConfig?.color === 'red' ? 'bg-red-500 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                        {statusConfig?.label || property.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Thumbnail Grid */}
                  {property.images && property.images.length > 1 && (
                    <div className="p-4 grid grid-cols-4 gap-2">
                      {property.images.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                          <img
                            src={img.url}
                            alt={`${property.title} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Property Details */}
              <FadeIn delay={0.1}>
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {property.title}
                  </h1>
                  
                  <div className="flex items-center gap-2 text-gray-500 mb-6">
                    <MapPin className="w-5 h-5" />
                    <span>{property.location?.address}, {property.location?.city}, {property.location?.state}</span>
                  </div>

                  <div className="flex items-center gap-6 py-6 border-y border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Square className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Area</p>
                        <p className="font-semibold text-gray-900">{property.area?.value} {property.area?.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-semibold text-gray-900">{typeLabel}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>

                  {/* Features */}
                  {property.features && property.features.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">Features</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-sm text-gray-500 mb-2">Price</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {property.formattedPrice || `₹${property.price?.amount?.toLocaleString('en-IN')}`}
                  </p>
                  {property.price?.negotiable && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      Negotiable
                    </span>
                  )}
                </div>
              </FadeIn>

              {/* Inquiry Form */}
              <FadeIn delay={0.3}>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Interested?</h3>
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Your Message"
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        rows={3}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Send Inquiry'
                      )}
                    </button>
                  </form>
                </div>
              </FadeIn>

              {/* Contact Info */}
              <FadeIn delay={0.4}>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Agent</h3>
                  <div className="space-y-4">
                    <a href="tel:+919876543210" className="flex items-center gap-3 text-gray-600 hover:text-blue-600">
                      <Phone className="w-5 h-5" />
                      <span>+91 98765 43210</span>
                    </a>
                    <a href="mailto:info@plotvastu.com" className="flex items-center gap-3 text-gray-600 hover:text-blue-600">
                      <Mail className="w-5 h-5" />
                      <span>info@plotvastu.com</span>
                    </a>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
