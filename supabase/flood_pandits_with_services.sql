-- ============================================================
-- Flood Pandits with Multiple Services
-- This script creates 5-10 diverse services for each published pandit
-- ============================================================

-- Helper function to pick random element from array
CREATE OR REPLACE FUNCTION pick(arr text[]) RETURNS text AS $$
BEGIN
  RETURN arr[1 + floor(random() * array_length(arr, 1))::int];
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  v_pandit_id uuid;
  v_service_id uuid;
  v_service_type text;
  v_service_title text;
  v_service_desc text;
  v_duration int;
  v_price int;
  v_pooja_explanation text;
  v_is_active boolean;
  v_temple_id uuid;
  v_service_count int;
  
  -- Service title arrays
  service_titles_pooja text[] := ARRAY[
    'Rudrabhishek',
    'Sankalp Pooja',
    'Grah Shanti Pooja',
    'Maha Mrityunjaya Jaap',
    'Satyanarayan Katha',
    'Lakshmi Pooja',
    'Durga Saptashati Path',
    'Hanuman Chalisa Path',
    'Navagraha Pooja',
    'Vishnu Sahasranama Path',
    'Ganesh Chaturthi Pooja',
    'Shiv Pooja',
    'Krishna Janmashtami Pooja',
    'Diwali Pooja',
    'Holi Pooja',
    'Kaal Sarp Dosh Shanti',
    'Pitru Tarpan',
    'Mangal Dosh Shanti',
    'Shani Shanti Pooja',
    'Rahu Ketu Shanti',
    'Vastu Pooja',
    'Griha Pravesh Pooja',
    'Vivah Muhurta Pooja',
    'Annaprashan Sanskar',
    'Mundan Sanskar',
    'Yagyopavit Sanskar',
    'Gayatri Mantra Jaap',
    'Om Namah Shivaya Jaap',
    'Mahamrityunjaya Mantra Jaap',
    'Ganapati Atharvashirsha Path'
  ];
  
  service_titles_consult text[] := ARRAY[
    'Pandit Consultation',
    'Muhurta Selection',
    'Pooja Planning Call',
    'Dosha Guidance Session',
    'Vastu Guidance',
    'Horoscope Reading',
    'Marriage Muhurta Consultation',
    'Griha Pravesh Consultation',
    'Business Muhurta',
    'Vehicle Pooja Consultation',
    'Remedial Measures Guidance',
    'Spiritual Counseling',
    'Mantra Guidance Session',
    'Ritual Planning Session'
  ];
  
  service_titles_darshan text[] := ARRAY[
    'Morning Aarti Darshan',
    'Evening Aarti Darshan',
    'Special Darshan',
    'Festival Darshan',
    'Live Temple Darshan'
  ];
  
  -- Pooja explanations
  pooja_explanations text[] := ARRAY[
    'Rudrabhishek is a powerful Vedic ritual dedicated to Lord Shiva. The pooja involves the ceremonial bathing (abhishek) of the Shiva Lingam with sacred substances including milk, curd, ghee, honey, sugar, and water. This ritual is performed to seek blessings, remove obstacles, and bring peace and prosperity.',
    'Sankalp Pooja is a sacred ceremony where devotees make a solemn vow (sankalp) to perform specific rituals or prayers. This pooja sets the intention and creates a spiritual commitment, ensuring the proper completion of religious observances with divine blessings.',
    'Grah Shanti Pooja is performed to pacify the malefic effects of planets in one''s horoscope. This ritual helps in reducing negative planetary influences and brings harmony, peace, and prosperity to the devotee''s life.',
    'Maha Mrityunjaya Jaap is a powerful mantra dedicated to Lord Shiva for protection, healing, and overcoming fear of death. This sacred chanting helps in removing obstacles and brings spiritual strength and longevity.',
    'Satyanarayan Katha is a popular religious discourse that narrates the story of Lord Vishnu. This ceremony is performed for prosperity, happiness, and fulfillment of wishes, often on auspicious occasions like full moon days.',
    'Lakshmi Pooja is performed to invoke the blessings of Goddess Lakshmi, the deity of wealth and prosperity. This pooja brings financial stability, abundance, and removes obstacles related to wealth.',
    'Navagraha Pooja is performed to appease all nine planets (Navagrahas) and balance their influences. This comprehensive pooja helps in reducing negative planetary effects and enhancing positive energies.',
    'Kaal Sarp Dosh Shanti is a special pooja performed to neutralize the effects of Kaal Sarp Dosh in one''s horoscope. This ritual helps in removing obstacles, health issues, and brings peace and prosperity.',
    'Ganesh Chaturthi Pooja is performed to seek blessings of Lord Ganesha, the remover of obstacles. This pooja is especially auspicious for new beginnings and ensures success in all endeavors.',
    'Hanuman Chalisa Path involves the recitation of Hanuman Chalisa, a powerful hymn dedicated to Lord Hanuman. This chanting provides strength, courage, and protection from negative energies.'
  ];
  
  -- Descriptions
  pooja_descriptions text[] := ARRAY[
    'Includes sankalp, mantra chanting, and guided rituals. Samagri list shared in advance. Live guidance provided throughout.',
    'Traditional Vedic pooja performed with authentic rituals. Complete samagri included. Step-by-step guidance for devotees.',
    'Comprehensive pooja with detailed explanations. All necessary materials provided. Personalized sankalp included.',
    'Sacred ritual performed with utmost devotion. Includes prasad, aarti, and blessings. Full support and guidance provided.',
    'Traditional ceremony following ancient Vedic practices. Complete samagri and detailed instructions included.'
  ];
  
  consult_descriptions text[] := ARRAY[
    'Guidance on muhurta, procedure, and preparations. Clear next steps and checklist provided.',
    'Expert consultation on rituals, timings, and preparations. Personalized guidance for your specific needs.',
    'Detailed discussion on pooja procedures, samagri requirements, and auspicious timings. Complete planning support.',
    'Comprehensive consultation covering all aspects of the ritual. Step-by-step guidance and recommendations provided.'
  ];
  
  darshan_descriptions text[] := ARRAY[
    'Live darshan experience with aarti view when available. Best effort timing based on temple schedule.',
    'Exclusive live darshan with guided commentary. Experience the divine atmosphere from anywhere.',
    'Special darshan session with detailed explanations. Connect with the divine energy of the temple.'
  ];

BEGIN
  -- Loop through all published pandits
  FOR v_pandit_id IN 
    SELECT id FROM pandit_profiles 
    WHERE profile_status = 'published'
  LOOP
    -- Get temple_id for this pandit (if any)
    SELECT temple_id INTO v_temple_id 
    FROM pandit_profiles 
    WHERE id = v_pandit_id;
    
    -- Create 5-10 services per pandit
    v_service_count := 5 + floor(random() * 6)::int; -- 5 to 10 services
    
    FOR i IN 1..v_service_count LOOP
      v_service_id := uuid_generate_v4();
      v_is_active := false;
      
      -- Determine service type (60% pooja, 30% consult, 10% darshan)
      IF random() < 0.6 THEN
        -- Pooja service
        v_service_type := 'pooja';
        v_service_title := pick(service_titles_pooja);
        v_duration := (ARRAY[30, 45, 60, 75, 90, 120])[1 + floor(random() * 6)::int];
        v_price := (ARRAY[499, 799, 999, 1499, 1999, 2499, 2999, 3499, 4999])[1 + floor(random() * 9)::int];
        v_service_desc := pick(pooja_descriptions);
        v_pooja_explanation := pick(pooja_explanations);
        
        -- Make first pooja active for single booking
        IF i = 1 THEN
          v_is_active := true;
        END IF;
        
      ELSIF random() < 0.9 THEN
        -- Consultation service
        v_service_type := 'consult';
        v_service_title := pick(service_titles_consult);
        v_duration := (ARRAY[15, 20, 30, 45, 60])[1 + floor(random() * 5)::int];
        v_price := (ARRAY[199, 299, 399, 499, 699, 999])[1 + floor(random() * 6)::int];
        v_service_desc := pick(consult_descriptions);
        v_pooja_explanation := NULL;
        
      ELSE
        -- Live darshan service
        v_service_type := 'live_darshan';
        v_service_title := pick(service_titles_darshan);
        v_duration := (ARRAY[10, 15, 20, 30, 45])[1 + floor(random() * 5)::int];
        v_price := (ARRAY[99, 149, 199, 249, 299, 399])[1 + floor(random() * 6)::int];
        v_service_desc := pick(darshan_descriptions);
        v_pooja_explanation := NULL;
      END IF;
      
      -- Insert service
      INSERT INTO services (
        id,
        service_type,
        title,
        description,
        duration_minutes,
        base_price_inr,
        temple_id,
        pandit_id,
        status,
        is_active_single_pooja,
        pooja_explanation
      )
      VALUES (
        v_service_id,
        v_service_type,
        v_service_title,
        v_service_desc,
        v_duration,
        v_price,
        v_temple_id,
        v_pandit_id,
        'published',
        v_is_active,
        v_pooja_explanation
      )
      ON CONFLICT DO NOTHING;
      
    END LOOP;
    
    RAISE NOTICE 'Created % services for pandit %', v_service_count, v_pandit_id;
    
  END LOOP;
  
END $$;

-- Display summary
SELECT 
  'Services Created' as status,
  COUNT(*) as total_services,
  COUNT(DISTINCT pandit_id) as pandits_with_services,
  COUNT(CASE WHEN service_type = 'pooja' THEN 1 END) as pooja_services,
  COUNT(CASE WHEN service_type = 'consult' THEN 1 END) as consult_services,
  COUNT(CASE WHEN service_type = 'live_darshan' THEN 1 END) as darshan_services,
  COUNT(CASE WHEN is_active_single_pooja = true THEN 1 END) as active_services,
  AVG(base_price_inr)::int as avg_price,
  MIN(base_price_inr) as min_price,
  MAX(base_price_inr) as max_price
FROM services
WHERE status = 'published';

-- Show services per pandit
SELECT 
  p.id as pandit_id,
  pr.full_name as pandit_name,
  COUNT(s.id) as service_count,
  COUNT(CASE WHEN s.is_active_single_pooja = true THEN 1 END) as active_count
FROM pandit_profiles p
LEFT JOIN profiles pr ON pr.id = p.id
LEFT JOIN services s ON s.pandit_id = p.id AND s.status = 'published'
WHERE p.profile_status = 'published'
GROUP BY p.id, pr.full_name
ORDER BY service_count DESC
LIMIT 20;

-- Clean up helper function
DROP FUNCTION IF EXISTS pick(text[]);


