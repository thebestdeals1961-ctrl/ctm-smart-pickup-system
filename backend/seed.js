/**
 * Database Seed Script
 * Run this to populate your Supabase database with demo data
 * 
 * Usage: node seed.js
 * Make sure .env is configured first!
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // 1. Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .insert([{
        email: 'admin@ctm.com',
        password_hash: adminPassword,
        full_name: 'System Administrator',
        phone: '+1-555-0100',
        role: 'admin',
        status: 'active'
      }])
      .select()
      .single();

    if (adminError) throw adminError;
    console.log('✅ Admin user created:', admin.email);

    // 2. Create dispatcher user
    const dispatcherPassword = await bcrypt.hash('dispatcher123', 10);
    const { data: dispatcher, error: dispError } = await supabase
      .from('users')
      .insert([{
        email: 'dispatcher@ctm.com',
        password_hash: dispatcherPassword,
        full_name: 'Jane Dispatcher',
        phone: '+1-555-0101',
        role: 'dispatcher',
        status: 'active'
      }])
      .select()
      .single();

    if (dispError) throw dispError;
    console.log('✅ Dispatcher user created:', dispatcher.email);

    // 3. Create driver users
    const driverPassword = await bcrypt.hash('driver123', 10);

    const driverUsers = [
      { email: 'driver1@ctm.com', full_name: 'John Driver', phone: '+1-555-0201' },
      { email: 'driver2@ctm.com', full_name: 'Sarah Driver', phone: '+1-555-0202' },
      { email: 'driver3@ctm.com', full_name: 'Mike Driver', phone: '+1-555-0203' }
    ];

    const { data: drivers, error: driverUsersError } = await supabase
      .from('users')
      .insert(driverUsers.map(d => ({
        email: d.email,
        password_hash: driverPassword,
        full_name: d.full_name,
        phone: d.phone,
        role: 'driver',
        status: 'active'
      })))
      .select();

    if (driverUsersError) throw driverUsersError;
    console.log('✅ Driver users created:', drivers.length);

    // 4. Create driver profiles
    const driverProfiles = [
      { user_id: drivers[0].id, vehicle_type: 'Sedan', vehicle_plate: 'ABC-1234', license_number: 'DL001' },
      { user_id: drivers[1].id, vehicle_type: 'SUV', vehicle_plate: 'XYZ-5678', license_number: 'DL002' },
      { user_id: drivers[2].id, vehicle_type: 'Van', vehicle_plate: 'DEF-9012', license_number: 'DL003' }
    ];

    const { data: driverProfilesData, error: profileError } = await supabase
      .from('drivers')
      .insert(driverProfiles)
      .select();

    if (profileError) throw profileError;
    console.log('✅ Driver profiles created:', driverProfilesData.length);

    // 5. Create passenger users
    const passengerPassword = await bcrypt.hash('passenger123', 10);

    const passengerUsers = [
      { email: 'passenger1@ctm.com', full_name: 'Alice Passenger', phone: '+1-555-0301' },
      { email: 'passenger2@ctm.com', full_name: 'Bob Passenger', phone: '+1-555-0302' },
      { email: 'passenger3@ctm.com', full_name: 'Carol Passenger', phone: '+1-555-0303' }
    ];

    const { data: passengers, error: passengerUsersError } = await supabase
      .from('users')
      .insert(passengerUsers.map(p => ({
        email: p.email,
        password_hash: passengerPassword,
        full_name: p.full_name,
        phone: p.phone,
        role: 'dispatcher', // Passengers use dispatcher role for now (or you can add 'passenger' role)
        status: 'active'
      })))
      .select();

    if (passengerUsersError) throw passengerUsersError;
    console.log('✅ Passenger users created:', passengers.length);

    // 6. Create passenger profiles
    const passengerProfiles = [
      { user_id: passengers[0].id, home_address: '123 Main St, Downtown', work_address: '456 Business Ave' },
      { user_id: passengers[1].id, home_address: '789 Oak Rd, Uptown', work_address: '321 Commerce St' },
      { user_id: passengers[2].id, home_address: '555 Pine Ln, Midtown', work_address: '888 Corporate Blvd' }
    ];

    const { data: passengerProfilesData, error: passengerProfileError } = await supabase
      .from('passengers')
      .insert(passengerProfiles)
      .select();

    if (passengerProfileError) throw passengerProfileError;
    console.log('✅ Passenger profiles created:', passengerProfilesData.length);

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Admin:      admin@ctm.com / admin123');
    console.log('  Dispatcher: dispatcher@ctm.com / dispatcher123');
    console.log('  Driver:     driver1@ctm.com / driver123');
    console.log('  Passenger:  passenger1@ctm.com / passenger123');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
