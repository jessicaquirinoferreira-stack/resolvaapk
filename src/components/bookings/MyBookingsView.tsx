import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { formatCurrency } from '../../lib/format';

export const MyBookingsView: React.FC = () => {
  const { orders, setActiveBookingDetail, setActiveTab } = useApp();
  const { currentUser, currentPartner } = useAuth();
  const [activeTabType, setActiveTabType] = useState<'active' | 'past'>('active');

  const isPartner = currentUser?.role === 'partner';

  // Filter orders
  const inProgressOrders = orders.filter((o) => o.status === 'in_progress' || o.status === 'on_the_way');
  const upcomingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'accepted');
  const pastOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Em andamento
          </span>
        );
      case 'on_the_way':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            A caminho
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-teal-700" />
            Aceito / Confirmado
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-slate-500" />
            Pendente
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Concluído
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency) return null;
    const u = urgency.toLowerCase();
    if (u === 'urgente' || u === 'alta') {
      return (
        <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
          Urgente
        </span>
      );
    }
    return (
      <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
        {urgency}
      </span>
    );
  };

  return (
    <div className="pb-28 pt-2 px-4 w-full max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Title & Partner Badge */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#0D3B4C] tracking-tight">
            {isPartner ? 'Meus Chamados' : 'Os Meus Serviços'}
          </h2>
          {isPartner && currentPartner && (
            <span className="bg-teal-50 border border-teal-200 text-teal-900 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-teal-700" />
              Parceiro: {currentPartner.name}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          {isPartner 
            ? 'Acompanhe os chamados atribuídos ao seu perfil em tempo real' 
            : 'Acompanhe os seus pedidos e agendamentos em tempo real'}
        </p>
      </div>

      {/* Partner Notice about Security Rules & Safe Read-Only Mode */}
      {isPartner && (
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold block">Sincronização em Tempo Real com o Backend</span>
            <span className="text-[11px] text-amber-800">
              Os chamados desta lista são lidos diretamente da coleção oficial <code className="bg-amber-100 px-1 rounded">/orders</code> onde <code className="bg-amber-100 px-1 rounded">partnerId == {currentPartner?.id || 'ID_DO_PARCEIRO'}</code>. A atualização de status pelo PWA aguarda a revisão planejada das regras de segurança de produção.
            </span>
          </div>
        </div>
      )}

      {/* Segmented Control Tabs */}
      <div className="bg-slate-200/70 p-1 rounded-2xl flex">
        <button
          onClick={() => setActiveTabType('active')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
            activeTabType === 'active'
              ? 'bg-white text-[#0D3B4C] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Ativos ({inProgressOrders.length + upcomingOrders.length})
        </button>
        <button
          onClick={() => setActiveTabType('past')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
            activeTabType === 'past'
              ? 'bg-white text-[#0D3B4C] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Anteriores ({pastOrders.length})
        </button>
      </div>

      {activeTabType === 'active' ? (
        <div className="space-y-6">
          {/* Section: Em andamento */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Em andamento
            </h3>

            {inProgressOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center shadow-xs">
                <Clock className="w-7 h-7 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                <p className="text-xs font-semibold text-slate-500">
                  Não há chamados em andamento no momento.
                </p>
              </div>
            ) : (
              inProgressOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setActiveBookingDetail(order)}
                  className="bg-white rounded-3xl p-4 border border-teal-200 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-teal-800 uppercase">
                        {order.category || order.categoryName || 'Serviço'}
                      </span>
                      {getUrgencyBadge(order.urgency)}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {order.serviceTitle || order.description || 'Chamado Solicitado'}
                    </h4>
                    {order.description && order.serviceTitle !== order.description && (
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {order.description}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {order.scheduledDate || order.date || 'Data a combinar'}, {order.scheduledTime || order.timeSlot || 'Horário flexível'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[220px] text-[10px]">
                      📍 {typeof order.address === 'object' && order.address?.street
                        ? `${order.address.street}, ${order.address.number || ''}`
                        : typeof order.address === 'string'
                        ? order.address
                        : 'Morada sob consulta'}
                    </span>
                    <span className="text-teal-800 font-bold text-[11px] flex items-center gap-0.5">
                      Ver detalhes →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section: Próximos / Atribuídos */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Próximos & Atribuídos
            </h3>

            {upcomingOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center shadow-xs space-y-3">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto stroke-[1.5]" />
                <div>
                  <p className="text-xs font-semibold text-slate-600">
                    {isPartner 
                      ? 'Nenhum chamado atribuído na fila de espera.' 
                      : 'Não tem próximos serviços agendados.'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isPartner
                      ? 'Assim que um chamado for atribuído ao seu ID de parceiro no site, ele surgirá aqui instantaneamente.'
                      : 'Precisa de uma reparação ou manutenção em sua casa?'}
                  </p>
                </div>
                {!isPartner && (
                  <button
                    onClick={() => setActiveTab('home')}
                    className="bg-[#0D3B4C] hover:bg-[#072430] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Explorar serviços
                  </button>
                )}
              </div>
            ) : (
              upcomingOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setActiveBookingDetail(order)}
                  className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-teal-800 uppercase">
                        {order.category || order.categoryName || 'Serviço'}
                      </span>
                      {getUrgencyBadge(order.urgency)}
                      {(order.totalPrice || order.price) && (
                        <>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[11px] font-bold text-slate-800">
                            {formatCurrency(order.totalPrice || order.price)}
                          </span>
                        </>
                      )}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {order.serviceTitle || order.description || 'Chamado Solicitado'}
                    </h4>
                    {order.description && order.serviceTitle !== order.description && (
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {order.description}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {order.scheduledDate || order.date || 'Data agendada'}, {order.scheduledTime || order.timeSlot || 'Horário a definir'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[220px] text-[10px]">
                      📍 {typeof order.address === 'object' && order.address?.street
                        ? `${order.address.street}, ${order.address.number || ''}`
                        : typeof order.address === 'string'
                        ? order.address
                        : 'Morada sob consulta'}
                    </span>
                    <span className="text-teal-800 font-bold text-[11px] flex items-center gap-0.5">
                      Ver detalhes <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Past Orders */
        <div className="space-y-3">
          {pastOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center shadow-xs">
              <p className="text-xs text-slate-500">Ainda não possui chamados concluídos ou cancelados.</p>
            </div>
          ) : (
            pastOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setActiveBookingDetail(order)}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {order.scheduledDate || order.date || order.createdAt?.split('T')[0]}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {order.serviceTitle || order.description || 'Chamado'}
                  </h4>
                  {(order.totalPrice || order.price) && (
                    <p className="text-[11px] font-bold text-[#0D3B4C] mt-0.5">
                      {formatCurrency(order.totalPrice || order.price)}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500">
                    ID: {order.id}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBookingDetail(order);
                    }}
                    className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
