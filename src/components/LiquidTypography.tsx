import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';

interface LiquidTypographyProps {
  text: string;
  className?: string;
  variant?: 'liquid' | 'glitch' | 'magnetic' | 'hologram';
  delay?: number;
}

export const LiquidTypography: React.FC<LiquidTypographyProps> = ({
  text,
  className = "text-4xl font-bold",
  variant = 'liquid',
  delay = 0
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!textRef.current || !isInView) return;

    const chars = textRef.current.querySelectorAll('.char');
    
    switch (variant) {
      case 'liquid':
        // Liquid typography with morphing effect
        gsap.fromTo(chars, 
          {
            opacity: 0,
            scale: 0.3,
            rotation: () => gsap.utils.random(-45, 45),
            y: () => gsap.utils.random(-50, 50),
            filter: 'blur(10px)'
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.2,
            delay: delay,
            stagger: {
              each: 0.05,
              from: "random"
            },
            ease: "elastic.out(1, 0.5)"
          }
        );
        break;

      case 'glitch':
        // Glitch effect with RGB splitting
        chars.forEach((char, i) => {
          const element = char as HTMLElement;
          element.style.position = 'relative';
          element.style.display = 'inline-block';
          
          // Create glitch clones
          const glitchBefore = element.cloneNode(true) as HTMLElement;
          const glitchAfter = element.cloneNode(true) as HTMLElement;
          
          glitchBefore.style.position = 'absolute';
          glitchBefore.style.top = '0';
          glitchBefore.style.left = '0';
          glitchBefore.style.color = 'hsl(var(--accent))';
          glitchBefore.style.zIndex = '-1';
          
          glitchAfter.style.position = 'absolute';
          glitchAfter.style.top = '0';
          glitchAfter.style.left = '0';
          glitchAfter.style.color = 'hsl(var(--secondary))';
          glitchAfter.style.zIndex = '-2';
          
          element.appendChild(glitchBefore);
          element.appendChild(glitchAfter);
        });

        gsap.fromTo(chars,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: delay,
            stagger: 0.03,
            ease: "power2.out"
          }
        );
        break;

      case 'magnetic':
        // Magnetic text that responds to cursor
        const handleMouseMove = (e: MouseEvent) => {
          chars.forEach((char) => {
            const element = char as HTMLElement;
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
              Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
            );
            
            const maxDistance = 100;
            const force = Math.max(0, (maxDistance - distance) / maxDistance);
            
            const deltaX = (e.clientX - centerX) * force * 0.3;
            const deltaY = (e.clientY - centerY) * force * 0.3;
            
            gsap.to(element, {
              x: deltaX,
              y: deltaY,
              rotation: deltaX * 0.1,
              scale: 1 + force * 0.1,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        };

        gsap.fromTo(chars,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: delay,
            stagger: 0.02,
            ease: "back.out(1.7)"
          }
        );

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);

      case 'hologram':
        // Holographic effect with prismatic colors
        chars.forEach((char) => {
          const element = char as HTMLElement;
          element.style.background = 'var(--gradient-primary)';
          element.style.backgroundClip = 'text';
          element.style.webkitBackgroundClip = 'text';
          element.style.webkitTextFillColor = 'transparent';
          element.style.filter = 'drop-shadow(0 0 10px hsl(var(--primary) / 0.5))';
        });

        gsap.fromTo(chars,
          {
            opacity: 0,
            scale: 0.5,
            rotationY: 90,
            filter: 'hue-rotate(0deg) brightness(0.5)'
          },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            filter: 'hue-rotate(360deg) brightness(1.2)',
            duration: 1.5,
            delay: delay,
            stagger: 0.04,
            ease: "power3.out"
          }
        );
        break;
    }
  }, [isInView, variant, delay]);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="char inline-block"
        data-text={char}
        style={{ transformOrigin: 'center' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <motion.div
      ref={textRef}
      className={`${className} ${variant === 'liquid' ? 'liquid-text' : ''} ${variant === 'glitch' ? 'glitch-text' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {splitText(text)}
    </motion.div>
  );
};