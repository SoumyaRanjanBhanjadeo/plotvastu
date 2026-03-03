'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from '@/components/dashboard/layout/Sidebar';
import { SessionExpiredModal } from '@/components/shared/SessionExpiredModal';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated, loading, showSessionExpired, handleLoginAgain } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated && !showSessionExpired) {
      router.push('/');
    }
  }, [loading, isAuthenticated, showSessionExpired, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <SessionExpiredModal 
        isOpen={showSessionExpired} 
        onLogin={handleLoginAgain} 
      />
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <SessionExpiredModal 
        isOpen={showSessionExpired} 
        onLogin={handleLoginAgain} 
      />
      <div className="min-h-screen bg-gray-50 in-[.dark_&]:bg-gray-950 transition-colors">
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main 
          className={`transition-all duration-300 ${
            isCollapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
