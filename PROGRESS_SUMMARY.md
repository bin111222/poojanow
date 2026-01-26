# PoojaNow - Progress Summary

## ✅ Completed Features

### Phase 1: Lock One Perfect Pooja Flow ✅
- [x] Single ritual selection (Rudrabhishek only)
- [x] Scheduled time windows (`scheduled_start`, `scheduled_end`)
- [x] Proof requirements enforcement (minimum 1 proof)
- [x] Real proof storage with Supabase Storage
- [x] Certificate generation (HTML version)
- [x] Post-pooja closure screen
- [x] SLA tracking columns

### Phase 2: Temple Ops Discipline ✅
- [x] Temple Ops Dashboard at `/t/ops`
- [x] Today's bookings view
- [x] Stats cards (Total, Pending, With Proof, SLA Breached)
- [x] Assign pandit functionality
- [x] Upload proof functionality
- [x] Complete booking (only after proof)
- [x] SLA countdown display

### Phase 3: Real Payments ✅ **JUST COMPLETED**
- [x] Razorpay SDK integration
- [x] Payment order creation API
- [x] Razorpay checkout integration in booking form
- [x] Payment webhook handler with signature verification
- [x] Payment verification endpoint
- [x] Automatic booking status update (payment_pending → confirmed)
- [x] Payout ledger entry creation
- [x] Payment failure handling

## 🚧 In Progress / Next Steps

### Phase 2.3: SLA Breach Automation ⏳
**Status**: Pending
**What's needed**:
- Create Supabase Edge Function or cron job
- Check `proof_sla_deadline` every hour
- Mark bookings as `is_sla_breached = true` if past deadline
- Create `ops_issues` records
- Send notifications (email/SMS)

**Files to create**:
- `supabase/functions/check-sla-breaches/index.ts` (Edge Function)
- Or set up external cron service

### Phase 1.5: Certificate PDF Generation ⏳
**Status**: Pending
**What's needed**:
- Upgrade from HTML to PDF generation
- Install PDF library (`pdfkit` or `puppeteer`)
- Update `/api/certificate/generate/route.ts`
- Store PDF in `certificates` bucket

**Options**:
1. Use `pdfkit` (lightweight, server-side)
2. Use `puppeteer` (renders HTML to PDF, heavier)
3. Use external service (e.g., PDFShift, HTMLtoPDF)

## 📊 Current System Status

### Database
- ✅ All Phase 1 migrations applied
- ✅ `ops_issues` table created
- ✅ `payout_ledger` table created
- ✅ Storage buckets: `pooja-proofs`, `certificates`

### Payment System
- ✅ Real Razorpay integration (no more mocks)
- ✅ Webhook verification
- ✅ Payment status tracking
- ⚠️ **Action Required**: Set up Razorpay keys in `.env.local`

### Booking Flow
1. User selects service → Creates booking (payment_pending)
2. Razorpay checkout opens
3. User pays → Webhook verifies → Booking confirmed
4. Pandit assigned → Proof uploaded → Booking completed
5. Certificate generated → User notified

## 🔧 Setup Required

### 1. Environment Variables
Add to `.env.local`:
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
```

### 2. Razorpay Webhook Configuration
- URL: `https://yourdomain.com/api/webhooks/razorpay`
- Events: `payment.captured`, `payment.authorized`, `payment.failed`
- Copy webhook secret to `.env.local`

### 3. Storage Buckets
Ensure these buckets exist in Supabase:
- `pooja-proofs` (private)
- `certificates` (private)

## 📝 Files Created/Modified

### New Files
- `src/app/api/payments/create-order/route.ts` - Create Razorpay orders
- `src/app/api/payments/verify/route.ts` - Verify payments
- `src/app/api/webhooks/razorpay/route.ts` - Webhook handler
- `PHASE3_PAYMENT_SETUP.md` - Setup guide

### Modified Files
- `src/app/book/actions.ts` - Returns bookingId instead of auto-confirming
- `src/app/book/[serviceId]/booking-form.tsx` - Razorpay checkout integration
- `src/app/booking/success/page.tsx` - Updated search params

## 🎯 Next Priority Tasks

1. **Set up Razorpay** (see `PHASE3_PAYMENT_SETUP.md`)
2. **Test payment flow** with test cards
3. **Implement SLA breach automation** (Phase 2.3)
4. **Upgrade certificate to PDF** (Phase 1.5)

## 📚 Documentation

- `PHASE3_PAYMENT_SETUP.md` - Complete payment setup guide
- `NEXT_STEPS.md` - Previous implementation notes
- `Execution.md` - Master execution plan
- `WIP.md` - Work in progress tracking

## 🚀 Ready for Testing

The payment system is ready for testing once Razorpay keys are configured. The flow is:
1. Complete end-to-end
2. Secure (signature verification)
3. Handles failures gracefully
4. Creates ledger entries automatically

