import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { ScanResult, UserProfile } from '../types';
import { Calendar, Plus, CheckCircle, Circle, Trash2, TrendingUp, X } from 'lucide-react';

interface HistoryProps {
  scans: ScanResult[];
  user: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  isCustom?: boolean;
}

// --- Fireworks Component ---
const Fireworks: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const colors = ['#0ea5e9', '#22c55e', '#f43f5e', '#eab308', '#a855f7', '#ffffff'];

    class Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      velocity: { x: number; y: number };
      alpha: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 1;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 6 + 2;
        this.velocity = {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity
        };
        this.alpha = 1;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.05; // gravity
        this.velocity.x *= 0.99; // friction
        this.velocity.y *= 0.99;
        this.alpha -= 0.01;
      }
    }

    const createFirework = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    let animationId: number;
    let timer = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Random fireworks
      if (timer % 30 === 0) {
        createFirework(
          Math.random() * canvas.width,
          Math.random() * canvas.height * 0.6 + canvas.height * 0.1
        );
      }
      timer++;

      particles.forEach((particle, index) => {
        if (particle.alpha > 0) {
          particle.update();
          particle.draw();
        } else {
          particles.splice(index, 1);
        }
      });
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn backdrop-blur-sm">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 flex flex-col items-center p-8 text-center animate-bounce-in">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          {message}
        </h2>
        <button 
          onClick={onClose}
          className="mt-8 px-8 py-3 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 transition hover:bg-glow-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// --- Main History Component ---
export const History: React.FC<HistoryProps> = ({ scans, user, onUpdateProfile }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Celebration State
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const hasCelebratedToday = useRef(false);

  // Initialize checklist
  useEffect(() => {
    // Determine labels based on language
    const lang = user.language || 'en';
    const isId = lang === 'id';

    const defaultItems: ChecklistItem[] = [
      { id: 'sleep', label: isId ? 'Tidur 7-8 jam' : 'Sleep 7-8 hours', checked: false },
      { id: 'am_skin', label: isId ? 'Memakai skincare pagi' : 'Morning skincare', checked: false },
      { id: 'water', label: isId ? 'Minum air mineral minimal 1,5 liter' : 'Drink 1.5L water', checked: false },
      { id: 'junkfood', label: isId ? 'Hindari junkfood' : 'Avoid junk food', checked: false },
      { id: 'pm_skin', label: isId ? 'Menggunakan skincare malam' : 'Night skincare', checked: false },
    ];

    // Load custom items from profile
    const customItems: ChecklistItem[] = (user.customChecklist || []).map((label, index) => ({
      id: `custom_${index}`,
      label,
      checked: false,
      isCustom: true
    }));

    // Load checked state from local storage for today
    const todayKey = new Date().toDateString();
    const savedState = localStorage.getItem(`checklist_${todayKey}`);
    
    let initialList = [...defaultItems, ...customItems];

    if (savedState) {
      const parsedState: Record<string, boolean> = JSON.parse(savedState);
      initialList = initialList.map(item => ({
        ...item,
        checked: !!parsedState[item.id]
      }));
    }

    setChecklist(initialList);
    
    // Check if already completed on load to prevent auto-popup if checking page later
    const allChecked = initialList.length > 0 && initialList.every(i => i.checked);
    if (allChecked) {
      hasCelebratedToday.current = true;
    }

  }, [user.language, user.customChecklist]);

  const saveChecklistState = (updatedList: ChecklistItem[]) => {
    const todayKey = new Date().toDateString();
    const stateObj: Record<string, boolean> = {};
    updatedList.forEach(item => {
      stateObj[item.id] = item.checked;
    });
    localStorage.setItem(`checklist_${todayKey}`, JSON.stringify(stateObj));
  };

  const checkCompletion = (list: ChecklistItem[]) => {
    const allChecked = list.length > 0 && list.every(item => item.checked);
    
    if (allChecked && !hasCelebratedToday.current) {
      const messages = [
        "Congratulations! You've completed it successfully",
        "Congrats! You finally finished it!",
        "Well done!",
        "Nice work!"
      ];
      // Deterministic randomness based on day to vary it daily, or just random
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setCelebrationMessage(randomMsg);
      setShowCelebration(true);
      hasCelebratedToday.current = true;
    } else if (!allChecked) {
      // Reset if user unchecks something, so they can celebrate again if they re-complete
      hasCelebratedToday.current = false;
    }
  };

  const toggleCheck = (id: string) => {
    const updated = checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    saveChecklistState(updated);
    checkCompletion(updated);
  };

  const addCustomItem = () => {
    if (!newItemText.trim()) return;
    
    // Save to user profile (persistent)
    const updatedCustomList = [...(user.customChecklist || []), newItemText];
    onUpdateProfile({ ...user, customChecklist: updatedCustomList });

    setNewItemText('');
    setIsAdding(false);
  };

  const deleteCustomItem = (label: string) => {
     // Remove from user profile
     const updatedCustomList = (user.customChecklist || []).filter(l => l !== label);
     onUpdateProfile({ ...user, customChecklist: updatedCustomList });
  };

  // Calculate Progress
  const completedCount = checklist.filter(c => c.checked).length;
  const totalCount = checklist.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Chart Data
  const data = scans.length < 2 ? [
    { date: 'Mon', score: 65 },
    { date: 'Tue', score: 68 },
    { date: 'Wed', score: 72 },
    { date: 'Thu', score: 70 },
    { date: 'Fri', score: scans[0]?.overallScore || 75 },
  ] : scans.slice(-7).map((s) => ({
    date: new Date(s.date).toLocaleDateString(user.language === 'id' ? 'id-ID' : 'en-US', { weekday: 'short' }),
    score: s.overallScore,
  }));

  const t = {
    title: user.language === 'id' ? 'Pelacakan Harian' : 'Daily Track',
    todayProgress: user.language === 'id' ? 'Progres Hari Ini' : 'Today\'s Progress',
    weeklyGraph: user.language === 'id' ? 'Grafik Mingguan' : 'Weekly Graph',
    addItem: user.language === 'id' ? 'Tambah checklist...' : 'Add checklist item...',
    cancel: user.language === 'id' ? 'Batal' : 'Cancel',
    add: user.language === 'id' ? 'Tambah' : 'Add',
    delete: user.language === 'id' ? 'Hapus' : 'Delete',
    checklistTitle: user.language === 'id' ? 'Checklist Hari Ini' : "Today's Checklist",
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto pb-24">
      {showCelebration && (
        <Fireworks 
          message={celebrationMessage} 
          onClose={() => setShowCelebration(false)} 
        />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t.title}</h2>
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {new Date().toLocaleDateString(user.language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Percentage Score Card */}
      <div className="bg-gradient-to-br from-glow-500 to-glow-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-glow-100 text-sm font-medium mb-1">{t.todayProgress}</p>
            <h1 className="text-5xl font-bold">{progressPercentage}%</h1>
            <p className="text-sm mt-2 opacity-90">
              {completedCount} of {totalCount} goals completed
            </p>
          </div>
          <div className="w-24 h-24 rounded-full border-8 border-white/20 flex items-center justify-center">
             <TrendingUp size={32} className="text-white" />
          </div>
        </div>
        {/* Background Decorations */}
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute left-10 -top-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Weekly Graph */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6">{t.weeklyGraph}</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 12, fill: '#94a3b8'}} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: '#fff',
                  color: '#334155'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#0ea5e9" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Checklist Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle size={20} className="text-glow-500"/>
            {t.checklistTitle}
          </h3>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Add New Item Input */}
        {isAdding && (
          <div className="mb-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fadeIn">
            <input 
              autoFocus
              type="text" 
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={t.addItem}
              className="w-full bg-transparent border-b border-slate-200 dark:border-slate-600 pb-2 mb-3 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                {t.cancel}
              </button>
              <button 
                onClick={addCustomItem}
                disabled={!newItemText.trim()}
                className="px-3 py-1.5 text-xs font-medium bg-glow-500 text-white rounded-lg hover:bg-glow-600 transition disabled:opacity-50"
              >
                {t.add}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {checklist.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                item.checked 
                  ? 'bg-glow-50 dark:bg-glow-900/20 border-glow-200 dark:border-glow-800/50' 
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
              }`}
            >
              <button 
                onClick={() => toggleCheck(item.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  item.checked 
                    ? 'bg-glow-500 border-glow-500 text-white' 
                    : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-glow-400'
                }`}
              >
                <CheckCircle size={14} className={item.checked ? 'opacity-100' : 'opacity-0'} />
              </button>
              
              <span className={`flex-1 text-sm font-medium transition-colors ${
                item.checked 
                  ? 'text-slate-500 dark:text-slate-400 line-through' 
                  : 'text-slate-800 dark:text-slate-200'
              }`}>
                {item.label}
              </span>

              {item.isCustom && (
                <button 
                  onClick={() => deleteCustomItem(item.label)}
                  className="text-slate-300 hover:text-red-400 transition"
                  title={t.delete}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};