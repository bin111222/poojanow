# ChatGPT Prompt for Database Seed Script

Copy and paste this prompt to ChatGPT:

---

I need a PostgreSQL seed script that will:
1. Delete all existing data from my database tables
2. Populate new seed data

Here's my database schema:

**Table: profiles**
- id (uuid, primary key, references auth.users(id))
- full_name (text)
- email (text)
- phone (text)
- role (text, check: 'user', 'pandit', 'admin')
- is_active (boolean, default true)
- created_at (timestamptz, default now())

**Table: temples**
- id (uuid, primary key, default uuid_generate_v4())
- name (text, not null)
- slug (text, unique, not null)
- city (text)
- state (text)
- country (text, default 'India')
- deity (text)
- description (text)
- address (text)
- geo_lat (numeric)
- geo_lng (numeric)
- verified (boolean, default false)
- status (text, check: 'draft', 'published', 'suspended', default 'draft')
- hero_image_path (text)
- created_by (uuid, references profiles(id))
- created_at (timestamptz, default now())

**Table: pandit_profiles**
- id (uuid, primary key, references profiles(id))
- bio (text)
- languages (text[], default '{}')
- specialties (text[], default '{}')
- city (text)
- state (text)
- temple_id (uuid, references temples(id))
- verification_status (text, check: 'pending', 'verified', 'rejected', default 'pending')
- profile_status (text, check: 'draft', 'published', 'suspended', default 'draft')
- profile_image_path (text)
- created_at (timestamptz, default now())

**Table: services**
- id (uuid, primary key, default uuid_generate_v4())
- service_type (text, check: 'live_darshan', 'pooja', 'consult', default 'pooja')
- title (text, not null)
- description (text)
- duration_minutes (int)
- base_price_inr (int)
- temple_id (uuid, references temples(id))
- pandit_id (uuid, references profiles(id))
- status (text, check: 'draft', 'published', 'suspended', default 'draft')
- created_at (timestamptz, default now())

**Requirements:**
1. The script must use `TRUNCATE TABLE ... CASCADE` to delete all existing data in the correct order (respecting foreign key dependencies)
2. Since I'm using fake data for development, I need to temporarily drop foreign key constraints:
   - `ALTER TABLE pandit_profiles DROP CONSTRAINT IF EXISTS pandit_profiles_id_fkey;`
   - `ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;`
3. Generate realistic Indian temple and pandit data:
   - 50-100 temples with Indian names, cities, deities (Shiva, Krishna, Durga, Ganesh, Ram, Vishnu, Hanuman)
   - 50-100 pandits with Indian names (Sharma, Mishra, Tiwari, Joshi, Dubey, Pandey, Shukla, Bhat)
   - All pandits should have `verification_status = 'verified'` and `profile_status = 'published'`
   - All temples should have `status = 'published'`
   - Use realistic Indian cities: Varanasi, Rishikesh, Haridwar, Mathura, Ayodhya, Ujjain, Nashik, Puri, Dwarka, Tirupati, etc.
4. For each temple, create at least one service with `status = 'published'`
5. Use PostgreSQL's `DO $$ ... END $$;` blocks with loops to generate the data
6. Use `uuid_generate_v4()` for generating UUIDs
7. For arrays (languages, specialties), use PostgreSQL array syntax: `ARRAY['Hindi', 'Sanskrit', 'English']`
8. Include realistic bios, descriptions, and image URLs (use Unsplash URLs for images)
9. Make sure the script handles the relationship: profiles -> pandit_profiles (same id), and temples -> services

**Output format:**
Provide a complete SQL script that I can run directly in PostgreSQL/Supabase. Include comments explaining each section.

---

