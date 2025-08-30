import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GlobeAltIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Header from '../components/navigation/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CountryForm from '../components/forms/CountryForm';
import { useCountries } from '../hooks/useData';

const Countries: React.FC = () => {
  const { countries, loading, error } = useCountries();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<any>(null);

  const handleAddCountry = () => {
    setEditingCountry(null);
    setShowForm(true);
  };

  const handleEditCountry = (country: any) => {
    setEditingCountry(country);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    // In a real app, you'd refresh the data here
    console.log('Country saved successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        Error loading countries: {error}
      </div>
    );
  }

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.country_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         country.country_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = Array.from(new Set(countries.map(c => c.region).filter(Boolean)));

  return (
    <div className="space-y-6">
      <Header 
        title="Countries" 
        subtitle="Manage country data and monitor coverage across regions"
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<MagnifyingGlassIcon className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <Button variant="secondary" icon={<FunnelIcon className="w-4 h-4" />}>
                Filters
              </Button>
              <Button 
                variant="primary" 
                icon={<GlobeAltIcon className="w-4 h-4" />}
                onClick={handleAddCountry}
              >
                Add Country
              </Button>
            </div>
          </div>
        </Card>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCountries.map((country, index) => (
            <motion.div
              key={country.country_code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover glow>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-quantum-ember/10 rounded-lg">
                      <GlobeAltIcon className="w-6 h-6 text-quantum-ember" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {country.country_name}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {country.country_code}
                      </p>
                    </div>
                  </div>
                  <Badge variant="info" size="sm">
                    {country.region || 'Unknown'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Indicators</span>
                    <span className="text-text-primary font-medium">
                      {country.totalIndicators}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Forecast Accuracy</span>
                    <span className="text-text-primary font-medium">
                      {country.forecastAccuracy.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Last Updated</span>
                    <span className="text-text-primary font-medium text-xs">
                      {new Date(country.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-quantum-ember/20">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditCountry(country)}
                    >
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                    View Details
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <GlobeAltIcon className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No countries found matching your criteria</p>
          </div>
        )}
      </div>

      <CountryForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        editData={editingCountry}
      />
    </div>
  );
};

export default Countries;