-- 8. Streams: Allow public read access to live streams
create policy "Public can view live streams"
on streams for select
to public
using (status = 'live');

