-- Seed Service Packages
-- This creates example packages for services
-- Run this AFTER migration 005_add_service_packages.sql

-- Helper function to get service IDs
DO $$
DECLARE
  v_service_id uuid;
  v_basic_package_id uuid;
  v_standard_package_id uuid;
  v_premium_package_id uuid;
  v_offering_id uuid;
BEGIN
  -- Loop through published services with active single pooja
  FOR v_service_id IN 
    SELECT id FROM services 
    WHERE status = 'published' 
    AND is_active_single_pooja = true
    LIMIT 20 -- Limit to first 20 services for seeding
  LOOP
    -- Create Basic Package
    INSERT INTO service_packages (service_id, package_name, package_description, base_price_inr, sort_order, is_popular, is_recommended, active)
    VALUES (
      v_service_id,
      'Basic',
      'Essential pooja with standard offerings. Perfect for regular worship and seeking blessings.',
      (SELECT base_price_inr FROM services WHERE id = v_service_id) * 0.8, -- 80% of base price
      1,
      false,
      false,
      true
    )
    RETURNING id INTO v_basic_package_id;

    -- Create Standard Package (Popular)
    INSERT INTO service_packages (service_id, package_name, package_description, base_price_inr, sort_order, is_popular, is_recommended, active)
    VALUES (
      v_service_id,
      'Standard',
      'Comprehensive pooja with enhanced offerings. Includes special prasad and extended rituals.',
      (SELECT base_price_inr FROM services WHERE id = v_service_id), -- 100% of base price
      2,
      true,
      true,
      true
    )
    RETURNING id INTO v_standard_package_id;

    -- Create Premium Package
    INSERT INTO service_packages (service_id, package_name, package_description, base_price_inr, sort_order, is_popular, is_recommended, active)
    VALUES (
      v_service_id,
      'Premium',
      'Complete pooja experience with premium offerings, extended rituals, and special blessings. Best for special occasions.',
      (SELECT base_price_inr FROM services WHERE id = v_service_id) * 1.5, -- 150% of base price
      3,
      false,
      false,
      true
    )
    RETURNING id INTO v_premium_package_id;

    -- Add offerings to packages (if offerings exist for the temple)
    -- Basic Package - minimal offerings
    FOR v_offering_id IN 
      SELECT id FROM offerings 
      WHERE temple_id = (SELECT temple_id FROM services WHERE id = v_service_id)
      AND active = true
      ORDER BY price_inr ASC
      LIMIT 2
    LOOP
      INSERT INTO service_package_offerings (package_id, offering_id, quantity, included)
      VALUES (v_basic_package_id, v_offering_id, 1, true)
      ON CONFLICT (package_id, offering_id) DO NOTHING;
    END LOOP;

    -- Standard Package - more offerings
    FOR v_offering_id IN 
      SELECT id FROM offerings 
      WHERE temple_id = (SELECT temple_id FROM services WHERE id = v_service_id)
      AND active = true
      ORDER BY price_inr ASC
      LIMIT 4
    LOOP
      INSERT INTO service_package_offerings (package_id, offering_id, quantity, included)
      VALUES (v_standard_package_id, v_offering_id, 1, true)
      ON CONFLICT (package_id, offering_id) DO NOTHING;
    END LOOP;

    -- Premium Package - all offerings
    FOR v_offering_id IN 
      SELECT id FROM offerings 
      WHERE temple_id = (SELECT temple_id FROM services WHERE id = v_service_id)
      AND active = true
    LOOP
      INSERT INTO service_package_offerings (package_id, offering_id, quantity, included)
      VALUES (v_premium_package_id, v_offering_id, 
        CASE WHEN random() < 0.7 THEN 1 ELSE 2 END, -- Some offerings with quantity 2
        true)
      ON CONFLICT (package_id, offering_id) DO NOTHING;
    END LOOP;

  END LOOP;
END $$;

-- Display summary
SELECT 
  'Service Packages Created' as status,
  COUNT(*) as total_packages,
  COUNT(DISTINCT service_id) as services_with_packages,
  COUNT(CASE WHEN is_popular = true THEN 1 END) as popular_packages,
  COUNT(CASE WHEN is_recommended = true THEN 1 END) as recommended_packages
FROM service_packages;

SELECT 
  'Package Offerings Created' as status,
  COUNT(*) as total_offerings_linked
FROM service_package_offerings;


