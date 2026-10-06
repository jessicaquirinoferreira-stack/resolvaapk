import React from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PwaInstallPrompt: React.FC = () => {
  const { isStandalone, showInstallBanner, setShowInstallBanner, triggerInstallPrompt } = useApp();

  if (isStandalone || !showInstallBanner) {
    return null;
  }

  return (
    <aside
      aria-label="Notificação de Instalação do Aplicativo"
      id="pwa-install-banner"
      className="fixed top-3 inset-x-3 sm:top-4 sm:inset-x-auto sm:right-4 sm:w-96 z-50 bg-[#0D3B4C] text-white rounded-2xl p-4 shadow-2xl border border-teal-600/40 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/10 p-2 flex items-center justify-center shrink-0 border border-white/10">
          <img
            src="/logo.png"
            alt="Resolva Facil"
            className="w-full h-full object-contain rounded-lg"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-bold text-sm text-white tracking-wide">Instalar Resolva Facil</span>
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full uppercase">PWA</span>
          </div>
          <p className="text-xs text-slate-200 leading-snug">
            Instale o aplicativo na sua tela inicial para acesso rápido, notificações e modo nativo sem barras de navegação.
          </p>
        </div>

        <button
          id="btn-close-install-banner"
          onClick={() => setShowInstallBanner(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3.5 flex items-center gap-2">
        <button
          id="btn-install-pwa-now"
          onClick={triggerInstallPrompt}
          className="flex-1 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950/20"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Instalar Agora</span>
        </button>
        <button
          id="btn-dismiss-install-banner"
          onClick={() => setShowInstallBanner(false)}
          className="text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors font-medium"
        >
          Mais tarde
        </button>
      </div>
    </aside>
  );
};
