# PoojaNow - Project Status & Work in Progress

## ✅ Completed Features

### 1. Foundation & Architecture
- [x] Next.js 14 App Router setup
- [x] Tailwind CSS + Shadcn UI integration
- [x] Supabase Client & Server utilities
- [x] Database Schema (Profiles, Temples, Pandits, Services, Bookings, etc.)
- [x] RLS Policies for security

### 2. Authentication
- [x] Login / Sign Up Page
- [x] Auth Server Actions (Login, Signup, Signout)
- [x] Role-based Middleware (User, Pandit, Admin)

### 3. Public Pages
- [x] Landing Page (Redesigned with Premium UI)
- [x] Temple Directory (`/temples`) with Modern Cards
- [x] Temple Detail Page (`/temples/[slug]`)
- [x] Pandit Directory (`/pandits`)
- [x] Pandit Profile Page (`/pandits/[id]`)
- [x] Live Darshan Directory (`/live`)
- [x] Live Stream Player (`/live/[streamId]`)

### 4. Booking System
- [x] Booking Flow (Date/Time selection)
- [x] Mock Payment Integration
- [x] Booking Confirmation & Success Page

### 5. User Portal
- [x] User Dashboard Layout
- [x] My Bookings List
- [x] Booking Detail View

### 6. Pandit Portal
- [x] Pandit Dashboard (Stats)
- [x] Booking Management List
- [x] Booking Detail & Completion Flow
- [x] Proof Upload (Mock)

### 7. Admin Console
- [x] Admin Dashboard (Overview Stats)
- [x] Temple Management (List, Create, Publish/Draft Toggle)
- [x] Pandit Verification (Approve/Reject Profiles)
- [x] Booking Management (List, Cancel, Refund)

---

## 🚧 Roadmap for V2 (Future Scope)

### 1. Financials
- [ ] **Real Payment Gateway**: Integration with Razorpay/Stripe.
- [ ] **Payouts System**: Automated commission calculation and ledger tracking.

### 2. Advanced Features
- [ ] **Service Management**: UI for Admins/Pandits to manage services dynamically.
- [ ] **Real-time Chat**: Functional chat for live streams and user-pandit communication.
- [ ] **Search Engine**: Full-text search with filters for temples and pandits.
- [ ] **Notifications**: Email/SMS alerts via SendGrid or Supabase Auth hooks.

---

## 📝 Developer Notes

- **Database**: Run `supabase/schema.sql` and `supabase/policies.sql` if setting up a fresh DB.
- **Seeding**: Use `supabase/seed.sql`, `supabase/seed_services.sql`, and `supabase/seed_streams.sql` for dummy data.
- **Roles**: Roles are stored in the `profiles` table. To make an admin, update the row manually in Supabase.
