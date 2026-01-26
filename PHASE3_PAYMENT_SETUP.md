# Phase 3: Real Payment Integration - Setup Guide

## ✅ What's Been Implemented

### 1. Razorpay SDK Integration
- ✅ Installed `razorpay` npm package
- ✅ Created payment order API endpoint (`/api/payments/create-order`)
- ✅ Created payment verification endpoint (`/api/payments/verify`)
- ✅ Created webhook handler (`/api/webhooks/razorpay`)

### 2. Booking Flow Updates
- ✅ Updated booking action to create `payment_pending` bookings
- ✅ Updated booking form to handle Razorpay checkout
- ✅ Payment flow: Create booking → Create Razorpay order → Open checkout → Verify payment

### 3. Payment Processing
- ✅ Webhook verifies payment signature
- ✅ Updates booking status from `payment_pending` to `confirmed` on successful payment
- ✅ Creates payout ledger entries automatically
- ✅ Handles payment failures gracefully

## 🔧 Required Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay Keys (Get from Razorpay Dashboard)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Public key for client-side (optional, can use RAZORPAY_KEY_ID)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### How to Get Razorpay Keys:

1. **Sign up/Login to Razorpay Dashboard**: https://dashboard.razorpay.com
2. **Go to Settings → API Keys**
3. **Generate Test Keys** (for development) or **Live Keys** (for production)
4. **Copy Key ID and Key Secret**
5. **For Webhook Secret**:
   - Go to Settings → Webhooks
   - Create a new webhook endpoint: `https://yourdomain.com/api/webhooks/razorpay`
   - Select events: `payment.captured`, `payment.authorized`, `payment.failed`
   - Copy the webhook secret

## 🧪 Testing the Payment Flow

### 1. Test Mode (Development)

Razorpay provides test cards for testing:

**Success Cards:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failure Cards:**
- Card Number: `4000 0000 0000 0002` (declined card)

### 2. Test Flow:

1. **Create a booking** at `/book/[serviceId]`
2. **Select date and time**
3. **Click "Confirm & Pay"**
4. **Razorpay checkout opens**
5. **Use test card** to complete payment
6. **Redirects to success page** on success
7. **Webhook updates booking status** to `confirmed`

### 3. Verify Payment:

- Check Supabase `payments` table - should have payment record
- Check Supabase `bookings` table - status should be `confirmed`
- Check Supabase `payout_ledger` table - should have ledger entry

## 📋 Payment Flow Architecture

```
User Books → Create Booking (payment_pending)
           ↓
    Create Razorpay Order
           ↓
    Open Razorpay Checkout
           ↓
    User Pays → Razorpay Processes
           ↓
    Webhook Receives Event
           ↓
    Verify Signature → Update Payment
           ↓
    Update Booking (confirmed)
           ↓
    Create Payout Ledger Entry
```

## 🔒 Security Features

1. **Webhook Signature Verification**: All webhooks are verified using HMAC SHA256
2. **Payment Signature Verification**: Client-side payments are verified before updating database
3. **User Authorization**: Only booking owner can create payment orders
4. **Idempotency**: Payment records prevent duplicate processing

## 🚨 Important Notes

1. **Webhook URL**: Must be publicly accessible. For local development, use:
   - ngrok: `ngrok http 3000`
   - Update webhook URL in Razorpay dashboard to `https://your-ngrok-url.ngrok.io/api/webhooks/razorpay`

2. **Payment Status**: Bookings remain `payment_pending` until webhook confirms payment

3. **Payout Calculation**: Currently set to:
   - Platform fee: 15%
   - Remaining split 50-50 between temple and pandit
   - Adjust in `/api/webhooks/razorpay/route.ts` as needed

4. **Error Handling**: Failed payments keep booking as `payment_pending` so users can retry

## 📝 Next Steps

1. **Set up environment variables** (see above)
2. **Configure Razorpay webhook** in dashboard
3. **Test payment flow** with test cards
4. **Monitor webhook logs** in Razorpay dashboard
5. **Test payment failures** to ensure graceful handling

## 🔄 Migration from Mock Payments

The system now uses real payments. Old mock payment logic has been removed:
- ✅ Bookings created with `payment_pending` status
- ✅ Payment required before booking confirmation
- ✅ Webhook automatically confirms bookings on payment

## 🐛 Troubleshooting

### Payment not updating booking status:
- Check webhook is configured correctly
- Verify webhook secret matches
- Check Razorpay dashboard for webhook delivery logs
- Verify payment signature in webhook handler

### Checkout not opening:
- Verify Razorpay script is loaded
- Check browser console for errors
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set

### Webhook not receiving events:
- Ensure webhook URL is publicly accessible
- Check webhook is enabled in Razorpay dashboard
- Verify webhook events are selected (payment.captured, etc.)

