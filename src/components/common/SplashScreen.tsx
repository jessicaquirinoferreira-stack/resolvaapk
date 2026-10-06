import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, Shield, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinish, 
  durationMs = 1500 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFinish();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="splash-screen-entrance"
          onClick={handleFinish}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0F485B] via-[#093A49] to-[#052A3A] select-none p-6 cursor-pointer"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
          <div className="absolute w-64 h-64 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

          {/* Centered Brand Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col items-center justify-center text-center space-y-4"
          >
            {/* Logo Graphic or Fallback Badge */}
            {!imgError ? (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white/10 backdrop-blur-md p-3 border border-white/20 shadow-2xl flex items-center justify-center">
                <img
                  id="splash-brand-logo"
                  src="/logo.png"
                  alt="Resolva Fácil"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none"
                />
              </div>
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-[#0D3B4C] to-[#1a6582] p-4 border border-teal-400/30 shadow-2xl flex flex-col items-center justify-center text-amber-400">
                <div className="relative">
                  <Shield className="w-14 h-14 text-teal-300 stroke-[1.5]" />
                  <Wrench className="w-7 h-7 text-amber-400 absolute inset-0 m-auto" />
                </div>
              </div>
            )}

            {/* Typography */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                <span>Resolva Fácil</span>
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              </h1>
              <p className="text-xs sm:text-sm text-teal-200/90 font-medium">
                Gestão e Serviços para Condomínios e Residências
              </p>
            </div>

            {/* Subtle loading indicator */}
            <div className="pt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[11px] text-teal-200/70 font-semibold tracking-wide">
                A carregar sistema...
              </span>
            </div>
          </motion.div>

          {/* Skip CTA */}
          <div className="absolute bottom-8 text-[11px] text-white/50 hover:text-white transition-colors">
            Toque em qualquer lugar para entrar
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
