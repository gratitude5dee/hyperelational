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
    <div className="relative inline-flex items-center p-1 rounded-xl bg-muted/50 backdrop-blur-sm">
      <motion.div
        className="absolute inset-y-1 bg-primary rounded-lg"
        animate={{
          x: isEcommerce ? 2 : '50%',
          width: 'calc(50% - 4px)'
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMode}
        className={`relative z-10 flex items-center gap-2 px-4 py-2 transition-colors ${
          isEcommerce ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <ShoppingBag className="h-4 w-4" />
        E-commerce
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMode}
        className={`relative z-10 flex items-center gap-2 px-4 py-2 transition-colors ${
          !isEcommerce ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Music className="h-4 w-4" />
        Artist Analytics
      </Button>
    </div>
  );
}