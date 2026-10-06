import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const SecurityProtection: React.FC = () => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const showSecurityNotice = (msg: string) => {
    setWarningMessage(msg);
  };

  useEffect(() => {
    if (!warningMessage) return;
    const timer = setTimeout(() => {
      setWarningMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [warningMessage]);

  useEffect(() => {
    // 1. Interceptar Clique com Botão Direito (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showSecurityNotice('Proteção Ativa: Cópia e download de elementos desativados.');
      return false;
    };

    // 2. Interceptar Evento de Cópia (Copy)
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      
      if (!isInput) {
        e.preventDefault();
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', 'Conteúdo protegido contra cópia e raspagem por IA - Resolva Fácil.');
        }
        showSecurityNotice('Proteção Ativa: Cópia proibida para proteger dados e direitos autorais.');
        return false;
      }
    };

    // 3. Interceptar Evento de Recortar (Cut)
    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if (!isInput) {
        e.preventDefault();
        return false;
      }
    };

    // 4. Interceptar Arrastar Elementos (Drag)
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 5. Interceptar Atalhos de Teclado (DevTools, View Source, Print, Save, Copy fora de input)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        showSecurityNotice('Acesso ao código-fonte protegido.');
        return false;
      }

      // Ctrl+U / Cmd+U (View Source)
      if (isCtrlOrMeta && key === 'u') {
        e.preventDefault();
        showSecurityNotice('Código-fonte protegido contra visualização.');
        return false;
      }

      // Ctrl+S / Cmd+S (Salvar Página)
      if (isCtrlOrMeta && key === 's') {
        e.preventDefault();
        showSecurityNotice('Salvamento da página bloqueado.');
        return false;
      }

      // Ctrl+P / Cmd+P (Imprimir)
      if (isCtrlOrMeta && key === 'p') {
        e.preventDefault();
        showSecurityNotice('Impressão e cópia em PDF desativadas.');
        return false;
      }

      // Ctrl+Shift+I / Cmd+Option+I (Inspecionar Elemento)
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      // Ctrl+Shift+C / Cmd+Option+C (Inspecionar)
      if (isCtrlOrMeta && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
        e.preventDefault();
        showSecurityNotice('Ferramentas de desenvolvedor bloqueadas.');
        return false;
      }

      // Ctrl+C / Cmd+C fora de campos de texto
      if (isCtrlOrMeta && key === 'c' && !isInput) {
        e.preventDefault();
        showSecurityNotice('Cópia de texto bloqueada.');
        return false;
      }
    };

    // Registrar ouvintes com passive: false
    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    document.addEventListener('copy', handleCopy, { capture: true });
    document.addEventListener('cut', handleCut, { capture: true });
    document.addEventListener('dragstart', handleDragStart, { capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      document.removeEventListener('copy', handleCopy, { capture: true });
      document.removeEventListener('cut', handleCut, { capture: true });
      document.removeEventListener('dragstart', handleDragStart, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  if (!warningMessage) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 text-white text-xs font-semibold shadow-xl border border-slate-700/60 backdrop-blur-md">
        <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
          <Lock className="w-3.5 h-3.5" />
        </div>
        <span>{warningMessage}</span>
        <span className="text-[10px] bg-slate-800 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1 font-bold">
          <ShieldCheck className="w-2.5 h-2.5" />
          Anti-IA
        </span>
      </div>
    </div>
  );
};
