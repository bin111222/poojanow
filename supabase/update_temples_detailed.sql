-- ============================================================
-- Update Temples with Detailed Information
-- This script enriches existing temple records with comprehensive details
-- Run this AFTER migration 004_enhance_temples.sql
-- ============================================================

-- Helper function to get a random element from array
CREATE OR REPLACE FUNCTION pick(arr text[]) RETURNS text AS $$
BEGIN
  RETURN arr[1 + floor(random() * array_length(arr, 1))::int];
END;
$$ LANGUAGE plpgsql;

-- Update temples with detailed information
-- This uses the temple name and deity to generate contextually appropriate content

UPDATE temples SET
  history = CASE 
    WHEN name ILIKE '%Kashi%' OR name ILIKE '%Vishwanath%' THEN 
      'Kashi Vishwanath Temple, also known as the Golden Temple, is one of the most sacred Hindu temples dedicated to Lord Shiva. Located in the holy city of Varanasi, it stands on the western bank of the Ganges River. The temple has been destroyed and rebuilt several times throughout history, with the current structure dating back to 1780. It is one of the twelve Jyotirlingas, the holiest of Shiva temples. The temple complex includes several smaller shrines and is a major pilgrimage destination for devotees seeking moksha (liberation).'
    WHEN name ILIKE '%Krishna%' OR deity ILIKE '%Krishna%' THEN 
      'This sacred temple is dedicated to Lord Krishna, one of the most beloved deities in Hinduism. The temple holds immense spiritual significance as it is believed to be associated with the divine pastimes of Lord Krishna. Devotees from across the world visit this temple to seek blessings and experience the divine presence. The temple architecture reflects traditional Indian temple design with intricate carvings and beautiful sculptures depicting scenes from Krishna''s life.'
    WHEN name ILIKE '%Somnath%' OR name ILIKE '%Shiva%' OR deity ILIKE '%Shiva%' THEN 
      'This ancient temple dedicated to Lord Shiva is one of the most revered pilgrimage sites in India. The temple has a rich history spanning thousands of years and has been mentioned in ancient scriptures. It is believed to be one of the twelve Jyotirlingas, making it one of the holiest Shiva temples. The temple has witnessed destruction and reconstruction multiple times, yet it continues to stand as a symbol of faith and resilience. Devotees visit to seek blessings, perform rituals, and experience the divine energy.'
    WHEN name ILIKE '%Meenakshi%' OR name ILIKE '%Parvati%' OR deity ILIKE '%Parvati%' THEN 
      'This magnificent temple is dedicated to Goddess Meenakshi (Parvati) and Lord Sundareshwarar (Shiva). The temple complex is renowned for its stunning architecture, featuring towering gopurams (gateway towers) adorned with thousands of colorful sculptures. The temple has a history dating back over 2,000 years and is considered one of the most important pilgrimage sites in South India. The temple hosts numerous festivals throughout the year, attracting millions of devotees.'
    WHEN name ILIKE '%Golden%' OR name ILIKE '%Amritsar%' THEN 
      'The Golden Temple, also known as Harmandir Sahib, is the holiest Gurdwara of Sikhism. Located in Amritsar, Punjab, it is surrounded by the sacred Amrit Sarovar (Pool of Nectar). The temple was built in the 16th century and features stunning golden architecture. It is a symbol of equality, peace, and brotherhood, welcoming people from all faiths. The temple serves free meals (langar) to thousands of visitors daily, regardless of their background.'
    WHEN name ILIKE '%Kedarnath%' THEN 
      'Kedarnath Temple is one of the holiest Hindu temples dedicated to Lord Shiva, located in the Garhwal Himalayan range near the Mandakini river. It is one of the twelve Jyotirlingas and is part of the Char Dham pilgrimage circuit. The temple is situated at an altitude of 3,583 meters and is accessible only during summer months. The temple has withstood natural disasters and continues to be a major pilgrimage destination for devotees seeking spiritual elevation.'
    WHEN name ILIKE '%Jagannath%' OR name ILIKE '%Puri%' THEN 
      'The Jagannath Temple in Puri is one of the Char Dham pilgrimage sites and is dedicated to Lord Jagannath, a form of Lord Vishnu. The temple is famous for its annual Rath Yatra (chariot festival), where the deities are taken out in grand processions. The temple has a unique tradition where non-Hindus are not allowed inside, and the temple kitchen is one of the largest in the world, serving thousands of devotees daily.'
    WHEN name ILIKE '%Venkateswara%' OR name ILIKE '%Tirumala%' OR name ILIKE '%Tirupati%' THEN 
      'Tirumala Venkateswara Temple is one of the richest and most visited temples in the world, dedicated to Lord Venkateswara, an incarnation of Lord Vishnu. Located in the hill town of Tirumala, the temple attracts millions of devotees annually. The temple is renowned for its unique traditions, including the practice of tonsuring (shaving head) as an offering. The temple complex includes several smaller shrines and is known for its strict security and organized darshan system.'
    WHEN name ILIKE '%Ganesh%' OR name ILIKE '%Ganapati%' OR deity ILIKE '%Ganesh%' THEN 
      'This temple is dedicated to Lord Ganesha, the remover of obstacles and the god of wisdom and beginnings. Devotees visit this temple before starting any new venture or important task. The temple is known for its vibrant atmosphere, especially during Ganesh Chaturthi festival. The deity is worshipped with great devotion, and the temple hosts various rituals and ceremonies throughout the year.'
    WHEN name ILIKE '%Lakshmi%' OR deity ILIKE '%Lakshmi%' THEN 
      'This sacred temple is dedicated to Goddess Lakshmi, the goddess of wealth, prosperity, and fortune. Devotees visit to seek blessings for financial prosperity and overall well-being. The temple is especially crowded during Diwali and other auspicious occasions. Special poojas and rituals are performed to invoke the blessings of the goddess.'
    WHEN name ILIKE '%Ram%' OR deity ILIKE '%Ram%' THEN 
      'This temple is dedicated to Lord Rama, the seventh avatar of Lord Vishnu and the hero of the epic Ramayana. The temple holds great significance for devotees who revere Lord Rama as the ideal king and embodiment of dharma. The temple architecture and rituals reflect the devotion to this beloved deity.'
    WHEN name ILIKE '%Hanuman%' OR deity ILIKE '%Hanuman%' THEN 
      'This temple is dedicated to Lord Hanuman, the devoted servant of Lord Rama and a symbol of strength, devotion, and selfless service. Devotees visit to seek courage, protection, and spiritual strength. The temple is especially popular on Tuesdays and Saturdays, which are considered auspicious days for Hanuman worship.'
    ELSE 
      'This ancient temple holds great spiritual significance and has been a center of devotion for centuries. The temple has a rich history and tradition, attracting devotees from far and wide. The divine presence and sacred atmosphere make it a place of peace and spiritual elevation. The temple continues to serve as a beacon of faith and devotion for countless pilgrims.'
  END,
  
  architecture = CASE 
    WHEN state IN ('Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh') THEN 
      'The temple features magnificent Dravidian architecture with towering gopurams (gateway towers) adorned with intricate sculptures and colorful paintings. The temple complex includes multiple halls, shrines, and a large courtyard. The main sanctum is built with traditional stone and features elaborate carvings depicting various deities and mythological scenes.'
    WHEN state IN ('Rajasthan', 'Gujarat', 'Madhya Pradesh') THEN 
      'The temple showcases beautiful North Indian temple architecture with a shikhara (spire) rising above the main sanctum. The temple features intricate marble work, detailed carvings, and beautiful paintings. The complex includes multiple pavilions, halls, and smaller shrines. The architecture reflects the rich cultural heritage of the region.'
    WHEN state IN ('Uttar Pradesh', 'Bihar', 'West Bengal') THEN 
      'The temple exhibits traditional North Indian architecture with a prominent shikhara and multiple smaller spires. The temple complex includes spacious halls, courtyards, and various shrines. The architecture incorporates elements of both ancient and medieval Indian temple design, creating a harmonious blend of styles.'
    WHEN state IN ('Uttarakhand', 'Himachal Pradesh') THEN 
      'The temple features Himalayan temple architecture, designed to withstand harsh mountain weather. The structure is built with local stone and wood, featuring sloping roofs and sturdy construction. The temple complex includes accommodation facilities for pilgrims and various shrines dedicated to different deities.'
    ELSE 
      'The temple features traditional Indian temple architecture with beautiful carvings, sculptures, and intricate designs. The temple complex includes the main sanctum, halls for rituals, and various smaller shrines. The architecture reflects the rich cultural and spiritual heritage of the region.'
  END,
  
  significance = CASE 
    WHEN name ILIKE '%Jyotirlinga%' OR name ILIKE '%Vishwanath%' OR name ILIKE '%Somnath%' OR name ILIKE '%Kedarnath%' THEN 
      'This temple is one of the twelve Jyotirlingas, the holiest shrines dedicated to Lord Shiva. A visit to this temple is believed to grant moksha (liberation) and remove all sins. The temple holds immense spiritual significance and is considered a must-visit pilgrimage destination for every Shiva devotee.'
    WHEN name ILIKE '%Char Dham%' OR name ILIKE '%Kedarnath%' OR name ILIKE '%Badrinath%' OR name ILIKE '%Jagannath%' OR name ILIKE '%Rameshwaram%' THEN 
      'This temple is part of the Char Dham pilgrimage circuit, one of the most sacred pilgrimage routes in Hinduism. A complete pilgrimage to all four Dhams is believed to grant salvation. The temple holds special significance in Hindu mythology and is visited by millions of devotees seeking spiritual elevation.'
    WHEN name ILIKE '%Krishna%' THEN 
      'This temple is of great significance as it is associated with the divine pastimes of Lord Krishna. Devotees visit to experience the divine love and teachings of Lord Krishna. The temple is especially important for followers of Vaishnavism and those seeking spiritual guidance.'
    WHEN name ILIKE '%Ganesh%' THEN 
      'This temple dedicated to Lord Ganesha is considered highly auspicious. Devotees visit before starting any new venture, as Lord Ganesha is the remover of obstacles. The temple is especially significant during Ganesh Chaturthi and other festivals dedicated to the deity.'
    ELSE 
      'This temple holds great spiritual significance and is considered a powerful center of divine energy. Devotees visit to seek blessings, perform rituals, and experience spiritual peace. The temple is known for fulfilling the wishes of sincere devotees and is a place of transformation and spiritual growth.'
  END,
  
  timings = CASE 
    WHEN random() < 0.3 THEN '5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM'
    WHEN random() < 0.6 THEN '6:00 AM - 1:00 PM, 3:00 PM - 8:00 PM'
    ELSE '5:30 AM - 12:30 PM, 4:30 PM - 9:30 PM'
  END,
  
  best_time_to_visit = CASE 
    WHEN state IN ('Uttarakhand', 'Himachal Pradesh', 'Jammu and Kashmir') THEN 
      'Best visited during summer months (May to October) when the weather is pleasant. The temple may be inaccessible during winter due to heavy snowfall.'
    WHEN state IN ('Rajasthan', 'Gujarat') THEN 
      'Best visited during winter months (November to February) when the weather is cool and pleasant. Avoid visiting during peak summer (April to June) due to extreme heat.'
    WHEN state IN ('Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh') THEN 
      'Can be visited year-round, but the best time is during winter (November to February) when the weather is most pleasant. Monsoon season (June to September) brings heavy rainfall.'
    ELSE 
      'Can be visited throughout the year. However, the best time is during winter (October to March) when the weather is pleasant. Festivals and special occasions are particularly auspicious times to visit.'
  END,
  
  festivals = CASE 
    WHEN deity ILIKE '%Shiva%' THEN ARRAY['Maha Shivaratri', 'Shravan Month', 'Kartik Purnima', 'Pradosh']
    WHEN deity ILIKE '%Krishna%' THEN ARRAY['Janmashtami', 'Holi', 'Govardhan Puja', 'Radhashtami']
    WHEN deity ILIKE '%Ganesh%' THEN ARRAY['Ganesh Chaturthi', 'Vinayaka Chaturthi', 'Sankashti Chaturthi']
    WHEN deity ILIKE '%Lakshmi%' THEN ARRAY['Diwali', 'Lakshmi Puja', 'Varalakshmi Vratam']
    WHEN deity ILIKE '%Ram%' THEN ARRAY['Ram Navami', 'Dussehra', 'Diwali']
    WHEN deity ILIKE '%Hanuman%' THEN ARRAY['Hanuman Jayanti', 'Tuesday Puja', 'Saturday Puja']
    WHEN deity ILIKE '%Venkateswara%' OR name ILIKE '%Tirumala%' THEN ARRAY['Brahmotsavam', 'Vaikunta Ekadashi', 'Rathasapthami']
    WHEN name ILIKE '%Jagannath%' THEN ARRAY['Rath Yatra', 'Snana Yatra', 'Nabakalebara']
    ELSE ARRAY['Diwali', 'Navratri', 'Maha Shivaratri', 'Janmashtami']
  END,
  
  special_rituals = CASE 
    WHEN deity ILIKE '%Shiva%' THEN ARRAY['Rudrabhishek', 'Maha Mrityunjaya Jaap', 'Ling Abhishek', 'Bhasma Aarti']
    WHEN deity ILIKE '%Krishna%' THEN ARRAY['Mangala Aarti', 'Shringar Aarti', 'Rajbhog Aarti', 'Shayan Aarti']
    WHEN deity ILIKE '%Ganesh%' THEN ARRAY['Ganapati Homam', 'Modak Offering', 'Sankashti Puja']
    WHEN deity ILIKE '%Lakshmi%' THEN ARRAY['Lakshmi Puja', 'Chanting of Lakshmi Mantras', 'Abhishek with Milk and Honey']
    ELSE ARRAY['Morning Aarti', 'Evening Aarti', 'Abhishek', 'Special Pooja']
  END,
  
  phone = CASE 
    WHEN random() < 0.5 THEN '+91-' || (1000000000 + floor(random() * 9000000000)::bigint)::text
    ELSE NULL
  END,
  
  email = CASE 
    WHEN random() < 0.4 THEN lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g')) || '@temple.org'
    ELSE NULL
  END,
  
  website = CASE 
    WHEN random() < 0.3 THEN 'https://www.' || lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g')) || 'temple.org'
    ELSE NULL
  END,
  
  established_year = CASE 
    WHEN name ILIKE '%ancient%' OR name ILIKE '%old%' THEN 1000 + floor(random() * 1000)::int
    WHEN random() < 0.3 THEN 1800 + floor(random() * 100)::int
    WHEN random() < 0.6 THEN 1900 + floor(random() * 100)::int
    ELSE 2000 + floor(random() * 24)::int
  END,
  
  visiting_hours = timings || '. Special darshan available on request. Closed during specific rituals.',
  
  dress_code = 'Modest traditional attire preferred. Men should wear dhoti or pants with shirt. Women should wear saree, salwar kameez, or traditional dress. Avoid revealing clothing.',
  
  photography_allowed = CASE WHEN random() < 0.7 THEN true ELSE false END,
  
  parking_available = CASE WHEN random() < 0.8 THEN true ELSE false END,
  
  accommodation_nearby = CASE 
    WHEN random() < 0.6 THEN 'Several guesthouses and hotels available within 1-2 km. Temple also provides basic accommodation for devotees on first-come-first-serve basis.'
    ELSE 'Limited accommodation available. It is recommended to book in advance during peak seasons and festivals.'
  END,
  
  nearby_attractions = CASE 
    WHEN state IN ('Uttar Pradesh', 'Bihar') THEN ARRAY['Ganges River', 'Other Temples', 'Spiritual Centers', 'Markets']
    WHEN state IN ('Tamil Nadu', 'Kerala') THEN ARRAY['Beaches', 'Other Temples', 'Heritage Sites', 'Markets']
    WHEN state IN ('Rajasthan', 'Gujarat') THEN ARRAY['Fort', 'Palace', 'Markets', 'Museums']
    WHEN state IN ('Uttarakhand', 'Himachal Pradesh') THEN ARRAY['Mountain Views', 'Trekking Trails', 'Other Temples', 'Natural Springs']
    ELSE ARRAY['Other Temples', 'Markets', 'Heritage Sites', 'Local Attractions']
  END,
  
  how_to_reach = CASE 
    WHEN state IN ('Uttarakhand', 'Himachal Pradesh') THEN 
      'Nearest airport: ' || city || ' Airport. Nearest railway station: ' || city || ' Railway Station. Regular bus services available from major cities. The temple is accessible by road, and the last stretch may require trekking during certain seasons.'
    ELSE 
      'Nearest airport: ' || city || ' Airport. Nearest railway station: ' || city || ' Railway Station. Well connected by road with regular bus and taxi services. Auto-rickshaws and local transport available from the city center.'
  END,
  
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1626125345510-4603468ee534?auto=format&fit=crop&q=80&w=800'
  ],
  
  featured = CASE WHEN random() < 0.2 THEN true ELSE false END

WHERE status = 'published';

-- Update description to be more detailed if it's too short
UPDATE temples 
SET description = description || ' This sacred temple is a center of devotion and spirituality, attracting devotees from across the world. The temple complex includes multiple shrines, halls for rituals, and facilities for devotees. The divine atmosphere and powerful energy make it a place of transformation and spiritual growth.'
WHERE status = 'published' AND (description IS NULL OR length(description) < 100);

-- Clean up helper function
DROP FUNCTION IF EXISTS pick(text[]);

-- Display summary
SELECT 
  'Temples Updated' as status,
  COUNT(*) as count,
  COUNT(CASE WHEN history IS NOT NULL THEN 1 END) as with_history,
  COUNT(CASE WHEN architecture IS NOT NULL THEN 1 END) as with_architecture,
  COUNT(CASE WHEN significance IS NOT NULL THEN 1 END) as with_significance,
  COUNT(CASE WHEN festivals IS NOT NULL THEN 1 END) as with_festivals
FROM temples
WHERE status = 'published';


