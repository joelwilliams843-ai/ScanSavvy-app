const { supabase } = require('../lib/supabase');
const storeLocations = require('../data/store-locations');
require('dotenv').config();

async function seedStores() {
  console.log('🌱 Starting store locations seed...');
  console.log(`📍 Seeding ${storeLocations.length} store locations\n`);

  try {
    // Check if store_locations table exists
    const { error: checkError } = await supabase
      .from('store_locations')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error: store_locations table does not exist');
      console.error('Please create the table first using the SQL below:\n');
      console.log(`
CREATE TABLE IF NOT EXISTS public.store_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  retailer TEXT NOT NULL,
  store_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS store_locations_retailer_idx ON public.store_locations(retailer);
CREATE INDEX IF NOT EXISTS store_locations_city_idx ON public.store_locations(city);
CREATE INDEX IF NOT EXISTS store_locations_lat_lng_idx ON public.store_locations(latitude, longitude);
`);
      process.exit(1);
    }

    // Clear existing data (optional - comment out to keep existing data)
    console.log('🗑️  Clearing existing store locations...');
    const { error: deleteError } = await supabase
      .from('store_locations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn('⚠️  Could not clear existing data:', deleteError.message);
    }

    // Insert new locations
    console.log('📥 Inserting store locations...');
    const { data, error } = await supabase
      .from('store_locations')
      .insert(storeLocations)
      .select();

    if (error) {
      console.error('❌ Error inserting stores:', error);
      throw error;
    }

    console.log(`\n✅ Successfully seeded ${data.length} store locations!\n`);

    // Show summary by retailer
    const summary = storeLocations.reduce((acc, store) => {
      acc[store.retailer] = (acc[store.retailer] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Summary by retailer:');
    Object.entries(summary).forEach(([retailer, count]) => {
      console.log(`   ${retailer}: ${count} locations`);
    });

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    process.exit(1);
  }
}

// Run the seed
seedStores();
