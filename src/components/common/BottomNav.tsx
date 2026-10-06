import React from 'react';
import { Home, Compass, Wrench, Calendar, User, Briefcase, Sliders } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, bookings, setShowCustomServiceModal } = useApp();
  const { currentUser, isAdmin } = useAuth();

  const isPartner = currentUser?.role === 'partner';

  if (isAdmin || activeTab === 'admin') {
    return null;
  }

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== 'completed' && b.status !== 'cancelled'
  ).length;

  if (isPartner) {
    return (
      <nav 
        id="bottom-navigation-bar"
        className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200/80 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
      >
        <div className="w-full max-w-lg mx-auto px-6 flex items-center justify-around relative">
          {/* Partner Tab 1: Painel Pro */}
          <button
            id="nav-tab-partner-dash"
            onClick={() => setActiveTab('partner')}
            className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
              activeTab === 'partner' ? 'text-teal-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Briefcase className={`w-5 h-5 ${activeTab === 'partner' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className={`text-[11px] mt-1 tracking-tight ${activeTab === 'partner' ? 'font-black' : 'font-medium'}`}>
              Painel Prestador
            </span>
          </button>

          {/* Partner Tab 2: Serviços / Agenda */}
          <button
            id="nav-tab-partner-bookings"
            onClick={() => setActiveTab('bookings')}
            className={`flex flex-col items-center justify-center py-1 relative transition-all cursor-pointer ${
              activeTab === 'bookings' ? 'text-teal-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Calendar className={`w-5 h-5 ${activeTab === 'bookings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4 h-4 bg-teal-600 text-white font-black text-[9px] px-1 rounded-full flex items-center justify-center shadow-sm">
                  {activeBookingsCount}
                </span>
              )}
            </div>
            <span className={`text-[11px] mt-1 tracking-tight ${activeTab === 'bookings' ? 'font-black' : 'font-medium'}`}>
              Meus Trabalhos
            </span>
          </button>

          {/* Partner Tab 3: Perfil */}
          <button
            id="nav-tab-partner-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
              activeTab === 'profile' ? 'text-teal-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className={`text-[11px] mt-1 tracking-tight ${activeTab === 'profile' ? 'font-black' : 'font-medium'}`}>
              Meu Perfil
            </span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav 
      id="bottom-navigation-bar"
      className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200/80 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="w-full max-w-4xl mx-auto px-4 flex items-center justify-between relative">
        
        {/* 1. Início */}
        <button
          id="nav-tab-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-[#0D3B4C]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>
            Início
          </span>
        </button>

        {/* 2. Descobrir */}
        <button
          id="nav-tab-discover"
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-all cursor-pointer ${
            activeTab === 'discover' ? 'text-[#0D3B4C]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'discover' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${activeTab === 'discover' ? 'font-bold' : 'font-medium'}`}>
            Descobrir
          </span>
        </button>

        {/* 3. Central Highlighted Action: Solicitar / Serviços Personalizados */}
        <div className="relative -top-4 flex items-center justify-center">
          <button
            id="nav-tab-central-action"
            onClick={() => setShowCustomServiceModal(true)}
            className="w-13 h-13 rounded-full bg-[#0D3B4C] hover:bg-[#072430] text-white flex flex-col items-center justify-center shadow-lg shadow-[#0D3B4C]/30 active:scale-95 border-4 border-white transition-all group cursor-pointer"
            title="Solicitar Serviço Personalizado"
          >
            <Wrench className="w-5 h-5 stroke-[2.5] text-amber-400 group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* 4. Os Meus Serviços (Agenda / Bookings) */}
        <button
          id="nav-tab-bookings"
          onClick={() => setActiveTab('bookings')}
          className={`flex flex-col items-center justify-center w-14 py-1 relative transition-all cursor-pointer ${
            activeTab === 'bookings' ? 'text-[#0D3B4C]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 ${activeTab === 'bookings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeBookingsCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-4 h-4 bg-amber-500 text-slate-950 font-black text-[9px] px-1 rounded-full flex items-center justify-center shadow-sm">
                {activeBookingsCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-1 tracking-tight ${activeTab === 'bookings' ? 'font-bold' : 'font-medium'}`}>
            Serviços
          </span>
        </button>

        {/* 5. Perfil */}
        <button
          id="nav-tab-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-[#0D3B4C]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${activeTab === 'profile' ? 'font-bold' : 'font-medium'}`}>
            Perfil
          </span>
        </button>

      </div>
    </nav>
  );
};
