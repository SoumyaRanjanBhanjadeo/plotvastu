'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { websiteContentAPI } from '@/lib/api';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2024);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const response = await websiteContentAPI.getFooter();
        setFooterData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch footer content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFooterContent();
  }, []);

  const content = footerData?.content || {};
  const contact = content.contact || { phone: '+91 8249307969', email: 'info@plotvastu.com', address: '123 Main Street, City, State - 123456' };
  const socialLinks = content.socialLinks || { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' };
  const quickLinks = content.quickLinks || [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: 'Contact Us', href: '/contact' },
  ];
  const propertyTypes = content.propertyTypes || [
    { label: 'Plots & Land', href: '/properties?type=plot' },
    { label: 'Residential', href: '/properties?type=residential' },
    { label: 'Commercial', href: '/properties?type=commercial' },
    { label: 'Apartments', href: '/properties?type=apartment' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">PlotVastu</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {content.description || "Your trusted partner in finding the perfect property. We offer a wide range of plots, residential, and commercial properties."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Types</h3>
            <ul className="space-y-3">
              {propertyTypes.map((type, index) => (
                <li key={index}>
                  <Link href={type.href} className="text-gray-400 hover:text-white transition-colors">
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{contact.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{contact.email}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 mt-1" />
                <span>{contact.address}</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a href={socialLinks.facebook} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href={socialLinks.twitter} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a href={socialLinks.instagram} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href={socialLinks.linkedin} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 p-4 text-center text-gray-400 text-sm">
        <p>&copy; {currentYear} PlotVastu. All rights reserved.</p>
      </div>
    </footer>
  );
}
