-- Seed Data for Streams
-- Note: Again, we need valid UUIDs. We'll use subqueries.

insert into streams (stream_type, temple_id, title, status, viewer_count, playback_url)
select 'public', id, 'Live: Evening Aarti at Kashi Vishwanath', 'live', 1245, 'https://www.youtube.com/embed/dQw4w9WgXcQ' -- Rick roll as placeholder :P
from temples where slug = 'kashi-vishwanath';

insert into streams (stream_type, temple_id, title, status, viewer_count, playback_url)
select 'public', id, 'Siddhivinayak Live Darshan', 'live', 850, 'https://www.youtube.com/embed/live_stream_id'
from temples where slug = 'siddhivinayak';

