import React from 'react';
import { Sunrise, Factory } from 'lucide-react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", light = false }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative">
        <div className={`absolute inset-0 blur-lg opacity-50 ${light ? 'bg-aurora-300' : 'bg-aurora-500'}`}></div>
        <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl shadow-lg border border-white/10 ${light ? 'bg-white/10 text-aurora-300' : 'bg-gradient-to-br from-aurora-500 to-aurora-600 text-white'}`}>
          <Factory className="w-7 h-7" />
          <Sunrise className="w-4 h-4 absolute top-1.5 right-1.5 text-yellow-300" />
        </div>
      </div>
      
      <div className="flex flex-col leading-none">
        <span className={`text-[0.7rem] font-bold tracking-[0.2em] uppercase mb-0.5 ${light ? 'text-gray-400' : 'text-slate-500'}`}>
          Distribuidora
        </span>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-black tracking-tighter ${light ? 'text-white' : 'text-slate-900'}`}>
            AURORA
          </span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${light ? 'bg-aurora-500/20 text-aurora-300' : 'bg-aurora-100 text-aurora-600'}`}>
            SAS
          </span>
        </div>
      </div>
    </div>
  );
};