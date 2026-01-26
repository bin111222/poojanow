# Temple Enhancement Guide

This guide explains how to add detailed information to temple pages in your database.

## Overview

Two scripts have been created to enhance temple pages with comprehensive information:

1. **Migration Script** (`supabase/migrations/004_enhance_temples.sql`) - Adds new columns to the temples table
2. **Update Script** (`supabase/update_temples_detailed.sql`) - Populates existing temples with detailed content

## New Fields Added

The migration adds the following fields to the `temples` table:

### Content Fields
- `history` - Historical background and origin story
- `architecture` - Architectural style and notable features
- `significance` - Religious and spiritual significance
- `timings` - Daily darshan timings
- `best_time_to_visit` - Recommended months or seasons
- `festivals` - Array of major festivals (text[])
- `special_rituals` - Array of unique rituals (text[])

### Contact Information
- `phone` - Contact phone number
- `email` - Contact email address
- `website` - Official website URL

### Practical Information
- `established_year` - Year temple was established/renovated
- `visiting_hours` - Detailed visiting hours
- `dress_code` - Dress code requirements
- `photography_allowed` - Boolean for photography policy
- `parking_available` - Boolean for parking availability
- `accommodation_nearby` - Information about nearby accommodation
- `nearby_attractions` - Array of nearby attractions (text[])
- `how_to_reach` - Directions and transportation info

### Media
- `gallery_images` - Array of image URLs (text[])
- `video_url` - URL to video tour

### Metadata
- `featured` - Boolean to feature temple prominently

## How to Run

### Step 1: Run the Migration

First, apply the migration to add the new columns:

```bash
# If using Supabase CLI
supabase migration up

# Or run directly in Supabase SQL Editor
# Copy and paste the contents of: supabase/migrations/004_enhance_temples.sql
```

### Step 2: Update Existing Temples

After the migration is applied, run the update script to populate the new fields:

```bash
# Run in Supabase SQL Editor
# Copy and paste the contents of: supabase/update_temples_detailed.sql
```

The update script will:
- Generate contextually appropriate content based on temple name, deity, and location
- Add historical information, architecture details, and significance
- Set timings, festivals, and special rituals
- Add contact information (where applicable)
- Set practical information like dress code, parking, etc.
- Add gallery images and other media

### Step 3: Verify

Check that the data was updated:

```sql
SELECT 
  name,
  history IS NOT NULL as has_history,
  architecture IS NOT NULL as has_architecture,
  festivals IS NOT NULL as has_festivals,
  phone IS NOT NULL as has_phone
FROM temples
WHERE status = 'published'
LIMIT 10;
```

## Customizing Content

The update script uses CASE statements to generate content based on:
- Temple name (e.g., "Kashi", "Krishna", "Shiva")
- Deity type
- State/location

To customize content for specific temples, you can:

1. **Update specific temples manually:**
```sql
UPDATE temples 
SET 
  history = 'Your custom history...',
  architecture = 'Your custom architecture description...',
  significance = 'Your custom significance...'
WHERE slug = 'your-temple-slug';
```

2. **Modify the update script** to add more specific cases for your temples

3. **Use the admin panel** (if you have one) to edit temple details directly

## Frontend Integration

After updating the database, you'll need to update your frontend to display these new fields. The temple detail page (`src/app/temples/[slug]/page.tsx`) should be updated to show:

- History section
- Architecture section
- Significance section
- Timings and visiting hours
- Festivals list
- Special rituals
- Contact information
- Practical information (dress code, parking, etc.)
- Gallery images
- Video embed (if video_url exists)

## Example Query

To fetch a temple with all new fields:

```sql
SELECT 
  *,
  array_length(festivals, 1) as festival_count,
  array_length(special_rituals, 1) as ritual_count
FROM temples
WHERE slug = 'kashi-vishwanath'
AND status = 'published';
```

## Notes

- The update script generates content based on patterns in temple names and deities
- Some fields (phone, email, website) are randomly assigned - you may want to update these manually with real data
- Gallery images use placeholder Unsplash URLs - replace with actual temple images
- The `featured` flag is randomly set for 20% of temples - adjust as needed
- All content is generated for `published` temples only

## Next Steps

1. Run the migration
2. Run the update script
3. Review and customize content for important temples
4. Update frontend to display new fields
5. Add real images to `gallery_images` array
6. Update contact information with real phone/email/website


