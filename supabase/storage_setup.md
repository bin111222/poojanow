# Supabase Storage Setup for Phase 1

## Required Storage Buckets

### 1. pooja-proofs (Private)
- **Purpose**: Store proof photos/videos uploaded by pandits
- **Access**: Private (signed URLs only)
- **Policy**: Only pandits assigned to booking and admins can upload

### Setup Commands (Run in Supabase SQL Editor):

```sql
-- Create the pooja-proofs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pooja-proofs', 'pooja-proofs', false);

-- Policy: Allow pandits and admins to upload proofs
CREATE POLICY "Pandits and admins can upload proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pooja-proofs' AND
  (
    -- Check if user is admin
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR
    -- Check if user is assigned pandit for this booking
    EXISTS (
      SELECT 1 FROM bookings
      WHERE id::text = (storage.foldername(name))[1]
      AND pandit_id = auth.uid()
    )
  )
);

-- Policy: Allow users to read proofs for their own bookings
CREATE POLICY "Users can read their own booking proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'pooja-proofs' AND
  EXISTS (
    SELECT 1 FROM bookings b
    JOIN booking_proofs bp ON bp.booking_id = b.id
    WHERE b.user_id = auth.uid()
    AND bp.storage_path = (bucket_id || '/' || name)
  )
);

-- Policy: Allow pandits and admins to read proofs
CREATE POLICY "Pandits and admins can read proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'pooja-proofs' AND
  (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN booking_proofs bp ON bp.booking_id = b.id
      WHERE b.pandit_id = auth.uid()
      AND bp.storage_path = (bucket_id || '/' || name)
    )
  )
);
```

### 2. certificates (Private)
- **Purpose**: Store auto-generated PDF certificates
- **Access**: Private (signed URLs only)
- **Policy**: Only users can read their own certificates

```sql
-- Create the certificates bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', false);

-- Policy: Users can read their own certificates
CREATE POLICY "Users can read their own certificates"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'certificates' AND
  EXISTS (
    SELECT 1 FROM bookings
    WHERE id::text = (storage.foldername(name))[1]
    AND user_id = auth.uid()
  )
);

-- Policy: Admins can upload certificates
CREATE POLICY "Admins can upload certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'certificates' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## Notes

- Replace `auth.uid()` with actual user ID checks in production
- The folder structure for proofs: `pooja-proofs/{bookingId}/{timestamp}-{random}.{ext}`
- The folder structure for certificates: `certificates/{bookingId}/certificate.pdf`


