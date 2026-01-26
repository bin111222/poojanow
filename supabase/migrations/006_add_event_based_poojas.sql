-- Migration: Add Event-Based Pooja Category
-- This adds support for organizing poojas by events/occasions

-- 1. Create event_types table for categorizing event-based poojas
CREATE TABLE IF NOT EXISTS event_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique, -- e.g., 'Festivals', 'Life Events', 'Remedial', 'Auspicious Days'
  slug text unique not null,
  description text,
  icon text, -- Icon name for UI
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- 2. Add event_type_id to services table
ALTER TABLE services
ADD COLUMN IF NOT EXISTS event_type_id uuid references event_types(id);

-- 3. Add event_category field to services (for quick filtering)
-- This allows services to be categorized as event-based or regular
ALTER TABLE services
ADD COLUMN IF NOT EXISTS event_category text check (event_category in ('regular', 'event_based')) default 'regular';

-- 4. Add event_date field for time-sensitive event poojas
ALTER TABLE services
ADD COLUMN IF NOT EXISTS event_date date; -- For poojas tied to specific dates (e.g., Diwali, Janmashtami)

-- 5. Add is_recurring_event field
ALTER TABLE services
ADD COLUMN IF NOT EXISTS is_recurring_event boolean default false; -- For annual festivals

-- 6. Create indexes
CREATE INDEX IF NOT EXISTS idx_services_event_type_id ON services(event_type_id);
CREATE INDEX IF NOT EXISTS idx_services_event_category ON services(event_category);
CREATE INDEX IF NOT EXISTS idx_services_event_date ON services(event_date);
CREATE INDEX IF NOT EXISTS idx_event_types_slug ON event_types(slug);
CREATE INDEX IF NOT EXISTS idx_event_types_active ON event_types(active) WHERE active = true;

-- 7. Enable RLS
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;

-- Public can view active event types
-- Drop policy if it exists (for idempotency)
DROP POLICY IF EXISTS "Public can view active event types" ON event_types;

CREATE POLICY "Public can view active event types"
  ON event_types FOR SELECT
  USING (active = true);

-- 8. Add helpful comments
COMMENT ON TABLE event_types IS 'Categories for event-based poojas (Festivals, Life Events, etc.)';
COMMENT ON COLUMN services.event_category IS 'Whether service is regular or event-based';
COMMENT ON COLUMN services.event_type_id IS 'Reference to event type (Festivals, Life Events, etc.)';
COMMENT ON COLUMN services.event_date IS 'Specific date for time-sensitive event poojas';
COMMENT ON COLUMN services.is_recurring_event IS 'Whether this is a recurring annual event';

-- 9. Insert default event types
INSERT INTO event_types (name, slug, description, icon, sort_order, active) VALUES
  ('Festivals', 'festivals', 'Poojas for major Hindu festivals and celebrations', 'Sparkles', 1, true),
  ('Life Events', 'life-events', 'Poojas for important life milestones and ceremonies', 'Heart', 2, true),
  ('Remedial', 'remedial', 'Poojas for dosha shanti and remedial measures', 'Shield', 3, true),
  ('Auspicious Days', 'auspicious-days', 'Poojas for special auspicious days and muhurtas', 'Calendar', 4, true),
  ('Monthly Rituals', 'monthly-rituals', 'Poojas performed on specific days each month', 'Moon', 5, true),
  ('Special Occasions', 'special-occasions', 'Poojas for special occasions and personal milestones', 'Star', 6, true)
ON CONFLICT (slug) DO NOTHING;

