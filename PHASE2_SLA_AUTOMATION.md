# Phase 2.3: SLA Breach Automation - Setup Guide

## ✅ What's Been Implemented

### SLA Breach Checker API
- ✅ Created `/api/ops/check-sla-breaches` endpoint
- ✅ Checks bookings where `proof_sla_deadline` has passed
- ✅ Verifies proof count (must be >= 1)
- ✅ Marks bookings as `is_sla_breached = true`
- ✅ Creates `ops_issues` records with appropriate severity
- ✅ Prevents duplicate issue creation

### Severity Levels
The system automatically assigns severity based on how long past the deadline:
- **Low**: 0-6 hours past deadline
- **Medium**: 6-12 hours past deadline
- **High**: 12-24 hours past deadline
- **Critical**: >24 hours past deadline

## 🔧 Setup Options

### Option 1: Vercel Cron Jobs (Recommended for Vercel Deployments)

If you're deploying on Vercel, add this to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/ops/check-sla-breaches",
      "schedule": "0 * * * *"
    }
  ]
}
```

This runs every hour. Adjust the schedule as needed:
- `0 * * * *` - Every hour
- `*/30 * * * *` - Every 30 minutes
- `0 */2 * * *` - Every 2 hours

**Environment Variable:**
```env
CRON_SECRET=your-secret-token-here
```

Vercel will automatically include this in the `authorization` header.

### Option 2: External Cron Service

Use a service like:
- **cron-job.org** (free)
- **EasyCron** (free tier available)
- **GitHub Actions** (free for public repos)

**Setup Steps:**

1. **Get your API URL:**
   - Production: `https://yourdomain.com/api/ops/check-sla-breaches`
   - Development: Use ngrok: `ngrok http 3000` → `https://your-ngrok-url.ngrok.io/api/ops/check-sla-breaches`

2. **Set up cron job:**
   - URL: Your API endpoint
   - Method: POST
   - Schedule: Every hour (or as needed)
   - Headers: `Authorization: Bearer your-cron-secret`

3. **Set environment variable:**
   ```env
   CRON_SECRET=your-secret-token-here
   ```

### Option 3: Supabase Edge Function (Alternative)

If you prefer using Supabase Edge Functions:

1. Create a new Edge Function:
   ```bash
   supabase functions new check-sla-breaches
   ```

2. Copy the logic from `/api/ops/check-sla-breaches/route.ts`

3. Set up a cron trigger in Supabase:
   ```sql
   -- Create a function that calls the edge function
   CREATE OR REPLACE FUNCTION check_sla_breaches()
   RETURNS void AS $$
   BEGIN
     -- Call edge function via HTTP
     PERFORM net.http_post(
       url := 'https://your-project.supabase.co/functions/v1/check-sla-breaches',
       headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
     );
   END;
   $$ LANGUAGE plpgsql;

   -- Schedule with pg_cron (if enabled)
   SELECT cron.schedule(
     'check-sla-breaches',
     '0 * * * *', -- Every hour
     $$SELECT check_sla_breaches()$$
   );
   ```

### Option 4: Manual Testing

You can manually trigger the check:

```bash
# Using curl
curl -X POST https://yourdomain.com/api/ops/check-sla-breaches \
  -H "Authorization: Bearer your-cron-secret"

# Or without auth (if CRON_SECRET not set)
curl -X POST https://yourdomain.com/api/ops/check-sla-breaches
```

## 📋 How It Works

### 1. Detection Logic
- Finds bookings where `proof_sla_deadline < now()`
- Checks `is_sla_breached = false` (not already processed)
- Verifies proof count < 1

### 2. Processing
- Marks booking as `is_sla_breached = true`
- Sets `sla_breached_at = now()`
- Creates `ops_issues` record with:
  - `issue_type = 'sla_breach'`
  - `severity` based on hours past deadline
  - `status = 'open'`
  - Descriptive message

### 3. Duplicate Prevention
- Checks if `ops_issue` already exists for the booking
- Only creates new issue if none exists with `status = 'open'`

## 🧪 Testing

### 1. Create a Test Booking
```sql
-- Create a booking with past SLA deadline
INSERT INTO bookings (
  user_id,
  service_id,
  scheduled_start,
  scheduled_end,
  proof_sla_deadline,
  status,
  total_amount,
  currency
) VALUES (
  'user-uuid',
  'service-uuid',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day' + INTERVAL '1 hour',
  NOW() - INTERVAL '2 hours', -- Past deadline
  'confirmed',
  1000,
  'INR'
);
```

### 2. Run the Check
```bash
curl -X POST http://localhost:3000/api/ops/check-sla-breaches
```

### 3. Verify Results
```sql
-- Check if booking is marked
SELECT id, is_sla_breached, sla_breached_at 
FROM bookings 
WHERE id = 'your-booking-id';

-- Check if ops_issue was created
SELECT * FROM ops_issues 
WHERE booking_id = 'your-booking-id';
```

## 📊 Monitoring

### View SLA Breaches
```sql
-- All breached bookings
SELECT 
  b.id,
  b.scheduled_end,
  b.proof_sla_deadline,
  b.sla_breached_at,
  b.status,
  COUNT(bp.id) as proof_count
FROM bookings b
LEFT JOIN booking_proofs bp ON bp.booking_id = b.id 
  AND bp.status IN ('uploaded', 'approved')
WHERE b.is_sla_breached = true
GROUP BY b.id
ORDER BY b.sla_breached_at DESC;
```

### View Open Issues
```sql
SELECT 
  oi.*,
  b.id as booking_id,
  s.title as service_title
FROM ops_issues oi
JOIN bookings b ON b.id = oi.booking_id
JOIN services s ON s.id = b.service_id
WHERE oi.status = 'open'
ORDER BY oi.severity DESC, oi.created_at DESC;
```

## 🔔 Next Steps: Notifications

To add notifications (email/SMS) when SLA is breached:

1. **Add notification service** (e.g., SendGrid, Twilio, Resend)
2. **Update the API route** to send notifications after creating `ops_issues`
3. **Notify:**
   - Temple admin (if booking has temple_id)
   - Platform admin (for critical breaches)
   - User (optional, to inform them of delay)

Example:
```typescript
// After creating ops_issue
if (severity === 'critical') {
  await sendEmail({
    to: 'admin@poojanow.com',
    subject: 'Critical SLA Breach',
    body: `Booking ${booking.id} has breached SLA by ${hoursPastDeadline} hours`
  })
}
```

## 🚨 Important Notes

1. **Idempotency**: The endpoint is idempotent - safe to call multiple times
2. **Performance**: Uses indexed columns for efficient queries
3. **RLS**: Ensure RLS policies allow service role to read/write bookings and ops_issues
4. **Frequency**: Running every hour is usually sufficient, but adjust based on your SLA requirements

## 🔒 Security

- Set `CRON_SECRET` environment variable
- Use HTTPS for production endpoints
- Consider IP whitelisting for cron services
- Log all breach checks for audit purposes

## 📝 Environment Variables

```env
# Required for cron authentication
CRON_SECRET=your-secret-token-here

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```


