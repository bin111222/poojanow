-- Phase 1: Foundation - Lock One Perfect Pooja Flow
-- Migration: Add scheduled time windows and proof requirements

-- 1. Add scheduled_start and scheduled_end to bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS scheduled_start timestamptz,
ADD COLUMN IF NOT EXISTS scheduled_end timestamptz;

-- 2. Add is_active_single_pooja flag to services (for Phase 1: only one pooja enabled)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS is_active_single_pooja boolean DEFAULT false;

-- 3. Add pooja_explanation text to services (hardcoded explanation for the single pooja)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS pooja_explanation text;

-- 4. Add SLA tracking columns to bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS proof_sla_hours int DEFAULT 2, -- Default 2 hours after scheduled_end
ADD COLUMN IF NOT EXISTS proof_sla_deadline timestamptz,
ADD COLUMN IF NOT EXISTS is_sla_breached boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sla_breached_at timestamptz;

-- 5. Add certificate_path to bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS certificate_path text;

-- 6. Create ops_issues table for SLA breach tracking (Phase 2)
CREATE TABLE IF NOT EXISTS ops_issues (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  issue_type text CHECK (issue_type IN ('proof_missing', 'sla_breach', 'proof_delayed', 'other')) DEFAULT 'proof_missing',
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status text CHECK (status IN ('open', 'acknowledged', 'resolved', 'escalated')) DEFAULT 'open',
  description text,
  resolved_by uuid REFERENCES profiles(id),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 7. Create payout_ledger table (Phase 3)
CREATE TABLE IF NOT EXISTS payout_ledger (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id) UNIQUE NOT NULL,
  total_amount_inr int NOT NULL,
  temple_share_inr int NOT NULL,
  pandit_share_inr int NOT NULL,
  platform_fee_inr int NOT NULL,
  status text CHECK (status IN ('pending', 'paid', 'held')) DEFAULT 'pending',
  paid_at timestamptz,
  paid_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- 8. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_start ON bookings(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_end ON bookings(scheduled_end);
CREATE INDEX IF NOT EXISTS idx_bookings_proof_sla_deadline ON bookings(proof_sla_deadline);
CREATE INDEX IF NOT EXISTS idx_bookings_is_sla_breached ON bookings(is_sla_breached);
CREATE INDEX IF NOT EXISTS idx_ops_issues_booking_id ON ops_issues(booking_id);
CREATE INDEX IF NOT EXISTS idx_ops_issues_status ON ops_issues(status);
CREATE INDEX IF NOT EXISTS idx_payout_ledger_booking_id ON payout_ledger(booking_id);
CREATE INDEX IF NOT EXISTS idx_payout_ledger_status ON payout_ledger(status);

-- 9. Enable RLS on new tables
ALTER TABLE ops_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_ledger ENABLE ROW LEVEL SECURITY;

-- 10. Mark Rudrabhishek as the active single pooja (update existing services)
UPDATE services 
SET is_active_single_pooja = true,
    pooja_explanation = 'Rudrabhishek is a powerful Vedic ritual dedicated to Lord Shiva. The pooja involves the ceremonial bathing (abhishek) of the Shiva Lingam with sacred substances including milk, curd, ghee, honey, sugar, and water. This ritual is performed to seek blessings, remove obstacles, and bring peace and prosperity. The chanting of Rudram and Chamakam mantras during the pooja amplifies its spiritual significance.'
WHERE title ILIKE '%rudrabhishek%' AND status = 'published';

-- Disable all other services temporarily
UPDATE services 
SET is_active_single_pooja = false
WHERE title NOT ILIKE '%rudrabhishek%';

