import { supabase } from './supabase'; // 👈 Only import the client

export async function fetchForecastResults() {
  const { data, error } = await supabase
    .from('forecast_results')
    .select('*');

  if (error) {
    console.error("Error fetching forecast results:", error);
    return null;
  }
  return data;
}

export async function fetchTaxonomyMappings() {
  const { data, error } = await supabase
    .from('taxonomy_mapping') // 👈 Make sure this table name is correct
    .select('*');

  if (error) {
    console.error("Error fetching taxonomy mappings:", error);
    return null;
  }
  return data;
}