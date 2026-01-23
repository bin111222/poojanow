-- MEGA SEED SCRIPT: 100 Temples & 100 Pandits
-- WARNING: This modifies constraints to allow "fake" pandits. Use only in DEV.

-- 1. CLEANUP
truncate table bookings cascade;
truncate table streams cascade;
truncate table services cascade;
truncate table pandit_profiles cascade;
truncate table temples cascade;

-- 2. DISABLE FOREIGN KEY CHECKS (To allow fake pandits without auth users)
ALTER TABLE pandit_profiles DROP CONSTRAINT IF EXISTS pandit_profiles_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. GENERATE 100 TEMPLES
DO $$
DECLARE
  i integer;
  cities text[] := ARRAY['Varanasi', 'Rishikesh', 'Haridwar', 'Mathura', 'Ayodhya', 'Ujjain', 'Nashik', 'Puri', 'Dwarka', 'Tirupati'];
  deities text[] := ARRAY['Lord Shiva', 'Lord Krishna', 'Goddess Durga', 'Lord Ganesh', 'Lord Ram', 'Lord Vishnu', 'Hanumanji'];
  temple_names text[] := ARRAY['Mandir', 'Dham', 'Temple', 'Shrine', 'Bhavan', 'Peeth'];
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO temples (name, slug, city, state, deity, description, status, verified, hero_image_path)
    VALUES (
      'Shri ' || deities[1 + (i % array_length(deities, 1))] || ' ' || temple_names[1 + (i % array_length(temple_names, 1))] || ' ' || i,
      'temple-' || i,
      cities[1 + (i % array_length(cities, 1))],
      'India',
      deities[1 + (i % array_length(deities, 1))],
      'A sacred place of worship dedicated to ' || deities[1 + (i % array_length(deities, 1))] || '. Known for its peaceful atmosphere and daily rituals.',
      'published',
      (i % 3 = 0), -- Mark every 3rd as verified
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1000'
    );
  END LOOP;
END $$;

-- 4. GENERATE 100 FAKE PROFILES & PANDITS
DO $$
DECLARE
  i integer;
  fake_id uuid;
  first_names text[] := ARRAY['Acharya', 'Pandit', 'Shastri', 'Swami', 'Guru'];
  last_names text[] := ARRAY['Sharma', 'Mishra', 'Tiwari', 'Joshi', 'Dubey', 'Pandey', 'Shukla', 'Bhat'];
  cities text[] := ARRAY['Varanasi', 'Rishikesh', 'Haridwar', 'Mathura', 'Ayodhya', 'Ujjain', 'Nashik', 'Pune', 'Bangalore', 'Delhi'];
BEGIN
  FOR i IN 1..100 LOOP
    fake_id := uuid_generate_v4();
    
    -- Insert Fake Profile (Needed for joins)
    INSERT INTO profiles (id, full_name, email, role)
    VALUES (
      fake_id,
      first_names[1 + (i % array_length(first_names, 1))] || ' ' || last_names[1 + (i % array_length(last_names, 1))] || ' ' || i,
      'pandit' || i || '@poojanow.dev',
      'pandit'
    );

    -- Insert Pandit Profile
    INSERT INTO pandit_profiles (id, bio, city, state, verification_status, profile_status, specialties, languages, profile_image_path)
    VALUES (
      fake_id,
      'Experienced Vedic scholar specializing in traditional rituals and ceremonies. Serving the community for over 10 years.',
      cities[1 + (i % array_length(cities, 1))],
      'India',
      'verified',
      'published',
      ARRAY['Rudrabhishek', 'Vastu Shanti', 'Griha Pravesh', 'Vivah Sanskar'],
      ARRAY['Hindi', 'Sanskrit', 'English'],
      'https://images.unsplash.com/photo-1595255362536-2e633c7c2c4c?auto=format&fit=crop&q=80&w=1000'
    );
  END LOOP;
END $$;

-- 5. GENERATE SERVICES FOR TEMPLES (To make them bookable)
INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id)
SELECT 
  'Daily Pooja Ritual', 
  'Standard daily pooja performed with devotion.', 
  30, 
  501, 
  'pooja', 
  'published', 
  id 
FROM temples;


