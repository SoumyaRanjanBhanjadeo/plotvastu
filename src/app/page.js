'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/public/layout/Header';
import { Footer } from '@/components/public/layout/Footer';
import { Hero } from '@/components/public/home/Hero';
import { FeaturedProperties } from '@/components/public/home/FeaturedProperties';
import { Testimonials } from '@/components/public/home/Testimonials';
import { LoginModal } from '@/components/public/home/LoginModal';
// import { RegisterModal } from '@/components/public/layout/RegisterModal';

export default function Home() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  return (
    <>
      <Toaster position="top-right" />
      <Header 
        onLoginClick={() => setLoginModalOpen(true)} 
        onRegisterClick={() => setRegisterModalOpen(true)}
      />
      <main className="bg-white in-[.dark_&]:bg-gray-900 transition-colors">
        <Hero />
        <FeaturedProperties />
        <Testimonials />
      </main>
      <Footer />
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        onRegisterClick={() => setRegisterModalOpen(true)}
      />
      {/* <RegisterModal 
        isOpen={registerModalOpen} 
        onClose={() => setRegisterModalOpen(false)}
        onLoginClick={() => setLoginModalOpen(true)}
      /> */}
    </>
  );
}
