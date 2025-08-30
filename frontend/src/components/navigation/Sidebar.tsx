import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ChartBarIcon,
  MapIcon,
  CogIcon,
  DocumentChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import type { NavigationItem } from '../../types';

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'HomeIcon', path: '/' },
  { id: 'forecasts', label: 'Forecasts', icon: 'ChartBarIcon', path: '/forecasts' },
  { id: 'countries', label: 'Countries', icon: 'GlobeAltIcon', path: '/countries' },
  { id: 'indicators', label: 'Indicators', icon: 'DocumentChartBarIcon', path: '/indicators' },
  { id: 'taxonomy', label: 'Taxonomy', icon: 'MapIcon', path: '/taxonomy' },
  { id: 'settings', label: 'Settings', icon: 'CogIcon', path: '/settings' }
];

const iconMap = {
  HomeIcon,
  ChartBarIcon,
  MapIcon,
  CogIcon,
  DocumentChartBarIcon,
  GlobeAltIcon
};

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-charcoal border-r border-quantum-ember/20 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-quantum-ember/20">
        <h1 className="text-xl font-mono uppercase text-text-primary tracking-wider">
          Global<span className="text-quantum-ember">Pulse</span>
        </h1>
        <p className="text-xs text-text-secondary mt-1">Economic Intelligence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `block w-full text-left transition-all duration-200 ${
                  isActive ? 'text-quantum-ember' : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                  isActive 
                    ? 'bg-quantum-ember/10 border border-quantum-ember/20' 
                    : 'hover:bg-charcoal/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-quantum-ember text-white text-xs rounded-full px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-quantum-ember/20">
        <div className="text-xs text-text-secondary">
          <p>Version 1.0.0</p>
          <p>Last sync: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;