-- Migration: Enhance Pandit Profiles with Additional Information
-- Adds fields for comprehensive pandit profile pages

-- Add experience and qualification fields
ALTER TABLE pandit_profiles 
ADD COLUMN IF NOT EXISTS years_of_experience int DEFAULT 0,
ADD COLUMN IF NOT EXISTS qualifications text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS certifications text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience_description text,
ADD COLUMN IF NOT EXISTS education text,
ADD COLUMN IF NOT EXISTS lineage text, -- Guru parampara/lineage
ADD COLUMN IF NOT EXISTS achievements text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_areas text[] DEFAULT '{}', -- Areas they serve
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 0.0, -- Average rating out of 5
ADD COLUMN IF NOT EXISTS total_reviews int DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_bookings int DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_time text, -- e.g., "Within 2 hours"
ADD COLUMN IF NOT EXISTS languages_spoken text[] DEFAULT '{}', -- Keep languages for backward compat
ADD COLUMN IF NOT EXISTS pooja_types text[] DEFAULT '{}', -- Types of poojas they perform
ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}', -- Array of image paths
ADD COLUMN IF NOT EXISTS video_url text, -- Introduction video URL
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false, -- Featured pandit
ADD COLUMN IF NOT EXISTS verified_at timestamptz, -- When they were verified
ADD COLUMN IF NOT EXISTS joined_at timestamptz DEFAULT now();

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pandit_profiles_rating ON pandit_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_pandit_profiles_featured ON pandit_profiles(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_pandit_profiles_total_bookings ON pandit_profiles(total_bookings DESC);
CREATE INDEX IF NOT EXISTS idx_pandit_profiles_joined_at ON pandit_profiles(joined_at DESC);

-- Add comments for documentation
COMMENT ON COLUMN pandit_profiles.years_of_experience IS 'Years of experience performing poojas';
COMMENT ON COLUMN pandit_profiles.qualifications IS 'Array of qualifications (e.g., ["Vedic Scholar", "Sanskrit Expert"])';
COMMENT ON COLUMN pandit_profiles.certifications IS 'Array of certifications received';
COMMENT ON COLUMN pandit_profiles.lineage IS 'Guru parampara or spiritual lineage';
COMMENT ON COLUMN pandit_profiles.service_areas IS 'Geographic areas where pandit provides services';
COMMENT ON COLUMN pandit_profiles.pooja_types IS 'Types of poojas the pandit specializes in';

