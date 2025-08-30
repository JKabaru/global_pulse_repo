import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  GlobeAltIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import { supabase } from '../../lib/supabase';

const schema = yup.object({
  country_code: yup.string().required('Country code is required').length(3, 'Must be 3 characters'),
  country_name: yup.string().required('Country name is required'),
  region: yup.string().required('Region is required')
});

interface CountryFormData {
  country_code: string;
  country_name: string;
  region: string;
}

interface CountryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: CountryFormData;
}

const CountryForm: React.FC<CountryFormProps> = ({
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
  } = useForm<CountryFormData>({
    resolver: yupResolver(schema),
    defaultValues: editData || {
      country_code: '',
      country_name: '',
      region: ''
    }
  });

  const regionOptions = [
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia', label: 'Asia' },
    { value: 'North America', label: 'North America' },
    { value: 'South America', label: 'South America' },
    { value: 'Africa', label: 'Africa' },
    { value: 'Oceania', label: 'Oceania' }
  ];

  const onSubmit = async (data: CountryFormData) => {
    setLoading(true);
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('canonical_countries')
          .update(data)
          .eq('country_code', editData.country_code);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('canonical_countries')
          .insert([data]);
        
        if (error) throw error;
      }

      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving country:', error);
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
      title={isEditing ? 'Edit Country' : 'Add New Country'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-quantum-ember/10 rounded-lg">
            <GlobeAltIcon className="w-6 h-6 text-quantum-ember" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {isEditing ? 'Update Country Information' : 'Add New Country'}
            </h3>
            <p className="text-text-secondary text-sm">
              {isEditing ? 'Modify existing country details' : 'Enter details for the new country'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Country Code"
            placeholder="e.g., USA, GBR, JPN"
            {...register('country_code')}
            error={errors.country_code?.message}
            disabled={isEditing} // Country code shouldn't be editable
          />

          <Input
            label="Country Name"
            placeholder="e.g., United States, United Kingdom, Japan"
            {...register('country_name')}
            error={errors.country_name?.message}
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Region
            </label>
            <select
              {...register('region')}
              className="w-full px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
            >
              <option value="">Select a region</option>
              {regionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="text-sm text-red-500 mt-1">{errors.region.message}</p>
            )}
          </div>
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
            {isEditing ? 'Update Country' : 'Add Country'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CountryForm;