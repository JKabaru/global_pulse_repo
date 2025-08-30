import { supabase } from './supabaseClient.js';

async function testConnection() {
  try {
    // Equivalent to SELECT table_name FROM information_schema.tables ...
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['countries', 'indicators_metadata', 'raw_data', 'audit_logs']);

    if (error) {
      throw new Error(error.message);
    }

    const tables = data.map(row => row.table_name);
    const expectedTables = ['countries', 'indicators_metadata', 'raw_data', 'audit_logs'];

    if (expectedTables.every(t => tables.includes(t))) {
      console.log('✅ All expected tables exist:', tables);
    } else {
      console.error(`❌ Missing tables. Found: ${tables}, Expected: ${expectedTables}`);
    }

  } catch (err) {
    console.error('ERROR: Connection test failed -', err.message);
  }
}

testConnection();
