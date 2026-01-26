-- Quick Fix: Run this to check and populate event-based poojas
-- This script will help diagnose and fix the issue

-- 1. Check if event_types exist
SELECT 'Event Types' as check_type, COUNT(*) as count FROM event_types WHERE active = true;

-- 2. Check if any services have event_category set
SELECT 
  'Services by Category' as check_type,
  event_category,
  COUNT(*) as count
FROM services
WHERE status = 'published'
GROUP BY event_category;

-- 3. Check if any services have event_type_id set
SELECT 
  'Services with Event Type' as check_type,
  COUNT(*) as count
FROM services
WHERE status = 'published' 
  AND event_type_id IS NOT NULL;

-- 4. If no event-based poojas exist, run this to quickly categorize some existing poojas
-- This will mark existing poojas as event-based based on their titles
UPDATE services
SET 
  event_category = 'event_based',
  event_type_id = (
    SELECT id FROM event_types WHERE slug = 
      CASE
        WHEN title ILIKE '%diwali%' OR title ILIKE '%ganesh%' OR title ILIKE '%navratri%' 
             OR title ILIKE '%janmashtami%' OR title ILIKE '%holi%' OR title ILIKE '%dussehra%'
             OR title ILIKE '%shivaratri%' OR title ILIKE '%durga%' OR title ILIKE '%lakshmi%'
             OR title ILIKE '%saraswati%' OR title ILIKE '%kali%' OR title ILIKE '%ram navami%'
             OR title ILIKE '%hanuman jayanti%'
        THEN 'festivals'
        
        WHEN title ILIKE '%griha%' OR title ILIKE '%vivah%' OR title ILIKE '%annaprashan%'
             OR title ILIKE '%mundan%' OR title ILIKE '%yagyopavit%' OR title ILIKE '%namkaran%'
             OR title ILIKE '%godh%' OR title ILIKE '%vehicle%' OR title ILIKE '%business%'
        THEN 'life-events'
        
        WHEN title ILIKE '%dosh%' OR title ILIKE '%shanti%' OR title ILIKE '%kaal sarp%'
             OR title ILIKE '%mangal%' OR title ILIKE '%shani%' OR title ILIKE '%rahu%'
             OR title ILIKE '%ketu%' OR title ILIKE '%pitru%' OR title ILIKE '%vastu dosha%'
             OR title ILIKE '%naga%' OR title ILIKE '%sarpa%'
        THEN 'remedial'
        
        WHEN title ILIKE '%ekadashi%' OR title ILIKE '%purnima%' OR title ILIKE '%amavasya%'
             OR title ILIKE '%sankranti%' OR title ILIKE '%pradosh%' OR title ILIKE '%vrat%'
        THEN 'auspicious-days'
        
        ELSE NULL
      END
  ),
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
  )
  AND event_category IS NULL; -- Only update if not already set

-- 5. Show summary after update
SELECT 
  'After Update' as status,
  event_category,
  COUNT(*) as count
FROM services
WHERE status = 'published'
GROUP BY event_category;

-- 6. Show event-based poojas by type
SELECT 
  et.name as event_type,
  COUNT(s.id) as pooja_count
FROM event_types et
LEFT JOIN services s ON s.event_type_id = et.id AND s.status = 'published'
WHERE et.active = true
GROUP BY et.id, et.name, et.sort_order
ORDER BY et.sort_order;


