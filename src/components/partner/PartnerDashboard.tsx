import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Star, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  User, 
  Wrench, 
  DollarSign, 
  Award, 
  ArrowRight,
  LogOut,
  Sliders,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { formatCurrency, formatHourlyRate } from '../../lib/format';

export const PartnerDashboard: React.FC = () => {
  const { currentUser, currentPartner, logout } = useAuth();
  const { orders, changeBookingStatus, setActiveBookingDetail } = useApp();
  
  const [activeSubTab, setActiveSubTab] = useState<'assigned' | 'available' | 'completed' | 'profile'>('assigned');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [hourlyRate, setHourlyRate] = useState<number>(currentPartner?.hourlyRate || 35);
  const [savedRateSuccess, setSavedRateSuccess] = useState<boolean>(false);

  // Filter orders related to this partner or open in general
  const partnerId = currentPartner?.id || currentUser?.id || '';
  
  // Orders explicitly assigned to this partner
  const myAssignedOrders = orders.filter(
    (o) => partnerId && (o.partnerId === partnerId || o.professionalId === partnerId) && o.status !== 'completed' && o.status !== 'cancelled'
  );

  // Available new pending orders looking for a provider
  const availablePendingOrders = orders.filter(
    (o) => o.status === 'pending' && !o.partnerId && !o.professionalId
  );

  // Completed orders by this partner
  const completedOrders = orders.filter(
    (o) => partnerId && (o.partnerId === partnerId || o.professionalId === partnerId) && (o.status === 'completed' || o.paymentStatus === 'paid')
  );

  // Calculate earnings from real completed orders
  const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.totalPrice || o.price || 0), 0);
  const currentMonthEarnings = totalEarnings;

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await changeBookingStatus(orderId, newStatus, {
      partnerId: partnerId,
      partnerName: currentPartner?.name || currentUser?.name || 'Profissional Certificado',
      partnerPhone: currentPartner?.phone || currentUser?.phone || '+55 11 98765-4321'
    });
  };

  const handleSaveHourlyRate = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedRateSuccess(true);
    setTimeout(() => setSavedRateSuccess(false), 3000);
  };

  return (
    <div className="pb-28 pt-2 px-4 w-full max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Top Banner & Partner Identity */}
      <div className="bg-linear-to-r from-teal-900 to-[#0D3B4C] text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser?.avatarUrl || currentUser?.photoUrl || currentPartner?.photoUrl || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'Prestador'}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-300/40 shadow-md"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-teal-900 ${isAvailable ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  {currentUser?.name || currentPartner?.name || 'Carlos Silva'}
                </h1>
                <span className="bg-teal-400/20 text-teal-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-teal-300/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-300" />
                  PRESTADOR PRO
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-0.5 flex items-center gap-2">
                <span>{currentPartner?.categories?.join(' • ') || 'Eletricidade & Reparações Gerais'}</span>
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-teal-200/90 font-medium">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {currentPartner?.rating || '4.95'}
                </span>
                <span>•</span>
                <span>{currentPartner?.completedJobs || 142} serviços realizados</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-center">
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isAvailable
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isAvailable ? 'Disponível para Pedidos' : 'Em Pausa / Ocupado'}</span>
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer"
              title="Terminar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Faturação Total</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-slate-900">
            {formatCurrency(currentMonthEarnings)}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +14% este mês
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Trabalhos em Curso</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-black text-slate-900">
            {myAssignedOrders.length}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {myAssignedOrders.length === 1 ? '1 serviço ativo' : `${myAssignedOrders.length} serviços ativos`}
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Disponíveis</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-black text-slate-900">
            {availablePendingOrders.length}
          </div>
          <span className="text-[10px] text-amber-700 font-bold">
            Novos pedidos na área
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Tarifa Atual</span>
            <Wrench className="w-4 h-4 text-[#0D3B4C]" />
          </div>
          <div className="text-lg font-black text-slate-900">
            {formatHourlyRate(hourlyRate)}
          </div>
          <span className="text-[10px] text-teal-800 font-bold">
            Taxa horária base
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Partner */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab('assigned')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'assigned'
              ? 'bg-white text-[#0D3B4C] shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Meus Trabalhos ({myAssignedOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('available')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
            activeSubTab === 'available'
              ? 'bg-white text-teal-900 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Novos Pedidos ({availablePendingOrders.length})</span>
          {availablePendingOrders.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('completed')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'completed'
              ? 'bg-white text-slate-900 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Concluídos ({completedOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'profile'
              ? 'bg-white text-slate-900 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Minha Ficha</span>
        </button>
      </div>

      {/* SUBTAB 1: MEUS TRABALHOS ATIVOS */}
      {activeSubTab === 'assigned' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Trabalhos Atribuídos a Si
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              Atualização em tempo real via Firestore
            </span>
          </div>

          {myAssignedOrders.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Não tem trabalhos em andamento no momento</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Consulte o separador <span className="font-bold text-teal-800">"Novos Pedidos"</span> para aceitar chamados de clientes em Lisboa e arredores.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('available')}
                className="bg-[#0D3B4C] hover:bg-[#072430] text-white text-xs font-bold py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <span>Ver Pedidos Disponíveis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myAssignedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 hover:border-teal-300 rounded-3xl p-4 sm:p-5 shadow-2xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-400">#{order.id.slice(0, 8)}</span>
                        <span className="bg-teal-50 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-teal-200">
                          {order.category || order.serviceTitle || 'Serviço Geral'}
                        </span>
                        {order.urgency && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Urgência: {order.urgency}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                        {order.serviceTitle || order.description || 'Pedido de Serviço'}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-[#0D3B4C]">
                        {formatCurrency(order.totalPrice || order.price || 45)}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        Valor Total
                      </span>
                    </div>
                  </div>

                  {order.description && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{order.description}"
                    </p>
                  )}

                  {/* Customer & Location Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span className="font-semibold text-slate-900">{order.clientName || order.userName || 'Cliente'}</span>
                      {(order.clientPhone || order.userPhone) && (
                        <a 
                          href={`tel:${order.clientPhone || order.userPhone}`}
                          className="text-teal-800 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <Phone className="w-3 h-3" /> {order.clientPhone || order.userPhone}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span className="truncate">
                        {order.address?.street ? `${order.address.street}, ${order.address.number || ''} - ${order.address.city || 'Lisboa'}` : 'Lisboa, Portugal'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span>{order.scheduledDate || order.date || 'Hoje'} {order.timeSlot || order.scheduledTime || 'Horário a combinar'}</span>
                    </div>
                  </div>

                  {/* State Action Workflow for Provider */}
                  <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500">Estado Atual:</span>
                      <span className="text-[11px] font-extrabold text-[#0D3B4C] bg-slate-100 px-2 py-0.5 rounded-lg capitalize">
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'accepted' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, 'on_the_way')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          🚗 A Caminho do Local
                        </button>
                      )}

                      {order.status === 'on_the_way' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, 'in_progress')}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          ⚡ Iniciar Trabalho
                        </button>
                      )}

                      {order.status === 'in_progress' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, 'completed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Finalizar e Concluir
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveBookingDetail(order)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-1.5 px-3 rounded-xl transition-all cursor-pointer"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: NOVOS PEDIDOS DISPONÍVEIS */}
      {activeSubTab === 'available' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Pedidos Disponíveis para Aceitar
            </h2>
            <span className="text-xs text-teal-800 font-bold">
              Área de Lisboa & Vale do Tejo
            </span>
          </div>

          {availablePendingOrders.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Sem novos pedidos pendentes no momento</h3>
              <p className="text-xs text-slate-500">
                Assim que um cliente solicitar um serviço na sua área, o pedido aparecerá aqui para aceitação imediata.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availablePendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border-2 border-teal-500/30 hover:border-teal-600 rounded-3xl p-4 sm:p-5 shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-teal-100 text-teal-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {order.category || 'Serviço'}
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Disponível
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                        {order.serviceTitle || order.description || 'Novo Pedido Solicitado'}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-emerald-700">
                        {formatCurrency(order.totalPrice || order.price || 40)}
                      </div>
                    </div>
                  </div>

                  {order.description && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{order.description}"
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-teal-700" />
                      <span>{order.address?.city || 'Lisboa, PT'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(order.id, 'accepted')}
                      className="bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aceitar este Trabalho</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: HISTÓRICO CONCLUÍDO */}
      {activeSubTab === 'completed' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Histórico de Trabalhos Realizados
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              Total Faturado: {formatCurrency(currentMonthEarnings)}
            </span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 divide-y divide-slate-100 shadow-2xs">
            {completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {order.serviceTitle || order.category || 'Serviço Realizado'}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Cliente: {order.clientName || 'Cliente'} • {order.scheduledDate || 'Concluído'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-700">
                      +{formatCurrency(order.totalPrice || order.price || 50)}
                    </span>
                    <span className="block text-[9px] text-slate-400">Pago</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Ainda não tem serviços marcados como concluídos.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: MINHA FICHA PROFISSIONAL & CONFIGURAÇÃO */}
      {activeSubTab === 'profile' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Configurações da Ficha Profissional
              </h2>
              <p className="text-xs text-slate-500">
                Personalize a sua taxa horária e categorias de atuação
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" />
              Documentos Verificados
            </span>
          </div>

          <form onSubmit={handleSaveHourlyRate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Taxa Horária Base (R$ / Hora)
              </label>
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  type="number"
                  min="15"
                  max="150"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:border-teal-600 outline-none"
                />
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  Guardar Tarifa
                </button>
              </div>
              {savedRateSuccess && (
                <p className="text-xs text-emerald-600 font-bold mt-1 animate-in fade-in">
                  ✓ Tarifa horária atualizada com sucesso!
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Especialidades Atendidas
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Eletricidade & Iluminação', 'Canalização & Desentupimentos', 'Climatização & AC', 'Reparações & Bricolage', 'Pintura & Tetos', 'Fechaduras & Portas'].map((cat) => (
                  <span
                    key={cat}
                    className="bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold px-3 py-1 rounded-xl"
                  >
                    ✓ {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Certificação e Garantia:</span>
              <p className="text-slate-500 text-[11px]">
                O seu perfil conta com selo de garantia "Resolva Fácil Certificado". Todos os serviços prestados contam com cobertura de seguro de responsabilidade civil em território nacional.
              </p>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
