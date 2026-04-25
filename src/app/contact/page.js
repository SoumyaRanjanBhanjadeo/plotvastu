'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  Clock
} from 'lucide-react';
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { Header } from '@/components/public/layout/Header';
import { Footer } from '@/components/public/layout/Footer';
import { LoginModal } from '@/components/public/home/LoginModal';
import { FadeIn } from '@/components/shared/animations/FadeIn';
import { contactAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function ContactPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await contactAPI.send(formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 8249307969',
      link: 'tel:+918249307969',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@plotvastu.com',
      link: 'mailto:info@plotvastu.com',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Main Street, City, State - 123456',
      link: '#',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
      link: null,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <Header onLoginClick={() => setLoginModalOpen(true)} />

      <main className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <FadeIn className="lg:col-span-1">
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900 rounded-xl flex items-center justify-center shrink-0">
                          <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                          {item.link ? (
                            <a
                              href={item.link}
                              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              {item.content}
                            </a>
                          ) : (
                            <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Social Links */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                    <div className="flex gap-3">
                      {[FaFacebookF, FaXTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                        <a
                          key={index}
                          href="#"
                          className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Contact Form */}
              <FadeIn delay={0.1} className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          maxLength={10}
                          required
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          placeholder="How can we help?"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
