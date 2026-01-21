-- 1. CLEANUP (Wipe existing data to avoid duplicates)
truncate table bookings cascade;
truncate table streams cascade;
truncate table services cascade;
truncate table pandit_profiles cascade;
truncate table temples cascade;

-- 2. TEMPLES
INSERT INTO temples (name, slug, city, state, deity, description, status, verified, hero_image_path)
VALUES
('Kashi Vishwanath Temple', 'kashi-vishwanath', 'Varanasi', 'Uttar Pradesh', 'Lord Shiva', 'One of the most revered Jyotirlinga temples on the ghats of Varanasi.', 'published', true, 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1000'),
('Shri Krishna Janmabhoomi', 'krishna-janmabhoomi', 'Mathura', 'Uttar Pradesh', 'Lord Krishna', 'The birthplace of Lord Krishna, a site of immense spiritual significance.', 'published', true, 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1000'),
('Somnath Temple', 'somnath', 'Veraval', 'Gujarat', 'Lord Shiva', 'The first among the twelve Jyotirlinga shrines of Shiva.', 'published', true, 'https://images.unsplash.com/photo-1626125345510-4603468ee534?auto=format&fit=crop&q=80&w=1000'),
('Meenakshi Temple', 'meenakshi', 'Madurai', 'Tamil Nadu', 'Goddess Parvati', 'A historic Hindu temple known for its towering gopurams and sacred rituals.', 'published', true, 'https://images.unsplash.com/photo-1582510003544-4d00b7f5feee?auto=format&fit=crop&q=80&w=1000'),
('Golden Temple', 'golden-temple', 'Amritsar', 'Punjab', 'Guru Granth Sahib', 'The holiest Gurdwara of Sikhism, surrounded by the Amrit Sarovar.', 'published', true, 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=1000'),
('Kedarnath Temple', 'kedarnath', 'Rudraprayag', 'Uttarakhand', 'Lord Shiva', 'A high Himalayan shrine, among the most sacred pilgrimage destinations.', 'published', true, 'https://images.unsplash.com/photo-1605649486169-3236275d2904?auto=format&fit=crop&q=80&w=1000'),
('Jagannath Temple', 'jagannath-puri', 'Puri', 'Odisha', 'Lord Jagannath', 'A famous temple dedicated to Jagannath, known for its grand rituals and heritage.', 'published', true, 'https://images.unsplash.com/photo-1597576222883-7c87c0e88103?auto=format&fit=crop&q=80&w=1000'),

('Tirumala Tirupati Devasthanam', 'tirupati', 'Tirupati', 'Andhra Pradesh', 'Lord Venkateswara', 'One of the richest and most visited temples, famed for Laddu prasadam.', 'published', true, 'https://images.unsplash.com/photo-1602573981445-9b2f4b9b1b89?auto=format&fit=crop&q=80&w=1000'),
('Vaishno Devi', 'vaishno-devi', 'Katra', 'Jammu and Kashmir', 'Maa Vaishno Devi', 'A legendary cave shrine visited by millions, known for its powerful energy.', 'published', true, 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&q=80&w=1000'),
('Mahakaleshwar Jyotirlinga', 'mahakaleshwar', 'Ujjain', 'Madhya Pradesh', 'Lord Shiva', 'A Jyotirlinga temple renowned for Bhasma Aarti and timeless traditions.', 'published', true, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000'),
('Shri Ram Mandir', 'ram-mandir-ayodhya', 'Ayodhya', 'Uttar Pradesh', 'Lord Ram', 'A grand and historic temple dedicated to Lord Ram, a major pilgrimage site.', 'published', true, 'https://images.unsplash.com/photo-1619022950547-1d7f1f2d996a?auto=format&fit=crop&q=80&w=1000'),
('Shirdi Sai Baba Temple', 'shirdi', 'Shirdi', 'Maharashtra', 'Sai Baba', 'A major shrine dedicated to Sai Baba, known for peaceful darshan and seva.', 'published', true, 'https://images.unsplash.com/photo-1609340823350-2b40b3a85a9a?auto=format&fit=crop&q=80&w=1000'),
('Siddhivinayak Temple', 'siddhivinayak', 'Mumbai', 'Maharashtra', 'Lord Ganesha', 'Mumbai’s most loved Ganesha temple, famous for quick darshan and blessings.', 'published', true, 'https://images.unsplash.com/photo-1604937455095-efb94b3d9f71?auto=format&fit=crop&q=80&w=1000'),
('Kalighat Kali Temple', 'kalighat', 'Kolkata', 'West Bengal', 'Goddess Kali', 'A revered Shakti Peetha and a powerful site of devotion in Kolkata.', 'published', true, 'https://images.unsplash.com/photo-1604080214322-1a1dff1e9f86?auto=format&fit=crop&q=80&w=1000'),
('Kamakhya Temple', 'kamakhya', 'Guwahati', 'Assam', 'Goddess Kamakhya', 'A major Shakti shrine known for tantric traditions and intense devotion.', 'published', true, 'https://images.unsplash.com/photo-1605197584157-9f8a9cc2c4e2?auto=format&fit=crop&q=80&w=1000'),
('Badrinath Temple', 'badrinath', 'Chamoli', 'Uttarakhand', 'Lord Vishnu', 'A Char Dham shrine set in the Garhwal Himalayas, known for serene darshan.', 'published', true, 'https://images.unsplash.com/photo-1544735716-8d2e2f16eab2?auto=format&fit=crop&q=80&w=1000'),
('Rameshwaram Ramanathaswamy Temple', 'rameshwaram', 'Rameshwaram', 'Tamil Nadu', 'Lord Shiva', 'A Jyotirlinga temple famed for long corridors and sacred theertham baths.', 'published', true, 'https://images.unsplash.com/photo-1580745294621-1f4b5e2dbd8d?auto=format&fit=crop&q=80&w=1000'),
('Sabarimala Temple', 'sabarimala', 'Pathanamthitta', 'Kerala', 'Lord Ayyappa', 'A famed pilgrimage destination with strict traditions and deep devotion.', 'published', true, 'https://images.unsplash.com/photo-1604601523841-9f1df2a1e0ab?auto=format&fit=crop&q=80&w=1000'),
('Dwarkadhish Temple', 'dwarkadhish', 'Dwarka', 'Gujarat', 'Lord Krishna', 'An ancient temple linked to Krishna’s kingdom, a major Char Dham site.', 'published', true, 'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&q=80&w=1000'),
('Shrinathji Temple', 'shrinathji', 'Nathdwara', 'Rajasthan', 'Lord Krishna', 'A celebrated Krishna shrine known for seva schedules and rich traditions.', 'published', true, 'https://images.unsplash.com/photo-1604080152308-2c6e6e9f1b2c?auto=format&fit=crop&q=80&w=1000'),
('ISKCON Temple', 'iskcon-delhi', 'New Delhi', 'Delhi', 'Lord Krishna', 'A vibrant temple known for kirtan, prasad, and community devotion.', 'published', true, 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000'),
('Akshardham Temple', 'akshardham-delhi', 'New Delhi', 'Delhi', 'Swaminarayan', 'A majestic complex known for architecture, exhibits, and peaceful gardens.', 'published', true, 'https://images.unsplash.com/photo-1598959659852-4a0a7d2a3c91?auto=format&fit=crop&q=80&w=1000');

-- 3. SERVICES
DO $$
DECLARE
  kashi_id uuid;
  somnath_id uuid;
  meenakshi_id uuid;
  kedarnath_id uuid;
  jagannath_id uuid;
  krishna_id uuid;
  golden_id uuid;

  tirupati_id uuid;
  vaishno_id uuid;
  mahakal_id uuid;
  ayodhya_id uuid;
  shirdi_id uuid;
  siddhi_id uuid;
  kalighat_id uuid;
  kamakhya_id uuid;
  badrinath_id uuid;
  rameshwaram_id uuid;
  sabarimala_id uuid;
  dwarka_id uuid;
  shrinathji_id uuid;
  iskcon_id uuid;
  akshardham_id uuid;
BEGIN
  SELECT id INTO kashi_id FROM temples WHERE slug = 'kashi-vishwanath';
  SELECT id INTO somnath_id FROM temples WHERE slug = 'somnath';
  SELECT id INTO meenakshi_id FROM temples WHERE slug = 'meenakshi';
  SELECT id INTO kedarnath_id FROM temples WHERE slug = 'kedarnath';
  SELECT id INTO jagannath_id FROM temples WHERE slug = 'jagannath-puri';
  SELECT id INTO krishna_id FROM temples WHERE slug = 'krishna-janmabhoomi';
  SELECT id INTO golden_id FROM temples WHERE slug = 'golden-temple';

  SELECT id INTO tirupati_id FROM temples WHERE slug = 'tirupati';
  SELECT id INTO vaishno_id FROM temples WHERE slug = 'vaishno-devi';
  SELECT id INTO mahakal_id FROM temples WHERE slug = 'mahakaleshwar';
  SELECT id INTO ayodhya_id FROM temples WHERE slug = 'ram-mandir-ayodhya';
  SELECT id INTO shirdi_id FROM temples WHERE slug = 'shirdi';
  SELECT id INTO siddhi_id FROM temples WHERE slug = 'siddhivinayak';
  SELECT id INTO kalighat_id FROM temples WHERE slug = 'kalighat';
  SELECT id INTO kamakhya_id FROM temples WHERE slug = 'kamakhya';
  SELECT id INTO badrinath_id FROM temples WHERE slug = 'badrinath';
  SELECT id INTO rameshwaram_id FROM temples WHERE slug = 'rameshwaram';
  SELECT id INTO sabarimala_id FROM temples WHERE slug = 'sabarimala';
  SELECT id INTO dwarka_id FROM temples WHERE slug = 'dwarkadhish';
  SELECT id INTO shrinathji_id FROM temples WHERE slug = 'shrinathji';
  SELECT id INTO iskcon_id FROM temples WHERE slug = 'iskcon-delhi';
  SELECT id INTO akshardham_id FROM temples WHERE slug = 'akshardham-delhi';

  -- Kashi Vishwanath
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Maha Mrityunjaya Jaap', 'Powerful chanting for longevity and health. Performed by 5 pandits.', 180, 11000, 'pooja', 'published', kashi_id),
  ('Ganga Aarti Sankalp', 'Get your name announced during the evening Ganga Aarti.', 15, 501, 'live_darshan', 'published', kashi_id),
  ('Rudra Abhishek (Ekadash Rudra)', 'Vedic chanting with abhishek offerings for Shiva blessings.', 75, 5100, 'pooja', 'published', kashi_id),
  ('Kaal Sarp Dosh Shanti', 'Ritual for relief from Kaal Sarp dosh related concerns.', 120, 12500, 'pooja', 'published', kashi_id),
  ('Pitru Tarpan on Ghats', 'Ritual offering for ancestors performed on sacred ghats.', 45, 2100, 'pooja', 'published', kashi_id);

  -- Somnath
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Somnath Jyotirlinga Abhishek', 'Milk and water abhishek offering to the prime Jyotirlinga.', 45, 2100, 'pooja', 'published', somnath_id),
  ('Rudrabhishek', 'Vedic chanting and ritual bathing of the Shiva Linga.', 60, 3500, 'pooja', 'published', somnath_id),
  ('Laghu Rudra Pooja', 'A structured Shiva pooja for protection and prosperity.', 120, 8500, 'pooja', 'published', somnath_id),
  ('Somnath Darshan Priority Pass', 'Assisted entry and guided darshan support.', 20, 799, 'darshan', 'published', somnath_id),
  ('Mahamrityunjaya Jaap (Solo)', 'Solo pandit chanting for health and well being.', 60, 2500, 'pooja', 'published', somnath_id);

  -- Meenakshi
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Kumkum Archana', 'Special archana with kumkum for Goddess Meenakshi.', 30, 1001, 'pooja', 'published', meenakshi_id),
  ('Meenakshi Kalyanam Sankalp', 'Sankalp for blessings in marriage and relationships.', 45, 3100, 'pooja', 'published', meenakshi_id),
  ('Navagraha Shanti', 'Pooja to balance planetary influences and remove obstacles.', 90, 5500, 'pooja', 'published', meenakshi_id),
  ('Special Deeparadhana', 'Evening lamp ritual with guided offering and blessings.', 20, 799, 'darshan', 'published', meenakshi_id);

  -- Kedarnath
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Himalayan Peace Puja', 'Special pooja performed at high altitude for inner peace.', 90, 5100, 'pooja', 'published', kedarnath_id),
  ('Kedarnath Abhishek', 'Abhishek offering with sacred water and flowers.', 30, 2500, 'pooja', 'published', kedarnath_id),
  ('Shiva Sahasranama Path', 'Recitation of 1000 names of Shiva for protection.', 45, 2100, 'pooja', 'published', kedarnath_id);

  -- Jagannath Puri
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Jagannath Mahaprasad Booking', 'Book and receive mahaprasad offering support.', 15, 499, 'prasadam', 'published', jagannath_id),
  ('Satyanarayan Katha', 'Katha and pooja for prosperity and family wellbeing.', 90, 4500, 'pooja', 'published', jagannath_id),
  ('Rath Yatra Sankalp', 'Sankalp seva for blessings during Rath Yatra season.', 30, 1500, 'pooja', 'published', jagannath_id);

  -- Krishna Janmabhoomi
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Janmashtami Special Pooja', 'Special Krishna pooja with bhog and aarti.', 60, 3100, 'pooja', 'published', krishna_id),
  ('Santaan Gopal Pooja', 'Pooja for couples seeking blessings for children.', 75, 6500, 'pooja', 'published', krishna_id),
  ('Bhagavad Gita Path', 'Guided recitation and sankalp for clarity and peace.', 45, 2100, 'pooja', 'published', krishna_id);

  -- Golden Temple
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Gurbani Kirtan Request', 'Request a kirtan dedication for your family name.', 10, 501, 'live_darshan', 'published', golden_id),
  ('Karah Prasad Seva', 'Sponsor karah prasad seva with acknowledgement.', 10, 1100, 'prasadam', 'published', golden_id),
  ('Langar Seva Contribution', 'Support langar seva as a donation entry.', 5, 501, 'donation', 'published', golden_id);

  -- Tirupati
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Suprabhatam Seva', 'Early morning seva booking assistance for Suprabhatam.', 20, 2500, 'darshan', 'published', tirupati_id),
  ('Archana Seva', 'Archana for Lord Venkateswara with sankalp details.', 30, 3100, 'pooja', 'published', tirupati_id),
  ('Laddu Prasadam Pack', 'Arrange prasadam pack pickup support and tracking.', 15, 799, 'prasadam', 'published', tirupati_id);

  -- Vaishno Devi
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Mata Rani Path and Sankalp', 'Sankalp puja for protection and wishes.', 45, 2100, 'pooja', 'published', vaishno_id),
  ('Chandi Path', 'Powerful recitation for strength and overcoming obstacles.', 90, 6500, 'pooja', 'published', vaishno_id),
  ('Darshan Assistance', 'Guided assistance for smoother darshan flow.', 25, 999, 'darshan', 'published', vaishno_id);

  -- Mahakaleshwar
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Bhasma Aarti Booking Support', 'Assistance to secure Bhasma Aarti slot and instructions.', 15, 1500, 'darshan', 'published', mahakal_id),
  ('Mahakal Abhishek', 'Abhishek with mantra chanting for Shiva blessings.', 45, 3100, 'pooja', 'published', mahakal_id),
  ('Navagraha Shanti (Ujjain)', 'Planetary balancing ritual as per sankalp.', 90, 7500, 'pooja', 'published', mahakal_id);

  -- Ayodhya Ram Mandir
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Ram Raksha Stotra Path', 'Path for protection and peace, with sankalp.', 30, 999, 'pooja', 'published', ayodhya_id),
  ('Sundarkand Path', 'Hanumanji focused path for strength and success.', 90, 4100, 'pooja', 'published', ayodhya_id),
  ('Special Aarti Sankalp', 'Name sankalp during evening aarti.', 15, 501, 'live_darshan', 'published', ayodhya_id);

  -- Shirdi
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Sai Satyanarayan Pooja', 'Pooja for prosperity and family wellbeing.', 90, 3500, 'pooja', 'published', shirdi_id),
  ('Udi Prasad Delivery', 'Arrange udi and prasad shipping details.', 10, 499, 'prasadam', 'published', shirdi_id),
  ('Thursday Special Darshan Support', 'Help planning darshan on peak day.', 20, 799, 'darshan', 'published', shirdi_id);

  -- Siddhivinayak
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Ganesh Atharvashirsha Path', 'Path and sankalp for removing obstacles.', 30, 999, 'pooja', 'published', siddhi_id),
  ('Modak Bhog Offering', 'Offer modak bhog with name sankalp.', 15, 501, 'pooja', 'published', siddhi_id),
  ('Fast Darshan Assistance', 'Queue guidance and timing help.', 15, 399, 'darshan', 'published', siddhi_id);

  -- Kalighat
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Kali Maa Special Archana', 'Archana for strength, protection, and courage.', 45, 2100, 'pooja', 'published', kalighat_id),
  ('Durga Saptashati Path', 'Recitation for victory over obstacles and inner power.', 120, 8500, 'pooja', 'published', kalighat_id);

  -- Kamakhya
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Kamakhya Devi Sankalp Pooja', 'Sankalp ritual for blessings and wishes.', 60, 5100, 'pooja', 'published', kamakhya_id),
  ('Navarna Mantra Jaap', 'Focused chanting for devotion and clarity.', 90, 9500, 'pooja', 'published', kamakhya_id);

  -- Badrinath
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Vishnu Sahasranama Path', 'Recitation for protection and wellbeing.', 45, 2100, 'pooja', 'published', badrinath_id),
  ('Badri Kedar Sankalp', 'Sankalp ritual for safe travel and blessings.', 30, 999, 'pooja', 'published', badrinath_id);

  -- Rameshwaram
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Shiva Abhishek (Rameshwaram)', 'Abhishek with sacred offerings and chanting.', 45, 3100, 'pooja', 'published', rameshwaram_id),
  ('Theertham Snan Guidance', 'Guidance and scheduling support for theertham baths.', 20, 799, 'darshan', 'published', rameshwaram_id);

  -- Sabarimala
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Ayyappa Mala Sankalp', 'Sankalp and guidance for devotees undertaking vrat.', 20, 999, 'darshan', 'published', sabarimala_id),
  ('Harivarasanam Aarti Sankalp', 'Name sankalp during evening prayers.', 15, 501, 'live_darshan', 'published', sabarimala_id);

  -- Dwarka
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Dwarkadhish Mangala Aarti Sankalp', 'Name sankalp during early aarti.', 15, 501, 'live_darshan', 'published', dwarka_id),
  ('Krishna Archana', 'Archana with bhog offering for blessings.', 30, 1500, 'pooja', 'published', dwarka_id);

  -- Shrinathji
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Shrinathji Seva Booking Support', 'Assistance for seva timing and darshan planning.', 20, 999, 'darshan', 'published', shrinathji_id),
  ('Pushti Marg Bhog Offering', 'Bhog offering with sankalp and acknowledgement.', 15, 1100, 'pooja', 'published', shrinathji_id);

  -- ISKCON
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Kirtan Sankalp', 'Dedicate kirtan for your family or occasion.', 15, 501, 'live_darshan', 'published', iskcon_id),
  ('Bhagavatam Class Pass', 'Attend guided session and receive prasad.', 60, 399, 'event', 'published', iskcon_id);

  -- Akshardham
  INSERT INTO services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id) VALUES
  ('Evening Aarti Entry Guidance', 'Guidance for best arrival time and entry flow.', 15, 299, 'darshan', 'published', akshardham_id),
  ('Exhibit Combo Pass Guidance', 'Planning support for exhibits and temple visit.', 30, 399, 'event', 'published', akshardham_id);

END $$;

-- 4. STREAMS
DO $$
DECLARE
  kashi_id uuid;
  somnath_id uuid;
  golden_id uuid;
  jagannath_id uuid;
  kedarnath_id uuid;
  tirupati_id uuid;
  vaishno_id uuid;
  mahakal_id uuid;
  ayodhya_id uuid;
  shirdi_id uuid;
  siddhi_id uuid;
  meenakshi_id uuid;
  rameshwaram_id uuid;
  dwarka_id uuid;
  iskcon_id uuid;
BEGIN
  SELECT id INTO kashi_id FROM temples WHERE slug = 'kashi-vishwanath';
  SELECT id INTO somnath_id FROM temples WHERE slug = 'somnath';
  SELECT id INTO golden_id FROM temples WHERE slug = 'golden-temple';
  SELECT id INTO jagannath_id FROM temples WHERE slug = 'jagannath-puri';
  SELECT id INTO kedarnath_id FROM temples WHERE slug = 'kedarnath';
  SELECT id INTO tirupati_id FROM temples WHERE slug = 'tirupati';
  SELECT id INTO vaishno_id FROM temples WHERE slug = 'vaishno-devi';
  SELECT id INTO mahakal_id FROM temples WHERE slug = 'mahakaleshwar';
  SELECT id INTO ayodhya_id FROM temples WHERE slug = 'ram-mandir-ayodhya';
  SELECT id INTO shirdi_id FROM temples WHERE slug = 'shirdi';
  SELECT id INTO siddhi_id FROM temples WHERE slug = 'siddhivinayak';
  SELECT id INTO meenakshi_id FROM temples WHERE slug = 'meenakshi';
  SELECT id INTO rameshwaram_id FROM temples WHERE slug = 'rameshwaram';
  SELECT id INTO dwarka_id FROM temples WHERE slug = 'dwarkadhish';
  SELECT id INTO iskcon_id FROM temples WHERE slug = 'iskcon-delhi';

  INSERT INTO streams (stream_type, temple_id, title, status, viewer_count, playback_url, thumbnail_path) VALUES
  ('public', kashi_id, 'Live: Kashi Vishwanath Mangala Aarti', 'live', 3420, 'https://www.youtube.com/embed/PzAjQD7JEDk?autoplay=1&mute=1', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1000'),
  ('public', kashi_id, 'Live: Ganga Aarti from Dashashwamedh Ghat', 'live', 9800, 'https://www.youtube.com/embed/PzAjQD7JEDk?autoplay=1&mute=1', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1000'),

  ('public', somnath_id, 'Somnath Temple Darshan', 'live', 1205, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1626125345510-4603468ee534?auto=format&fit=crop&q=80&w=1000'),
  ('public', somnath_id, 'Evening Aarti Highlights', 'scheduled', 0, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1626125345510-4603468ee534?auto=format&fit=crop&q=80&w=1000'),

  ('public', golden_id, 'Gurbani Kirtan Live', 'live', 8900, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=1000'),
  ('public', golden_id, 'Langar Seva Live Feed', 'scheduled', 0, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=1000'),

  ('public', jagannath_id, 'Puri: Daily Sandhya Aarti', 'live', 2100, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1597576222883-7c87c0e88103?auto=format&fit=crop&q=80&w=1000'),
  ('public', meenakshi_id, 'Madurai: Deeparadhana Live', 'live', 1650, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1582510003544-4d00b7f5feee?auto=format&fit=crop&q=80&w=1000'),

  ('public', kedarnath_id, 'Kedarnath: Morning Darshan', 'scheduled', 0, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1605649486169-3236275d2904?auto=format&fit=crop&q=80&w=1000'),
  ('public', tirupati_id, 'Tirupati: Suprabhatam Live', 'live', 5400, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1602573981445-9b2f4b9b1b89?auto=format&fit=crop&q=80&w=1000'),

  ('public', vaishno_id, 'Vaishno Devi: Cave Shrine Darshan', 'live', 4300, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&q=80&w=1000'),
  ('public', mahakal_id, 'Ujjain: Bhasma Aarti Feed', 'scheduled', 0, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000'),

  ('public', ayodhya_id, 'Ayodhya: Evening Aarti Live', 'live', 3200, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1619022950547-1d7f1f2d996a?auto=format&fit=crop&q=80&w=1000'),
  ('public', shirdi_id, 'Shirdi: Kakad Aarti Live', 'live', 6100, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1609340823350-2b40b3a85a9a?auto=format&fit=crop&q=80&w=1000'),

  ('public', siddhi_id, 'Mumbai: Siddhivinayak Morning Darshan', 'live', 2700, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1604937455095-efb94b3d9f71?auto=format&fit=crop&q=80&w=1000'),
  ('public', dwarka_id, 'Dwarka: Mangala Aarti', 'scheduled', 0, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&q=80&w=1000'),

  ('public', rameshwaram_id, 'Rameshwaram: Abhishek Live', 'live', 1400, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1580745294621-1f4b5e2dbd8d?auto=format&fit=crop&q=80&w=1000'),
  ('public', iskcon_id, 'Delhi: Evening Kirtan', 'live', 1900, 'https://www.youtube.com/embed/live_stream_id', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000');
END $$;
