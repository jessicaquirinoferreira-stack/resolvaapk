import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Briefcase, 
  User as UserIcon, 
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    loginWithEmail, 
    loginWithGoogle,
    registerWithEmail,
    sendPasswordReset,
    authError,
    setAuthError,
    isOperationNotAllowed,
    isAuthenticated,
    currentUser
  } = useAuth();

  const { setActiveTab } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!showAuthModal) return null;

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    setAuthError(null);
    const res = await loginWithGoogle();
    setIsGoogleSubmitting(false);
    if (res.success) {
      setShowAuthModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setAuthError('Por favor preencha o seu e-mail.');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    if (mode === 'forgot') {
      const res = await sendPasswordReset(email.trim());
      setIsSubmitting(false);
      if (res.success) {
        setResetSent(true);
      }
      return;
    }

    if (mode === 'register') {
      if (!password || password.length < 6) {
        setAuthError('A palavra-passe deve ter no mínimo 6 caracteres.');
        setIsSubmitting(false);
        return;
      }

      // App registration is exclusively for clients; providers register through the website
      const result = await registerWithEmail(
        email.trim(), 
        password, 
        name.trim(), 
        'client'
      );
      setIsSubmitting(false);
      if (result.success) {
        setShowAuthModal(false);
        setActiveTab('home');
      }
    } else {
      if (!password) {
        setAuthError('Por favor digite a sua palavra-passe.');
        setIsSubmitting(false);
        return;
      }

      const result = await loginWithEmail(email.trim(), password);
      setIsSubmitting(false);
      if (result.success) {
        setShowAuthModal(false);
        const clean = email.trim().toLowerCase();
        if (clean === 'prestador@x.com') {
          setActiveTab('partner');
        } else if (clean === 'resolvafacil@x.com' || clean === 'jessicaq2204@gmail.com') {
          setActiveTab('admin');
        } else {
          setActiveTab('home');
        }
      }
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowAuthModal(false);
      }}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Modal Button */}
        <button
          type="button"
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo & Heading */}
        <div className="text-center mb-5 relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-[#0D3B4C] p-2 mx-auto mb-2 flex items-center justify-center shadow-md">
            <img
              src="/logo.png"
              alt="Resolva Fácil"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-2xl font-black text-[#0D3B4C] tracking-tight">
            Resolva Fácil
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {mode === 'forgot' 
              ? 'Recuperação de Palavra-passe' 
              : 'Plataforma de Serviços & Reparações Profissionais'}
          </p>
        </div>

        {/* Mode Switcher: Entrar vs Cadastro */}
        {mode !== 'forgot' ? (
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold mb-4 shrink-0">
            <button
              type="button"
              id="tab-mode-login"
              onClick={() => {
                setMode('login');
                setAuthError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#0D3B4C] shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              id="tab-mode-register"
              onClick={() => {
                setMode('register');
                setAuthError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all text-center cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#0D3B4C] shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Criar Nova Conta
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setResetSent(false);
              setAuthError(null);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D3B4C] mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para o Início de Sessão
          </button>
        )}

        {/* Error Alert Box */}
        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1 text-left leading-relaxed">
              {authError}
            </div>
          </div>
        )}

        {/* Google Sign In Button */}
        {mode !== 'forgot' && (
          <div className="space-y-3 mb-4 shrink-0">
            <button
              type="button"
              id="btn-google-login"
              onClick={handleGoogleSignIn}
              disabled={isGoogleSubmitting || isSubmitting}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleSubmitting ? 'A autenticar...' : 'Continuar com o Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute tracking-wider">
                ou com e-mail
              </span>
            </div>
          </div>
        )}

        {/* Success Password Reset Box */}
        {resetSent && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1 text-left leading-relaxed">
              Enviámos um link de recuperação para o seu e-mail. Verifique a sua caixa de entrada e pasta de spam.
            </div>
          </div>
        )}

        <div className="overflow-y-auto pr-1">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Informative notice for providers trying to register in app */}
            {mode === 'register' && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-[11px] text-slate-600 leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <UserIcon className="w-3.5 h-3.5 text-[#0D3B4C]" />
                  <span>Registo de Cliente</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Crie a sua conta para solicitar serviços, agendar reparações e acompanhar os seus pedidos.
                </p>
                <div className="pt-1 border-t border-slate-200/60 mt-1.5 text-[10px] text-slate-500 flex items-start gap-1">
                  <Briefcase className="w-3 h-3 text-teal-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>É prestador de serviços?</strong> A adesão e certificação profissional é realizada exclusivamente pelo nosso portal web oficial. Após aprovação, aceda ao app pela opção <strong>Entrar</strong>.
                  </span>
                </div>
              </div>
            )}

            {/* Name Input (Register mode) */}
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 px-3.5 py-2.5 bg-slate-50/60 focus-within:bg-white focus-within:border-[#0D3B4C] focus-within:ring-2 focus-within:ring-[#0D3B4C]/10 transition-all">
                  <UserIcon className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    id="input-auth-name"
                    placeholder="Seu Nome Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="flex-1 text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                E-mail
              </label>
              <div className="flex items-center rounded-2xl border border-slate-200 px-3.5 py-2.5 bg-slate-50/60 focus-within:bg-white focus-within:border-[#0D3B4C] focus-within:ring-2 focus-within:ring-[#0D3B4C]/10 transition-all">
                <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  id="input-auth-email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Input (Login & Register mode) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Palavra-passe
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setAuthError(null);
                      }}
                      className="text-[11px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                    >
                      Esqueci-me da palavra-passe?
                    </button>
                  )}
                </div>
                <div className="flex items-center rounded-2xl border border-slate-200 px-3.5 py-2.5 bg-slate-50/60 focus-within:bg-white focus-within:border-[#0D3B4C] focus-within:ring-2 focus-within:ring-[#0D3B4C]/10 transition-all">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="input-auth-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none ml-1.5 cursor-pointer"
                    title={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Test Accounts Quick-Fill Section */}
            {mode === 'login' && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-[11px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    Contas para Teste Rápido:
                  </span>
                  <span className="text-[10px] text-slate-400">1 clique preenche</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('resolvafacil@x.com');
                      setPassword('resolvafacil4321');
                      setAuthError(null);
                    }}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:border-[#0D3B4C] hover:bg-teal-50/50 text-slate-800 text-[10px] font-bold text-center transition-all cursor-pointer shadow-2xs"
                    title="Login: resolvafacil@x.com | Senha: resolvafacil4321"
                  >
                    <span className="block text-amber-600 font-extrabold text-[9px]">👑 ADMIN</span>
                    <span className="truncate block font-semibold text-slate-700">Resolva</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail('testeresolva@x.com');
                      setPassword('testeusuario');
                      setAuthError(null);
                    }}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:border-[#0D3B4C] hover:bg-teal-50/50 text-slate-800 text-[10px] font-bold text-center transition-all cursor-pointer shadow-2xs"
                    title="Login: testeresolva@x.com | Senha: testeusuario"
                  >
                    <span className="block text-teal-700 font-extrabold text-[9px]">👤 CLIENTE</span>
                    <span className="truncate block font-semibold text-slate-700">Usuário</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail('prestador@x.com');
                      setPassword('testeprestador');
                      setAuthError(null);
                    }}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:border-[#0D3B4C] hover:bg-teal-50/50 text-slate-800 text-[10px] font-bold text-center transition-all cursor-pointer shadow-2xs"
                    title="Login: prestador@x.com | Senha: testeprestador"
                  >
                    <span className="block text-indigo-700 font-extrabold text-[9px]">🛠️ PRESTADOR</span>
                    <span className="truncate block font-semibold text-slate-700">Técnico</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-auth-submit"
              disabled={isSubmitting}
              className="w-full bg-[#0D3B4C] hover:bg-[#072430] active:scale-[0.98] disabled:opacity-60 text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#0D3B4C]/25 transition-all mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>A processar...</span>
              ) : (
                <>
                  <span>
                    {mode === 'login' 
                      ? 'Entrar com E-mail' 
                      : mode === 'register' 
                      ? 'Concluir Cadastro e Aceder' 
                      : 'Enviar E-mail de Recuperação'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-4">
            <p className="text-[10px] text-slate-400 leading-relaxed flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />
              Sincronizado diretamente com a base de dados oficial do Resolva Fácil.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

