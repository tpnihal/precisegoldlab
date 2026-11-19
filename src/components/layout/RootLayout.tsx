import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { WhatsAppFloatingButton } from '@/components/ui/WhatsAppFloatingButton';

export const RootLayout: React.FC = () => {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Header />
      <main id="main-content" className="min-h-screen bg-[#0A0A0A] text-white">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </SmoothScroll>
  );
};
