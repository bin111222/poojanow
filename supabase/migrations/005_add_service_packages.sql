-- Migration: Add Service Packages System
-- This allows services to have multiple package tiers (Basic, Standard, Premium)
-- Similar to how gharmandir.in structures their pooja packages

-- 1. Service Packages Table
CREATE TABLE IF NOT EXISTS service_packages (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid references services(id) on delete cascade not null,
  package_name text not null, -- e.g., 'Basic', 'Standard', 'Premium', 'Deluxe'
  package_description text,
  base_price_inr int not null,
  sort_order int default 0,
  is_popular boolean default false, -- Highlight popular packages
  is_recommended boolean default false, -- Show as recommended
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Service Package Offerings (what's included in each package)
CREATE TABLE IF NOT EXISTS service_package_offerings (
  id uuid primary key default uuid_generate_v4(),
  package_id uuid references service_packages(id) on delete cascade not null,
  offering_id uuid references offerings(id) on delete cascade not null,
  quantity int default 1,
  included boolean default true, -- If false, it's an optional add-on
  created_at timestamptz default now(),
  UNIQUE(package_id, offering_id)
);

-- 3. Add package_id to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS package_id uuid references service_packages(id);

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_packages_service_id ON service_packages(service_id);
CREATE INDEX IF NOT EXISTS idx_service_packages_active ON service_packages(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_service_package_offerings_package_id ON service_package_offerings(package_id);
CREATE INDEX IF NOT EXISTS idx_service_package_offerings_offering_id ON service_package_offerings(offering_id);
CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON bookings(package_id);

-- 5. Add RLS policies
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_package_offerings ENABLE ROW LEVEL SECURITY;

-- Public can view active packages
CREATE POLICY "Public can view active service packages"
  ON service_packages FOR SELECT
  USING (active = true);

-- Public can view package offerings
CREATE POLICY "Public can view service package offerings"
  ON service_package_offerings FOR SELECT
  USING (true);

-- 6. Add helpful comments
COMMENT ON TABLE service_packages IS 'Different package tiers for services (e.g., Basic, Standard, Premium)';
COMMENT ON TABLE service_package_offerings IS 'Offerings included in each service package';
COMMENT ON COLUMN service_packages.is_popular IS 'Highlight this package as popular';
COMMENT ON COLUMN service_packages.is_recommended IS 'Show this package as recommended';
COMMENT ON COLUMN service_package_offerings.included IS 'If true, included in package. If false, optional add-on';

-- 7. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_service_packages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_packages_timestamp
  BEFORE UPDATE ON service_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_service_packages_updated_at();


