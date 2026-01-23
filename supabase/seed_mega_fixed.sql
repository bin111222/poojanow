-- ============================================================
-- PoojaNow / Supabase Seed Script (PostgreSQL) - FIXED VERSION
-- - Drops selected FKs temporarily (for fake dev data)
-- - Truncates tables with CASCADE
-- - Seeds 80 temples, 80 pandits, and services for every temple
-- - Uses DO $$ ... $$ blocks + loops + uuid_generate_v4()
-- ============================================================

-- 0) Ensure uuid-ossp exists (needed for uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop helper functions if they exist (to avoid conflicts)
DROP FUNCTION IF EXISTS pick(text[]);
DROP FUNCTION IF EXISTS pick_langs();
DROP FUNCTION IF EXISTS pick_specs();
DROP FUNCTION IF EXISTS slugify(text);

-- Helper functions (must be created BEFORE the DO block)
CREATE FUNCTION pick(arr text[]) RETURNS text AS $$
BEGIN
  RETURN arr[1 + floor(random() * array_length(arr, 1))::int];
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION pick_langs() RETURNS text[] AS $$
DECLARE
  r float := random();
BEGIN
  IF r < 0.25 THEN
    RETURN ARRAY['Hindi','Sanskrit'];
  ELSIF r < 0.55 THEN
    RETURN ARRAY['Hindi','Sanskrit','English'];
  ELSIF r < 0.8 THEN
    RETURN ARRAY['Hindi','Marathi','Sanskrit'];
  ELSE
    RETURN ARRAY['Hindi','English'];
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION pick_specs() RETURNS text[] AS $$
DECLARE
  r float := random();
BEGIN
  IF r < 0.2 THEN
    RETURN ARRAY['Grah Shanti','Jaap','Havan'];
  ELSIF r < 0.45 THEN
    RETURN ARRAY['Satyanarayan Katha','Lakshmi Pooja','Housewarming'];
  ELSIF r < 0.7 THEN
    RETURN ARRAY['Rudrabhishek','Maha Mrityunjaya','Shiv Pooja'];
  ELSE
    RETURN ARRAY['Navagraha','Vastu','Muhurta'];
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION slugify(input_text text) RETURNS text AS $$
DECLARE
  result text;
BEGIN
  result := lower(input_text);
  result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
  result := regexp_replace(result, '(^-+|-+$)', '', 'g');
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 1) Temporarily drop the two FK constraints
ALTER TABLE pandit_profiles DROP CONSTRAINT IF EXISTS pandit_profiles_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2) Delete all existing data
TRUNCATE TABLE
  services,
  pandit_profiles,
  temples,
  profiles
CASCADE;

-- 3) Seed data
DO $$
DECLARE
  v_admin_id uuid := uuid_generate_v4();

  -- Counts
  v_temple_count  int := 80;
  v_pandit_count  int := 80;

  -- Loop vars
  i int;
  j int;

  -- Temple fields
  v_temple_id uuid;
  v_temple_name text;
  v_temple_slug text;
  v_city text;
  v_state text;
  v_deity text;
  v_desc text;
  v_address text;
  v_lat numeric;
  v_lng numeric;
  v_hero_url text;

  -- Pandit fields
  v_pandit_id uuid;
  v_first text;
  v_last text;
  v_full_name text;
  v_email text;
  v_phone text;
  v_bio text;
  v_langs text[];
  v_specs text[];
  v_profile_img text;
  v_home_city text;
  v_home_state text;
  v_assign_temple_id uuid;

  -- Service fields
  v_service_type text;
  v_service_title text;
  v_service_desc text;
  v_duration int;
  v_price int;

  -- Pools
  cities text[] := ARRAY[
    'Varanasi','Rishikesh','Haridwar','Mathura','Ayodhya','Ujjain','Nashik','Puri','Dwarka','Tirupati',
    'Prayagraj','Vrindavan','Kanchipuram','Madurai','Thanjavur','Guwahati','Shillong','Jammu','Amritsar','Jaipur',
    'Pushkar','Bhubaneswar','Gaya','Badrinath','Kedarnath','Gangotri','Yamunotri','Srinagar','Mysuru','Pune',
    'Mumbai','Ahmedabad','Indore','Lucknow','Patna','Ranchi','Raipur','Kolkata','Chennai','Hyderabad',
    'Bengaluru','Kochi','Thiruvananthapuram'
  ];

  states text[] := ARRAY[
    'Uttar Pradesh','Uttarakhand','Gujarat','Madhya Pradesh','Maharashtra','Odisha','Andhra Pradesh','Tamil Nadu',
    'Rajasthan','Punjab','Bihar','Karnataka','Kerala','Telangana','West Bengal','Assam','Jammu and Kashmir',
    'Chhattisgarh','Jharkhand'
  ];

  deities text[] := ARRAY['Shiva','Krishna','Durga','Ganesh','Ram','Vishnu','Hanuman'];

  temple_prefix text[] := ARRAY[
    'Shri','Shree','Sri','Mahadev','Mahakaleshwar','Kashi','Trimbakeshwar','Jagannath','Somnath','Badrinath',
    'Kedarnath','Raghunath','Krittivasa','Chamundeshwari','Meenakshi','Ekambareswarar','Govind','Gopinath',
    'Balaji','Rameshwaram'
  ];

  temple_suffix text[] := ARRAY[
    'Mandir','Temple','Dham','Peeth','Kshetra','Devasthan','Mahadev Mandir','Shakti Peeth','Kovil'
  ];

  last_names text[] := ARRAY['Sharma','Mishra','Tiwari','Joshi','Dubey','Pandey','Shukla','Bhat','Upadhyay','Pathak'];
  first_names text[] := ARRAY[
    'Amit','Rohit','Suresh','Ramesh','Vikram','Ankit','Prakash','Dinesh','Mahesh','Gaurav',
    'Shivam','Kunal','Abhishek','Nitin','Rajesh','Manish','Kartik','Mohan','Pankaj','Arun'
  ];

  bio_lines text[] := ARRAY[
    'Trained in Vedic rituals with a focus on sankalp, shuddhi, and precise mantra uccharan.',
    'Known for calm guidance, clear explanations, and a traditional yet practical approach.',
    'Specializes in homam, grah shanti, and family sankalp poojas with step by step support.',
    'Conducts ceremonies with authenticity, punctuality, and attention to samagri details.',
    'Experienced in online consultations and remote pooja coordination for families worldwide.'
  ];

  temple_desc_lines text[] := ARRAY[
    'A revered spiritual site known for daily aarti, traditional rituals, and a peaceful sanctum.',
    'Pilgrims visit year round for darshan, prasad, and a deeply devotional atmosphere.',
    'Famous for its heritage architecture, sacred timings, and community celebrations.',
    'A temple with strong local significance, welcoming devotees for pooja and guided rituals.',
    'Known for festivals, aarti traditions, and a serene experience for families and elders.'
  ];

  service_titles_pooja text[] := ARRAY[
    'Sankalp Pooja','Grah Shanti Pooja','Maha Mrityunjaya Jaap','Satyanarayan Katha',
    'Lakshmi Pooja','Durga Saptashati Path','Hanuman Chalisa Path','Rudrabhishek',
    'Navagraha Pooja','Vishnu Sahasranama Path'
  ];

  service_titles_consult text[] := ARRAY[
    'Pandit Consultation','Muhurta Selection','Pooja Planning Call','Dosha Guidance Session','Vastu Guidance'
  ];

  service_titles_darshan text[] := ARRAY[
    'Live Darshan','Aarti Live Stream','Special Darshan Slot','Festival Darshan','Sanctum View Darshan'
  ];

BEGIN
  -- 3A) Create one admin profile (created_by for temples)
  INSERT INTO profiles (id, full_name, email, phone, role, is_active)
  VALUES (
    v_admin_id,
    'Admin User',
    'admin@poojanow.in',
    '+91 90000 00000',
    'admin',
    true
  );

  -- 3B) Seed temples
  FOR i IN 1..v_temple_count LOOP
    v_temple_id := uuid_generate_v4();

    v_city  := pick(cities);
    v_state := pick(states);
    v_deity := pick(deities);

    v_temple_name :=
      pick(temple_prefix) || ' ' ||
      v_deity || ' ' ||
      pick(temple_suffix) || ' ' ||
      '(' || v_city || ')';

    v_temple_slug := slugify(v_temple_name) || '-' || lpad(i::text, 3, '0');

    v_desc := pick(temple_desc_lines) || ' Dedicated to ' || v_deity || '.';

    v_address := 'Near main bazaar, ' || v_city || ', ' || v_state || ', India';

    -- Rough India bounding box randomization for dev maps
    v_lat := round((8 + random() * 28)::numeric, 6);   -- 8 to 36
    v_lng := round((68 + random() * 30)::numeric, 6);  -- 68 to 98

    -- Unsplash images (temple)
    v_hero_url :=
      'https://images.unsplash.com/' ||
      (ARRAY[
        'photo-1548013146-72479768bada',
        'photo-1582550945154-66ea8fff25e1',
        'photo-1561361513-2d000a50f0dc',
        'photo-1605640840605-14ac1855827b',
        'photo-1604147706283-4904cddfce9a',
        'photo-1548013146-38a0f5bd2dbe'
      ])[1 + floor(random() * 6)::int] ||
      '?auto=format&fit=crop&q=80&w=1400';

    INSERT INTO temples (
      id, name, slug, city, state, country, deity, description, address,
      geo_lat, geo_lng, verified, status, hero_image_path, created_by
    )
    VALUES (
      v_temple_id, v_temple_name, v_temple_slug, v_city, v_state, 'India', v_deity,
      v_desc, v_address, v_lat, v_lng, true, 'published', v_hero_url, v_admin_id
    );

    -- 3C) For each temple: create 1 to 3 published services
    FOR j IN 1..(1 + floor(random() * 3)::int) LOOP
      IF random() < 0.6 THEN
        v_service_type  := 'pooja';
        v_service_title := pick(service_titles_pooja);
        v_duration      := (ARRAY[30,45,60,75,90,120])[1 + floor(random() * 6)::int];
        v_price         := (ARRAY[499,799,999,1499,1999,2499,2999])[1 + floor(random() * 7)::int];
        v_service_desc  := 'Includes sankalp, mantra, and guided rituals. Samagri list shared in advance.';
      ELSIF random() < 0.85 THEN
        v_service_type  := 'consult';
        v_service_title := pick(service_titles_consult);
        v_duration      := (ARRAY[15,20,30,45])[1 + floor(random() * 4)::int];
        v_price         := (ARRAY[199,299,399,499,699])[1 + floor(random() * 5)::int];
        v_service_desc  := 'Guidance on muhurta, procedure, and preparations. Clear next steps and checklist provided.';
      ELSE
        v_service_type  := 'live_darshan';
        v_service_title := pick(service_titles_darshan);
        v_duration      := (ARRAY[10,15,20,30])[1 + floor(random() * 4)::int];
        v_price         := (ARRAY[99,149,199,249,299])[1 + floor(random() * 5)::int];
        v_service_desc  := 'Live darshan experience with aarti view when available. Best effort timing based on temple schedule.';
      END IF;

      INSERT INTO services (
        id, service_type, title, description, duration_minutes, base_price_inr,
        temple_id, pandit_id, status
      )
      VALUES (
        uuid_generate_v4(),
        v_service_type,
        v_service_title,
        v_service_desc,
        v_duration,
        v_price,
        v_temple_id,
        NULL,
        'published'
      );
    END LOOP;

  END LOOP;

  -- 3D) Seed pandits
  FOR i IN 1..v_pandit_count LOOP
    v_pandit_id := uuid_generate_v4();

    v_first := pick(first_names);
    v_last  := pick(last_names);
    v_full_name := v_first || ' ' || v_last;

    v_email := lower(v_first || '.' || v_last || lpad(i::text, 3, '0') || '@poojanow.in');
    v_phone := '+91 ' ||
      (7000000000 + floor(random() * 999999999)::bigint)::text;

    v_bio := pick(bio_lines) || ' Comfortable with ' ||
             (ARRAY['in-person ceremonies','remote family coordination','quick consultations','festival services'])[1 + floor(random() * 4)::int] ||
             '.';

    v_langs := pick_langs();
    v_specs := pick_specs();

    v_home_city  := pick(cities);
    v_home_state := pick(states);

    -- pick a random existing temple
    SELECT id INTO v_assign_temple_id
    FROM temples
    ORDER BY random()
    LIMIT 1;

    v_profile_img :=
      'https://images.unsplash.com/' ||
      (ARRAY[
        'photo-1544723795-3fb6469f5b39',
        'photo-1520975916090-3105956dac38',
        'photo-1506794778202-cad84cf45f1d',
        'photo-1547425260-76bcadfb4f2c',
        'photo-1552058544-f2b08422138a'
      ])[1 + floor(random() * 5)::int] ||
      '?auto=format&fit=crop&q=80&w=900';

    INSERT INTO profiles (id, full_name, email, phone, role, is_active)
    VALUES (v_pandit_id, v_full_name, v_email, v_phone, 'pandit', true);

    INSERT INTO pandit_profiles (
      id, bio, languages, specialties, city, state, temple_id,
      verification_status, profile_status, profile_image_path
    )
    VALUES (
      v_pandit_id,
      v_bio,
      v_langs,
      v_specs,
      v_home_city,
      v_home_state,
      v_assign_temple_id,
      'verified',
      'published',
      v_profile_img
    );

  END LOOP;

  -- 3E) Assign services to pandits
  UPDATE services s
  SET pandit_id = p.id
  FROM pandit_profiles pp
  JOIN profiles p ON p.id = pp.id
  WHERE s.pandit_id IS NULL
    AND pp.temple_id = s.temple_id
    AND p.role = 'pandit'
    AND p.is_active = true;

  -- Fallback: if any services still have NULL pandit_id, assign any available pandit
  -- (For seed data, it's okay if multiple services share the same pandit)
  UPDATE services
  SET pandit_id = (
    SELECT p.id
    FROM profiles p
    WHERE p.role = 'pandit'
    LIMIT 1
  )
  WHERE pandit_id IS NULL;

END $$;

-- 4) Optionally re-add constraints (safe attempt)
DO $$
BEGIN
  -- Re-add pandit_profiles.id -> profiles.id
  BEGIN
    ALTER TABLE pandit_profiles
      ADD CONSTRAINT pandit_profiles_id_fkey
      FOREIGN KEY (id) REFERENCES profiles(id);
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Could not re-add pandit_profiles_id_fkey (likely already exists or dependency issue): %', SQLERRM;
  END;

  -- Re-add profiles.id -> auth.users(id) (Supabase)
  BEGIN
    ALTER TABLE profiles
      ADD CONSTRAINT profiles_id_fkey
      FOREIGN KEY (id) REFERENCES auth.users(id);
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Could not re-add profiles_id_fkey (expected if auth.users does not have these fake ids): %', SQLERRM;
  END;
END $$;

-- 5) Quick sanity checks (optional)
-- SELECT role, count(*) FROM profiles GROUP BY role ORDER BY role;
-- SELECT status, count(*) FROM temples GROUP BY status;
-- SELECT status, count(*) FROM services GROUP BY status;
-- SELECT verification_status, profile_status, count(*) FROM pandit_profiles GROUP BY verification_status, profile_status;

