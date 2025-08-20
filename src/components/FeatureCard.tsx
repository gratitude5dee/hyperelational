import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactElement<LucideIcon>;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  gradient,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="group relative p-6 glass rounded-2xl border border-white/10 overflow-hidden"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 
                      group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 
                      group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl
                        bg-gradient-to-br ${gradient} mb-4 group-hover:scale-110 
                        transition-transform duration-300`}>
          <div className="w-6 h-6 text-white [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-2">
            {icon}
          </div>
        </div>
        
        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 
                       transition-colors">
          {title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/70 
                     transition-colors">
          {description}
        </p>
      </div>
      
      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-2xl border border-transparent 
                      group-hover:border-white/20 transition-colors duration-300" />
    </motion.div>
  );
};