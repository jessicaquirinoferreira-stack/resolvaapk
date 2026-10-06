import React, { useState } from 'react';
import { MapPin, ChevronDown, Bell, Shield, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { 
    currentAddress, 
    addresses, 
    setCurrentAddress, 
    isAdmin, 
    setAdminModeActive, 
    adminModeActive,
    currentUser,
    setShowAuthModal
  } = useAuth();
  const { notifications, markNotificationRead, setActiveTab, activeTab, setShowAddressModal } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-2.5 transition-all w-full">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0D3B4C] p-1.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="Resolva Facil"
              className="w-full h-full object-contain rounded"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-[#0D3B4C] leading-none">
              Resolva Facil
            </span>
            <span className="text-[10px] text-teal-800 font-semibold tracking-wider uppercase leading-tight mt-0.5">
              Serviços & Reparações
            </span>
          </div>
        </div>

        {/* Center/Right Address Picker & Actions */}
        <div className="flex items-center gap-2">
          {/* Location Dropdown */}
          <div className="relative">
            <button
              id="header-address-picker"
              onClick={() => setShowAddressDropdown(!showAddressDropdown)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-800 text-xs font-medium py-1.5 px-2.5 rounded-full transition-all max-w-[140px] sm:max-w-[170px]"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span className="truncate text-[11px] font-semibold">
                {currentAddress?.street || 'São Paulo, SP'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
            </button>

            {showAddressDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowAddressDropdown(false)} 
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">As tuas moradas</span>
                    <button
                      onClick={() => {
                        setShowAddressDropdown(false);
                        setShowAddressModal(true);
                      }}
                      className="text-[11px] font-bold text-teal-800 hover:underline"
                    >
                      + Nova
                    </button>
                  </div>
                  <div className="py-1 space-y-1 max-h-48 overflow-y-auto no-scrollbar">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => {
                          setCurrentAddress(addr);
                          setShowAddressDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start gap-2 transition-colors ${
                          currentAddress?.id === addr.id
                            ? 'bg-teal-50 text-teal-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="font-semibold leading-tight">{addr.title}</p>
                          <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                            {addr.street}, {addr.number} {addr.floor || ''}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Admin Toggle Badge if Admin */}
          {isAdmin && (
            <button
              id="header-admin-badge"
              onClick={() => {
                const nextState = !adminModeActive;
                setAdminModeActive(nextState);
                if (nextState) setActiveTab('admin');
                else if (activeTab === 'admin') setActiveTab('home');
              }}
              className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                adminModeActive 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={adminModeActive ? 'Modo Admin Ativo (Clique para sair)' : 'Entrar no Painel Admin'}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="header-notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-slate-100 active:scale-95 text-slate-700 transition-colors"
              title="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-white rounded-full ring-1 ring-amber-400/50" />
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900">Notificações</h4>
                    <span className="text-[10px] text-slate-400">{notifications.length} mensagens</span>
                  </div>

                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">Sem notificações no momento.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                            notif.read ? 'bg-slate-50 text-slate-600' : 'bg-teal-50/70 border border-teal-100 text-slate-900 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[11px] text-[#0D3B4C]">{notif.title}</span>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 bg-teal-600 rounded-full shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Guest Login Button */}
          {!currentUser && (
            <button
              type="button"
              id="header-login-btn"
              onClick={() => setShowAuthModal(true)}
              className="bg-[#0D3B4C] hover:bg-[#072430] active:scale-95 text-white text-[11px] font-bold py-1.5 px-3 rounded-full transition-all flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
            >
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
