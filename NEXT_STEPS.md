# 🚀 Next Steps - What You Need to Do

## ✅ Phase 1 Complete!

Phase 1 foundation is implemented. Here's what's done:
- ✅ Single ritual (Rudrabhishek) selection
- ✅ Scheduled time windows
- ✅ Proof requirements enforcement
- ✅ Real proof storage with Supabase
- ✅ Certificate generation (HTML version)
- ✅ Post-pooja closure screen

## 📋 Immediate Setup Required

### 1. Run Database Migration

**Go to your Supabase Dashboard → SQL Editor** and run:

```sql
-- File: supabase/migrations/001_phase1_foundation.sql
```

This adds:
- `scheduled_start` and `scheduled_end` columns
- `is_active_single_pooja` flag on services
- SLA tracking columns
- `ops_issues` and `payout_ledger` tables

### 2. Set Up Storage Buckets

**Go to Supabase Dashboard → Storage** and run the SQL from:
- `supabase/storage_setup.md`

This creates:
- `pooja-proofs` bucket (private)
- `certificates` bucket (private)
- Storage policies for secure access

### 3. Mark Rudrabhishek as Active Service

Run this SQL to enable Rudrabhishek:

```sql
UPDATE services 
SET is_active_single_pooja = true,
    pooja_explanation = 'Rudrabhishek is a powerful Vedic ritual dedicated to Lord Shiva. The pooja involves the ceremonial bathing (abhishek) of the Shiva Lingam with sacred substances including milk, curd, ghee, honey, sugar, and water. This ritual is performed to seek blessings, remove obstacles, and bring peace and prosperity. The chanting of Rudram and Chamakam mantras during the pooja amplifies its spiritual significance.'
WHERE title ILIKE '%rudrabhishek%' AND status = 'published';
```

### 4. Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

## 🎯 Phase 2: Temple Ops Dashboard (Just Created!)

I've created the Temple Ops Dashboard at `/t/ops`. Here's what it does:

### Features:
- ✅ Shows today's bookings only
- ✅ Displays: Booking ID, Pooja name, Scheduled time, Pandit, Proof status, SLA countdown
- ✅ Actions: Assign pandit, Upload proof, Mark completed
- ✅ Stats cards: Total, Pending, With Proof, SLA Breached

### Access:
Currently accessible to admins. To restrict to temple admins:
1. Create a `temple_admins` table
2. Update the check in `/t/ops/page.tsx`

## 🔧 What Still Needs Work

### Phase 1.5 - Certificate PDF Generation
Currently generates HTML certificates. To upgrade to PDF:

1. Install a PDF library:
```bash
npm install pdfkit @types/pdfkit
# OR
npm install puppeteer
```

2. Update `/api/certificate/generate/route.ts` to generate actual PDFs

### Phase 2.2 - Pandit Discipline Flow
- ✅ Pandits can only upload proof (already enforced)
- ✅ Pandits cannot close booking (already enforced)
- ⚠️ Need to verify temple admin must approve proof

### Phase 2.3 - SLA Breach Automation
Create a cron job or Supabase Edge Function to:
- Check `proof_sla_deadline` every hour
- Mark bookings as `is_sla_breached = true` if past deadline
- Create `ops_issues` records
- Send notifications

### Phase 3 - Real Payments
- Replace mock payment in `src/app/book/actions.ts`
- Integrate Razorpay SDK
- Create webhook handler at `/api/webhooks/razorpay`

## 🧪 Testing Checklist

1. **Test Booking Flow:**
   - [ ] Create a booking for Rudrabhishek
   - [ ] Verify only Rudrabhishek is shown
   - [ ] Check scheduled_start and scheduled_end are set

2. **Test Proof Upload:**
   - [ ] Login as pandit
   - [ ] Upload proof for assigned booking
   - [ ] Verify proof appears in booking

3. **Test Completion:**
   - [ ] Try to complete without proof (should fail)
   - [ ] Upload proof, then complete (should succeed)
   - [ ] Check certificate is generated

4. **Test Temple Ops:**
   - [ ] Login as admin
   - [ ] Go to `/t/ops`
   - [ ] Assign pandit to booking
   - [ ] Upload proof
   - [ ] Complete booking

## 📝 Notes

- The Temple Ops dashboard is at `/t/ops` (accessible to admins)
- Certificate generation currently creates HTML files (upgrade to PDF later)
- SLA breach detection is manual (automate with cron/edge function)
- Payments are still mocked (Phase 3)

## 🎉 You're Ready!

The foundation is solid. Run the migrations, set up storage, and you can start testing the complete flow from booking to completion!


