import React, { useState } from 'react';
import { 
  Sparkles, 
  Wrench, 
  Paintbrush, 
  Zap, 
  Hammer, 
  Boxes, 
  Shirt, 
  Refrigerator, 
  DoorClosed, 
  HardHat, 
  Truck,
  Star,
  Clock,
  ArrowLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import { formatCurrency } from '../../lib/format';

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
    case 'DoorClosed': return <DoorClosed className={className} />;
    case 'HardHat': return <HardHat className={className} />;
    case 'Truck': return <Truck className={className} />;
    default: return <Wrench className={className} />;
  }
};

export const DiscoverView: React.FC = () => {
  const { categories, services, selectedCategory, setSelectedCategory, setSelectedServiceForBooking } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'bestPrice'>('all');

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategory);

  // If a category is selected, show services for that category
  let displayedServices = selectedCategory
    ? services.filter((s) => s.categoryId === selectedCategory)
    : services;

  if (activeFilter === 'popular') {
    displayedServices = displayedServices.filter((s) => s.popular || s.rating >= 4.9);
  } else if (activeFilter === 'bestPrice') {
    displayedServices = [...displayedServices].sort((a, b) => a.price - b.price);
  }

  return (
    <div className="pb-28 pt-2 px-4 w-full max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200">
      
      {/* Category Header or Grid Title */}
      {selectedCategoryObj ? (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Todas as Categorias</span>
          </button>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full">
            {displayedServices.length} serviços
          </span>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-black text-[#0D3B4C] tracking-tight">
            Descobrir
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore todos os nossos serviços para casa e empresa
          </p>
        </div>
      )}

      {/* If No Category Selected: Full Grid of All Categories */}
      {!selectedCategoryObj ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => {
              const catServiceCount = services.filter((s) => s.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-300 active:scale-95 transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-50/70 text-[#0D3B4C] group-hover:bg-[#0D3B4C] group-hover:text-amber-400 flex items-center justify-center transition-colors mb-2">
                    <CategoryIcon name={cat.iconName} className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {catServiceCount > 0 ? `${catServiceCount} serviços` : 'Disponível'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick List of All Available Services below */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-[#0D3B4C]">
              Mais Solicitados
            </h3>
            <div className="space-y-2.5">
              {services.slice(0, 4).map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceForBooking(service)}
                  className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3 items-center group"
                >
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-teal-800 uppercase tracking-wide">
                      {service.categoryName}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0D3B4C] transition-colors">
                      {service.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-black text-[#0D3B4C]">
                        {formatCurrency(service.price)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-600">{service.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Selected Category View */
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0D3B4C] text-amber-400 flex items-center justify-center shrink-0">
              <CategoryIcon name={selectedCategoryObj.iconName} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0D3B4C]">
                {selectedCategoryObj.name}
              </h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                {selectedCategoryObj.description}
              </p>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'popular', label: 'Mais Populares' },
              { id: 'bestPrice', label: 'Menor Preço' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all ${
                  activeFilter === tab.id
                    ? 'bg-[#0D3B4C] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div className="space-y-3">
            {displayedServices.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 p-6">
                <p className="text-xs text-slate-400">Nenhum serviço disponível nesta categoria.</p>
              </div>
            ) : (
              displayedServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceForBooking(service)}
                  className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex gap-3.5 items-start">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-22 h-22 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-teal-800 uppercase">
                          {service.categoryName}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-slate-800">{service.rating}</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 mt-0.5 group-hover:text-[#0D3B4C] transition-colors leading-tight">
                        {service.title}
                      </h4>

                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {service.description}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-black text-[#0D3B4C]">
                            {formatCurrency(service.price)}
                          </span>
                          {service.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatCurrency(service.originalPrice)}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.durationMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>

                  {service.includedItems && service.includedItems.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {service.includedItems.slice(0, 2).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-semibold bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100"
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
