import React, { useState } from 'react';
import { UserProfile, ScanResult } from '../types';
import { ScanFace, MessageCircle, Droplets, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import { Settings } from './Settings';

interface HomeProps {
  user: UserProfile;
  latestScan: ScanResult | null;
  onNavigate: (page: string) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

export const Home: React.FC<HomeProps> = ({ user, latestScan, onNavigate, onUpdateProfile, onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (user.language === 'id') {
       if (hour < 10) return 'Selamat Pagi';
       if (hour < 15) return 'Selamat Siang';
       if (hour < 18) return 'Selamat Sore';
       return 'Selamat Malam';
    }
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const t = {
    skinHealth: user.language === 'id' ? 'Skor Kesehatan Kulit' : 'Skin Health Score',
    scanNow: user.language === 'id' ? 'Scan Sekarang' : 'Scan Now',
    noData: user.language === 'id' ? 'Belum ada data scan.' : 'No scan data yet.',
    greatJob: user.language === 'id' ? 'Kerja bagus! Kelembapan meningkat.' : "You're doing great! Moisture levels are up.",
    quickActions: user.language === 'id' ? 'Aksi Cepat' : 'Quick Actions',
    newScan: user.language === 'id' ? 'Scan Baru' : 'New Scan',
    askAI: user.language === 'id' ? 'Tanya AI' : 'Ask AI',
    dailyTips: user.language === 'id' ? 'Tips Harian' : 'Daily Tips',
    morningRoutine: user.language === 'id' ? 'Rutinitas Pagi' : 'Morning Routine',
    nightRoutine: user.language === 'id' ? 'Rutinitas Malam' : 'Night Routine',
    hydration: user.language === 'id' ? 'Hidrasi' : 'Hydration',
  };

  return (
    <div className="h-full overflow-y-auto pb-24 bg-transparent relative z-10">
      {showSettings && (
        <Settings 
          user={user} 
          onUpdate={onUpdateProfile} 
          onClose={() => setShowSettings(false)} 
          onLogout={onLogout}
        />
      )}

      {/* Header Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 pb-8 rounded-b-[2rem] shadow-sm transition-colors duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{getGreeting()},</p>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{user.name.split(' ')[0]}</h1>
          </div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition"
            >
              <SettingsIcon size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-glow-100 dark:bg-glow-900 flex items-center justify-center text-glow-600 dark:text-glow-300 font-bold border border-glow-200 dark:border-glow-800 overflow-hidden">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{user.name[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-r from-glow-500 to-glow-600 rounded-2xl p-6 text-white shadow-lg shadow-glow-200 dark:shadow-none relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-glow-100 text-sm mb-1">{t.skinHealth}</p>
                <h2 className="text-4xl font-bold">{latestScan ? latestScan.overallScore : '--'}</h2>
              </div>
              <button 
                onClick={() => onNavigate('scan')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {t.scanNow}
              </button>
            </div>
            <p className="text-sm text-glow-50 opacity-90">
              {latestScan ? t.greatJob : t.noData}
            </p>
          </div>
          {/* Decorative Circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div>
           <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{t.quickActions}</h3>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => onNavigate('scan')} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 hover:bg-white dark:hover:bg-slate-700 transition">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                  <ScanFace size={20} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.newScan}</span>
              </button>
              <button onClick={() => onNavigate('chat')} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 hover:bg-white dark:hover:bg-slate-700 transition">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.askAI}</span>
              </button>
           </div>
        </div>

        {/* Daily Tips (Carousel-like) */}
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{t.dailyTips}</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="min-w-[200px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 flex items-center justify-center mb-3">
                <Sun size={18} />
              </div>
              <h4 className="font-semibold text-sm mb-1 text-slate-800 dark:text-slate-200">{t.morningRoutine}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Don't forget sunscreen, even indoors!</p>
            </div>
             <div className="min-w-[200px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Moon size={18} />
              </div>
              <h4 className="font-semibold text-sm mb-1 text-slate-800 dark:text-slate-200">{t.nightRoutine}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Double cleanse to remove pollutants.</p>
            </div>
             <div className="min-w-[200px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mb-3">
                <Droplets size={18} />
              </div>
              <h4 className="font-semibold text-sm mb-1 text-slate-800 dark:text-slate-200">{t.hydration}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Drink 500ml water now to hit your goal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};