import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and public key
const supabaseUrl = 'https://jjizaincjbgigbylbbyi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqaXphaW5jamJnaWdieWxiYnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjA1NTMsImV4cCI6MjA3MTg5NjU1M30.SkkIilhr1CumUHUoQrwtjAPp6PrqTCQv-a5IQPgYNco';

async function testConnection() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // This is a simple query to test the connection.
    // It will fail if the initial connection cannot be established.
    const { data, error } = await supabase.from('countries').select();

    if (error) {
      console.error('ERROR: Connection test failed -', error.message);
    } else {
      console.log('SUCCESS: Connection established!');
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err.message);
  }
}

testConnection();