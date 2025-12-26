import React from 'react';
import { UserProfile, ScanResult, SkinType } from '../types';
import { FlaskConical, Droplets, Shield, Zap, Sparkles, AlertTriangle, CheckCircle2, Leaf, Eraser, Activity, Sun as SunIcon } from 'lucide-react';

interface RecommendationsProps {
  user: UserProfile;
  latestScan: ScanResult | null;
}

interface Ingredient {
  id: string;
  name: string;
  description: { en: string; id: string };
  icon: React.ElementType;
  matchReason: { en: string; id: string }; // Default reason (Skin type based)
  color: string;
  bg: string;
}

// Wrapper to include dynamic reason based on scan
interface RecommendedItem extends Ingredient {
  dynamicReason?: { en: string; id: string };
  priority: number; // Higher number = Higher on list
}

export const Recommendations: React.FC<RecommendationsProps> = ({ user, latestScan }) => {
  const isId = user.language === 'id';

  const allIngredients: Ingredient[] = [
    // --- ACNE & OIL CONTROL ---
    {
      id: 'salicylic_acid',
      name: 'Salicylic Acid (BHA)',
      description: { 
        en: 'Penetrates pores to clear acne and reduce oil.', 
        id: 'Menembus pori-pori untuk membersihkan jerawat dan minyak.' 
      },
      icon: Zap,
      matchReason: { en: 'Best for Oily & Acne-prone skin', id: 'Terbaik untuk kulit Berminyak & Berjerawat' },
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      id: 'tea_tree',
      name: 'Tea Tree Oil',
      description: { 
        en: 'Natural antibacterial properties to fight acne.', 
        id: 'Antibakteri alami untuk melawan bakteri penyebab jerawat.' 
      },
      icon: Leaf,
      matchReason: { en: 'Natural solution for Acne', id: 'Solusi alami untuk Jerawat' },
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'azelaic_acid',
      name: 'Azelaic Acid',
      description: { 
        en: 'Reduces redness, kills bacteria, and unclogs pores.', 
        id: 'Mengurangi kemerahan, membunuh bakteri, dan membuka pori.' 
      },
      icon: Eraser,
      matchReason: { en: 'Great for Acne & Redness', id: 'Bagus untuk Jerawat & Kemerahan' },
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20'
    },

    // --- BRIGHTENING & PIGMENTATION ---
    {
      id: 'vitamin_c',
      name: 'Vitamin C',
      description: { 
        en: 'Brightens skin and fades dark spots.', 
        id: 'Mencerahkan kulit dan memudarkan bintik hitam.' 
      },
      icon: SunIcon,
      matchReason: { en: 'Targets Pigmentation & Dullness', id: 'Target Pigmentasi & Kulit Kusam' },
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      id: 'alpha_arbutin',
      name: 'Alpha Arbutin',
      description: { 
        en: 'Gentle skin brightener to reduce hyperpigmentation.', 
        id: 'Pencerah kulit lembut untuk mengurangi hiperpigmentasi.' 
      },
      icon: Sparkles,
      matchReason: { en: 'Safe for Pigmentation spots', id: 'Aman untuk noda Pigmentasi' },
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
    {
      id: 'niacinamide',
      name: 'Niacinamide',
      description: { 
        en: 'Regulates oil, minimizes pores, and brightens skin.', 
        id: 'Mengatur minyak, mengecilkan pori, dan mencerahkan.' 
      },
      icon: Shield,
      matchReason: { en: 'Versatile for Oil control & Pigmentation', id: 'Serbaguna untuk kontrol Minyak & Pigmentasi' },
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },

    // --- ANTI-AGING & TEXTURE ---
    {
      id: 'retinol',
      name: 'Retinol',
      description: { 
        en: 'Accelerates cell turnover to reduce wrinkles.', 
        id: 'Mempercepat pergantian sel untuk kurangi kerutan.' 
      },
      icon: Activity,
      matchReason: { en: 'Anti-aging powerhouse for Wrinkles', id: 'Anti-aging ampuh untuk Kerutan' },
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'peptides',
      name: 'Peptides',
      description: { 
        en: 'Building blocks of collagen for firmer skin.', 
        id: 'Pembangun kolagen untuk kulit lebih kencang.' 
      },
      icon: Activity,
      matchReason: { en: 'Firming support for Aging skin', id: 'Mengencangkan kulit Menua' },
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      id: 'glycolic_acid',
      name: 'Glycolic Acid (AHA)',
      description: { 
        en: 'Exfoliates dead skin cells for smoother texture.', 
        id: 'Mengangkat sel kulit mati untuk tekstur lebih halus.' 
      },
      icon: Eraser,
      matchReason: { en: 'Smooths Texture & Fine lines', id: 'Menghaluskan Tekstur & Garis halus' },
      color: 'text-pink-500',
      bg: 'bg-pink-50 dark:bg-pink-900/20'
    },

    // --- HYDRATION & REPAIR ---
    {
      id: 'hyaluronic_acid',
      name: 'Hyaluronic Acid',
      description: { 
        en: 'Draws moisture into the skin for deep hydration.', 
        id: 'Menarik kelembapan ke dalam kulit untuk hidrasi mendalam.' 
      },
      icon: Droplets,
      matchReason: { en: 'Essential for Dry & Dehydrated skin', id: 'Penting untuk kulit Kering & Dehidrasi' },
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    {
      id: 'ceramides',
      name: 'Ceramides',
      description: { 
        en: 'Restores the skin barrier and locks in moisture.', 
        id: 'Memperbaiki skin barrier dan mengunci kelembapan.' 
      },
      icon: Shield,
      matchReason: { en: 'Repair for Dry & Sensitive skin', id: 'Perbaikan untuk kulit Kering & Sensitif' },
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      id: 'squalane',
      name: 'Squalane',
      description: { 
        en: 'Lightweight oil that mimics skin natural oils.', 
        id: 'Minyak ringan yang menyerupai minyak alami kulit.' 
      },
      icon: Droplets,
      matchReason: { en: 'Light hydration for all types', id: 'Hidrasi ringan untuk semua tipe' },
      color: 'text-teal-500',
      bg: 'bg-teal-50 dark:bg-teal-900/20'
    },
    {
      id: 'centella',
      name: 'Centella Asiatica',
      description: { 
        en: 'Soothes inflammation and redness.', 
        id: 'Menenangkan peradangan dan kemerahan.' 
      },
      icon: CheckCircle2,
      matchReason: { en: 'Calming for Sensitive skin', id: 'Menenangkan untuk kulit Sensitif' },
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'snail_mucin',
      name: 'Snail Mucin',
      description: { 
        en: 'Aids in repair and hydration.', 
        id: 'Membantu perbaikan dan hidrasi kulit.' 
      },
      icon: Sparkles,
      matchReason: { en: 'Repair & Hydration boost', id: 'Peningkat Perbaikan & Hidrasi' },
      color: 'text-slate-500',
      bg: 'bg-slate-100 dark:bg-slate-800'
    }
  ];

  // Advanced Filter Logic
  const getPersonalizedRecommendations = (): RecommendedItem[] => {
    let recommendations: RecommendedItem[] = [];
    const addedIds = new Set<string>();

    const addIng = (id: string, reasonEn: string, reasonId: string, priorityScore: number) => {
      if (addedIds.has(id)) {
        // If already added, check if we should update priority (keep highest)
        const existing = recommendations.find(r => r.id === id);
        if (existing && priorityScore > existing.priority) {
          existing.priority = priorityScore;
          existing.dynamicReason = { en: reasonEn, id: reasonId };
        }
        return;
      }
      
      const ingredient = allIngredients.find(i => i.id === id);
      if (ingredient) {
        recommendations.push({
          ...ingredient,
          dynamicReason: { en: reasonEn, id: reasonId },
          priority: priorityScore
        });
        addedIds.add(id);
      }
    };

    // 1. SCAN BASED LOGIC (High Priority)
    if (latestScan) {
      const { acne, wrinkles, pigmentation, texture } = latestScan.metrics;

      // Acne Logic
      if (acne > 25) {
        const severity = acne > 50 ? (isId ? 'Tinggi' : 'High') : (isId ? 'Sedang' : 'Moderate');
        addIng('salicylic_acid', `Targeting detected acne (${severity})`, `Menargetkan jerawat terdeteksi (${severity})`, acne + 20);
        addIng('tea_tree', `Natural anti-bacterial for acne`, `Anti-bakteri alami untuk jerawat`, acne + 10);
        addIng('azelaic_acid', `Reduces acne redness`, `Mengurangi kemerahan jerawat`, acne + 15);
      }

      // Wrinkles Logic
      if (wrinkles > 25) {
        addIng('retinol', `Targeting signs of aging`, `Menargetkan tanda penuaan`, wrinkles + 20);
        addIng('peptides', `Collagen support for firming`, `Dukungan kolagen untuk pengencangan`, wrinkles + 15);
        addIng('hyaluronic_acid', `Plumps fine lines`, `Mengisi garis halus`, wrinkles + 10);
      }

      // Pigmentation Logic
      if (pigmentation > 25) {
        addIng('vitamin_c', `Brightens detected dark spots`, `Mencerahkan noda hitam terdeteksi`, pigmentation + 20);
        addIng('alpha_arbutin', `Targeted spot treatment`, `Perawatan noda spesifik`, pigmentation + 15);
        addIng('niacinamide', `Evens out skin tone`, `Meratakan warna kulit`, pigmentation + 10);
        addIng('glycolic_acid', `Exfoliates pigmented cells`, `Mengangkat sel berpigmen`, pigmentation + 5);
      }

      // Texture Logic
      if (texture > 25) {
        addIng('glycolic_acid', `Smoothes detected texture`, `Menghaluskan tekstur terdeteksi`, texture + 15);
        addIng('snail_mucin', `Repairs skin texture`, `Memperbaiki tekstur kulit`, texture + 10);
        addIng('squalane', `Softens rough skin`, `Melembutkan kulit kasar`, texture + 5);
      }
    }

    // 2. SKIN TYPE LOGIC (Base Priority)
    // Only adds if not already added by scan logic (or adds with lower priority if not present)
    
    if (user.skinType === SkinType.Oily) {
      addIng('salicylic_acid', 'Matches Oily skin type', 'Sesuai tipe kulit Berminyak', 10);
      addIng('niacinamide', 'Oil control for Oily skin', 'Kontrol minyak untuk kulit Berminyak', 10);
    } else if (user.skinType === SkinType.Dry) {
      addIng('hyaluronic_acid', 'Hydration for Dry skin', 'Hidrasi untuk kulit Kering', 10);
      addIng('ceramides', 'Barrier repair for Dry skin', 'Perbaikan barrier kulit Kering', 10);
      addIng('squalane', 'Moisturizer for Dry skin', 'Pelembap untuk kulit Kering', 8);
    } else if (user.skinType === SkinType.Combination) {
      addIng('niacinamide', 'Balances Combination skin', 'Menyeimbangkan kulit Kombinasi', 10);
    } else if (user.skinType === SkinType.Sensitive) {
      addIng('centella', 'Soothing for Sensitive skin', 'Menenangkan kulit Sensitif', 12); // Higher priority for sensitive
      addIng('ceramides', 'Strengthens Sensitive barrier', 'Memperkuat barrier Sensitif', 10);
    } else {
      // Normal
      addIng('vitamin_c', 'Maintenance for Normal skin', 'Perawatan kulit Normal', 5);
    }

    // Sort by priority (Highest first)
    return recommendations.sort((a, b) => b.priority - a.priority);
  };

  const recommendedList = getPersonalizedRecommendations();

  return (
    <div className="h-full overflow-y-auto pb-24 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {isId ? 'Saran Kandungan' : 'Ingredient Advice'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {isId 
            ? 'Dipersonalisasi berdasarkan hasil scan terakhir Anda.' 
            : 'Personalized based on your latest scan results.'}
        </p>
      </div>

      {/* User Context Card */}
      <div className="bg-gradient-to-r from-glow-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg mb-6 flex items-center justify-between">
        <div>
          <p className="text-glow-100 text-xs font-medium uppercase tracking-wider mb-1">
            {isId ? 'Fokus Perawatan' : 'Treatment Focus'}
          </p>
          <h3 className="text-xl font-bold">
            {latestScan 
              ? (isId ? 'Berdasarkan Kondisi Terkini' : 'Based on Current Condition') 
              : user.skinType}
          </h3>
          {latestScan && (
             <p className="text-sm opacity-90 mt-1">
               {isId ? 'Masalah Utama: ' : 'Primary Concern: '}
               <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-xs">
                 {Object.entries(latestScan.metrics).sort(([,a], [,b]) => (b as number) - (a as number))[0][0].toUpperCase()}
               </span>
             </p>
          )}
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <FlaskConical size={24} className="text-white" />
        </div>
      </div>

      {/* Ingredients List */}
      <div className="space-y-4">
        {recommendedList.map((ing) => (
          <div 
            key={ing.id} 
            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 animate-fadeIn relative overflow-hidden"
          >
            {/* Priority Indicator for High Matches */}
            {ing.priority > 20 && (
              <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                {isId ? 'SANGAT DISARANKAN' : 'HIGHLY RECOMMENDED'}
              </div>
            )}

            <div className={`w-12 h-12 rounded-full ${ing.bg} flex items-center justify-center flex-shrink-0 mt-1`}>
              <ing.icon size={24} className={ing.color} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start pr-4">
                 <h4 className="font-bold text-slate-800 dark:text-slate-200">{ing.name}</h4>
              </div>
              
              {/* Dynamic Reason Badge */}
              <div className="inline-block bg-slate-100 dark:bg-slate-700 rounded-md px-2 py-1 mt-1 mb-2">
                <p className="text-xs font-semibold text-glow-600 dark:text-glow-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  {ing.dynamicReason ? (isId ? ing.dynamicReason.id : ing.dynamicReason.en) : (isId ? ing.matchReason.id : ing.matchReason.en)}
                </p>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isId ? ing.description.id : ing.description.en}
              </p>
            </div>
          </div>
        ))}

        {recommendedList.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <FlaskConical size={48} className="mx-auto mb-3 opacity-50" />
            <p>{isId ? 'Lakukan scan wajah untuk rekomendasi yang lebih akurat.' : 'Perform a face scan for accurate recommendations.'}</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30 flex gap-3">
        <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
        <p className="text-xs text-yellow-700 dark:text-yellow-400 leading-relaxed">
          {isId 
            ? 'Penting: Informasi ini bukan saran medis. Selalu lakukan patch test sebelum mencoba produk baru. Konsultasikan dengan dermatologis untuk masalah kulit serius.'
            : 'Disclaimer: This is not medical advice. Always patch test new products. Consult a dermatologist for severe skin conditions.'}
        </p>
      </div>
    </div>
  );
};