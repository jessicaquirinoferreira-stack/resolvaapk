import React from 'react';
import { 
  Search, 
  Sparkles, 
  Wrench, 
  Paintbrush, 
  Zap, 
  Hammer, 
  Boxes, 
  Shirt, 
  Refrigerator, 
  Star, 
  Percent, 
  Gift, 
  ChevronRight, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import { formatCurrency } from '../../lib/format';

// Map icon strings to Lucide components
const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'Paintbrush': return <Paintbrush className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Hammer': return <Hammer className={className} />;
    case 'Boxes': return <Boxes className={className} />;
    case 'Shirt': return <Shirt className={className} />;
    case 'Refrigerator': return <Refrigerator className={className} />;
    default: return <Wrench className={className} />;
  }
};

export const HomeView: React.FC = () => {
  const { 
    services, 
    categories, 
    searchQuery, 
    setSearchQuery, 
    setSelectedCategory, 
    setActiveTab, 
    setSelectedServiceForBooking,
    setShowCustomServiceModal 
  } = useApp();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setActiveTab('discover');
  };

  const handleServiceClick = (service: ServiceItem) => {
    setSelectedServiceForBooking(service);
  };

  // Filtered services based on search query
  const filteredServices = searchQuery.trim()
    ? services.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : services;

  const bestOffers = services.filter((s) => s.bestOffer || s.discountPercentage);
  const plumbingServices = services.filter((s) => s.categoryId === 'canalizacao');
  const cleaningAndTextile = services.filter(
    (s) => s.categoryId === 'limpeza' || s.categoryId === 'lavandaria'
  );
  const decorAndAssembly = services.filter(
    (s) => s.categoryId === 'decoracao' || s.categoryId === 'montagem'
  );

  return (
    <div className="pb-28 pt-2 px-4 w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Search Input matching OSCAR */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          id="home-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Como podemos ajudar?"
          className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D3B4C]/10 focus:border-[#0D3B4C] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 text-xs text-slate-400 hover:text-slate-700 flex items-center font-bold"
          >
            Limpar
          </button>
        )}
      </div>

      {/* If Searching, show search results */}
      {searchQuery.trim() ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              Resultados para "{searchQuery}" ({filteredServices.length})
            </h3>
          </div>
          {filteredServices.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-slate-100 p-6">
              <p className="text-xs text-slate-500">Nenhum serviço encontrado com esse termo.</p>
              <button
                onClick={() => setShowCustomServiceModal(true)}
                className="mt-3 text-xs font-bold text-teal-800 hover:underline"
              >
                Pedir serviço personalizado →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3 items-center group"
                >
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide">
                      {service.categoryName}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5 group-hover:text-[#0D3B4C] transition-colors">
                      {service.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-bold text-slate-700">{service.rating}</span>
                      <span className="text-[10px] text-slate-400">({service.reviewCount})</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs font-black text-[#0D3B4C]">
                        {formatCurrency(service.price)}
                      </span>
                      {service.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatCurrency(service.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Top Categories Grid (OSCAR style circular/square pills) */}
          <section>
            <div className="grid grid-cols-4 gap-2.5">
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200 active:scale-95 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#0D3B4C] group-hover:bg-[#0D3B4C] group-hover:text-amber-400 flex items-center justify-center transition-colors mb-1.5 shadow-xs">
                    <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 text-center leading-tight truncate w-full">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Golden Banner: Serviço Personalizado (OSCAR reference) */}
          <section>
            <div
              onClick={() => setShowCustomServiceModal(true)}
              className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 rounded-3xl p-4 text-slate-950 shadow-md cursor-pointer hover:shadow-lg active:scale-[0.99] transition-all relative overflow-hidden flex items-center justify-between border border-amber-300"
            >
              <div className="relative z-10 max-w-[70%]">
                <span className="inline-block bg-slate-950 text-amber-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-1">
                  Feito à medida
                </span>
                <h3 className="text-sm font-black tracking-tight leading-tight uppercase">
                  Serviço Personalizado
                </h3>
                <p className="text-[11px] font-medium text-slate-900/80 mt-0.5">
                  Tarifa fixa de <strong className="font-extrabold text-slate-950">R$ 49,90/hora</strong>. Explique o que necessita.
                </p>
              </div>

              <div className="relative z-10 bg-white/90 p-2.5 rounded-2xl shadow-sm shrink-0 flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-slate-950" />
              </div>
            </div>
          </section>

          {/* Melhores Ofertas (Best Deals) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0D3B4C] tracking-tight">
                  Melhores ofertas
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Preços promocionais por tempo limitado
                </p>
              </div>
              <button
                onClick={() => setActiveTab('discover')}
                className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-0.5"
              >
                <span>Ver tudo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Carousel */}
            <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 snap-x">
              {bestOffers.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="min-w-[210px] w-[210px] bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer snap-start flex flex-col overflow-hidden group shrink-0"
                >
                  <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {service.discountPercentage && (
                      <span className="absolute top-2 left-2 bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                        -{service.discountPercentage}%
                      </span>
                    )}
                    {service.popular && (
                      <span className="absolute top-2 right-2 bg-amber-400 text-slate-950 font-black text-[9px] uppercase px-1.5 py-0.5 rounded-full shadow-sm">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide block">
                        {service.categoryName}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5 group-hover:text-[#0D3B4C] transition-colors">
                        {service.title}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-extrabold text-[#0D3B4C]">
                            {formatCurrency(service.price)}
                          </span>
                          {service.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatCurrency(service.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold text-slate-600">{service.rating}</span>
                        </div>
                      </div>

                      <span className="w-7 h-7 rounded-xl bg-teal-50 group-hover:bg-[#0D3B4C] text-[#0D3B4C] group-hover:text-white flex items-center justify-center transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Teal Banner: Cartão Oferta Resolva Facil */}
          <section>
            <div className="bg-[#0D3B4C] rounded-3xl p-4 text-white shadow-md flex items-center justify-between border border-teal-800/40 relative overflow-hidden">
              <div className="relative z-10 max-w-[70%]">
                <div className="inline-flex items-center gap-1 text-amber-400 text-[10px] font-bold mb-1">
                  <Gift className="w-3 h-3" />
                  <span>Oferta Especial</span>
                </div>
                <h4 className="text-sm font-extrabold tracking-tight">
                  Cartão Oferta Resolva Facil
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Ofereça horas de serviços de confiança a quem mais gosta.
                </p>
              </div>

              <button
                onClick={() => setShowCustomServiceModal(true)}
                className="relative z-10 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm shrink-0"
              >
                Comprar
              </button>
            </div>
          </section>

          {/* Section: Canalização */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0D3B4C] tracking-tight">
                  Canalização e Fugas
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Intervenções rápidas por técnicos certificados
                </p>
              </div>
              <button
                onClick={() => handleCategoryClick('canalizacao')}
                className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-0.5"
              >
                <span>Ver mais</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {plumbingServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3 items-center group"
                >
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-18 h-18 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0D3B4C] transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {service.description}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-[#0D3B4C]">
                          {formatCurrency(service.price)}
                        </span>
                        {service.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(service.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.durationMinutes} min
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Sofás, Tapetes e Colchões */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0D3B4C] tracking-tight">
                  Sofás, tapetes e colchões
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Higienização a vapor e extração de manchas
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {cleaningAndTextile.slice(0, 2).map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3 items-center group"
                >
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-18 h-18 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide">
                      {service.categoryName}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5 group-hover:text-[#0D3B4C] transition-colors">
                      {service.title}
                    </h4>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-black text-[#0D3B4C]">
                          {formatCurrency(service.price)}
                        </span>
                        {service.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(service.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-700">{service.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Guarantee Footer Card */}
          <section className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B4C] text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-[#0D3B4C]">Garantia Resolva Facil</h5>
              <p className="text-[10px] text-slate-600 leading-snug mt-0.5">
                Todos os serviços incluem seguro de responsabilidade civil e garantia de satisfação de 100%.
              </p>
            </div>
          </section>

          {/* Proteção Anti-Cópia e Direitos Reservados */}
          <div className="py-2 text-center space-y-1">
            <p className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Site Protegido contra Cópia & Raspagem por IA
            </p>
            <p className="text-[9px] text-slate-400">
              © {new Date().getFullYear()} Resolva Fácil. Todos os direitos reservados.
            </p>
          </div>
        </>
      )}

    </div>
  );
};
