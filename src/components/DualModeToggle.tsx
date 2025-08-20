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
      // Create a real project in the database if none exists
      console.log('No current project, need to create a real project with the backend...');
      
      // For now, set a temporary state but we need a real project
      const defaultProject = {
        id: 'demo-project-' + Date.now(),
        workspace_id: 'demo-workspace',
        name: 'Demo Project',
        type: 'fashion_ecommerce' as const,
        created_at: new Date().toISOString()
      };
      setCurrentProject(defaultProject);
      console.log('Created demo project (needs real backend integration):', defaultProject);
    }
  };

  const isEcommerce = currentProject?.type === 'fashion_ecommerce';
  
  console.log('DualModeToggle render - isEcommerce:', isEcommerce, 'project type:', currentProject?.type);

  return (
    <div className="relative inline-flex items-center p-1 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/50 shadow-lg">
      {/* Animated background indicator - only shows behind active button */}
      <motion.div
        className="absolute top-1 bottom-1 bg-primary rounded-lg shadow-md pointer-events-none"
        animate={{
          x: isEcommerce ? 4 : 'calc(50% + 4px)',
          width: 'calc(50% - 8px)'
        }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
        style={{ zIndex: 1 }}
      />
      
      {/* E-commerce Button */}
      <button
        onClick={toggleMode}
        className={`
          relative z-20 flex items-center gap-2 px-4 py-2 rounded-lg
          font-medium text-sm transition-all duration-300 ease-out
          cursor-pointer select-none outline-none min-w-[120px] justify-center
          focus:ring-2 focus:ring-primary/50 focus:ring-offset-1
          active:scale-95 transform
          ${isEcommerce 
            ? 'text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
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
          cursor-pointer select-none outline-none min-w-[120px] justify-center
          focus:ring-2 focus:ring-primary/50 focus:ring-offset-1
          active:scale-95 transform
          ${!isEcommerce 
            ? 'text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
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