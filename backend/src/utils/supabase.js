/**
 * Supabase Client Configuration
 * Connects to your own Supabase project
 */

const { createClient } = require('@supabase/supabase-js');

// Get credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

// Validate that credentials are provided
if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Supabase credentials missing!');
  console.error('Please check your .env file and ensure SUPABASE_URL and SUPABASE_SERVICE_KEY are set.');
  console.error('Get these values from your Supabase project dashboard.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✓ Supabase client initialized');

module.exports = supabase;
