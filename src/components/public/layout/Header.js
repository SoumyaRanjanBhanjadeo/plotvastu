'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Building2, User } from 'lucide-react';
import { PUBLIC_NAV_LINKS } from '@/lib/constants';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export function Header({ onLoginClick, onRegisterClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-line-to-r from-blue-600 to-purple-600 bg-clip-text text-gray-700 in-[.dark_&]:text-white transition-colors cursor-pointer">
                PlotVastu
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {PUBLIC_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-600 in-[.dark_&]:text-gray-300 hover:text-gray-900 in-[.dark_&]:hover:text-white font-medium transition-colors relative group cursor-pointer ${isActive ? 'text-gray-900 in-[.dark_&]:text-white' : ''}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full ${isActive ? 'w-[75%]' : 'w-0 group-hover:w-full'}`} />
              </Link>
              );
            })}
          </nav>

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLoginClick}
              className="px-5 py-2.5 bg-gray-900 dark:bg-blue-600 rounded-xl text-white in-[.dark_&]:text-gray-300 font-medium hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Login
            </motion.button>
            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRegisterClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
            >
              <User className="w-4 h-4" />
              Register
            </motion.button> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 in-[.dark_&]:text-gray-300 hover:text-gray-900 in-[.dark_&]:hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white in-[.dark_&]:bg-gray-900 border-t border-gray-100 in-[.dark_&]:border-gray-800 shadow-2xl transition-all duration-300"
          >
            <nav className="px-4 py-4 space-y-2">
              {PUBLIC_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-600 in-[.dark_&]:text-gray-300 hover:text-gray-900 in-[.dark_&]:hover:text-white hover:bg-gray-50 in-[.dark_&]:hover:bg-gray-800 rounded-xl font-medium cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="flex-1 px-4 py-3 bg-blue-500 dark:bg-blue-600 rounded-xl text-white in-[.dark_&]:text-gray-300 font-medium cursor-pointer"
                >
                  Login
                </button>
                {/* <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onRegisterClick();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 in-[.dark_&]:bg-blue-600 text-white rounded-xl font-medium cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  Register
                </button> */}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
