import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(onFinish, 200); // Small delay after 100% before transition
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-glow-200 dark:bg-glow-900 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl opacity-50"></div>

      {/* Logo Container */}
      <div className="flex flex-col items-center animate-float z-10">
        <div className="w-40 h-40 mb-2 relative">
           <Logo showText={false} className="w-full h-full" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight mb-1">glowyze</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm tracking-widest uppercase">face Analyzer</p>
      </div>

      {/* Loading Bar */}
      <div className="w-64 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-12 overflow-hidden z-10">
        <div 
          className="h-full bg-gradient-to-r from-glow-400 to-glow-600 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(14,165,233,0.5)]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-slate-400 dark:text-slate-500 text-xs mt-3 font-medium animate-pulse">Loading experience...</p>
    </div>
  );
};