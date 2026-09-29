-- Removes the unused ratings table, indexes watchlist item lookups by title,
-- switches to Postgres's built-in UUID function, and deletes titles no list uses anymore
BEGIN;

DROP TABLE IF EXISTS ratings;

CREATE INDEX IF NOT EXISTS watchlistitems_media_id_idx ON watchlistitems (media_id);

ALTER TABLE users ALTER COLUMN user_id SET DEFAULT gen_random_uuid();
ALTER TABLE media ALTER COLUMN media_id SET DEFAULT gen_random_uuid();
ALTER TABLE watchlists ALTER COLUMN watchlist_id SET DEFAULT gen_random_uuid();
ALTER TABLE watchlistitems ALTER COLUMN watchlist_item_id SET DEFAULT gen_random_uuid();

DROP EXTENSION IF EXISTS "uuid-ossp";

DELETE FROM media m
WHERE NOT EXISTS (SELECT 1 FROM watchlistitems wi WHERE wi.media_id = m.media_id);

COMMIT;