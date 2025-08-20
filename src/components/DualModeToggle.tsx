import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Music } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

export function DualModeToggle() {
  const { currentProject, setCurrentProject } = useAppStore();
  
  const toggleMode = () => {
    if (currentProject) {
      const newType = currentProject.type === 'fashion_ecommerce' ? 'creative_hub' : 'fashion_ecommerce';
      setCurrentProject({
        ...currentProject,
        type: newType
      });
    }
  };

  const isEcommerce = currentProject?.type === 'fashion_ecommerce';

  return (
    <div className="relative inline-flex items-center p-1 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/50 shadow-lg">
      {/* Animated background indicator - non-interactive */}
      <motion.div
        className="absolute inset-y-1 bg-primary rounded-lg shadow-md pointer-events-none"
        animate={{
          x: isEcommerce ? 2 : 'calc(50% + 2px)',
          width: 'calc(50% - 4px)'
        }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        style={{ zIndex: 1 }}
      />
      
      {/* E-commerce Button */}
      <button
        onClick={toggleMode}
        className={`
          relative z-20 flex items-center gap-2 px-4 py-2 rounded-lg
          font-medium text-sm transition-all duration-300 ease-out
          cursor-pointer select-none outline-none
          focus:ring-2 focus:ring-primary/50 focus:ring-offset-1
          ${isEcommerce 
            ? 'text-primary-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          }
        `}
        aria-pressed={isEcommerce}
        role="switch"
        type="button"
      >
        <ShoppingBag className="h-4 w-4 flex-shrink-0" />
        <span className="whitespace-nowrap">E-commerce</span>
      </button>
      
      {/* Artist Analytics Button */}
      <button
        onClick={toggleMode}
        className={`
          relative z-20 flex items-center gap-2 px-4 py-2 rounded-lg
          font-medium text-sm transition-all duration-300 ease-out
          cursor-pointer select-none outline-none
          focus:ring-2 focus:ring-primary/50 focus:ring-offset-1
          ${!isEcommerce 
            ? 'text-primary-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          }
        `}
        aria-pressed={!isEcommerce}
        role="switch"
        type="button"
      >
        <Music className="h-4 w-4 flex-shrink-0" />
        <span className="whitespace-nowrap">Artist Analytics</span>
      </button>
    </div>
  );
}