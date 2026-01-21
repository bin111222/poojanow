-- 1. Temples: Allow public read access to published temples
create policy "Public can view published temples"
on temples for select
to public
using (status = 'published');

-- 2. Pandit Profiles: Allow public read access to published profiles
create policy "Public can view published pandits"
on pandit_profiles for select
to public
using (profile_status = 'published');

-- 3. Services: Allow public read access to published services
create policy "Public can view published services"
on services for select
to public
using (status = 'published');

-- 4. Offerings: Allow public read access to active offerings
create policy "Public can view active offerings"
on offerings for select
to public
using (active = true);

-- 5. Profiles: Allow public read access (needed to see pandit names)
-- Note: In a real app, you might want to restrict this to specific fields via a view, 
-- but for now we'll allow reading profiles to get names.
create policy "Public can view profiles"
on profiles for select
to public
using (true);

-- 6. Bookings: Users can see their own bookings
create policy "Users can view own bookings"
on bookings for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create bookings"
on bookings for insert
to authenticated
with check (auth.uid() = user_id);

-- 7. Booking Offerings: Users can view their own booking offerings (via booking)
create policy "Users can view own booking offerings"
on booking_offerings for select
to authenticated
using (
  exists (
    select 1 from bookings
    where bookings.id = booking_offerings.booking_id
    and bookings.user_id = auth.uid()
  )
);

create policy "Users can create booking offerings"
on booking_offerings for insert
to authenticated
with check (
  exists (
    select 1 from bookings
    where bookings.id = booking_offerings.booking_id
    and bookings.user_id = auth.uid()
  )
);

