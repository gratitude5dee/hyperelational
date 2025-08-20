import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Share2, 
  Download,
  X
} from 'lucide-react';

interface WidgetContainerProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  controls?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'mini' | 'medium' | 'large' | 'full';
  onRefresh?: () => void;
  onMaximize?: () => void;
  onMinimize?: () => void;
  onClose?: () => void;
  isMaximized?: boolean;
  className?: string;
}

export function WidgetContainer({
  title,
  icon: Icon,
  children,
  controls,
  fullWidth = false,
  size = 'medium',
  onRefresh,
  onMaximize,
  onMinimize,
  onClose,
  isMaximized = false,
  className = ''
}: WidgetContainerProps) {
  const sizeClasses = {
    mini: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-2 row-span-2',
    large: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2',
    full: 'col-span-full row-span-3'
  };

  const containerClass = fullWidth ? 'col-span-full' : sizeClasses[size];

  return (
    <motion.div 
      className={`${containerClass} ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard 
        variant="hover" 
        className={`h-full p-6 border-primary/20 shadow-xl hover:shadow-2xl 
          transition-all duration-300 overflow-hidden
          ${isMaximized ? 'fixed inset-4 z-50' : ''}`}
      >
        {/* Widget Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
                <Icon className="h-5 w-5 text-primary animate-glow" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold gradient-text">{title}</h3>
              {size === 'full' && (
                <p className="text-sm text-muted-foreground">Advanced analytics and insights</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {controls}
            
            {onRefresh && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onRefresh}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
            </Button>
            
            {onMaximize && !isMaximized && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onMaximize}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Maximize2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            
            {onMinimize && isMaximized && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onMinimize}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minimize2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClose}
                className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        {/* Widget Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </GlassCard>
    </motion.div>
  );
}