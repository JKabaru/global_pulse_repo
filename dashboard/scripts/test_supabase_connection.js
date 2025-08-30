const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load .env from current directory (globalpulse)

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

async function testConnection() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connectivity by querying raw_te_metadata
    const { data, error } = await supabase
      .from('raw_te_metadata')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Connection failed:', error.message);
      return;
    }

    console.log('Connection successful:', data);
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

testConnection();