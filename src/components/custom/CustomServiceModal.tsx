import React, { useState } from 'react';
import { X, Sparkles, Clock, Calendar, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const CustomServiceModal: React.FC = () => {
  const { showCustomServiceModal, setShowCustomServiceModal, submitCustomRequest } = useApp();
  const { currentUser, currentAddress } = useAuth();

  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:00 - 12:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!showCustomServiceModal) return null;

  const charLimit = 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    await submitCustomRequest({
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Cliente',
      userPhone: currentUser?.phone || '',
      description,
      estimatedHours,
      hourlyRate: 49.90,
      preferredDate,
      preferredTime,
      address: currentAddress
    });

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setShowCustomServiceModal(false);
    setIsSuccess(false);
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-start p-0 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="w-full max-w-4xl bg-white h-[100dvh] flex flex-col overflow-hidden">
        
        {/* Top Header with Close */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Sob Medida
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar flex-1 p-5 pb-24 space-y-5">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0D3B4C]">
                  Pedido Personalizado Enviado!
                </h3>
                <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
                  A nossa equipa técnica do <strong className="text-slate-900">Resolva Facil</strong> já recebeu a sua solicitação. Vamos atribuir o especialista ideal e contactá-lo rapidamente com a confirmação.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-1.5 max-w-xs mx-auto">
                <div className="flex justify-between text-slate-500">
                  <span>Tarifa base:</span>
                  <span className="font-bold text-slate-800">R$ 49,90 / hora</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Data preferencial:</span>
                  <span className="font-bold text-slate-800">{preferredDate} ({preferredTime})</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Morada:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[150px]">{currentAddress?.street}</span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-[#0D3B4C] text-white font-bold text-xs py-3 px-4 rounded-xl hover:bg-[#072430] transition-colors"
              >
                Concluir
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Visual Banner */}
              <div className="rounded-2xl bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 p-5 text-slate-950 shadow-md relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-slate-950/10 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3" />
                    Resolva Facil Exclusivo
                  </div>
                  <h2 className="text-lg font-black tracking-tight uppercase leading-tight">
                    SERVIÇO PERSONALIZADO
                  </h2>
                  <p className="text-xs font-semibold text-slate-900/80 mt-1">
                    Não encontrou o que procura na lista? O nosso técnico resolve.
                  </p>
                  
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                    <span className="text-xs font-bold text-slate-500">Tarifa:</span>
                    <span className="text-sm font-extrabold text-[#0D3B4C]">R$ 49,90</span>
                    <span className="text-[11px] font-bold text-slate-600">por hora</span>
                  </div>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Descreva o que precisa
                  </label>
                  <span className={`text-[10px] font-bold ${
                    description.length > 180 ? 'text-rose-600' : 'text-slate-400'
                  }`}>
                    {description.length}/{charLimit}
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={charLimit}
                  id="custom-service-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Preciso de fixar uma cabeceira de cama pesada na parede de pladur e trocar duas tomadas antigas da sala..."
                  className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0D3B4C] focus:ring-2 focus:ring-[#0D3B4C]/10 transition-all resize-none bg-slate-50/50"
                  required
                />
              </div>

              {/* Time & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Duração estimada
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/50">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mr-2" />
                    <select
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(Number(e.target.value))}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value={1}>1 hora (R$ 49,90)</option>
                      <option value={2}>2 horas (R$ 99,80)</option>
                      <option value={3}>3 horas (R$ 149,70)</option>
                      <option value={4}>4 horas (R$ 199,60)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Data preferida
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/50">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2" />
                    <input
                      type="date"
                      value={preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Slot */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Janela horária
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00 - 12:00', '13:00 - 16:00', '16:00 - 19:00'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPreferredTime(slot)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border ${
                        preferredTime === slot
                          ? 'bg-[#0D3B4C] text-white border-[#0D3B4C]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address indicator */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 font-bold block leading-none">Morada de intervenção</span>
                    <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">{currentAddress?.street}, {currentAddress?.number}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="btn-submit-custom-request"
                disabled={isSubmitting || !description.trim()}
                className="w-full bg-[#0D3B4C] hover:bg-[#072430] active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0D3B4C]/25 transition-all mt-2"
              >
                {isSubmitting ? (
                  <span>A enviar pedido...</span>
                ) : (
                  <>
                    <span>Continuar e Solicitar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
