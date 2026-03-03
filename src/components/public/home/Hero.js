'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  const stats = [
    { icon: TrendingUp, value: '500+', label: 'Properties Listed' },
    { icon: Users, value: '1000+', label: 'Happy Customers' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-purple-50" />
      
      {/* Animated Background Shapes */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                #1 Real Estate Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Find Your{' '}
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dream Property
              </span>{' '}
              With Us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Discover the perfect plot, residential, or commercial property. 
              We offer a curated selection of premium properties with transparent 
              pricing and expert guidance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/properties"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:gap-4"
              >
                Explore Properties
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 transition-colors">
                <Play className="w-5 h-5" />
                Watch Video
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Property Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Property Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="h-64 bg-linear-to-br from-blue-400 to-purple-500 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium">
                      Featured Property
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Premium Residential Plot
                  </h3>
                  <p className="text-gray-500 mb-4">Sector 45, Gurugram</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">₹45 Lakh</span>
                    <span className="text-sm text-gray-500">250 Sq. Yd.</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 1 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-8 -right-8 bg-white rounded-xl shadow-xl p-4 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price Trend</p>
                    <p className="text-lg font-bold text-green-600">+12.5%</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-8 bg-white rounded-xl shadow-xl p-4 z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-500 border-2 border-white"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">50+</span> people viewed today
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
