# Service Packages System Guide

This guide explains how to implement and use the service packages system, similar to how gharmandir.in structures their pooja packages.

## Overview

The package system allows each service to have multiple pricing tiers (Basic, Standard, Premium) with different offerings included. This gives users flexibility to choose the package that best fits their needs and budget.

## Database Structure

### Tables Created

1. **`service_packages`** - Stores package tiers for each service
   - `id` - Package UUID
   - `service_id` - Reference to service
   - `package_name` - e.g., "Basic", "Standard", "Premium"
   - `package_description` - Description of what's included
   - `base_price_inr` - Package price
   - `is_popular` - Highlight as popular
   - `is_recommended` - Show as recommended
   - `sort_order` - Display order
   - `active` - Whether package is available

2. **`service_package_offerings`** - Links offerings to packages
   - `package_id` - Reference to package
   - `offering_id` - Reference to offering
   - `quantity` - How many of this offering
   - `included` - If true, included in package. If false, optional add-on

3. **`bookings`** - Updated to include `package_id`

## Setup Instructions

### Step 1: Run the Migration

```bash
# Run in Supabase SQL Editor
# Copy contents of: supabase/migrations/005_add_service_packages.sql
```

This creates the necessary tables and indexes.

### Step 2: Seed Packages (Optional)

To quickly create example packages for your services:

```bash
# Run in Supabase SQL Editor
# Copy contents of: supabase/seed_service_packages.sql
```

This will create Basic, Standard, and Premium packages for the first 20 services.

### Step 3: Customize Packages

You can customize packages for specific services:

```sql
-- Create a custom package
INSERT INTO service_packages (
  service_id, 
  package_name, 
  package_description, 
  base_price_inr, 
  sort_order, 
  is_popular, 
  is_recommended
) VALUES (
  'your-service-id',
  'Deluxe',
  'Ultimate pooja experience with all offerings and extended rituals',
  5000,
  4,
  false,
  false
);

-- Add offerings to the package
INSERT INTO service_package_offerings (package_id, offering_id, quantity, included)
VALUES 
  ('package-id', 'offering-1-id', 2, true),
  ('package-id', 'offering-2-id', 1, true);
```

## Frontend Implementation

### Package Selector Component

The `PackageSelector` component (`src/components/package-selector.tsx`) displays packages in a card layout:

- Shows package name, description, and price
- Highlights popular/recommended packages
- Displays included offerings with checkmarks
- Allows package selection

### Booking Flow

1. **Service Page** → User clicks "Book Now"
2. **Booking Page** → Shows package selection (if packages exist)
3. **Package Selection** → User selects a package
4. **Booking Form** → User fills date/time/notes
5. **Payment** → Amount is based on selected package
6. **Booking Created** → Includes `package_id`

## Usage Examples

### Query Packages for a Service

```sql
SELECT 
  sp.*,
  json_agg(
    json_build_object(
      'id', o.id,
      'title', o.title,
      'description', o.description,
      'quantity', spo.quantity,
      'included', spo.included
    )
  ) as offerings
FROM service_packages sp
LEFT JOIN service_package_offerings spo ON spo.package_id = sp.id
LEFT JOIN offerings o ON o.id = spo.offering_id
WHERE sp.service_id = 'your-service-id'
AND sp.active = true
GROUP BY sp.id
ORDER BY sp.sort_order;
```

### Get Booking with Package Details

```sql
SELECT 
  b.*,
  sp.package_name,
  sp.package_description,
  sp.base_price_inr as package_price
FROM bookings b
LEFT JOIN service_packages sp ON sp.id = b.package_id
WHERE b.id = 'booking-id';
```

## Package Pricing Strategy

Common pricing patterns:

1. **Basic Package** (80% of base price)
   - Essential offerings only
   - Standard rituals
   - Good for regular worship

2. **Standard Package** (100% of base price) - **Recommended**
   - More offerings
   - Enhanced rituals
   - Special prasad
   - Best value

3. **Premium Package** (150% of base price)
   - All offerings
   - Extended rituals
   - Premium prasad
   - Special blessings
   - Best for special occasions

## Best Practices

1. **Always have a recommended package** - Set `is_recommended = true` for the best value package
2. **Highlight popular packages** - Use `is_popular = true` for packages that sell well
3. **Clear descriptions** - Explain what's included in each package
4. **Show savings** - Display percentage savings compared to base price
5. **Limit packages** - 3-4 packages per service is optimal (too many choices can confuse users)

## Customization

### Add Package Badges

You can add custom badges in the `PackageSelector` component:

```tsx
{pkg.is_popular && (
  <Badge className="bg-primary text-white">
    Most Popular
  </Badge>
)}
```

### Custom Package Colors

Modify the card styling in `PackageSelector`:

```tsx
className={cn(
  "relative cursor-pointer",
  isSelected && "ring-2 ring-primary",
  pkg.is_popular && "border-primary border-2"
)}
```

## Troubleshooting

### Packages Not Showing

1. Check that packages are active: `active = true`
2. Verify service_id matches
3. Check RLS policies allow public read

### Price Not Updating

1. Ensure `selectedPackageId` is passed to booking form
2. Verify `totalPrice` calculation uses selected package
3. Check that package price is being sent to payment API

### Offerings Not Displaying

1. Verify `service_package_offerings` records exist
2. Check that offerings are linked correctly
3. Ensure offerings are active

## Next Steps

1. Run the migration
2. Seed packages or create custom ones
3. Test the booking flow
4. Customize package descriptions and pricing
5. Add more offerings to packages
6. Monitor which packages are most popular


