import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { AddressModal } from './components/common/AddressModal';
import { HomeView } from './components/home/HomeView';
import { DiscoverView } from './components/discover/DiscoverView';
import { MyBookingsView } from './components/bookings/MyBookingsView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PartnerDashboard } from './components/partner/PartnerDashboard';
import { BookingModal } from './components/bookings/BookingModal';
import { BookingDetailModal } from './components/bookings/BookingDetailModal';
import { CustomServiceModal } from './components/custom/CustomServiceModal';
import { AuthModal } from './components/auth/AuthModal';
import { SmsVerifyModal } from './components/auth/SmsVerifyModal';
import { SplashScreen } from './components/common/SplashScreen';
import { SecurityProtection } from './components/common/SecurityProtection';

const MainLayout: React.FC = () => {
  const { activeTab, showSplash, setShowSplash } = useApp();

  return (
    <div className="fixed inset-0 min-h-screen w-full h-full bg-[#F8FAFC] flex flex-col text-slate-900 selection:bg-amber-300 selection:text-slate-950 font-sans antialiased overflow-hidden">
      {/* Sistema Ativo de Proteção Anti-Cópia e Anti-IA */}
      <SecurityProtection />

      {/* PWA Install Banner */}
      <div className="shrink-0 w-full z-50 relative">
        <PwaInstallPrompt />
      </div>

      {/* Top Header (Shown on client and standard views) */}
      <div className="shrink-0 w-full z-40 relative">
        {activeTab !== 'admin' && activeTab !== 'partner' && <Header />}
      </div>

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar relative scroll-smooth pb-24">
        {(!activeTab || activeTab === 'home') && <HomeView />}
        {activeTab === 'discover' && <DiscoverView />}
        {activeTab === 'bookings' && <MyBookingsView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'partner' && <PartnerDashboard />}
      </main>

      {/* Bottom Navigation */}
      <div className="shrink-0 w-full z-40 relative">
        {activeTab !== 'admin' && <BottomNav />}
      </div>

      {/* Global Modals */}
      <BookingModal />
      <BookingDetailModal />
      <CustomServiceModal />
      <AddressModal />
      <AuthModal />
      <SmsVerifyModal />

      {/* Splash Screen Overlay only if explicitly replayed */}
      {showSplash && (
        <SplashScreen 
          durationMs={1200} 
          onFinish={() => setShowSplash(false)} 
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
