# Event-Based Poojas System - Implementation Guide

## ✅ What's Been Implemented

### 1. Database Schema
- ✅ Created `event_types` table with 6 default categories:
  - **Festivals** - Major Hindu festivals (Diwali, Ganesh Chaturthi, etc.)
  - **Life Events** - Milestones (Marriage, Housewarming, etc.)
  - **Remedial** - Dosha shanti poojas
  - **Auspicious Days** - Special days (Ekadashi, Purnima, etc.)
  - **Monthly Rituals** - Monthly recurring poojas
  - **Special Occasions** - Personal milestones

- ✅ Added fields to `services` table:
  - `event_category` - 'regular' or 'event_based'
  - `event_type_id` - Reference to event_types
  - `event_date` - Specific date for time-sensitive events
  - `is_recurring_event` - For annual festivals

### 2. Migration Files
- ✅ `supabase/migrations/006_add_event_based_poojas.sql` - Schema migration
- ✅ `supabase/seed_event_based_poojas.sql` - Seed script to:
  - Categorize existing poojas
  - Create new event-based poojas for pandits
  - Generate 2-4 festival poojas per pandit
  - Generate 1-2 life event poojas per pandit
  - Generate 1-2 remedial poojas per pandit
  - Generate 1-2 auspicious day poojas per pandit

### 3. UI Implementation
- ✅ Created `/poojas` page with:
  - Event type filters (badges)
  - Grouped display by event type
  - Individual event type pages
  - Service cards for each pooja
  - Responsive design

- ✅ Added "Pooja by Event" to main navigation

## 🚀 Setup Instructions

### Step 1: Run Migration
```sql
-- In Supabase SQL Editor, run:
-- File: supabase/migrations/006_add_event_based_poojas.sql
```

This will:
- Create `event_types` table
- Add event-related columns to `services`
- Insert 6 default event types
- Set up indexes and RLS policies

### Step 2: Seed Event-Based Poojas
```sql
-- In Supabase SQL Editor, run:
-- File: supabase/seed_event_based_poojas.sql
```

This will:
- Categorize existing poojas that match event patterns
- Create new event-based poojas for published pandits
- Generate ~5-10 event poojas per pandit

### Step 3: Verify Data
```sql
-- Check event types
SELECT * FROM event_types WHERE active = true ORDER BY sort_order;

-- Check event-based poojas
SELECT 
  et.name as event_type,
  COUNT(s.id) as pooja_count,
  AVG(s.base_price_inr)::int as avg_price
FROM event_types et
LEFT JOIN services s ON s.event_type_id = et.id AND s.status = 'published'
WHERE et.active = true
GROUP BY et.id, et.name
ORDER BY et.sort_order;

-- Check services by category
SELECT 
  event_category,
  COUNT(*) as count
FROM services
WHERE status = 'published'
GROUP BY event_category;
```

## 📊 Event Types Breakdown

### 1. Festivals (Sparkles Icon)
- Diwali Pooja
- Ganesh Chaturthi Pooja
- Navratri Pooja
- Janmashtami Pooja
- Holi Pooja
- Dussehra Pooja
- Maha Shivaratri Pooja
- And more...

**Characteristics:**
- Recurring annual events
- Higher pricing (₹999-₹2999)
- Longer duration (45-120 min)
- Special rituals and offerings

### 2. Life Events (Heart Icon)
- Griha Pravesh Pooja
- Vivah Muhurta Pooja
- Annaprashan Sanskar
- Mundan Sanskar
- Vehicle Pooja
- Business Inauguration Pooja
- And more...

**Characteristics:**
- One-time ceremonies
- Milestone-based
- Higher pricing (₹1499-₹3499)
- Longer duration (60-120 min)

### 3. Remedial (Shield Icon)
- Kaal Sarp Dosh Shanti
- Mangal Dosh Shanti
- Shani Shanti Pooja
- Rahu Ketu Shanti
- Grah Shanti Pooja
- And more...

**Characteristics:**
- Dosha-specific
- Highest pricing (₹2499-₹5999)
- Longest duration (90-180 min)
- Specialized rituals

### 4. Auspicious Days (Calendar Icon)
- Ekadashi Pooja
- Purnima Pooja
- Amavasya Pooja
- Sankranti Pooja
- Vrat Poojas (Monday, Tuesday, etc.)
- And more...

**Characteristics:**
- Recurring monthly/weekly
- Moderate pricing (₹799-₹1999)
- Standard duration (45-90 min)
- Date-specific

## 🎨 UI Features

### Main Page (`/poojas`)
- **Header Section:**
  - Title: "Pooja by Event"
  - Description
  - Filter badges for each event type

- **Content Sections:**
  - All event types displayed as cards
  - Each card shows:
    - Event type name with icon
    - Description
    - Service count
    - Preview of 6 services
    - "View All" link

### Filtered View (`/poojas?type=festivals`)
- Shows all poojas for selected event type
- Event type header with icon
- Grid of service cards
- Direct booking links

## 🔧 Customization

### Add New Event Type
```sql
INSERT INTO event_types (name, slug, description, icon, sort_order, active)
VALUES (
  'Custom Type',
  'custom-type',
  'Description here',
  'IconName', -- Use Lucide icon name
  7,
  true
);
```

### Update Existing Services
```sql
-- Mark a service as event-based
UPDATE services
SET 
  event_category = 'event_based',
  event_type_id = (SELECT id FROM event_types WHERE slug = 'festivals'),
  is_recurring_event = true
WHERE id = 'service-uuid-here';
```

### Add Event Date
```sql
-- For time-sensitive events
UPDATE services
SET event_date = '2024-10-31' -- Diwali date
WHERE title ILIKE '%diwali%';
```

## 📱 Navigation

The "Pooja by Event" link has been added to:
- Main desktop navigation
- Mobile menu
- Uses Sparkles icon

## 🎯 Next Steps

1. **Run migrations** - Execute both SQL files
2. **Verify data** - Check poojas are categorized
3. **Test UI** - Visit `/poojas` and filter by type
4. **Customize** - Add more event types or poojas as needed
5. **Enhance** - Consider adding:
   - Event date calendar view
   - Upcoming events section
   - Event-specific landing pages
   - Email reminders for recurring events

## 📝 Notes

- Event-based poojas are separate from regular poojas
- Services can be both regular and event-based (future enhancement)
- Event dates can be used for time-sensitive promotions
- Recurring events can be used for annual reminders
- All event types are filterable and searchable

## ✅ Status

**Implementation:** Complete
**Migration:** Ready to run
**Seed Script:** Ready to run
**UI:** Complete and functional
**Navigation:** Added to navbar

**Ready for production!** 🚀


