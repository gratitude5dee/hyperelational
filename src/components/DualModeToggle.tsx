import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Music } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

export function DualModeToggle() {
  const { industryMode, setIndustryMode } = useAppStore();

  return (
    <div className="relative flex items-center gap-1 p-1 glass rounded-2xl border border-white/10">
      {/* Background slider */}
      <motion.div
        className="absolute top-1 left-1 w-32 h-10 rounded-xl"
        style={{
          background: industryMode === 'fashion' 
            ? 'var(--fashion-gradient)' 
            : 'var(--artist-gradient)'
        }}
        animate={{
          x: industryMode === 'fashion' ? 0 : 128
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      
      {/* Fashion Mode Button */}
      <button
        onClick={() => setIndustryMode('fashion')}
        className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
          industryMode === 'fashion' 
            ? 'text-white font-semibold' 
            : 'text-white/60 hover:text-white/80'
        }`}
      >
        <Palette className="w-4 h-4" />
        <span className="text-sm">Fashion Retail</span>
      </button>
      
      {/* Artist Mode Button */}
      <button
        onClick={() => setIndustryMode('artist')}
        className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
          industryMode === 'artist' 
            ? 'text-white font-semibold' 
            : 'text-white/60 hover:text-white/80'
        }`}
      >
        <Music className="w-4 h-4" />
        <span className="text-sm">Artist Management</span>
      </button>
    </div>
  );
}