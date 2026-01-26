-- Migration: Add detailed information fields to temples table
-- This adds comprehensive fields for rich temple detail pages

ALTER TABLE temples
ADD COLUMN IF NOT EXISTS history text,
ADD COLUMN IF NOT EXISTS architecture text,
ADD COLUMN IF NOT EXISTS significance text,
ADD COLUMN IF NOT EXISTS timings text,
ADD COLUMN IF NOT EXISTS best_time_to_visit text,
ADD COLUMN IF NOT EXISTS festivals text[],
ADD COLUMN IF NOT EXISTS special_rituals text[],
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS established_year integer,
ADD COLUMN IF NOT EXISTS visiting_hours text,
ADD COLUMN IF NOT EXISTS dress_code text,
ADD COLUMN IF NOT EXISTS photography_allowed boolean default true,
ADD COLUMN IF NOT EXISTS parking_available boolean default false,
ADD COLUMN IF NOT EXISTS accommodation_nearby text,
ADD COLUMN IF NOT EXISTS nearby_attractions text[],
ADD COLUMN IF NOT EXISTS how_to_reach text,
ADD COLUMN IF NOT EXISTS gallery_images text[],
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS featured boolean default false;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_temples_featured ON temples(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_temples_verified ON temples(verified) WHERE verified = true;
CREATE INDEX IF NOT EXISTS idx_temples_state ON temples(state);
CREATE INDEX IF NOT EXISTS idx_temples_city ON temples(city);

COMMENT ON COLUMN temples.history IS 'Historical background and origin story of the temple';
COMMENT ON COLUMN temples.architecture IS 'Architectural style and notable features';
COMMENT ON COLUMN temples.significance IS 'Religious and spiritual significance';
COMMENT ON COLUMN temples.timings IS 'Daily darshan timings';
COMMENT ON COLUMN temples.best_time_to_visit IS 'Recommended months or seasons to visit';
COMMENT ON COLUMN temples.festivals IS 'Array of major festivals celebrated at the temple';
COMMENT ON COLUMN temples.special_rituals IS 'Array of unique rituals or poojas performed';
COMMENT ON COLUMN temples.phone IS 'Contact phone number';
COMMENT ON COLUMN temples.email IS 'Contact email address';
COMMENT ON COLUMN temples.website IS 'Official website URL';
COMMENT ON COLUMN temples.established_year IS 'Year the temple was established or renovated';
COMMENT ON COLUMN temples.visiting_hours IS 'Detailed visiting hours information';
COMMENT ON COLUMN temples.dress_code IS 'Dress code requirements for visitors';
COMMENT ON COLUMN temples.photography_allowed IS 'Whether photography is allowed';
COMMENT ON COLUMN temples.parking_available IS 'Whether parking is available';
COMMENT ON COLUMN temples.accommodation_nearby IS 'Information about nearby accommodation';
COMMENT ON COLUMN temples.nearby_attractions IS 'Array of nearby tourist or spiritual attractions';
COMMENT ON COLUMN temples.how_to_reach IS 'Directions and transportation information';
COMMENT ON COLUMN temples.gallery_images IS 'Array of image URLs for gallery';
COMMENT ON COLUMN temples.video_url IS 'URL to video tour or promotional video';
COMMENT ON COLUMN temples.featured IS 'Whether to feature this temple prominently';


