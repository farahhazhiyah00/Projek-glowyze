
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { FaceScan } from './components/FaceScan';
import { ChatAssistant } from './components/ChatAssistant';
import { History } from './components/History';
import { Recommendations } from './components/Recommendations';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { UserProfile, ScanResult, SkinType, StressLevel } from './types';
import { Home as HomeIcon, ScanFace, Sparkles, BarChart2, FlaskConical } from 'lucide-react';

// Generate bubble elements for background
const Bubbles = () => {
  const bubbles = Array.from({ length: 15 });
  return (
    <div className="bubble-bg">
      {bubbles.map((_, i) => {
        const size = Math.random() * 60 + 20; 
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10; 
        const delay = Math.random() * 10;
        return (
          <div 
            key={i}
            className="bubble"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `-${delay}s`
            }}
          />
        );
      })}
    </div>
  );
};

// Premium Wave Component
const WaveOverlay = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="wave-overlay-root animating">
      <div className="wave-layer wave-layer-1"></div>
      <div className="wave-layer wave-layer-2"></div>
      <div className="wave-layer wave-layer-3"></div>
      <div className="wave-layer wave-layer-4"></div>
    </div>
  );
};

// Navigation Wrapper Component
interface LayoutProps {
  children: React.ReactNode;
  userProfile: UserProfile | null;
  onNavigateWithTransition: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userProfile, onNavigateWithTransition }) => {
  const location = useLocation();
  const isId = userProfile?.language === 'id';

  const navItems = [
    { id: '/scan', icon: ScanFace, label: isId ? 'Scan' : 'Scan' },
    { id: '/recommendations', icon: FlaskConical, label: isId ? 'Saran' : 'Advice' },
    { id: '/', icon: HomeIcon, label: 'Home' },
    { id: '/history', icon: BarChart2, label: isId ? 'Track' : 'Track' },
    { id: '/chat', icon: Sparkles, label: 'AI' },
  ];

  const showNav = location.pathname !== '/scan';

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-hidden relative z-10">
        {children}
      </div>
      
      {showNav && (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-2 py-2 flex justify-around items-end z-20 safe-area-bottom transition-colors duration-300 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.id;
            const isCenter = index === 2; // Home is index 2

            if (isCenter) {
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateWithTransition(item.id)}
                  className="flex flex-col items-center justify-center -mt-8"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
                    isActive 
                      ? 'bg-glow-500 text-white scale-110 ring-4 ring-white dark:ring-slate-900' 
                      : 'bg-white dark:bg-slate-800 text-glow-500 border border-slate-100 dark:border-slate-700'
                  }`}>
                    <item.icon size={28} />
                  </div>
                  <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-glow-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onNavigateWithTransition(item.id)}
                className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
                  isActive ? 'text-glow-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<'SPLASH' | 'AUTH' | 'ONBOARDING' | 'HOME'>('SPLASH');
  const [waveActive, setWaveActive] = useState(false);
  const isTransitioning = useRef(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedProfile = localStorage.getItem('glowyze_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setUserProfile(parsed);
      
      if (parsed.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      if (parsed.email) {
        if(parsed.isOnboarded) setAppState('HOME'); 
        else setAppState('ONBOARDING');
      } else {
        setAppState('AUTH');
      }
    } else {
      setAppState('SPLASH'); 
    }
  }, []);

  // Universal navigation/state transition handler with wave effect
  const triggerTransition = (action: () => void) => {
    if (isTransitioning.current) return;
    
    isTransitioning.current = true;
    setWaveActive(true);
    
    // Wave animation covers the screen at 900ms (50% of 1.8s)
    setTimeout(() => {
      action();
      // Keep wave at top for a moment, then let it descend
      setTimeout(() => {
        setWaveActive(false);
        isTransitioning.current = false;
      }, 900);
    }, 900);
  };

  const handlePageTransition = (targetPath: string) => {
    if (location.pathname === targetPath && appState === 'HOME') return;
    triggerTransition(() => navigate(targetPath));
  };

  const handleStateTransition = (nextState: 'AUTH' | 'ONBOARDING' | 'HOME') => {
    triggerTransition(() => {
      setAppState(nextState);
      if (nextState === 'HOME') navigate('/');
    });
  };

  const updateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('glowyze_profile', JSON.stringify(profile));
    
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('glowyze_profile');
    setUserProfile(null);
    setScans([]);
    document.documentElement.classList.remove('dark');
    handleStateTransition('AUTH');
  };

  const handleSplashFinish = () => {
    if (userProfile?.isOnboarded) {
      handleStateTransition('HOME');
    } else if (userProfile?.email) {
      handleStateTransition('ONBOARDING');
    } else {
      handleStateTransition('AUTH');
    }
  };

  const handleAuthComplete = (email: string) => {
    const initialProfile: UserProfile = {
      email,
      name: '',
      age: '',
      gender: 'Female',
      skinType: SkinType.Normal,
      allergies: [],
      sleepHours: 7,
      waterIntake: 1.5,
      stressLevel: StressLevel.Medium,
      diet: 'Balanced',
      isOnboarded: false,
      language: 'id',
      theme: 'light'
    };
    updateProfile(initialProfile);
    handleStateTransition('ONBOARDING');
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    updateProfile(profile);
    handleStateTransition('HOME');
  };

  const handleScanComplete = (result: ScanResult) => {
    setScans(prev => [...prev, result]);
    handlePageTransition('/history');
  };

  return (
    <>
      <WaveOverlay active={waveActive} />

      {appState === 'SPLASH' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {appState === 'AUTH' && (
        <AuthScreen onComplete={handleAuthComplete} />
      )}

      {appState === 'ONBOARDING' && (
        <>
          <Bubbles />
          <Onboarding onComplete={handleOnboardingComplete} />
        </>
      )}

      {appState === 'HOME' && userProfile && (
        <>
          <Bubbles />
          <Layout userProfile={userProfile} onNavigateWithTransition={handlePageTransition}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Home 
                    user={userProfile} 
                    latestScan={scans[scans.length-1]} 
                    onNavigate={handlePageTransition} 
                    onUpdateProfile={updateProfile}
                    onLogout={handleLogout}
                  />
                } 
              />
              <Route 
                path="/scan" 
                element={
                  <FaceScan 
                    onScanComplete={handleScanComplete} 
                    onClose={() => handlePageTransition('/')} 
                  />
                } 
              />
              <Route 
                path="/recommendations" 
                element={<Recommendations user={userProfile} latestScan={scans[scans.length-1]} />} 
              />
              <Route 
                path="/history" 
                element={
                  <History 
                    scans={scans} 
                    user={userProfile}
                    onUpdateProfile={updateProfile}
                  />
                } 
              />
              <Route path="/chat" element={<ChatAssistant userProfile={userProfile} />} />
            </Routes>
          </Layout>
        </>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
