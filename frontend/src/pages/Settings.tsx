import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  DatabaseIcon,
  KeyIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Header from '../components/navigation/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      forecast_alerts: true,
      system_alerts: true
    },
    api: {
      rate_limit: 100,
      timeout: 30,
      retry_attempts: 3
    },
    data: {
      retention_days: 365,
      auto_cleanup: true,
      backup_frequency: 'daily'
    }
  });

  const sections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General',
      description: 'Basic application settings',
      icon: CogIcon
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Alert and notification preferences',
      icon: BellIcon
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Authentication and access control',
      icon: ShieldCheckIcon
    },
    {
      id: 'data',
      title: 'Data Management',
      description: 'Data retention and backup settings',
      icon: DatabaseIcon
    },
    {
      id: 'api',
      title: 'API Configuration',
      description: 'External API settings and limits',
      icon: KeyIcon
    }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <h4 className="text-lg font-semibold text-text-primary mb-4">Application Settings</h4>
        <div className="space-y-4">
          <Input
            label="Application Name"
            defaultValue="GlobalPulse"
            placeholder="Enter application name"
          />
          <Input
            label="Default Currency"
            defaultValue="USD"
            placeholder="Enter default currency"
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Time Zone
            </label>
            <select className="w-full px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20">
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <h4 className="text-lg font-semibold text-text-primary mb-4">Notification Preferences</h4>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-text-primary font-medium capitalize">
                  {key.replace('_', ' ')}
                </p>
                <p className="text-text-secondary text-sm">
                  Receive {key.replace('_', ' ')} notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      [key]: e.target.checked
                    }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-charcoal peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-quantum-ember/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-quantum-ember"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <h4 className="text-lg font-semibold text-text-primary mb-4">Security Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-deep-void/30 rounded-lg">
            <div>
              <p className="text-text-primary font-medium">Two-Factor Authentication</p>
              <p className="text-text-secondary text-sm">Add an extra layer of security</p>
            </div>
            <Badge variant="warning">Disabled</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-deep-void/30 rounded-lg">
            <div>
              <p className="text-text-primary font-medium">Session Timeout</p>
              <p className="text-text-secondary text-sm">Automatic logout after inactivity</p>
            </div>
            <span className="text-text-primary font-mono">30 minutes</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-deep-void/30 rounded-lg">
            <div>
              <p className="text-text-primary font-medium">API Key Rotation</p>
              <p className="text-text-secondary text-sm">Last rotated 30 days ago</p>
            </div>
            <Button variant="secondary" size="sm">
              Rotate Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <Card>
        <h4 className="text-lg font-semibold text-text-primary mb-4">Data Management</h4>
        <div className="space-y-4">
          <Input
            label="Data Retention (days)"
            type="number"
            value={settings.data.retention_days}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              data: { ...prev.data, retention_days: parseInt(e.target.value) }
            }))}
          />
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Backup Frequency
            </label>
            <select 
              value={settings.data.backup_frequency}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                data: { ...prev.data, backup_frequency: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary font-medium">Auto Cleanup</p>
              <p className="text-text-secondary text-sm">Automatically remove old data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.data.auto_cleanup}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  data: { ...prev.data, auto_cleanup: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-charcoal peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-quantum-ember/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-quantum-ember"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <Card>
        <h4 className="text-lg font-semibold text-text-primary mb-4">API Configuration</h4>
        <div className="space-y-4">
          <Input
            label="Rate Limit (requests/minute)"
            type="number"
            value={settings.api.rate_limit}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              api: { ...prev.api, rate_limit: parseInt(e.target.value) }
            }))}
          />
          
          <Input
            label="Timeout (seconds)"
            type="number"
            value={settings.api.timeout}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              api: { ...prev.api, timeout: parseInt(e.target.value) }
            }))}
          />

          <Input
            label="Retry Attempts"
            type="number"
            value={settings.api.retry_attempts}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              api: { ...prev.api, retry_attempts: parseInt(e.target.value) }
            }))}
          />
        </div>
      </Card>

      <Card>
        <h4 className="text-lg font-semibold text-text-primary mb-4">API Keys</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-deep-void/30 rounded-lg">
            <div>
              <p className="text-text-primary font-medium">TradingEconomics API</p>
              <p className="text-text-secondary text-sm">••••••••••••••••</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-deep-void/30 rounded-lg">
            <div>
              <p className="text-text-primary font-medium">Supabase Service Key</p>
              <p className="text-text-secondary text-sm">••••••••••••••••</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'data': return renderDataSettings();
      case 'api': return renderApiSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Settings" 
        subtitle="Configure application preferences and system parameters"
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-mono uppercase text-text-primary mb-4 tracking-wider">
                Settings
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <motion.button
                      key={section.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-quantum-ember/10 border border-quantum-ember/20 text-quantum-ember' 
                          : 'text-text-secondary hover:text-text-primary hover:bg-charcoal/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium">{section.title}</p>
                          <p className="text-xs opacity-75">{section.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>

            {/* Save Actions */}
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="secondary">
                Reset to Defaults
              </Button>
              <Button variant="primary">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;