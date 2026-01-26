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

### 8. UI/UX Improvements
- [x] **Premium Navbar** - Enhanced navigation with:
  - Functional mobile menu with slide-in panel
  - User dropdown menu with account options
  - Scroll effects (navbar adapts on scroll)
  - Active route highlighting
  - Icons for all navigation items
  - Smooth animations and transitions
  - Better responsive design

---

## 🚧 In Progress / Next Steps

### 1. Missing Public Marketing Pages
- [ ] `/how-it-works` - Explain the platform workflow
- [ ] `/features/live-darshan` - Feature page for live darshan
- [ ] `/features/book-pooja` - Feature page for booking poojas
- [ ] `/features/offerings` - Feature page for offerings
- [ ] `/events` - Festival and special events listing
- [ ] `/legal/terms` - Terms of service
- [ ] `/legal/privacy` - Privacy policy
- [ ] `/support` - Support/help center

### 2. Missing User Portal Pages
- [ ] `/u/home` - User dashboard/home
- [ ] `/u/payments` - Payment history and invoices
- [ ] `/u/profile` - User profile management

### 3. Missing Pandit Portal Pages
- [ ] `/p/calendar` - Availability calendar management
- [ ] `/p/services` - Service management (create/edit services)
- [ ] `/p/go-live` - Start live streaming interface
- [ ] `/p/payouts` - Payout history and earnings
- [ ] `/p/profile` - Pandit profile management

### 4. Missing Admin Console Pages
- [ ] `/admin/services` - Service management (CRUD)
- [ ] `/admin/offerings` - Offerings management (CRUD)
- [ ] `/admin/events` - Events management
- [ ] `/admin/live-moderation` - Live stream moderation panel
- [ ] `/admin/pricing` - Pricing rules and commission settings
- [ ] `/admin/payouts` - Payout batch management
- [ ] `/admin/cms` - Content management system

### 5. Core Features Missing
- [ ] **Offerings System**: 
  - Offerings catalogue (global + temple-specific)
  - Add offerings to booking flow
  - Offerings management UI
- [ ] **Availability Slots**: 
  - Pandit availability calendar
  - Slot booking system
  - Auto-booking logic
- [ ] **Real Payment Integration**: 
  - Razorpay checkout integration
  - Payment webhook handling
  - Payment status tracking
- [ ] **Proof Upload System**: 
  - Supabase Storage integration for proofs
  - Image/video upload UI
  - Signed URL generation for user access
- [ ] **Search Functionality**: 
  - Basic text search (ILIKE) for temples/pandits
  - Search filters
  - Search results page

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
