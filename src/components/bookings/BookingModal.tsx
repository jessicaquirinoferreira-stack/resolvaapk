import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Banknote
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Professional, ServiceItem } from '../../types';
import { formatCurrency } from '../../lib/format';

export const BookingModal: React.FC = () => {
  const { 
    selectedServiceForBooking, 
    setSelectedServiceForBooking, 
    professionals, 
    createNewBooking,
    setActiveBookingDetail,
    setActiveTab
  } = useApp();

  const { currentUser, currentAddress, addresses, addAddress, setCurrentAddress } = useAuth();

  const [step, setStep] = useState<number>(1); // 1: Details, 2: Date/Time, 3: Address, 4: Pro & Payment, 5: Confirmed
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('09:00 - 11:00');
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mbway' | 'card' | 'multibanco' | 'cash'>('mbway');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdBookingId, setCreatedBookingId] = useState<string>('');

  // New address state if user wants to add
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);
  const [newStreet, setNewStreet] = useState<string>('');
  const [newNumber, setNewNumber] = useState<string>('');
  const [newPostalCode, setNewPostalCode] = useState<string>('');
  const [newCity, setNewCity] = useState<string>('São Paulo');

  if (!selectedServiceForBooking) return null;

  const service = selectedServiceForBooking;

  // Filter professionals suitable for this category
  const suitablePros = professionals.filter(
    (p) => (p.isActive ?? true) && (
      (p.specialties && p.specialties.includes(service.categoryName)) || 
      (p.specialties && p.specialties.length > 0) ||
      (p.categories && p.categories.length > 0)
    )
  );
  const activePro = selectedPro || suitablePros[0] || professionals[0];

  const handleCreateBooking = async () => {
    setIsSubmitting(true);
    const bookingId = await createNewBooking({
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Cliente Resolva Fácil',
      userPhone: currentUser?.phone || '+55 11 98765-4321',
      serviceId: service.id,
      serviceTitle: service.title,
      categoryName: service.categoryName,
      serviceImageUrl: service.imageUrl,
      professionalId: activePro?.id,
      professionalName: activePro?.name,
      professionalPhoto: activePro?.photoUrl,
      professionalPhone: activePro?.phone,
      date: selectedDate,
      timeSlot: selectedSlot,
      address: currentAddress,
      notes,
      status: 'pending',
      totalPrice: service.price,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
    });

    setCreatedBookingId(bookingId);
    setIsSubmitting(false);
    setStep(5); // Confirmation screen
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newNumber) return;
    const addr = {
      id: 'addr_' + Date.now(),
      title: 'Novo Endereço',
      street: newStreet,
      number: newNumber,
      postalCode: newPostalCode || '01001-000',
      city: newCity || 'São Paulo',
      isDefault: false
    };
    addAddress(addr);
    setShowNewAddressForm(false);
  };

  const handleClose = () => {
    setSelectedServiceForBooking(null);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-start p-0 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="w-full max-w-4xl bg-white h-[100dvh] flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            {step > 1 && step < 5 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="text-xs font-black uppercase tracking-wider text-[#0D3B4C]">
              {step === 1 && 'Detalhes do Serviço'}
              {step === 2 && 'Data e Horário'}
              {step === 3 && 'Morada de Intervenção'}
              {step === 4 && 'Pagamento & Confirmação'}
              {step === 5 && 'Reserva Efetuada'}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto no-scrollbar flex-1 p-5 pb-24">
          
          {/* STEP 1: SERVICE DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#0D3B4C] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                  {service.categoryName}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{service.rating}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black text-[#0D3B4C]">
                    {formatCurrency(service.price)}
                  </span>
                  {service.originalPrice && (
                    <span className="text-xs text-slate-400 line-through font-semibold">
                      {formatCurrency(service.originalPrice)}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 font-medium">
                    • Duração aprox. {service.durationMinutes} min
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Included items */}
              {service.includedItems && (
                <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2">
                  <h5 className="text-[11px] font-black uppercase text-teal-900">
                    O que está incluído no serviço:
                  </h5>
                  <div className="space-y-1.5">
                    {service.includedItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Instruções específicas para o profissional (opcional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Tocar no 3º andar, há estacionamento em frente..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-[#0D3B4C] bg-slate-50/50"
                />
              </div>

              <button
                id="btn-booking-step1-continue"
                onClick={() => setStep(2)}
                className="w-full bg-[#0D3B4C] hover:bg-[#072430] active:scale-[0.98] text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-2"
              >
                <span>Avançar para Agendamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Quando pretende receber o profissional?
                </h4>
                <p className="text-xs text-slate-500">
                  Disponibilidade garantida nos dias e horários selecionados
                </p>
              </div>

              {/* Quick Date Shortcuts */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">
                  Escolha o dia
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Hoje', offset: 0 },
                    { label: 'Amanhã', offset: 1 },
                    { label: 'Depois', offset: 2 }
                  ].map((opt) => {
                    const target = new Date();
                    target.setDate(target.getDate() + opt.offset);
                    const iso = target.toISOString().split('T')[0];
                    const isSelected = selectedDate === iso;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedDate(iso)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-[#0D3B4C] text-white border-[#0D3B4C] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-xs font-bold">{opt.label}</span>
                        <span className="block text-[10px] opacity-80 mt-0.5">
                          {target.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2">
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">
                  Janela Horária de Chegada
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '09:00 - 11:00',
                    '11:00 - 13:00',
                    '14:00 - 16:00',
                    '16:00 - 18:00',
                    '18:00 - 20:00'
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedSlot === slot
                          ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <span className="text-xs">{slot}</span>
                      {selectedSlot === slot && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="btn-booking-step2-continue"
                onClick={() => setStep(3)}
                className="w-full bg-[#0D3B4C] hover:bg-[#072430] active:scale-[0.98] text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-2"
              >
                <span>Confirmar Horário</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: ADDRESS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  Onde será realizado o serviço?
                </h4>
                <button
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs font-bold text-teal-800 hover:underline"
                >
                  {showNewAddressForm ? 'Cancelar' : '+ Nova Morada'}
                </button>
              </div>

              {showNewAddressForm ? (
                <form onSubmit={handleAddNewAddress} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Rua / Avenida</label>
                    <input
                      type="text"
                      placeholder="Ex: Rua de Santa Catarina"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Número / Andar</label>
                      <input
                        type="text"
                        placeholder="Nº 45, 2º Dto"
                        value={newNumber}
                        onChange={(e) => setNewNumber(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Código Postal</label>
                      <input
                        type="text"
                        placeholder="4000-001"
                        value={newPostalCode}
                        onChange={(e) => setNewPostalCode(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-800 text-white text-xs font-bold py-2 rounded-xl"
                  >
                    Guardar Morada
                  </button>
                </form>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setCurrentAddress(addr)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        currentAddress?.id === addr.id
                          ? 'bg-teal-50/80 border-[#0D3B4C] text-slate-900 ring-1 ring-[#0D3B4C]'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{addr.title}</span>
                          {currentAddress?.id === addr.id && (
                            <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                              Selecionada
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {addr.street}, {addr.number} {addr.floor ? `(${addr.floor})` : ''}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {addr.postalCode} {addr.city}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                id="btn-booking-step3-continue"
                onClick={() => setStep(4)}
                className="w-full bg-[#0D3B4C] hover:bg-[#072430] active:scale-[0.98] text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-2"
              >
                <span>Avançar para Pagamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: PROFESSIONAL & PAYMENT */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Professional preview */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Profissional Atribuído (Camisa Resolva Facil)
                </label>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img
                    src={activePro.photoUrl}
                    alt={activePro.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 truncate">
                        {activePro.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-700">{activePro.rating}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-teal-800 font-semibold block">
                      Uniforme e Crachá Oficial Resolva Facil
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {activePro.completedJobs} serviços concluídos com sucesso
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Método de Pagamento
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'mbway', name: 'MB WAY', desc: 'Confirmação instantânea na app', icon: Smartphone },
                    { id: 'card', name: 'Cartão de Crédito / Débito', desc: 'Visa, Mastercard ou American Express', icon: CreditCard },
                    { id: 'multibanco', name: 'Multibanco', desc: 'Entidade e referência para pagamento', icon: CreditCard },
                    { id: 'cash', name: 'Pagar ao Profissional', desc: 'Numerário após conclusão da obra', icon: Banknote }
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          paymentMethod === m.id
                            ? 'bg-teal-50/80 border-[#0D3B4C] text-slate-900 ring-1 ring-[#0D3B4C]'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            paymentMethod === m.id ? 'bg-[#0D3B4C] text-amber-400' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">{m.name}</span>
                            <span className="text-[10px] text-slate-500">{m.desc}</span>
                          </div>
                        </div>

                        {paymentMethod === m.id && (
                          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary of Price */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Valor do serviço:</span>
                  <span className="font-semibold">{formatCurrency(service.price)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Deslocação e Seguro:</span>
                  <span className="font-semibold text-emerald-700">Grátis (R$ 0,00)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-[#0D3B4C]">
                  <span>Total a pagar:</span>
                  <span>{formatCurrency(service.price)}</span>
                </div>
              </div>

              <button
                id="btn-confirm-and-pay"
                onClick={handleCreateBooking}
                disabled={isSubmitting}
                className="w-full bg-[#0D3B4C] hover:bg-[#072430] active:scale-[0.98] disabled:opacity-60 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0D3B4C]/25 transition-all"
              >
                {isSubmitting ? (
                  <span>A processar reserva...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Confirmar Agendamento ({formatCurrency(service.price)})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 5: CONFIRMATION SUCCESS */}
          {step === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  Pedido Confirmado
                </span>
                <h3 className="text-xl font-black text-[#0D3B4C] mt-2">
                  Serviço Agendado com Sucesso!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                  O profissional <strong className="text-slate-900">{activePro.name}</strong> está destacado para a sua morada.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2 max-w-xs mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Serviço:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[150px]">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Data & Hora:</span>
                  <span className="font-bold text-slate-900">{selectedDate} ({selectedSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Morada:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[150px]">{currentAddress?.street}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total:</span>
                  <span className="font-black text-[#0D3B4C]">{formatCurrency(service.price)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setActiveTab('bookings');
                  }}
                  className="w-full bg-[#0D3B4C] hover:bg-[#072430] text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors shadow-sm"
                >
                  Ver em Os Meus Serviços
                </button>
                <button
                  onClick={handleClose}
                  className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 py-2"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
