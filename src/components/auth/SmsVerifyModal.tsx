import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SmsVerifyModal: React.FC = () => {
  const { showSmsModal, setShowSmsModal, pendingPhone, verifySmsCode } = useAuth();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(45);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!showSmsModal) return;
    setTimer(45);
    setDigits(['', '', '', '', '', '']);
    setErrorMsg('');
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showSmsModal]);

  if (!showSmsModal) return null;

  const handleChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length < 6) {
      setErrorMsg('Por favor introduza os 6 dígitos do código.');
      return;
    }
    setIsVerifying(true);
    setErrorMsg('');
    const success = await verifySmsCode(code);
    setIsVerifying(false);
    if (!success) {
      setErrorMsg('Código incorreto. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-start p-0 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="w-full max-w-4xl bg-white h-[100dvh] flex flex-col pt-12 px-6 shadow-none border-none relative overflow-y-auto no-scrollbar">
        
        {/* Top Back Button */}
        <button
          onClick={() => setShowSmsModal(false)}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors mb-2 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-semibold">Voltar</span>
        </button>

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="text-xl font-black text-[#0D3B4C] tracking-tight">
            Verificar que és tu
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Introduz o código de 6 dígitos que enviámos por SMS para{' '}
            <span className="font-bold text-slate-800">{pendingPhone || '+55 11 98765-4321'}</span>
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* 6 Digit Input Boxes */}
        <div className="flex justify-between gap-2 mb-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              id={`sms-otp-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-11 h-13 text-center text-xl font-black rounded-xl border transition-all outline-none ${
                digit
                  ? 'border-[#0D3B4C] bg-teal-50/40 text-[#0D3B4C]'
                  : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-[#0D3B4C] focus:bg-white focus:ring-2 focus:ring-[#0D3B4C]/10'
              }`}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {/* Verify Action Button */}
        <button
          id="btn-confirm-sms-code"
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full bg-[#0D3B4C] hover:bg-[#072430] active:scale-[0.98] disabled:opacity-60 text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0D3B4C]/25 transition-all"
        >
          {isVerifying ? (
            <span>A verificar...</span>
          ) : (
            <span>Verificar e Entrar</span>
          )}
        </button>

        {/* Resend Timer */}
        <div className="mt-5 text-center">
          {timer > 0 ? (
            <p className="text-xs text-slate-400 font-medium">
              Reenviar código em <span className="font-bold text-slate-700">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={() => {
                setTimer(45);
                setDigits(['', '', '', '', '', '']);
              }}
              className="text-xs text-teal-800 hover:text-teal-900 font-bold flex items-center justify-center gap-1 mx-auto"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reenviar novo código SMS</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
