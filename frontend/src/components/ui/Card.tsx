import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = true,
  glow = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        'bg-charcoal border border-quantum-ember/20 rounded-xl p-6 backdrop-blur-sm',
        glow && 'shadow-lg shadow-quantum-ember/10',
        hover && 'hover:border-quantum-ember/40 hover:shadow-xl hover:shadow-quantum-ember/20',
        'transition-all duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;