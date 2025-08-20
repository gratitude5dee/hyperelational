import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Music } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

export function DualModeToggle() {
  const { currentProject, setCurrentProject } = useAppStore();
  
  const toggleMode = () => {
    console.log('Toggle clicked, current project:', currentProject);
    
    if (currentProject) {
      const newType: 'fashion_ecommerce' | 'creative_hub' = currentProject.type === 'fashion_ecommerce' ? 'creative_hub' : 'fashion_ecommerce';
      console.log('Switching from', currentProject.type, 'to', newType);
      
      const updatedProject = {
        ...currentProject,
        type: newType
      };
      
      setCurrentProject(updatedProject);
      console.log('Project updated to:', updatedProject);
    } else {
      // Create a default project if none exists
      console.log('No current project, creating default...');
      const defaultProject = {
        id: 'temp-project',
        workspace_id: 'temp-workspace',
        name: 'Demo Project',
        type: 'fashion_ecommerce' as const,
        created_at: new Date().toISOString()
      };
      setCurrentProject(defaultProject);
      console.log('Created default project:', defaultProject);
    }
  };

  const isEcommerce = currentProject?.type === 'fashion_ecommerce';
  
  console.log('DualModeToggle render - isEcommerce:', isEcommerce, 'project type:', currentProject?.type);

  return (
    <div className="relative inline-flex items-center p-1 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/50 shadow-lg">
      {/* Debug info (remove in production) */}
      <div className="absolute -top-8 left-0 text-xs text-muted-foreground">
        Mode: {currentProject?.type || 'none'} | Project: {currentProject?.id ? 'exists' : 'missing'}
      </div>
      
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
          active:scale-95 transform
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
          active:scale-95 transform
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