import React from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-charcoal border-b border-quantum-ember/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-mono uppercase text-text-primary tracking-wider"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <Input
              placeholder="Search..."
              icon={<MagnifyingGlassIcon className="w-4 h-4" />}
              className="w-64"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm">
              <BellIcon className="w-5 h-5" />
            </Button>
            <Badge 
              variant="error" 
              size="sm" 
              className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center p-0"
            >
              3
            </Badge>
          </div>

          {/* User Menu */}
          <Button variant="ghost" size="sm">
            <UserCircleIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;