import React, { useState } from 'react';
import { 
  User, 
  Heart, 
  HelpCircle, 
  MapPin, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  ChevronRight, 
  Shield, 
  Check,
  Briefcase,
  FileCheck2,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    currentPartner,
    logout, 
    isAdmin, 
    setAdminModeActive, 
    addresses,
    setShowAuthModal
  } = useAuth();

  const { setActiveTab, setShowAddressModal, professionals, replaySplash } = useApp();
  const [activeBenefitModal, setActiveBenefitModal] = useState<boolean>(false);
  const [activeFavoritesModal, setActiveFavoritesModal] = useState<boolean>(false);

  const isPartner = currentUser?.role === 'partner';

  const favPros = professionals.filter((p) =>
    currentUser?.favoriteProfessionals?.includes(p.id)
  );

  return (
    <div className="pb-28 pt-2 px-4 w-full max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Unauthenticated Login Card */}
      {!currentUser && (
        <div className="bg-linear-to-r from-[#0D3B4C] to-[#124e64] rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              Sessão Não Iniciada
            </span>
            <h3 className="text-base font-extrabold text-white">
              Aceder ao Painel ou Perfil
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Inicie sessão com a sua conta Google ou dados administrativos para aceder aos seus dados sincronizados.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-3 px-5 rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Entrar / Iniciar Sessão
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-teal-100/60 overflow-hidden shrink-0 border border-teal-200 relative">
          {currentUser?.avatarUrl || currentPartner?.photoUrl ? (
            <img
              src={currentUser?.avatarUrl || currentPartner?.photoUrl}
              alt={currentUser?.name || currentPartner?.name || 'Perfil'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#0D3B4C] font-black text-xl">
              {(currentUser?.name || currentPartner?.name || 'U')[0]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-base font-extrabold text-slate-900 truncate">
              {currentPartner?.name || currentUser?.name || 'Utilizador Resolva Fácil'}
            </h3>
            {isPartner && (
              <span className="bg-teal-700 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Prestador Pro
              </span>
            )}
            {currentUser?.role === 'admin' && (
              <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Administrador
              </span>
            )}
            {currentUser?.isSubscribed && (
              <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full uppercase">
                Prime
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {currentPartner?.email || currentUser?.email || 'utilizador@resolvafacil.pt'}
          </p>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">
            {currentPartner?.phone || currentUser?.phone || 'Telemóvel registado'}
          </p>
        </div>
      </div>

      {/* Partner Credentials Card (When logged in as partner) */}
      {isPartner && (
        <div className="bg-linear-to-br from-[#0D3B4C] to-[#082834] rounded-3xl p-5 text-white shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-300" />
              <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                Ficha do Prestador
              </span>
            </div>
            <span className="bg-teal-500/20 text-teal-200 border border-teal-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Status: {currentPartner?.status || 'Aprovado'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-300 block font-medium">Painel de Operações</span>
              <button
                type="button"
                onClick={() => setActiveTab('partner')}
                className="mt-1 text-xs font-bold text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Aceder ao Painel Pro</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-300 block font-medium">Serviços Concluídos</span>
              <span className="font-bold text-sm block mt-0.5 text-white">
                {currentPartner?.completedJobs || 0}
              </span>
            </div>
          </div>

          {(currentPartner?.categories?.length || currentPartner?.specialties?.length) ? (
            <div className="text-xs">
              <span className="text-[10px] text-slate-300 block mb-1 font-medium">Especialidades</span>
              <div className="flex flex-wrap gap-1.5">
                {(currentPartner.specialties || currentPartner.categories || ['Eletricidade & Iluminação', 'Reparações']).map((cat, i) => (
                  <span
                    key={i}
                    className="bg-white/10 text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-white/15"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Subscrições e Benefícios (For Clients) */}
      {!isPartner && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveBenefitModal(true)}
            className="bg-linear-to-br from-[#0D3B4C] to-[#072430] text-white p-3.5 rounded-2xl shadow-sm text-left hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Plano
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <span className="text-xs font-black block leading-tight">Subscrições</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">Clube Resolva Fácil Prime</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveBenefitModal(true)}
            className="bg-linear-to-br from-amber-400 to-amber-500 text-slate-950 p-3.5 rounded-2xl shadow-sm text-left hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">
                Vantagens
              </span>
              <span className="text-[10px] font-extrabold bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded-full">
                -10%
              </span>
            </div>
            <div className="mt-2">
              <span className="text-xs font-black block leading-tight">Benefícios</span>
              <span className="text-[10px] text-slate-900/80 block mt-0.5">Descontos automáticos</span>
            </div>
          </button>
        </div>
      )}

      {/* Admin Panel Access Banner (When logged in as Admin) */}
      {(isAdmin || currentUser?.role === 'admin') && (
        <div
          onClick={() => {
            setAdminModeActive(true);
            setActiveTab('admin');
          }}
          className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 cursor-pointer flex items-center justify-between hover:bg-amber-100/70 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 block leading-tight">
                Painel Administrativo
              </span>
              <span className="text-[10px] text-slate-600">
                Faturação, gestão de parceiros e chamados oficiais
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      )}

      {/* Menu List Items */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
        
        {/* Profissionais favoritos (Clients only) */}
        {!isPartner && (
          <button
            type="button"
            onClick={() => setActiveFavoritesModal(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-700">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-slate-800">Profissionais favoritos</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400">{favPros.length}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>
        )}

        {/* Moradas salvas */}
        <button
          type="button"
          onClick={() => setShowAddressModal(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 text-slate-700">
            <MapPin className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold text-slate-800">Moradas salvas</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400">{addresses.length} moradas</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </button>

        {/* Ajuda e Suporte */}
        <button
          type="button"
          onClick={() => alert('Apoio ao Cliente Resolva Fácil:\nLinha Direta: 800 200 300 (Gratuito)\nEmail: ajuda@resolvafacil.pt\nHorário: Seg a Sáb das 08h às 20h')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 text-slate-700">
            <HelpCircle className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-800">Ajuda e Suporte</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Rever Entrada (Splash) */}
        <button
          type="button"
          id="btn-replay-splash"
          onClick={replaySplash}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 text-slate-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Ecrã de Abertura (Splash)</span>
              <span className="text-[10px] text-slate-500 block">Rever apresentação do PWA</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Legal & Privacidade */}
        <button
          type="button"
          onClick={() => alert('Resolva Fácil - Termos de Uso e Política de Privacidade de acordo com o RGPD.\nTodos os parceiros possuem verificação cadastral.')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-800">Legal & Privacidade</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Auth button */}
      {currentUser ? (
        <button
          type="button"
          id="btn-logout"
          onClick={logout}
          className="w-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminar Sessão</span>
        </button>
      ) : (
        <button
          type="button"
          id="btn-login-profile"
          onClick={() => setShowAuthModal(true)}
          className="w-full bg-[#0D3B4C] hover:bg-[#072430] text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-[#0D3B4C]/20"
        >
          <User className="w-4 h-4 text-amber-400" />
          <span>Iniciar Sessão / Entrar</span>
        </button>
      )}

      {/* Benefits Modal */}
      {activeBenefitModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-amber-500">Clube Resolva Fácil</span>
              <button onClick={() => setActiveBenefitModal(false)} className="text-slate-400 hover:text-slate-800 font-bold cursor-pointer">✕</button>
            </div>
            <h3 className="text-lg font-black text-[#0D3B4C]">Subscrições & Benefícios</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-xl">
                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                <span>10% de desconto em qualquer serviço</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-teal-50 rounded-xl">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Prioridade no agendamento aos fins de semana</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                <Check className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Garantia estendida para reparações</span>
              </div>
            </div>
            <button
              onClick={() => setActiveBenefitModal(false)}
              className="w-full bg-[#0D3B4C] text-white text-xs font-bold py-3 rounded-xl cursor-pointer"
            >
              Compreendi
            </button>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {activeFavoritesModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-black text-slate-900">Profissionais Favoritos</h4>
              <button onClick={() => setActiveFavoritesModal(false)} className="text-slate-400 hover:text-slate-800 font-bold cursor-pointer">✕</button>
            </div>
            {favPros.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Ainda não adicionou profissionais aos favoritos.</p>
            ) : (
              <div className="space-y-2.5">
                {favPros.map((pro) => (
                  <div key={pro.id} className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                    {pro.photoUrl ? (
                      <img src={pro.photoUrl} alt={pro.name} className="w-12 h-12 rounded-xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-sm">
                        {pro.name[0]}
                      </div>
                    )}
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{pro.name}</h5>
                      <span className="text-[10px] text-teal-800 font-semibold">{pro.specialties?.join(', ')}</span>
                      <p className="text-[10px] text-slate-400">★ {pro.rating || '5.0'} ({pro.reviewCount || 0} avaliações)</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setActiveFavoritesModal(false)}
              className="w-full bg-slate-100 text-slate-700 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
