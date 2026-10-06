import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  Star, 
  AlertCircle,
  Briefcase,
  Info,
  Navigation,
  CheckCheck,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { BookingStatus, Order } from '../../types';
import { formatCurrency } from '../../lib/format';

export const BookingDetailModal: React.FC = () => {
  const { activeBookingDetail, setActiveBookingDetail, changeBookingStatus } = useApp();
  const { currentUser, currentPartner, isAdmin } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  if (!activeBookingDetail) return null;

  const b = activeBookingDetail;
  const isPartner = currentUser?.role === 'partner';

  const steps: { key: BookingStatus; label: string; desc: string }[] = [
    { key: 'pending', label: 'Pedido Registado', desc: 'A aguardar confirmação do sistema' },
    { key: 'accepted', label: 'Profissional Atribuído', desc: 'Técnico certificado Resolva Fácil pronto' },
    { key: 'on_the_way', label: 'A Caminho', desc: 'Profissional em deslocação para a morada' },
    { key: 'in_progress', label: 'A Decorrer', desc: 'Serviço a ser realizado neste momento' },
    { key: 'completed', label: 'Concluído', desc: 'Trabalho finalizado com garantia' }
  ];

  const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex((s) => s.key === status);
  };

  const currentIndex = getStepIndex(b.status);
  const displayPrice = (b.totalPrice ?? b.price ?? 0);

  const handleUpdateStatus = async (newStatus: Order['status'], extra?: Partial<Order>) => {
    try {
      setIsUpdating(true);
      await changeBookingStatus(b.id, newStatus, extra);
    } catch (err: any) {
      alert('Erro ao atualizar estado no banco de dados: ' + (err.message || 'Verifique a conexão'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelBooking = async () => {
    if (confirm('Tem a certeza que deseja cancelar este agendamento?')) {
      await handleUpdateStatus('cancelled');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasRated(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-start p-0 sm:p-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="w-full max-w-lg bg-white h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#0D3B4C]">
              {isPartner ? 'Detalhes do Chamado' : isAdmin ? 'Gestão do Pedido' : 'Acompanhamento do Pedido'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">#{b.id.slice(-6)}</span>
          </div>

          <button
            onClick={() => setActiveBookingDetail(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto no-scrollbar flex-1 p-5 pb-20 space-y-5">

          {/* Live Sync Banner */}
          <div className="p-3 bg-teal-50/80 border border-teal-200/60 rounded-2xl flex items-center justify-between text-xs text-teal-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span className="text-[11px] font-bold">Sincronizado em tempo real com o banco de dados</span>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold bg-white px-2 py-0.5 rounded shadow-2xs">
              {b.status}
            </span>
          </div>

          {/* Service Snapshot */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            {b.serviceImageUrl && (
              <img
                src={b.serviceImageUrl}
                alt={b.serviceTitle || 'Serviço'}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full inline-block mb-1">
                {b.category || b.categoryName || 'Geral'}
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 truncate">
                {b.serviceTitle || 'Serviço Solicitado'}
              </h4>
              <p className="text-xs font-black text-[#0D3B4C] mt-1">
                {formatCurrency(displayPrice)}
              </p>
            </div>
          </div>

          {/* Order Timeline */}
          {b.status !== 'cancelled' ? (
            <div className="space-y-4 pt-1">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Progresso em Tempo Real
              </h5>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {steps.map((st, idx) => {
                  const isDone = currentIndex >= idx;
                  const isCurrent = currentIndex === idx;

                  return (
                    <div key={st.key} className="relative flex items-start gap-3 text-xs">
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-white border-2 border-slate-300 text-transparent'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isCurrent ? 'text-teal-900 font-extrabold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                            {st.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-extrabold bg-teal-100 text-teal-900 px-1.5 py-0.2 rounded-full uppercase animate-pulse">
                              Atual
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-800 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <strong className="block font-bold">Agendamento Cancelado</strong>
                <span>Este pedido foi cancelado no sistema.</span>
              </div>
            </div>
          )}

          {/* PARTNER REAL-TIME ACTIONS */}
          {isPartner && b.status !== 'cancelled' && b.status !== 'completed' && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                  Ações do Profissional
                </span>
                <span className="text-[10px] text-slate-400">Atualização Imediata</span>
              </div>

              {b.status === 'pending' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('accepted', {
                    partnerId: currentPartner?.id || '',
                    partnerName: currentPartner?.name || 'Profissional Resolva Fácil'
                  })}
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  {isUpdating ? 'A aceitar...' : 'Aceitar Chamado'}
                </button>
              )}

              {b.status === 'accepted' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('on_the_way')}
                  className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  {isUpdating ? 'A atualizar...' : 'Estou a Caminho do Cliente'}
                </button>
              )}

              {b.status === 'on_the_way' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('in_progress')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Play className="w-4 h-4" />
                  {isUpdating ? 'A iniciar...' : 'Iniciar Serviço no Local'}
                </button>
              )}

              {b.status === 'in_progress' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('completed')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isUpdating ? 'A concluir...' : 'Marcar Serviço como Concluído'}
                </button>
              )}
            </div>
          )}

          {/* ADMIN REAL-TIME CONTROLS */}
          {isAdmin && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-slate-900 space-y-2">
              <span className="text-[11px] font-black uppercase text-amber-950 block">
                Gestão Administrativa do Estado
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['pending', 'accepted', 'on_the_way', 'in_progress', 'completed', 'cancelled'] as Order['status'][]).map((st) => (
                  <button
                    key={st}
                    disabled={isUpdating || b.status === st}
                    onClick={() => handleUpdateStatus(st)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                      b.status === st 
                        ? 'bg-[#0D3B4C] text-white shadow-xs' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Professional Snapshot */}
          {(b.professionalName || b.partnerName) && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Profissional Atribuído
              </span>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(b.professionalPhoto || b.partnerPhoto) ? (
                    <img
                      src={b.professionalPhoto || b.partnerPhoto}
                      alt={b.professionalName || b.partnerName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-base">
                      {(b.professionalName || b.partnerName || 'P')[0]}
                    </div>
                  )}
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      {b.professionalName || b.partnerName}
                    </h5>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-slate-700">Top Profissional</span>
                    </div>
                  </div>
                </div>

                {(b.professionalPhone || b.partnerPhone) && (
                  <a
                    href={`tel:${b.professionalPhone || b.partnerPhone}`}
                    className="w-9 h-9 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 flex items-center justify-center transition-colors shadow-2xs"
                    title="Contactar Profissional"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Details (Schedule & Address) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                {b.scheduledDate || b.date || 'Data sob consulta'} • {b.scheduledTime || b.timeSlot || 'Horário flexível'}
              </span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span>
                {typeof b.address === 'object' && b.address?.street
                  ? `${b.address.street}, ${b.address.number || ''} ${b.address.floor ? `(${b.address.floor})` : ''} - ${b.address.city || ''}`
                  : typeof b.address === 'string'
                  ? b.address
                  : 'Morada sob confirmação'}
              </span>
            </div>
            {b.notes && (
              <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                <strong>Notas:</strong> {b.notes}
              </div>
            )}
          </div>

          {/* Review form if completed */}
          {b.status === 'completed' && !hasRated && !isPartner && (
            <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950">Avaliar o Profissional</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRating(st)}
                      className="p-0.5 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${rating >= st ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="Deixe um comentário sobre a pontualidade e serviço..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-amber-200 bg-white outline-none"
              />
              <button
                type="submit"
                className="w-full bg-[#0D3B4C] text-white text-xs font-bold py-2 rounded-xl cursor-pointer"
              >
                Enviar Avaliação
              </button>
            </form>
          )}

          {hasRated && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center font-bold">
              ✓ Obrigado pela sua avaliação de {rating} estrelas!
            </div>
          )}

          {/* Cancel button if pending */}
          {b.status === 'pending' && !isPartner && (
            <button
              onClick={handleCancelBooking}
              className="w-full py-2.5 text-xs text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar Agendamento
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
