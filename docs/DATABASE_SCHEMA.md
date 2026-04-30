# CTM Smart Pickup - Database Schema

## Overview

This project uses **PostgreSQL via Supabase**. You must create your own Supabase project and set up these tables manually through the Supabase Dashboard.

---

## Step 1: Create Your Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Give it a name (e.g., `ctm-smart-pickup`)
4. Choose a region close to your users
5. Set a secure database password (save it!)
6. Wait for the project to be created

---

## Step 2: Get Your API Keys

Once your project is ready:

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:
   - **URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_KEY` (keep this secret!)

3. Paste them into your backend `.env` file

---

## Step 3: Create Tables

Go to **Table Editor** in Supabase Dashboard and create these tables:

### Table 1: `users`

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | Primary Key, Default: `gen_random_uuid()` |
| email | text | Unique, Not Null |
| password_hash | text | Not Null |
| full_name | text | Not Null |
| phone | text | Nullable |
| role | text | Not Null, Check: `role IN ('admin', 'dispatcher', 'driver')` |
| status | text | Default: 'active', Check: `status IN ('active', 'inactive', 'suspended')` |
| created_at | timestamptz | Default: `now()` |

**Enable RLS (Row Level Security):** Yes

---

### Table 2: `drivers`

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | Primary Key, Default: `gen_random_uuid()` |
| user_id | uuid | Foreign Key → `users(id)`, Not Null |
| vehicle_type | text | Not Null |
| vehicle_plate | text | Not Null |
| license_number | text | Nullable |
| status | text | Default: 'offline', Check: `status IN ('available', 'busy', 'offline')` |
| is_online | boolean | Default: false |
| current_location | jsonb | Nullable |
| rating | numeric | Default: 0 |
| total_rides | integer | Default: 0 |
| created_at | timestamptz | Default: `now()` |

---

### Table 3: `passengers`

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | Primary Key, Default: `gen_random_uuid()` |
| user_id | uuid | Foreign Key → `users(id)`, Not Null |
| home_address | text | Nullable |
| work_address | text | Nullable |
| total_rides | integer | Default: 0 |
| rating | numeric | Default: 0 |
| created_at | timestamptz | Default: `now()` |

---

### Table 4: `rides`

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | Primary Key, Default: `gen_random_uuid()` |
| ride_number | text | Unique, Not Null |
| passenger_id | uuid | Foreign Key → `passengers(id)`, Not Null |
| driver_id | uuid | Foreign Key → `drivers(id)`, Nullable |
| pickup_location | text | Not Null |
| dropoff_location | text | Not Null |
| pickup_lat | numeric | Nullable |
| pickup_lng | numeric | Nullable |
| dropoff_lat | numeric | Nullable |
| dropoff_lng | numeric | Nullable |
| status | text | Default: 'pending', Check: `status IN ('pending', 'assigned', 'picked_up', 'in_progress', 'completed', 'cancelled')` |
| estimated_fare | numeric | Nullable |
| actual_fare | numeric | Nullable |
| notes | text | Nullable |
| cancellation_reason | text | Nullable |
| created_by | uuid | Foreign Key → `users(id)` |
| assigned_at | timestamptz | Nullable |
| picked_up_at | timestamptz | Nullable |
| completed_at | timestamptz | Nullable |
| cancelled_at | timestamptz | Nullable |
| created_at | timestamptz | Default: `now()` |

---

## Step 4: Create Your First Admin User

After creating the tables, insert your first admin user via the Supabase SQL Editor:

```sql
-- First, generate a bcrypt hash of your password
-- You can use an online bcrypt generator or Node.js
-- For password "password123", the hash is approximately:
-- $2a$10$... (generate your own!)

-- Insert admin user (replace the password_hash with your actual bcrypt hash)
INSERT INTO users (email, password_hash, full_name, phone, role, status)
VALUES (
  'admin@ctm.com',
  '$2a$10$YourBcryptHashHere',
  'System Administrator',
  '+1234567890',
  'admin',
  'active'
);
```

**To generate a bcrypt hash in Node.js:**
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

---

## Step 5: Row Level Security (RLS) Policies (Optional but Recommended)

For security, enable RLS and add policies. This is optional for testing but required for production.

Go to **Authentication** → **Policies** in Supabase Dashboard for each table.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Supabase credentials missing" | Check your `.env` file has correct URL and keys |
| "Failed to create user" | Check table columns match exactly |
| "Foreign key violation" | Make sure referenced records exist first |
| "Permission denied" | Check RLS policies or use service_role key |

---

## Next Steps

After database setup:
1. Run the backend: `cd backend && npm install && npm run dev`
2. Run the frontend: `cd frontend && npm install && npm start`
3. Login with your admin credentials
4. Start creating rides!
