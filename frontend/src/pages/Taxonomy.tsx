import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapIcon,
  TagIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import Header from '../components/navigation/Header';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CategoryDistributionChart from '../components/charts/CategoryDistributionChart';
import { supabase } from '../lib/supabase';
import type { TaxonomyMapping, Category, CategoryMetrics } from '../types';

const Taxonomy: React.FC = () => {
  const [mappings, setMappings] = useState<TaxonomyMapping[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTaxonomyData() {
      try {
        const [mappingsRes, categoriesRes] = await Promise.all([
          supabase.from('taxonomy_mapping').select('*'),
          supabase.from('categories').select('*')
        ]);

        if (mappingsRes.error) throw mappingsRes.error;
        if (categoriesRes.error) throw categoriesRes.error;

        setMappings(mappingsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch taxonomy data');
      } finally {
        setLoading(false);
      }
    }

    fetchTaxonomyData();
  }, []);

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
        Error loading taxonomy: {error}
      </div>
    );
  }

  // Calculate category metrics
  const categoryMetrics: CategoryMetrics[] = categories.map(category => {
    const categoryMappings = mappings.filter(m => m.category_id === category.category_id);
    const primaryMappings = categoryMappings.filter(m => m.is_primary);
    
    return {
      category_id: category.category_id,
      category_name: category.category_name,
      total_mappings: categoryMappings.length,
      coverage_percentage: (categoryMappings.length / mappings.length) * 100,
      primary_mappings: primaryMappings.length
    };
  });

  return (
    <div className="space-y-6">
      <Header 
        title="Taxonomy" 
        subtitle="Category mappings and indicator classification system"
      />

      <div className="p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card glow>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-quantum-ember/10 rounded-lg">
                <TagIcon className="w-6 h-6 text-quantum-ember" />
              </div>
              <div>
                <p className="text-text-secondary text-sm uppercase tracking-wide">Categories</p>
                <p className="text-2xl font-mono font-bold text-text-primary">{categories.length}</p>
              </div>
            </div>
          </Card>

          <Card glow>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-stabilizer-cyan/10 rounded-lg">
                <LinkIcon className="w-6 h-6 text-stabilizer-cyan" />
              </div>
              <div>
                <p className="text-text-secondary text-sm uppercase tracking-wide">Total Mappings</p>
                <p className="text-2xl font-mono font-bold text-text-primary">{mappings.length}</p>
              </div>
            </div>
          </Card>

          <Card glow>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-radiant-magenta/10 rounded-lg">
                <MapIcon className="w-6 h-6 text-radiant-magenta" />
              </div>
              <div>
                <p className="text-text-secondary text-sm uppercase tracking-wide">Primary Mappings</p>
                <p className="text-2xl font-mono font-bold text-text-primary">
                  {mappings.filter(m => m.is_primary).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-charcoal border border-quantum-ember/20 rounded-xl p-6">
              <CategoryDistributionChart 
                data={categoryMetrics}
                title="Category Distribution"
              />
            </div>
          </motion.div>

          {/* Category Details */}
          <div className="space-y-4">
            {categories.map((category, index) => {
              const metrics = categoryMetrics.find(m => m.category_id === category.category_id);
              return (
                <motion.div
                  key={category.category_id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card hover>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-text-primary">
                        {category.category_name}
                      </h4>
                      <Badge variant="default" size="sm">
                        {metrics?.total_mappings || 0} mappings
                      </Badge>
                    </div>
                    
                    {category.description && (
                      <p className="text-text-secondary text-sm mb-4">
                        {category.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wide">Coverage</p>
                        <p className="text-text-primary font-mono">
                          {metrics?.coverage_percentage.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wide">Primary</p>
                        <p className="text-text-primary font-mono">
                          {metrics?.primary_mappings || 0}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mappings Table */}
        <Card>
          <h3 className="text-lg font-mono uppercase text-text-primary mb-6 tracking-wider">
            Recent Mappings
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-quantum-ember/20">
                  <th className="text-left py-3 px-4 text-text-secondary text-sm uppercase tracking-wide">
                    Country
                  </th>
                  <th className="text-left py-3 px-4 text-text-secondary text-sm uppercase tracking-wide">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-text-secondary text-sm uppercase tracking-wide">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 text-text-secondary text-sm uppercase tracking-wide">
                    Primary
                  </th>
                  <th className="text-left py-3 px-4 text-text-secondary text-sm uppercase tracking-wide">
                    Coverage
                  </th>
                </tr>
              </thead>
              <tbody>
                {mappings.slice(0, 10).map((mapping, index) => {
                  const category = categories.find(c => c.category_id === mapping.category_id);
                  return (
                    <motion.tr
                      key={mapping.mapping_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-quantum-ember/10 hover:bg-deep-void/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-text-primary">
                        {mapping.country_code}
                      </td>
                      <td className="py-3 px-4 text-text-primary">
                        {category?.category_name || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-text-primary font-mono">
                        {mapping.rank}
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={mapping.is_primary ? 'success' : 'default'} 
                          size="sm"
                        >
                          {mapping.is_primary ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-text-primary font-mono">
                        {mapping.coverage_ratio ? `${(mapping.coverage_ratio * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Taxonomy;