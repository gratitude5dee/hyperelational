import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed: number;
  className?: string;
  direction?: 'vertical' | 'horizontal' | 'both';
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed,
  className = "",
  direction = 'vertical'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const xTransform = useTransform(scrollYProgress, [0, 1], [0, speed * 50]);
  
  const springY = useSpring(yTransform, { stiffness: 100, damping: 30 });
  const springX = useSpring(xTransform, { stiffness: 100, damping: 30 });

  const getTransform = () => {
    switch (direction) {
      case 'horizontal':
        return { x: springX };
      case 'both':
        return { x: springX, y: springY };
      default:
        return { y: springY };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={getTransform()}
    >
      {children}
    </motion.div>
  );
};

interface ScrollDrivenParallaxProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollDrivenParallax: React.FC<ScrollDrivenParallaxProps> = ({
  children,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (!containerRef.current) return;

    // Advanced scroll-driven animations
    const handleScroll = () => {
      const progress = scrollYProgress.get();
      
      // Atmospheric effects based on scroll position
      const atmosphericElements = containerRef.current?.querySelectorAll('.atmospheric-element');
      atmosphericElements?.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        const offset = (index + 1) * 0.1;
        const intensity = Math.sin((progress + offset) * Math.PI * 2);
        
        gsap.to(htmlElement, {
          opacity: 0.3 + intensity * 0.2,
          scale: 1 + intensity * 0.05,
          rotation: intensity * 5,
          duration: 0.3,
          ease: "none"
        });
      });

      // Particle drift effects
      const particles = containerRef.current?.querySelectorAll('.drift-particle');
      particles?.forEach((particle, index) => {
        const htmlElement = particle as HTMLElement;
        const driftX = Math.sin(progress * Math.PI * 4 + index) * 20;
        const driftY = Math.cos(progress * Math.PI * 3 + index) * 15;
        
        gsap.to(htmlElement, {
          x: driftX,
          y: driftY,
          duration: 0.5,
          ease: "power2.out"
        });
      });
    };

    const unsubscribe = scrollYProgress.onChange(handleScroll);
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Atmospheric particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="atmospheric-element absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Drift particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="drift-particle absolute w-2 h-2 bg-gradient-to-r from-secondary to-accent rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {children}
    </div>
  );
};