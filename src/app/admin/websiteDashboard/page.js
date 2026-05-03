'use client';

import React, { useState, useEffect } from 'react';
import { websiteContentAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Save, Plus, Trash2, X,
  TrendingUp, Users, Star, Settings, Map,
  Building2, Sparkles, Globe, Quote, Footprints
} from 'lucide-react';
import Swal from 'sweetalert2';

const tabs = [
  { id: 'hero', label: 'Hero Section', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { id: 'testimonials', label: 'Testimonials', icon: Quote, color: 'from-blue-500 to-cyan-500' },
  { id: 'footer', label: 'Footer', icon: Globe, color: 'from-green-500 to-emerald-500' },
];

const iconMap = {
  TrendingUp, Users, Star, Settings, Map, Building2, Sparkles, Globe, Quote, Footprints
};

const WebsiteDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  const [heroContent, setHeroContent] = useState({
    tagline: '#1 Real Estate Platform',
    title: 'Find Your Dream Property With Us',
    subtitle: 'Discover the perfect plot, residential, or commercial property. We offer a curated selection of premium properties with transparent pricing and expert guidance.',
    stats: [
      { label: 'Properties Listed', value: 500, suffix: '+', icon: 'TrendingUp' },
      { label: 'Happy Customers', value: 1000, suffix: '+', icon: 'Users' },
      { label: 'Average Rating', value: 4.9, suffix: '', decimals: 1, icon: 'Star' },
    ],
    primaryCTA: { text: 'Explore Properties', link: '/properties' },
    secondaryCTA: { text: 'Watch Video', action: 'video' },
    videoUrl: '/landVideo.mp4',
  });

  const [testimonialsContent, setTestimonialsContent] = useState({
    title: 'What Our Clients Say',
    subtitle: 'Hear from our satisfied customers who found their dream properties through PlotVastu.',
    testimonials: [
      {
        id: 1,
        name: 'Rajesh Sharma',
        role: 'Home Buyer',
        content: 'Found my dream plot through PlotVastu. The team was extremely helpful and professional throughout the process.',
        rating: 5,
        image: '/testimonials/person1.jpg',
      },
    ],
  });

  const [footerContent, setFooterContent] = useState({
    description: 'Your trusted partner in finding the perfect property. We offer a wide range of plots, residential, and commercial properties.',
    contact: {
      phone: '+91 8249307969',
      email: 'info@plotvastu.com',
      address: '123 Main Street, City, State - 123456',
    },
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
    quickLinks: [
      { label: 'Home', href: '/' },
      { label: 'Properties', href: '/properties' },
      { label: 'Contact Us', href: '/contact' },
    ],
    propertyTypes: [
      { label: 'Plots & Land', href: '/properties?type=plot' },
      { label: 'Residential', href: '/properties?type=residential' },
      { label: 'Commercial', href: '/properties?type=commercial' },
      { label: 'Apartments', href: '/properties?type=apartment' },
    ],
  });

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      const [heroRes, testimonialsRes, footerRes] = await Promise.all([
        websiteContentAPI.getHero(),
        websiteContentAPI.getTestimonials(),
        websiteContentAPI.getFooter(),
      ]);

      if (heroRes.data.data?.content) {
        setHeroContent(heroRes.data.data.content);
      }
      if (testimonialsRes.data.data?.content) {
        setTestimonialsContent(testimonialsRes.data.data.content);
      }
      if (footerRes.data.data?.content) {
        setFooterContent(footerRes.data.data.content);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async () => {
    try {
      setSaving(true);
      await websiteContentAPI.updateHero({ content: heroContent });
      Swal.fire('Success!', 'Hero section updated successfully', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to update hero section', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTestimonials = async () => {
    try {
      setSaving(true);
      await websiteContentAPI.updateTestimonials({ content: testimonialsContent });
      Swal.fire('Success!', 'Testimonials updated successfully', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to update testimonials', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFooter = async () => {
    try {
      setSaving(true);
      await websiteContentAPI.updateFooter({ content: footerContent });
      Swal.fire('Success!', 'Footer content updated successfully', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to update footer content', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addTestimonial = () => {
    setTestimonialsContent({
      ...testimonialsContent,
      testimonials: [
        ...testimonialsContent.testimonials,
        { id: Date.now(), name: '', role: '', content: '', rating: 5, image: '' },
      ],
    });
  };

  const removeTestimonial = (index) => {
    const updated = [...testimonialsContent.testimonials];
    updated.splice(index, 1);
    setTestimonialsContent({ ...testimonialsContent, testimonials: updated });
  };

  const updateTestimonial = (index, field, value) => {
    const updated = [...testimonialsContent.testimonials];
    updated[index][field] = value;
    setTestimonialsContent({ ...testimonialsContent, testimonials: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      {/* Animated background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/25">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Website Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your website content with real-time updates
              </p>
            </div>
          </div>

          {/* Glowing divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-8 p-2 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer ${isActive
                  ? 'text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl opacity-90`}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                      Hero Section
                    </h2>

                    <div className="space-y-6">
                      <div className="group/input">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                        <input
                          type="text"
                          value={heroContent.tagline}
                          onChange={(e) => setHeroContent({ ...heroContent, tagline: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          value={heroContent.title}
                          onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                          className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                        <textarea
                          value={heroContent.subtitle}
                          onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                          rows={3}
                          className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Video URL</label>
                          <input
                            type="text"
                            value={heroContent.videoUrl}
                            onChange={(e) => setHeroContent({ ...heroContent, videoUrl: e.target.value })}
                            className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Primary CTA Text</label>
                          <input
                            type="text"
                            value={heroContent.primaryCTA.text}
                            onChange={(e) => setHeroContent({ ...heroContent, primaryCTA: { ...heroContent.primaryCTA, text: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                          Stats Configuration
                        </h3>
                        <div className="space-y-4">
                          {heroContent.stats.map((stat, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
                              <input
                                type="text"
                                placeholder="Label"
                                value={stat.label}
                                onChange={(e) => {
                                  const updated = [...heroContent.stats];
                                  updated[index].label = e.target.value;
                                  setHeroContent({ ...heroContent, stats: updated });
                                }}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                              />
                              <input
                                type="number"
                                placeholder="Value"
                                value={stat.value}
                                onChange={(e) => {
                                  const updated = [...heroContent.stats];
                                  updated[index].value = Number(e.target.value);
                                  setHeroContent({ ...heroContent, stats: updated });
                                }}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                              />
                              <input
                                type="text"
                                placeholder="Suffix"
                                value={stat.suffix}
                                onChange={(e) => {
                                  const updated = [...heroContent.stats];
                                  updated[index].suffix = e.target.value;
                                  setHeroContent({ ...heroContent, stats: updated });
                                }}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                              />
                              <input
                                type="text"
                                placeholder="Icon"
                                value={stat.icon}
                                onChange={(e) => {
                                  const updated = [...heroContent.stats];
                                  updated[index].icon = e.target.value;
                                  setHeroContent({ ...heroContent, stats: updated });
                                }}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveHero}
                        disabled={saving}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Hero Section'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Testimonials Section */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Quote className="w-6 h-6 text-blue-400" />
                        Testimonials
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addTestimonial}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all cursor-pointer"
                      >
                        <Plus className="w-5 h-5" />
                        Add Testimonial
                      </motion.button>
                    </div>

                    <div className="space-y-6">
                      {testimonialsContent.testimonials.map((testimonial, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative p-6 bg-gray-900/30 rounded-2xl border border-gray-700/30"
                        >
                          <button
                            onClick={() => removeTestimonial(index)}
                            className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                            title='Delete Testimonial'
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                              <input
                                type="text"
                                value={testimonial.name}
                                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                              <input
                                type="text"
                                value={testimonial.role}
                                onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              />
                            </div>
                          </div>

                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                            <textarea
                              value={testimonial.content}
                              onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                              <input
                                type="number"
                                min="1"
                                max="5"
                                value={testimonial.rating}
                                onChange={(e) => updateTestimonial(index, 'rating', Number(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                              <input
                                type="text"
                                value={testimonial.image}
                                onChange={(e) => updateTestimonial(index, 'image', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveTestimonials}
                      disabled={saving}
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed mt-6"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save Testimonials'}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Section */}
            {activeTab === 'footer' && (
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Globe className="w-6 h-6 text-green-400" />
                      Footer Content
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                          value={footerContent.description}
                          onChange={(e) => setFooterContent({ ...footerContent, description: e.target.value })}
                          rows={3}
                          className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                          <input
                            type="text"
                            value={footerContent.contact.phone}
                            onChange={(e) => setFooterContent({ ...footerContent, contact: { ...footerContent.contact, phone: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                          <input
                            type="email"
                            value={footerContent.contact.email}
                            onChange={(e) => setFooterContent({ ...footerContent, contact: { ...footerContent.contact, email: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                          <input
                            type="text"
                            value={footerContent.contact.address}
                            onChange={(e) => setFooterContent({ ...footerContent, contact: { ...footerContent.contact, address: e.target.value } })}
                            className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
                        <div className="grid grid-cols-4 gap-4">
                          {Object.keys(footerContent.socialLinks).map((platform) => (
                            <div key={platform}>
                              <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">{platform}</label>
                              <input
                                type="text"
                                value={footerContent.socialLinks[platform]}
                                onChange={(e) => setFooterContent({ ...footerContent, socialLinks: { ...footerContent.socialLinks, [platform]: e.target.value } })}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveFooter}
                        disabled={saving}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Footer Content'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WebsiteDashboard;
