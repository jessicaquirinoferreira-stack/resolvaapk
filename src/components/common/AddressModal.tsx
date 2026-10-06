import React, { useState } from 'react';
import { X, MapPin, Plus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AddressModal: React.FC = () => {
  const { currentAddress, addresses, setCurrentAddress, addAddress } = useAuth();
  const { showAddressModal, setShowAddressModal } = useApp();

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [street, setStreet] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [city, setCity] = useState<string>('São Paulo');
  const [postalCode, setPostalCode] = useState<string>('01001-000');

  if (!showAddressModal) return null;

  const handleSelect = (addr: any) => {
    setCurrentAddress(addr);
    setShowAddressModal(false);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !number) return;
    const newAddr = {
      id: 'addr_' + Date.now(),
      title: `${street}, ${number}`,
      street,
      number,
      postalCode,
      city,
      isDefault: false
    };
    addAddress(newAddr);
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-start p-0 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="w-full max-w-4xl bg-white h-[100dvh] flex flex-col p-5 shadow-none border-none overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-black text-[#0D3B4C] uppercase tracking-wider">
            Escolher Morada
          </h3>
          <button
            onClick={() => setShowAddressModal(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => handleSelect(addr)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                currentAddress?.id === addr.id
                  ? 'bg-teal-50 border-[#0D3B4C] ring-1 ring-[#0D3B4C]'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{addr.title}</span>
                  {currentAddress?.id === addr.id && (
                    <Check className="w-4 h-4 text-teal-700" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {addr.street}, {addr.number}
                </p>
                <p className="text-[10px] text-slate-400">
                  {addr.postalCode} {addr.city}
                </p>
              </div>
            </div>
          ))}

          {isAddingNew ? (
            <form onSubmit={handleAddNew} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">Nova Morada</span>
              <input
                type="text"
                placeholder="Rua ou Avenida"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Número / Andar"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="Código Postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-2 text-xs text-slate-600 font-bold bg-white border border-slate-200 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white font-bold bg-[#0D3B4C] rounded-xl shadow-xs"
                >
                  Adicionar
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-teal-400 text-xs font-bold text-teal-800 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Nova Morada</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
