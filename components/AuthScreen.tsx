import React, { useState } from 'react';
import { Mail, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';

interface AuthScreenProps {
  onComplete: (email: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, validate and call API here.
      // For now, we simulate success and pass email to App state.
      onComplete(email);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center px-8 bg-white dark:bg-slate-900 relative overflow-hidden animate-fadeIn transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-glow-50 dark:bg-slate-800 rounded-bl-[100px] -z-0"></div>
      
      <div className="z-10 w-full max-w-sm mx-auto">
        <div className="mb-8">
           <div className="w-20 h-20 mb-4">
             <Logo showText={false} className="w-full h-full" />
           </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {isRegister ? 'Buat Akun' : 'Selamat Datang'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-glow-400 dark:text-white transition"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-glow-400 dark:text-white transition"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-glow-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-glow-200 hover:bg-glow-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
          >
            {isRegister ? 'Daftar Sekarang' : 'Masuk'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} 
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="ml-1 text-glow-600 dark:text-glow-400 font-bold hover:underline"
            >
              {isRegister ? 'Masuk' : 'Daftar'}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-3 z-10">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CheckCircle2 size={14} className="text-green-500" />
          <span>Analisis kulit berbasis AI gratis</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CheckCircle2 size={14} className="text-green-500" />
          <span>Data terenkripsi & aman</span>
        </div>
      </div>
    </div>
  );
};