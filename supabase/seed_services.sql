-- Seed Data for Services
-- Note: We need valid UUIDs for temple_id. Since we generated them in the previous step, we can't know them here without querying.
-- FOR DEMO: We will use a subquery to find the temple ID by slug.

-- Services for Kashi Vishwanath
insert into services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id)
select 'Rudrabhishek Pooja', 'Traditional Rudrabhishek pooja performed with milk, curd, ghee, honey and sugar.', 45, 2100, 'pooja', 'published', id
from temples where slug = 'kashi-vishwanath';

insert into services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id)
select 'Live Darshan (Special)', 'Exclusive live darshan of the morning aarti.', 30, 501, 'live_darshan', 'published', id
from temples where slug = 'kashi-vishwanath';

-- Services for Siddhivinayak
insert into services (title, description, duration_minutes, base_price_inr, service_type, status, temple_id)
select 'Sahasravartan Pooja', 'Chanting of Ganesha Atharvashirsha 1000 times.', 120, 5100, 'pooja', 'published', id
from temples where slug = 'siddhivinayak';

-- Seed Offerings
insert into offerings (title, description, price_inr, active, temple_id)
select 'Flower Basket', 'Fresh flowers for offering', 101, true, id
from temples where slug = 'kashi-vishwanath';

insert into offerings (title, description, price_inr, active, temple_id)
select 'Prasad Box (Laddoo)', 'Box of 4 besan laddoos', 251, true, id
from temples where slug = 'siddhivinayak';

