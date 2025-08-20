import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Button, ButtonProps } from '@/components/ui/button';

interface MagneticButtonProps extends ButtonProps {
  magneticStrength?: number;
  glowIntensity?: number;
  particleCount?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  magneticStrength = 0.3,
  glowIntensity = 0.5,
  particleCount = 8,
  className = "",
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * magneticStrength;
      const deltaY = (e.clientY - centerY) * magneticStrength;

      gsap.to(button, {
        x: deltaX,
        y: deltaY,
        rotation: deltaX * 0.1,
        duration: 0.3,
        ease: "power2.out"
      });

      // Update particles
      if (isHovered) {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
          id: i,
          x: e.clientX - rect.left + (Math.random() - 0.5) * 60,
          y: e.clientY - rect.top + (Math.random() - 0.5) * 60
        }));
        setParticles(newParticles);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      
      gsap.to(button, {
        scale: 1.05,
        boxShadow: `0 10px 40px hsla(259, 100%, 65%, ${glowIntensity})`,
        duration: 0.3,
        ease: "power2.out"
      });

      document.addEventListener('mousemove', handleMouseMove);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setParticles([]);
      
      gsap.to(button, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        boxShadow: '0 4px 20px hsla(259, 100%, 65%, 0.2)',
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });

      document.removeEventListener('mousemove', handleMouseMove);
    };

    const handleClick = () => {
      // Success celebration effect
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });

      // Burst effect
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 rounded-full pointer-events-none';
        particle.style.backgroundColor = 'hsl(259, 100%, 65%)';
        particle.style.left = '50%';
        particle.style.top = '50%';
        button.appendChild(particle);

        const angle = (i / 12) * Math.PI * 2;
        const distance = 50;

        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            particle.remove();
          }
        });
      }
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('click', handleClick);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [magneticStrength, glowIntensity, particleCount, isHovered]);

  return (
    <div className="relative inline-block">
      <Button
        ref={buttonRef}
        className={`
          relative overflow-hidden transition-organic hover-magnetic
          before:absolute before:inset-0 before:bg-gradient-primary before:opacity-0 before:transition-opacity
          hover:before:opacity-10
          ${className}
        `}
        {...props}
      >
        {/* Particle vortex background */}
        <div className="absolute inset-0 particle-vortex opacity-20" />
        
        {/* Content */}
        <span className="relative z-10">{children}</span>
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-accent rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1, 0],
              x: (Math.random() - 0.5) * 30,
              y: (Math.random() - 0.5) * 30
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
          />
        ))}
      </Button>
      
      {/* Holographic border effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-primary/30 pointer-events-none"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [1, 1.1, 1.2]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
    </div>
  );
};