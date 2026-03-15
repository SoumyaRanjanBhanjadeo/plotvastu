'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Upload, 
  X, 
  MapPin, 
  Loader2,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';
import { propertyAPI, mediaAPI } from '@/lib/api';
import { 
  PROPERTY_TYPES, 
  PROPERTY_STATUS, 
  AREA_UNITS, 
  CURRENCIES,
  PROPERTY_FEATURES 
} from '@/lib/constants';
import toast from 'react-hot-toast';
import { FormSelect } from '@/components/shared/FormSelect';
import { Portal } from '@/components/shared/Portal';

export function PropertyForm({ initialData = null }) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'plot',
    status: initialData?.status || 'available',
    price: {
      amount: initialData?.price?.amount || '',
      currency: initialData?.price?.currency || 'INR',
      negotiable: initialData?.price?.negotiable || false,
    },
    area: {
      value: initialData?.area?.value || '',
      unit: initialData?.area?.unit || 'sqyd',
    },
    location: {
      address: initialData?.location?.address || '',
      city: initialData?.location?.city || '',
      state: initialData?.location?.state || '',
      pincode: initialData?.location?.pincode || '',
      coordinates: {
        lat: initialData?.location?.coordinates?.lat || '',
        lng: initialData?.location?.coordinates?.lng || '',
      },
    },
    features: initialData?.features || [],
    images: initialData?.images || [],
    isFeatured: initialData?.isFeatured || false,
    isActive: initialData?.isActive !== false,
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [customFeatures, setCustomFeatures] = useState([]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const handleCoordinatesChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: { ...prev.location.coordinates, [field]: value },
      },
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleAddCustomFeature = () => {
    const newFeature = '';
    setCustomFeatures(prev => [...prev, { id: Date.now(), value: newFeature }]);
  };

  const handleCustomFeatureChange = (id, value) => {
    setCustomFeatures(prev => 
      prev.map(feature => 
        feature.id === id ? { ...feature, value } : feature
      )
    );
  };

  const handleCustomFeatureBlur = (id, value) => {
    if (value.trim()) {
      handleFeatureToggle(value.trim());
    }
    setCustomFeatures(prev => prev.filter(feature => feature.id !== id));
  };

  const handleCustomFeatureKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      const value = e.target.value.trim();
      if (value) {
        handleFeatureToggle(value);
        setCustomFeatures(prev => prev.filter(feature => feature.id !== id));
      }
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadedImages = [];

    try {
      // Convert all files to base64
      const base64Images = await Promise.all(
        files.map(file => fileToBase64(file))
      );

      // Upload using uploadMultiple endpoint
      const response = await mediaAPI.uploadMultiple({ images: base64Images });
      
      const imagesData = response.data.data.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        isPrimary: index === 0 && formData.images.length === 0,
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imagesData],
      }));
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setUploadingImages(false);
    }
    
    // Reset file input
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  const handlePreviewImage = (imageUrl) => {
    setPreviewImage(imageUrl);
    setShowFullscreenPreview(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing) {
        await propertyAPI.update(initialData._id, formData);
        toast.success('Property updated successfully');
      } else {
        await propertyAPI.create(formData);
        toast.success('Property created successfully');
      }
      router.push('/admin/properties');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save property');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-500 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Property Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              placeholder="Enter property title"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              rows={4}
              placeholder="Enter property description"
              className={inputClass}
            />
          </div>

          <FormSelect
            label="Property Type"
            options={PROPERTY_TYPES}
            value={formData.type}
            onChange={(value) => handleChange('type', value)}
          />

          <FormSelect
            label="Status"
            options={PROPERTY_STATUS}
            value={formData.status}
            onChange={(value) => handleChange('status', value)}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Price</label>
            <input
              type="number"
              value={formData.price.amount}
              onChange={(e) => handleNestedChange('price', 'amount', Number(e.target.value))}
              required
              placeholder="Enter price"
              className={inputClass}
            />
          </div>

          <FormSelect
            label="Currency"
            options={CURRENCIES}
            value={formData.price.currency}
            onChange={(value) => handleNestedChange('price', 'currency', value)}
          />

          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.price.negotiable}
                onChange={(e) => handleNestedChange('price', 'negotiable', e.target.checked)}
                className="w-5 h-5 accent-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-700">Price Negotiable</span>
            </label>
          </div>
        </div>
      </div>

      {/* Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Area</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Area Value</label>
            <input
              type="number"
              value={formData.area.value}
              onChange={(e) => handleNestedChange('area', 'value', Number(e.target.value))}
              required
              placeholder="Enter area"
              className={inputClass}
            />
          </div>

          <FormSelect
            label="Unit"
            options={AREA_UNITS}
            value={formData.area.unit}
            onChange={(value) => handleNestedChange('area', 'unit', value)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              type="text"
              value={formData.location.address}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              required
              placeholder="Enter full address"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={formData.location.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              required
              placeholder="Enter city"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>State</label>
            <input
              type="text"
              value={formData.location.state}
              onChange={(e) => handleLocationChange('state', e.target.value)}
              required
              placeholder="Enter state"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Pincode</label>
            <input
              type="text"
              value={formData.location.pincode}
              onChange={(e) => handleLocationChange('pincode', e.target.value)}
              required
              placeholder="Enter pincode"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Latitude</label>
            <input
              type="number"
              step="any"
              value={formData.location.coordinates.lat}
              onChange={(e) => handleCoordinatesChange('lat', Number(e.target.value))}
              required
              placeholder="Enter latitude"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Longitude</label>
            <input
              type="number"
              step="any"
              value={formData.location.coordinates.lng}
              onChange={(e) => handleCoordinatesChange('lng', Number(e.target.value))}
              required
              placeholder="Enter longitude"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Features</h2>
        <div className="flex flex-wrap gap-3">
          {PROPERTY_FEATURES.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => handleFeatureToggle(feature)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                formData.features.includes(feature)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {formData.features.includes(feature) && <span className="mr-1">✓</span>}
              {feature}
            </button>
          ))}
          {formData.features.map((feature, idx) => {
            if (!PROPERTY_FEATURES.includes(feature)) {
              return (
                <span
                  key={`${feature}-${idx}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium"
                >
                  ✓ {feature}
                  <button
                    type="button"
                    onClick={() => handleFeatureToggle(feature)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            }
            return null;
          })}
          {customFeatures.map((feature) => (
            <input
              key={feature.id}
              type="text"
              defaultValue={feature.value}
              onChange={(e) => handleCustomFeatureChange(feature.id, e.target.value)}
              onKeyDown={(e) => handleCustomFeatureKeyDown(e, feature.id)}
              onBlur={(e) => handleCustomFeatureBlur(feature.id, e.target.value)}
              autoFocus
              className="px-4 py-2 bg-green-50 border border-blue-300 rounded-xl text-sm font-medium text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-37.5"
              placeholder="Enter feature..."
            />
          ))}
          <button
            type="button"
            onClick={handleAddCustomFeature}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom Feature
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Images</h2>
        
        {/* Upload Button */}
        <div className="mb-6">
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
            <div className="text-center">
              {uploadingImages ? (
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              )}
              <span className="text-gray-600">
                {uploadingImages ? 'Uploading...' : 'Click to upload images'}
              </span>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="hidden"
            />
          </label>
        </div>

        {/* Image Previews */}
        {formData.images.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">All Images ({formData.images.length})</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={image.url}
                    alt={`Property ${index + 1}`}
                    className={`w-full h-full object-cover rounded-lg cursor-pointer transition-all ${
                      image.isPrimary ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300'
                    }`}
                    onClick={() => handlePreviewImage(image.url)}
                  />
                  {image.isPrimary && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-md">
                      Primary
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewImage(image.url);
                      }}
                      className="p-1.5 bg-white rounded-md text-blue-600 hover:bg-blue-50 cursor-pointer"
                      title="View fullscreen"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {!image.isPrimary && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPrimaryImage(index);
                        }}
                        className="p-1.5 bg-white rounded-md text-blue-600 hover:bg-blue-50 cursor-pointer"
                        title="Set as primary"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="p-1.5 bg-white rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Preview Modal */}
      {showFullscreenPreview && previewImage && (
        <Portal>
          <div 
            className="fixed inset-0 z-1000 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setShowFullscreenPreview(false)}
          >
            <div 
              className="relative max-w-full max-h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFullscreenPreview(false)}
                className="absolute -top-6 -right-90 text-white hover:text-gray-300 transition-colors z-1500 cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={previewImage}
                alt="Full size preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </Portal>
      )}

      {/* Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
        <div className="flex flex-wrap gap-6 dark:text-white">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => handleChange('isFeatured', e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Featured Property</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Active (Visible to Public)</span>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/properties')}
          className="px-8 py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            isEditing ? 'Update Property' : 'Create Property'
          )}
        </button>
      </div>
    </form>
  );
}
