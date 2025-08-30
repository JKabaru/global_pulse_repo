import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  DocumentChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { supabase } from '../../lib/supabase';

const schema = yup.object({
  indicator_name: yup.string().required('Indicator name is required'),
  description: yup.string(),
  unit: yup.string()
});

interface IndicatorFormData {
  indicator_name: string;
  description?: string;
  unit?: string;
}

interface IndicatorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: IndicatorFormData & { indicator_id: number };
}

const IndicatorForm: React.FC<IndicatorFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editData
}) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!editData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IndicatorFormData>({
    resolver: yupResolver(schema),
    defaultValues: editData || {
      indicator_name: '',
      description: '',
      unit: ''
    }
  });

  const onSubmit = async (data: IndicatorFormData) => {
    setLoading(true);
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('canonical_indicators')
          .update(data)
          .eq('indicator_id', editData.indicator_id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('canonical_indicators')
          .insert([data]);
        
        if (error) throw error;
      }

      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving indicator:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Indicator' : 'Add New Indicator'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-stabilizer-cyan/10 rounded-lg">
            <DocumentChartBarIcon className="w-6 h-6 text-stabilizer-cyan" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {isEditing ? 'Update Indicator Information' : 'Add New Economic Indicator'}
            </h3>
            <p className="text-text-secondary text-sm">
              {isEditing ? 'Modify existing indicator details' : 'Define a new economic indicator for tracking'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Indicator Name"
            placeholder="e.g., GDP, Consumer Price Index, Unemployment Rate"
            {...register('indicator_name')}
            error={errors.indicator_name?.message}
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              placeholder="Detailed description of what this indicator measures..."
              rows={3}
              className="w-full px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary placeholder-text-secondary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20 focus:outline-none transition-colors duration-200 resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <Input
            label="Unit"
            placeholder="e.g., %, USD Billion, Index Points"
            {...register('unit')}
            error={errors.unit?.message}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-quantum-ember/20">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={isEditing ? undefined : <PlusIcon className="w-4 h-4" />}
          >
            {isEditing ? 'Update Indicator' : 'Add Indicator'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default IndicatorForm;