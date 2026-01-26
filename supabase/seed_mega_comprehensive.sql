-- ============================================================
-- PoojaNow / Supabase Comprehensive Seed Script
-- BLASTS THE SITE WITH MOCK DATA
-- - 150+ temples with full booking routes
-- - 200+ pandits
-- - Multiple services per temple (at least one active per temple)
-- - Offerings for each temple
-- - Bookings (completed, pending, in-progress)
-- - Live streams
-- - Events
-- - Availability slots
-- ============================================================

-- 0) Ensure uuid-ossp exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop helper functions if they exist
DROP FUNCTION IF EXISTS pick(text[]);
DROP FUNCTION IF EXISTS pick_langs();
DROP FUNCTION IF EXISTS pick_specs();
DROP FUNCTION IF EXISTS slugify(text);
DROP FUNCTION IF EXISTS random_date(date, date);
DROP FUNCTION IF EXISTS random_timestamp(date, date);

-- Helper functions
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
    RETURN ARRAY['Hindi','English','Tamil'];
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

CREATE FUNCTION random_date(start_date date, end_date date) RETURNS date AS $$
BEGIN
  RETURN start_date + (random() * (end_date - start_date))::int;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION random_timestamp(start_date date, end_date date) RETURNS timestamptz AS $$
BEGIN
  RETURN (start_date + (random() * (end_date - start_date))::int)::timestamp + 
         (random() * interval '1 day');
END;
$$ LANGUAGE plpgsql;

-- 1) Temporarily drop FK constraints
ALTER TABLE pandit_profiles DROP CONSTRAINT IF EXISTS pandit_profiles_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;

-- 2) Delete all existing data
TRUNCATE TABLE
  booking_offerings,
  booking_proofs,
  payments,
  bookings,
  availability_slots,
  events,
  streams,
  offerings,
  services,
  pandit_profiles,
  temples,
  profiles
CASCADE;

-- 3) Seed data
DO $$
DECLARE
  v_admin_id uuid := uuid_generate_v4();
  v_test_user_id uuid := uuid_generate_v4();

  -- Counts
  v_temple_count  int := 150;
  v_pandit_count  int := 200;
  v_booking_count int := 500;
  v_stream_count  int := 50;
  v_event_count   int := 100;

  -- Loop vars
  i int;
  j int;
  k int;

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
  v_service_id uuid;
  v_service_type text;
  v_service_title text;
  v_service_desc text;
  v_duration int;
  v_price int;
  v_is_active boolean;
  v_pooja_explanation text;

  -- Offering fields
  v_offering_id uuid;
  v_offering_title text;
  v_offering_desc text;
  v_offering_price int;

  -- Booking fields
  v_booking_id uuid;
  v_user_id uuid;
  v_service_id_for_booking uuid;
  v_pandit_id_for_booking uuid;
  v_temple_id_for_booking uuid;
  v_booking_status text;
  v_scheduled_start timestamptz;
  v_scheduled_end timestamptz;
  v_total_amount int;

  -- Stream fields
  v_stream_id uuid;
  v_stream_title text;
  v_stream_type text;
  v_stream_status text;

  -- Event fields
  v_event_id uuid;
  v_event_title text;
  v_event_desc text;
  v_start_date date;
  v_end_date date;

  -- Data pools
  cities text[] := ARRAY[
    'Varanasi','Rishikesh','Haridwar','Mathura','Ayodhya','Ujjain','Nashik','Puri','Dwarka','Tirupati',
    'Prayagraj','Vrindavan','Kanchipuram','Madurai','Thanjavur','Guwahati','Shillong','Jammu','Amritsar','Jaipur',
    'Pushkar','Bhubaneswar','Gaya','Badrinath','Kedarnath','Gangotri','Yamunotri','Srinagar','Mysuru','Pune',
    'Mumbai','Ahmedabad','Indore','Lucknow','Patna','Ranchi','Raipur','Kolkata','Chennai','Hyderabad',
    'Bengaluru','Kochi','Thiruvananthapuram','Surat','Nagpur','Vadodara','Coimbatore','Visakhapatnam','Agra','Allahabad'
  ];

  states text[] := ARRAY[
    'Uttar Pradesh','Uttarakhand','Gujarat','Madhya Pradesh','Maharashtra','Odisha','Andhra Pradesh','Tamil Nadu',
    'Rajasthan','Punjab','Bihar','Karnataka','Kerala','Telangana','West Bengal','Assam','Jammu and Kashmir',
    'Chhattisgarh','Jharkhand','Himachal Pradesh','Haryana','Delhi'
  ];

  deities text[] := ARRAY['Shiva','Krishna','Durga','Ganesh','Ram','Vishnu','Hanuman','Lakshmi','Saraswati','Kartikeya'];

  temple_prefix text[] := ARRAY[
    'Shri','Shree','Sri','Mahadev','Mahakaleshwar','Kashi','Trimbakeshwar','Jagannath','Somnath','Badrinath',
    'Kedarnath','Raghunath','Krittivasa','Chamundeshwari','Meenakshi','Ekambareswarar','Govind','Gopinath',
    'Balaji','Rameshwaram','Venkateswara','Padmanabha','Guruvayur','Sabarimala','Vaishno Devi','Kamakhya'
  ];

  temple_suffix text[] := ARRAY[
    'Mandir','Temple','Dham','Peeth','Kshetra','Devasthan','Mahadev Mandir','Shakti Peeth','Kovil','Alayam'
  ];

  last_names text[] := ARRAY['Sharma','Mishra','Tiwari','Joshi','Dubey','Pandey','Shukla','Bhat','Upadhyay','Pathak','Acharya','Dwivedi'];
  first_names text[] := ARRAY[
    'Amit','Rohit','Suresh','Ramesh','Vikram','Ankit','Prakash','Dinesh','Mahesh','Gaurav',
    'Shivam','Kunal','Abhishek','Nitin','Rajesh','Manish','Kartik','Mohan','Pankaj','Arun',
    'Vishal','Sachin','Rahul','Ajay','Nikhil','Deepak','Sunil','Ravi','Kiran','Sandeep'
  ];

  bio_lines text[] := ARRAY[
    'Trained in Vedic rituals with a focus on sankalp, shuddhi, and precise mantra uccharan.',
    'Known for calm guidance, clear explanations, and a traditional yet practical approach.',
    'Specializes in homam, grah shanti, and family sankalp poojas with step by step support.',
    'Conducts ceremonies with authenticity, punctuality, and attention to samagri details.',
    'Experienced in online consultations and remote pooja coordination for families worldwide.',
    'Expert in temple rituals, daily aarti, and festival celebrations with deep spiritual knowledge.',
    'Practicing Vedic scholar with 20+ years of experience in traditional pooja ceremonies.'
  ];

  temple_desc_lines text[] := ARRAY[
    'A revered spiritual site known for daily aarti, traditional rituals, and a peaceful sanctum.',
    'Pilgrims visit year round for darshan, prasad, and a deeply devotional atmosphere.',
    'Famous for its heritage architecture, sacred timings, and community celebrations.',
    'A temple with strong local significance, welcoming devotees for pooja and guided rituals.',
    'Known for festivals, aarti traditions, and a serene experience for families and elders.',
    'Historic temple with centuries of tradition, attracting devotees from across the country.',
    'Sacred shrine with powerful spiritual energy, known for fulfilling prayers and wishes.'
  ];

  service_titles_pooja text[] := ARRAY[
    'Rudrabhishek','Sankalp Pooja','Grah Shanti Pooja','Maha Mrityunjaya Jaap','Satyanarayan Katha',
    'Lakshmi Pooja','Durga Saptashati Path','Hanuman Chalisa Path','Navagraha Pooja','Vishnu Sahasranama Path',
    'Ganesh Chaturthi Pooja','Shiv Pooja','Krishna Janmashtami Pooja','Diwali Pooja','Holi Pooja'
  ];

  service_titles_consult text[] := ARRAY[
    'Pandit Consultation','Muhurta Selection','Pooja Planning Call','Dosha Guidance Session','Vastu Guidance',
    'Horoscope Reading','Marriage Muhurta','Griha Pravesh Consultation'
  ];

  service_titles_darshan text[] := ARRAY[
    'Live Darshan','Aarti Live Stream','Special Darshan Slot','Festival Darshan','Sanctum View Darshan',
    'Morning Aarti Darshan','Evening Aarti Darshan'
  ];

  offering_titles text[] := ARRAY[
    'Flowers','Coconut','Fruits','Sweets','Incense Sticks','Camphor','Ghee Lamp','Sandalwood Paste',
    'Tulsi Leaves','Betel Leaves','Rice','Turmeric','Kumkum','Red Cloth','Yellow Cloth'
  ];

  pooja_explanations text[] := ARRAY[
    'Rudrabhishek is a powerful Vedic ritual dedicated to Lord Shiva. The pooja involves the ceremonial bathing (abhishek) of the Shiva Lingam with sacred substances including milk, curd, ghee, honey, sugar, and water. This ritual is performed to seek blessings, remove obstacles, and bring peace and prosperity. The chanting of Rudram and Chamakam mantras during the pooja amplifies its spiritual significance.',
    'Sankalp Pooja is a sacred ceremony where devotees make a solemn vow (sankalp) to perform specific rituals or prayers. This pooja sets the intention and creates a spiritual commitment, ensuring the proper completion of religious observances with divine blessings.',
    'Grah Shanti Pooja is performed to pacify the malefic effects of planets in one''s horoscope. This ritual helps in reducing negative planetary influences and brings harmony, peace, and prosperity to the devotee''s life.',
    'Maha Mrityunjaya Jaap is a powerful mantra dedicated to Lord Shiva for protection, healing, and overcoming fear of death. This sacred chanting helps in removing obstacles and brings spiritual strength and longevity.',
    'Satyanarayan Katha is a popular religious discourse that narrates the story of Lord Vishnu. This ceremony is performed for prosperity, happiness, and fulfillment of wishes, often on auspicious occasions like full moon days.'
  ];

BEGIN
  -- 3A) Create admin and test user profiles
  INSERT INTO profiles (id, full_name, email, phone, role, is_active)
  VALUES 
    (v_admin_id, 'Admin User', 'admin@poojanow.in', '+91 90000 00000', 'admin', true),
    (v_test_user_id, 'Test User', 'user@poojanow.in', '+91 98765 43210', 'user', true);

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

    -- India bounding box
    v_lat := round((8 + random() * 28)::numeric, 6);
    v_lng := round((68 + random() * 30)::numeric, 6);

    -- Relevant Hindu temple images - using curated Unsplash photos
    v_hero_url :=
      'https://images.unsplash.com/' ||
      (ARRAY[
        'photo-1561361513-2d000a50f0dc',  -- Temple architecture
        'photo-1582550945154-66ea8fff25e1',  -- Temple exterior
        'photo-1605640840605-14ac1855827b',  -- Temple structure
        'photo-1548013146-72479768bada',  -- Temple facade
        'photo-1604147706283-4904cddfce9a',  -- Temple entrance
        'photo-1578662996442-0fdf301b8b57',  -- Temple interior
        'photo-1605648916277-93c8c0a1c0e8',  -- Temple courtyard
        'photo-1548013146-38a0f5bd2dbe',  -- Temple detail
        'photo-1561361513-2d000a50f0dc',  -- Temple architecture 2
        'photo-1582550945154-66ea8fff25e1',  -- Temple exterior 2
        'photo-1605640840605-14ac1855827b',  -- Temple structure 2
        'photo-1548013146-72479768bada'   -- Temple facade 2
      ])[1 + floor(random() * 12)::int] ||
      '?auto=format&fit=crop&q=80&w=1400&h=800';

    INSERT INTO temples (
      id, name, slug, city, state, country, deity, description, address,
      geo_lat, geo_lng, verified, status, hero_image_path, created_by
    )
    VALUES (
      v_temple_id, v_temple_name, v_temple_slug, v_city, v_state, 'India', v_deity,
      v_desc, v_address, v_lat, v_lng, 
      CASE WHEN random() < 0.8 THEN true ELSE false END, -- 80% verified
      'published', v_hero_url, v_admin_id
    );

    -- 3C) Create 2-5 services per temple (at least one active)
    v_is_active := true; -- First service is always active
    FOR j IN 1..(2 + floor(random() * 4)::int) LOOP
      v_service_id := uuid_generate_v4();
      
      IF random() < 0.6 THEN
        v_service_type  := 'pooja';
        v_service_title := pick(service_titles_pooja);
        v_duration      := (ARRAY[30,45,60,75,90,120])[1 + floor(random() * 6)::int];
        v_price         := (ARRAY[499,799,999,1499,1999,2499,2999])[1 + floor(random() * 7)::int];
        v_service_desc  := 'Includes sankalp, mantra, and guided rituals. Samagri list shared in advance.';
        IF v_service_title = 'Rudrabhishek' THEN
          v_pooja_explanation := pooja_explanations[1];
        ELSE
          v_pooja_explanation := pick(pooja_explanations);
        END IF;
      ELSIF random() < 0.85 THEN
        v_service_type  := 'consult';
        v_service_title := pick(service_titles_consult);
        v_duration      := (ARRAY[15,20,30,45])[1 + floor(random() * 4)::int];
        v_price         := (ARRAY[199,299,399,499,699])[1 + floor(random() * 5)::int];
        v_service_desc  := 'Guidance on muhurta, procedure, and preparations. Clear next steps and checklist provided.';
        v_pooja_explanation := NULL;
      ELSE
        v_service_type  := 'live_darshan';
        v_service_title := pick(service_titles_darshan);
        v_duration      := (ARRAY[10,15,20,30])[1 + floor(random() * 4)::int];
        v_price         := (ARRAY[99,149,199,249,299])[1 + floor(random() * 5)::int];
        v_service_desc  := 'Live darshan experience with aarti view when available. Best effort timing based on temple schedule.';
        v_pooja_explanation := NULL;
      END IF;

      INSERT INTO services (
        id, service_type, title, description, duration_minutes, base_price_inr,
        temple_id, pandit_id, status, is_active_single_pooja, pooja_explanation
      )
      VALUES (
        v_service_id,
        v_service_type,
        v_service_title,
        v_service_desc,
        v_duration,
        v_price,
        v_temple_id,
        NULL, -- Will assign later
        'published',
        v_is_active,
        v_pooja_explanation
      );

      v_is_active := false; -- Only first service is active
    END LOOP;

    -- 3D) Create 3-8 offerings per temple
    FOR j IN 1..(3 + floor(random() * 6)::int) LOOP
      v_offering_id := uuid_generate_v4();
      v_offering_title := pick(offering_titles);
      v_offering_desc := 'Traditional offering for ' || v_deity || ' pooja';
      v_offering_price := (ARRAY[50,100,150,200,250,300,500])[1 + floor(random() * 7)::int];

      INSERT INTO offerings (
        id, title, description, price_inr, temple_id, active, sort_order
      )
      VALUES (
        v_offering_id, v_offering_title, v_offering_desc, v_offering_price,
        v_temple_id, true, j
      );
    END LOOP;

  END LOOP;

  -- 3E) Seed pandits
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

    -- Assign to random temple
    SELECT id INTO v_assign_temple_id
    FROM temples
    ORDER BY random()
    LIMIT 1;

    -- Relevant images of Indian men/priests - using curated Unsplash photos
    v_profile_img :=
      'https://images.unsplash.com/' ||
      (ARRAY[
        'photo-1507003211169-0a1dd7228f2d',  -- Indian man portrait
        'photo-1506794778202-cad84cf45f1d',  -- Professional Indian man
        'photo-1547425260-76bcadfb4f2c',     -- Indian man formal
        'photo-1552058544-f2b08422138a',     -- Indian man professional
        'photo-1520975916090-3105956dac38',  -- Indian man portrait 2
        'photo-1544723795-3fb6469f5b39',     -- Professional portrait
        'photo-1500648767791-00dcc994a43e',  -- Indian man professional 2
        'photo-1519085360753-af0119f7cbe7',  -- Professional portrait 2
        'photo-1507003211169-0a1dd7228f2d',  -- Indian man formal 2
        'photo-1506794778202-cad84cf45f1d',  -- Professional headshot
        'photo-1547425260-76bcadfb4f2c',     -- Indian man portrait 3
        'photo-1552058544-f2b08422138a'      -- Indian man professional 3
      ])[1 + floor(random() * 12)::int] ||
      '?auto=format&fit=crop&q=80&w=900&h=900&facepad=2';

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
      CASE WHEN random() < 0.9 THEN 'verified' ELSE 'pending' END,
      CASE WHEN random() < 0.95 THEN 'published' ELSE 'draft' END,
      v_profile_img
    );

  END LOOP;

  -- 3F) Assign services to pandits
  UPDATE services s
  SET pandit_id = p.id
  FROM pandit_profiles pp
  JOIN profiles p ON p.id = pp.id
  WHERE s.pandit_id IS NULL
    AND pp.temple_id = s.temple_id
    AND p.role = 'pandit'
    AND p.is_active = true
    AND pp.profile_status = 'published';

  -- Fallback: assign any available pandit
  UPDATE services
  SET pandit_id = (
    SELECT p.id
    FROM profiles p
    JOIN pandit_profiles pp ON pp.id = p.id
    WHERE p.role = 'pandit'
      AND p.is_active = true
      AND pp.profile_status = 'published'
    ORDER BY random()
    LIMIT 1
  )
  WHERE pandit_id IS NULL;

  -- 3G) Create bookings
  FOR i IN 1..v_booking_count LOOP
    v_booking_id := uuid_generate_v4();
    
    -- Get random service
    SELECT s.id, s.temple_id, s.pandit_id, COALESCE(s.base_price_inr, 999), COALESCE(s.duration_minutes, 60)
    INTO v_service_id_for_booking, v_temple_id_for_booking, v_pandit_id_for_booking, v_total_amount, v_duration
    FROM services s
    WHERE s.status = 'published'
      AND s.is_active_single_pooja = true
    ORDER BY random()
    LIMIT 1;

    IF v_service_id_for_booking IS NULL THEN
      CONTINUE;
    END IF;

    -- Random status distribution
    v_booking_status := CASE 
      WHEN random() < 0.3 THEN 'completed'
      WHEN random() < 0.5 THEN 'confirmed'
      WHEN random() < 0.7 THEN 'payment_pending'
      WHEN random() < 0.85 THEN 'in_progress'
      WHEN random() < 0.95 THEN 'created'
      ELSE 'cancelled'
    END;

    -- Scheduled time (past for completed, future for others)
    IF v_booking_status IN ('completed', 'cancelled') THEN
      v_scheduled_start := random_timestamp((CURRENT_DATE - INTERVAL '30 days')::date, (CURRENT_DATE - INTERVAL '1 day')::date);
    ELSE
      v_scheduled_start := random_timestamp((CURRENT_DATE + INTERVAL '1 day')::date, (CURRENT_DATE + INTERVAL '30 days')::date);
    END IF;

    v_scheduled_end := v_scheduled_start + (v_duration::text || ' minutes')::interval;

    INSERT INTO bookings (
      id, user_id, temple_id, pandit_id, service_id, scheduled_at,
      scheduled_start, scheduled_end, duration_minutes, status,
      total_amount, currency, proof_status, proof_sla_hours, proof_sla_deadline
    )
    VALUES (
      v_booking_id,
      v_test_user_id,
      v_temple_id_for_booking,
      v_pandit_id_for_booking,
      v_service_id_for_booking,
      v_scheduled_start,
      v_scheduled_start,
      v_scheduled_end,
      v_duration,
      v_booking_status,
      v_total_amount,
      'INR',
      CASE 
        WHEN v_booking_status = 'completed' AND random() < 0.7 THEN 'approved'
        WHEN v_booking_status = 'completed' THEN 'uploaded'
        ELSE 'none'
      END,
      2,
      v_scheduled_end + INTERVAL '2 hours'
    );

    -- Add payment for confirmed/completed bookings
    IF v_booking_status IN ('confirmed', 'completed', 'in_progress') THEN
      INSERT INTO payments (
        id, booking_id, provider, provider_order_id, amount_inr, status
      )
      VALUES (
        uuid_generate_v4(),
        v_booking_id,
        'razorpay',
        'order_' || substr(v_booking_id::text, 1, 8),
        v_total_amount,
        CASE WHEN v_booking_status = 'completed' THEN 'captured' ELSE 'authorized' END
      );
    END IF;

  END LOOP;

  -- 3H) Create live streams
  FOR i IN 1..v_stream_count LOOP
    v_stream_id := uuid_generate_v4();
    
    SELECT t.id, p.id
    INTO v_temple_id_for_booking, v_pandit_id_for_booking
    FROM temples t
    JOIN pandit_profiles pp ON pp.temple_id = t.id
    JOIN profiles p ON p.id = pp.id
    WHERE t.status = 'published'
    ORDER BY random()
    LIMIT 1;

    IF v_temple_id_for_booking IS NULL THEN
      CONTINUE;
    END IF;

    v_stream_title := pick(ARRAY['Morning Aarti','Evening Aarti','Special Darshan','Festival Celebration','Daily Pooja']);
    v_stream_type := CASE WHEN random() < 0.8 THEN 'public' ELSE 'private' END;
    v_stream_status := CASE 
      WHEN random() < 0.2 THEN 'live'
      WHEN random() < 0.8 THEN 'ended'
      ELSE 'hidden'
    END;

    INSERT INTO streams (
      id, stream_type, temple_id, pandit_id, title, thumbnail_path,
      playback_url, status, viewer_count, started_at, ended_at
    )
    VALUES (
      v_stream_id,
      v_stream_type,
      v_temple_id_for_booking,
      v_pandit_id_for_booking,
      v_stream_title,
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
      CASE WHEN v_stream_status = 'live' THEN 'https://stream.example.com/' || v_stream_id ELSE NULL END,
      v_stream_status,
      CASE WHEN v_stream_status = 'live' THEN floor(random() * 1000)::int ELSE 0 END,
      CASE WHEN v_stream_status != 'live' THEN random_timestamp((CURRENT_DATE - INTERVAL '7 days')::date, CURRENT_DATE) ELSE now() END,
      CASE WHEN v_stream_status = 'ended' THEN random_timestamp((CURRENT_DATE - INTERVAL '6 days')::date, CURRENT_DATE) ELSE NULL END
    );

  END LOOP;

  -- 3I) Create events
  FOR i IN 1..v_event_count LOOP
    v_event_id := uuid_generate_v4();
    
    SELECT t.id, p.id
    INTO v_temple_id_for_booking, v_pandit_id_for_booking
    FROM temples t
    JOIN pandit_profiles pp ON pp.temple_id = t.id
    JOIN profiles p ON p.id = pp.id
    WHERE t.status = 'published'
    ORDER BY random()
    LIMIT 1;

    IF v_temple_id_for_booking IS NULL THEN
      CONTINUE;
    END IF;

    v_event_title := pick(ARRAY[
      'Maha Shivaratri Celebration','Diwali Festival','Holi Celebration','Janmashtami','Navratri',
      'Ganesh Chaturthi','Dussehra','Raksha Bandhan','Karva Chauth','Guru Purnima'
    ]);
    v_event_desc := 'Join us for a special celebration with traditional rituals, aarti, and prasad distribution.';
    v_start_date := random_date((CURRENT_DATE - INTERVAL '30 days')::date, (CURRENT_DATE + INTERVAL '60 days')::date);
    v_end_date := v_start_date + (floor(random() * 3)::int || ' days')::interval;

    INSERT INTO events (
      id, title, description, start_date, end_date, temple_id, pandit_id, status
    )
    VALUES (
      v_event_id,
      v_event_title,
      v_event_desc,
      v_start_date,
      v_end_date,
      v_temple_id_for_booking,
      v_pandit_id_for_booking,
      CASE WHEN v_start_date > CURRENT_DATE THEN 'published' ELSE 'archived' END
    );

  END LOOP;

  -- 3J) Create availability slots for pandits
  FOR i IN 1..(v_pandit_count * 5) LOOP
    SELECT p.id
    INTO v_pandit_id
    FROM profiles p
    JOIN pandit_profiles pp ON pp.id = p.id
    WHERE p.role = 'pandit'
      AND p.is_active = true
      AND pp.profile_status = 'published'
    ORDER BY random()
    LIMIT 1;

    IF v_pandit_id IS NULL THEN
      CONTINUE;
    END IF;

    v_scheduled_start := random_timestamp((CURRENT_DATE + INTERVAL '1 day')::date, (CURRENT_DATE + INTERVAL '30 days')::date);
    v_scheduled_end := v_scheduled_start + INTERVAL '1 hour';

    INSERT INTO availability_slots (
      id, pandit_id, start_time, end_time, status
    )
    VALUES (
      uuid_generate_v4(),
      v_pandit_id,
      v_scheduled_start,
      v_scheduled_end,
      CASE WHEN random() < 0.7 THEN 'open' WHEN random() < 0.9 THEN 'booked' ELSE 'blocked' END
    );

  END LOOP;

  RAISE NOTICE '✅ Seed complete!';
  RAISE NOTICE '  - Temples: %', v_temple_count;
  RAISE NOTICE '  - Pandits: %', v_pandit_count;
  RAISE NOTICE '  - Bookings: %', v_booking_count;
  RAISE NOTICE '  - Streams: %', v_stream_count;
  RAISE NOTICE '  - Events: %', v_event_count;

END $$;

-- 4) Re-add constraints
DO $$
BEGIN
  BEGIN
    ALTER TABLE pandit_profiles
      ADD CONSTRAINT pandit_profiles_id_fkey
      FOREIGN KEY (id) REFERENCES profiles(id);
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Could not re-add pandit_profiles_id_fkey: %', SQLERRM;
  END;

  BEGIN
    ALTER TABLE profiles
      ADD CONSTRAINT profiles_id_fkey
      FOREIGN KEY (id) REFERENCES auth.users(id);
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Could not re-add profiles_id_fkey (expected for seed data): %', SQLERRM;
  END;

  BEGIN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES profiles(id);
  EXCEPTION WHEN others THEN
    RAISE NOTICE 'Could not re-add bookings_user_id_fkey: %', SQLERRM;
  END;
END $$;

-- 5) Summary queries
SELECT 'Temples' as entity, count(*) as count FROM temples
UNION ALL
SELECT 'Pandits', count(*) FROM pandit_profiles WHERE profile_status = 'published'
UNION ALL
SELECT 'Services', count(*) FROM services WHERE status = 'published'
UNION ALL
SELECT 'Active Services', count(*) FROM services WHERE status = 'published' AND is_active_single_pooja = true
UNION ALL
SELECT 'Offerings', count(*) FROM offerings WHERE active = true
UNION ALL
SELECT 'Bookings', count(*) FROM bookings
UNION ALL
SELECT 'Streams', count(*) FROM streams
UNION ALL
SELECT 'Events', count(*) FROM events
UNION ALL
SELECT 'Availability Slots', count(*) FROM availability_slots
ORDER BY entity;

