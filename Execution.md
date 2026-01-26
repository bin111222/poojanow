✅ POOJANOW – MASTER EXECUTION TO-DO LIST

Goal: Turn PoojaNow from software into a living, trusted spiritual system

PHASE 0: HARD RESET (PRIORITY ALIGNMENT)
❌ STOP BUILDING IMMEDIATELY

 Pause events pages

 Pause CMS

 Pause offerings (flowers, coconuts, etc.)

 Pause advanced search

 Pause chat systems

 Pause pricing dashboards

 Pause influencer pandit ideas

Objective: eliminate distractions. Focus only on trust, ops, proof, payments.

PHASE 1: LOCK ONE PERFECT POOJA FLOW (FOUNDATION)
1.1 Select a Single Ritual

 Choose 1 pooja only (example: Rudrabhishek or Ganesh Sankatnashan)

 Disable booking of all other services temporarily

 Hardcode explanation text for this pooja

1.2 Enforce Scheduled Time Window

 Add scheduled_start and scheduled_end to bookings

 Display scheduled window clearly to:

 User

 Pandit

 Temple admin

 Prevent completion outside window without admin override

1.3 Make Proof Non-Optional (CRITICAL)

 Enforce minimum 1 photo proof per booking

 Block completed status if proof count < 1

 Add SLA timer:

 If no proof X hours after scheduled_end → mark booking as delayed

 Notify temple admin automatically on delay

 Show “Proof pending” status to user

1.4 Proof Storage (REAL, NOT MOCK)

 Create Supabase private storage bucket: pooja-proofs

 Upload proof via signed URLs only

 Store metadata:

 booking_id

 captured_at

 uploaded_by

 Generate signed read URLs with expiry for users

1.5 Auto Certificate Generation

 Generate certificate PDF automatically after proof upload

 Include:

 Devotee name

 Temple name

 Pooja name

 Date & timestamp

 Store in private bucket certificates

 Attach certificate to booking record

 Notify user automatically

1.6 Post-Pooja Closure Screen

 Add “What was done” explanation section

 Add “What devotees usually do next” section

 Show certificate + proof together

 Prevent dead-end UX after completion

PHASE 2: TEMPLE OPS DISCIPLINE (THIS MAKES IT REAL)
2.1 Build ONE Temple Ops Screen (Not More Pages)

 Create /t/ops dashboard

 Show today’s bookings only

 Columns:

 Booking ID

 Pooja name

 Scheduled time

 Pandit assigned

 Proof status

 SLA countdown

 Actions:

 Assign pandit

 Upload proof

 Mark completed (only after proof)

2.2 Pandit Discipline Flow

 Pandit sees only today’s bookings

 Pandit cannot close booking

 Pandit can only upload proof

 Temple admin must verify proof

2.3 Failure Escalation Rules

 If proof missing after SLA:

 Auto notify temple admin

 Auto flag booking for platform admin

 Log all SLA breaches in ops_issues table

PHASE 3: REAL PAYMENTS (NO MORE MOCKS)
3.1 Razorpay Integration

 Implement real Razorpay checkout

 Create server-side order creation

 Verify payment via webhook

 Handle:

 success

 failure

 pending

 Lock booking only on verified payment

3.2 Refund Flow (Basic)

 Admin-triggered refund only

 Store refund reason

 Update booking status to refunded

3.3 Payment Ledger (MANDATORY EVEN IF MANUAL)

 Create payout_ledger table

 Record per booking:

 total amount

 temple share

 pandit share

 platform fee

 Status:

 pending

 paid

 Display payable amount to temple admin

PHASE 4: LIVESTREAM (SIMPLE, RELIABLE)
4.1 MVP Streaming

 Allow temple admin to paste unlisted YouTube live link

 Attach stream to booking

 Display stream link in user booking view

 After pooja:

 Paste playback URL

 Store for replay

4.2 Stream Rules

 Private stream for personal poojas

 No public discovery until ops stable

 No chat initially

PHASE 5: FIRST 100 BOOKINGS (HUMAN-IN-THE-LOOP)
5.1 Founder Ops Mode

 Personally monitor first 100 bookings

 Verify proof delivery

 Call temple admin on misses

 Log failure reasons

 Fix UX or ops immediately

5.2 Temple Dry Runs

 Select 5 temples only

 Do 2 test bookings per temple

 Walk through:

 assignment

 proof upload

 certificate

 user view

PHASE 6: USER TRUST LOOP
6.1 Post-Completion Messaging

 Notify user when proof is ready

 Explain ritual outcome

 Thank user personally (template is fine)

6.2 Repeat Behavior Hooks

 Add festival reminder opt-in

 Suggest 1 follow-up ritual only

 Do not upsell aggressively

PHASE 7: LAUNCH WITHOUT ADS
7.1 Temple-Led Launch

 QR code at temple counters

 Temple WhatsApp broadcast

 Priest announcements (offline)

7.2 NRI Soft Launch

 Target temple NRI committees

 Timezone-friendly scheduling

 Manual concierge if needed

PHASE 8: SCALE CHECKPOINT (DO NOT SKIP)

Only proceed if:

 95% bookings have proof within SLA

 Less than 5% refunds

 At least 30% repeat users

 Temples ask for more capacity

PHASE 9: ONLY AFTER THIS WORKS
Allowed Future Builds

 Offerings system

 Events

 Annual devotion plans

 Advanced search

 AI guidance (educational only)

FINAL RULE (PIN THIS)

❌ No feature ships unless it reduces doubt, delay, or dependency on WhatsApp.