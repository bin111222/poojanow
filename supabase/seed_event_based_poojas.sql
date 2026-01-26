-- Seed Event-Based Poojas
-- This categorizes existing poojas and creates new event-based poojas
-- Run AFTER migration 006_add_event_based_poojas.sql

-- Helper function
CREATE OR REPLACE FUNCTION pick(arr text[]) RETURNS text AS $$
BEGIN
  RETURN arr[1 + floor(random() * array_length(arr, 1))::int];
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  v_event_type_id uuid;
  v_service_id uuid;
  v_pandit_id uuid;
  v_temple_id uuid;
  v_festivals_type_id uuid;
  v_life_events_type_id uuid;
  v_remedial_type_id uuid;
  v_auspicious_type_id uuid;
  
  -- Event-based pooja titles by category
  festival_poojas text[] := ARRAY[
    'Diwali Pooja',
    'Ganesh Chaturthi Pooja',
    'Navratri Pooja',
    'Janmashtami Pooja',
    'Holi Pooja',
    'Dussehra Pooja',
    'Maha Shivaratri Pooja',
    'Raksha Bandhan Pooja',
    'Karva Chauth Pooja',
    'Durga Puja',
    'Lakshmi Puja',
    'Saraswati Puja',
    'Kali Puja',
    'Ram Navami Pooja',
    'Hanuman Jayanti Pooja'
  ];
  
  life_event_poojas text[] := ARRAY[
    'Griha Pravesh Pooja',
    'Vivah Muhurta Pooja',
    'Annaprashan Sanskar',
    'Mundan Sanskar',
    'Yagyopavit Sanskar',
    'Namkaran Sanskar',
    'Godh Bharai Pooja',
    'Satyanarayan Katha (Marriage)',
    'Satyanarayan Katha (Housewarming)',
    'Vehicle Pooja',
    'Business Inauguration Pooja',
    'New Year Pooja'
  ];
  
  remedial_poojas text[] := ARRAY[
    'Kaal Sarp Dosh Shanti',
    'Mangal Dosh Shanti',
    'Shani Shanti Pooja',
    'Rahu Ketu Shanti',
    'Grah Shanti Pooja',
    'Pitru Dosha Shanti',
    'Vastu Dosha Shanti',
    'Naga Dosha Shanti',
    'Sarpa Dosha Shanti'
  ];
  
  auspicious_poojas text[] := ARRAY[
    'Ekadashi Pooja',
    'Purnima Pooja',
    'Amavasya Pooja',
    'Sankranti Pooja',
    'Pradosh Pooja',
    'Somvar Vrat Pooja',
    'Mangalvar Vrat Pooja',
    'Guruvar Vrat Pooja',
    'Shukravar Vrat Pooja',
    'Shanivar Vrat Pooja'
  ];
  
  v_title text;
  v_category text;
  v_price int;
  v_duration int;
  v_description text;
  v_pooja_explanation text;
  
BEGIN
  -- Get event type IDs
  SELECT id INTO v_festivals_type_id FROM event_types WHERE slug = 'festivals';
  SELECT id INTO v_life_events_type_id FROM event_types WHERE slug = 'life-events';
  SELECT id INTO v_remedial_type_id FROM event_types WHERE slug = 'remedial';
  SELECT id INTO v_auspicious_type_id FROM event_types WHERE slug = 'auspicious-days';
  
  -- 1. Categorize existing poojas that match event-based patterns
  UPDATE services
  SET 
    event_category = 'event_based',
    event_type_id = CASE
      WHEN title ILIKE '%diwali%' OR title ILIKE '%ganesh%' OR title ILIKE '%navratri%' 
           OR title ILIKE '%janmashtami%' OR title ILIKE '%holi%' OR title ILIKE '%dussehra%'
           OR title ILIKE '%shivaratri%' OR title ILIKE '%raksha%' OR title ILIKE '%durga%'
           OR title ILIKE '%lakshmi%' OR title ILIKE '%saraswati%' OR title ILIKE '%kali%'
           OR title ILIKE '%ram navami%' OR title ILIKE '%hanuman jayanti%'
      THEN v_festivals_type_id
      
      WHEN title ILIKE '%griha%' OR title ILIKE '%vivah%' OR title ILIKE '%annaprashan%'
           OR title ILIKE '%mundan%' OR title ILIKE '%yagyopavit%' OR title ILIKE '%namkaran%'
           OR title ILIKE '%godh%' OR title ILIKE '%vehicle%' OR title ILIKE '%business%'
      THEN v_life_events_type_id
      
      WHEN title ILIKE '%dosh%' OR title ILIKE '%shanti%' OR title ILIKE '%kaal sarp%'
           OR title ILIKE '%mangal%' OR title ILIKE '%shani%' OR title ILIKE '%rahu%'
           OR title ILIKE '%ketu%' OR title ILIKE '%pitru%' OR title ILIKE '%vastu dosha%'
           OR title ILIKE '%naga%' OR title ILIKE '%sarpa%'
      THEN v_remedial_type_id
      
      WHEN title ILIKE '%ekadashi%' OR title ILIKE '%purnima%' OR title ILIKE '%amavasya%'
           OR title ILIKE '%sankranti%' OR title ILIKE '%pradosh%' OR title ILIKE '%vrat%'
      THEN v_auspicious_type_id
      
      ELSE NULL
    END,
    is_recurring_event = CASE
      WHEN title ILIKE '%diwali%' OR title ILIKE '%ganesh%' OR title ILIKE '%navratri%'
           OR title ILIKE '%janmashtami%' OR title ILIKE '%holi%' OR title ILIKE '%dussehra%'
           OR title ILIKE '%shivaratri%' OR title ILIKE '%ekadashi%' OR title ILIKE '%purnima%'
      THEN true
      ELSE false
    END
  WHERE service_type = 'pooja'
    AND status = 'published'
    AND (
      title ILIKE '%diwali%' OR title ILIKE '%ganesh%' OR title ILIKE '%navratri%'
      OR title ILIKE '%janmashtami%' OR title ILIKE '%holi%' OR title ILIKE '%dussehra%'
      OR title ILIKE '%shivaratri%' OR title ILIKE '%griha%' OR title ILIKE '%vivah%'
      OR title ILIKE '%dosh%' OR title ILIKE '%shanti%' OR title ILIKE '%ekadashi%'
      OR title ILIKE '%purnima%' OR title ILIKE '%amavasya%' OR title ILIKE '%sankranti%'
    );
  
  -- 2. Create new event-based poojas for each pandit
  FOR v_pandit_id IN 
    SELECT id FROM pandit_profiles 
    WHERE profile_status = 'published'
    LIMIT 50 -- Limit to first 50 pandits
  LOOP
    -- Get temple_id
    SELECT temple_id INTO v_temple_id 
    FROM pandit_profiles 
    WHERE id = v_pandit_id;
    
    -- Create 2-4 festival poojas per pandit
    FOR i IN 1..(2 + floor(random() * 3)::int) LOOP
      v_service_id := uuid_generate_v4();
      v_title := pick(festival_poojas);
      v_category := 'event_based';
      v_duration := (ARRAY[45, 60, 90, 120])[1 + floor(random() * 4)::int];
      v_price := (ARRAY[999, 1499, 1999, 2499, 2999])[1 + floor(random() * 5)::int];
      v_description := 'Special pooja for this auspicious festival. Includes traditional rituals, mantras, and blessings.';
      v_pooja_explanation := 'This festival pooja is performed with special rituals and offerings to invoke divine blessings during this auspicious time.';
      
      INSERT INTO services (
        id, service_type, title, description, duration_minutes, base_price_inr,
        temple_id, pandit_id, status, event_category, event_type_id, 
        is_recurring_event, pooja_explanation
      )
      VALUES (
        v_service_id, 'pooja', v_title, v_description, v_duration, v_price,
        v_temple_id, v_pandit_id, 'published', v_category, v_festivals_type_id,
        true, v_pooja_explanation
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Create 1-2 life event poojas per pandit
    FOR i IN 1..(1 + floor(random() * 2)::int) LOOP
      v_service_id := uuid_generate_v4();
      v_title := pick(life_event_poojas);
      v_category := 'event_based';
      v_duration := (ARRAY[60, 90, 120])[1 + floor(random() * 3)::int];
      v_price := (ARRAY[1499, 1999, 2499, 2999, 3499])[1 + floor(random() * 5)::int];
      v_description := 'Sacred ceremony for this important life milestone. Complete ritual with traditional practices and blessings.';
      v_pooja_explanation := 'This sanskar/ceremony marks an important milestone in life and is performed with traditional Vedic rituals to seek divine blessings.';
      
      INSERT INTO services (
        id, service_type, title, description, duration_minutes, base_price_inr,
        temple_id, pandit_id, status, event_category, event_type_id,
        is_recurring_event, pooja_explanation
      )
      VALUES (
        v_service_id, 'pooja', v_title, v_description, v_duration, v_price,
        v_temple_id, v_pandit_id, 'published', v_category, v_life_events_type_id,
        false, v_pooja_explanation
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Create 1-2 remedial poojas per pandit
    FOR i IN 1..(1 + floor(random() * 2)::int) LOOP
      v_service_id := uuid_generate_v4();
      v_title := pick(remedial_poojas);
      v_category := 'event_based';
      v_duration := (ARRAY[90, 120, 180])[1 + floor(random() * 3)::int];
      v_price := (ARRAY[2499, 2999, 3499, 4999, 5999])[1 + floor(random() * 5)::int];
      v_description := 'Remedial pooja to neutralize dosha effects. Comprehensive ritual with specific mantras and offerings.';
      v_pooja_explanation := 'This remedial pooja is performed to pacify malefic planetary influences and remove obstacles from one''s life.';
      
      INSERT INTO services (
        id, service_type, title, description, duration_minutes, base_price_inr,
        temple_id, pandit_id, status, event_category, event_type_id,
        is_recurring_event, pooja_explanation
      )
      VALUES (
        v_service_id, 'pooja', v_title, v_description, v_duration, v_price,
        v_temple_id, v_pandit_id, 'published', v_category, v_remedial_type_id,
        false, v_pooja_explanation
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Create 1-2 auspicious day poojas per pandit
    FOR i IN 1..(1 + floor(random() * 2)::int) LOOP
      v_service_id := uuid_generate_v4();
      v_title := pick(auspicious_poojas);
      v_category := 'event_based';
      v_duration := (ARRAY[45, 60, 90])[1 + floor(random() * 3)::int];
      v_price := (ARRAY[799, 999, 1499, 1999])[1 + floor(random() * 4)::int];
      v_description := 'Pooja performed on this auspicious day for enhanced spiritual benefits. Traditional rituals and blessings.';
      v_pooja_explanation := 'This pooja is performed on an auspicious day when the cosmic energies are favorable, amplifying the benefits of the ritual.';
      
      INSERT INTO services (
        id, service_type, title, description, duration_minutes, base_price_inr,
        temple_id, pandit_id, status, event_category, event_type_id,
        is_recurring_event, pooja_explanation
      )
      VALUES (
        v_service_id, 'pooja', v_title, v_description, v_duration, v_price,
        v_temple_id, v_pandit_id, 'published', v_category, v_auspicious_type_id,
        true, v_pooja_explanation
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
    
  END LOOP;
  
END $$;

-- Display summary
SELECT 
  'Event-Based Poojas' as status,
  COUNT(*) as total_event_poojas,
  COUNT(DISTINCT event_type_id) as event_types_used,
  COUNT(DISTINCT pandit_id) as pandits_with_event_poojas,
  COUNT(CASE WHEN event_category = 'event_based' THEN 1 END) as event_based_count,
  COUNT(CASE WHEN is_recurring_event = true THEN 1 END) as recurring_events
FROM services
WHERE event_category = 'event_based'
AND status = 'published';

-- Show breakdown by event type
SELECT 
  et.name as event_type,
  COUNT(s.id) as pooja_count,
  AVG(s.base_price_inr)::int as avg_price
FROM event_types et
LEFT JOIN services s ON s.event_type_id = et.id AND s.status = 'published'
WHERE et.active = true
GROUP BY et.id, et.name, et.sort_order
ORDER BY et.sort_order;

-- Clean up
DROP FUNCTION IF EXISTS pick(text[]);

