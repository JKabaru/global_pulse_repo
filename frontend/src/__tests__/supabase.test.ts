import { describe, it, expect } from 'vitest';
import { supabase } from '../lib/supabase';

describe('Supabase Connection', () => {
  it('should connect to Supabase and fetch from all required tables', async () => {
    // 👇 THE FIX: Add "as const" to the end of the array
    const tables = ['categories', 'taxonomy_mapping', 'forecast_results', 'canonical_timeseries'] as const;

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);

      // Your expectations remain the same
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    }
  });
});