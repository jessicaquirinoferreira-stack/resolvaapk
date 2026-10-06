import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Resolva Fácil ErrorBoundary] Erro capturado:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 w-full h-[100dvh] bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center z-[9999]">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-[#0D3B4C] mb-2 tracking-tight">
            Resolva Fácil
          </h2>

          <p className="text-sm font-semibold text-slate-700 max-w-sm mb-1">
            Ocorreu uma instabilidade temporária ao carregar a página.
          </p>
          <p className="text-xs text-slate-400 max-w-xs mb-6">
            Não se preocupe, os seus dados e agendamentos estão salvos e sincronizados com o servidor.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#0D3B4C] hover:bg-[#082631] active:scale-95 text-white font-bold text-xs py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recarregar Aplicativo</span>
            </button>

            <button
              onClick={this.handleReset}
              className="w-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Ir para o Início</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
