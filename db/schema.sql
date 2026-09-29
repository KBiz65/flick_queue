CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = (now() AT TIME ZONE 'utc');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    allow_adult_content BOOLEAN NOT NULL DEFAULT false,
    adult_confirmed_at TIMESTAMP WITHOUT TIME ZONE,
    watch_region VARCHAR(2) NOT NULL DEFAULT 'US',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    CONSTRAINT users_username_format CHECK (username ~ '^[A-Za-z0-9_.]{6,30}$'),
    CONSTRAINT users_first_name_length CHECK (char_length(first_name) <= 50),
    CONSTRAINT users_last_name_length CHECK (char_length(last_name) <= 50),
    CONSTRAINT users_email_length CHECK (char_length(email) <= 254)
);

-- Case-insensitive, so "KevinB" and "kevinb" can't both exist
CREATE UNIQUE INDEX users_username_lower_key ON users (lower(username));
CREATE UNIQUE INDEX users_email_lower_key ON users (lower(email));

CREATE TABLE media (
    media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tmdb_id INT NOT NULL,
    title TEXT NOT NULL,
    original_title TEXT,
    overview TEXT,
    release_date DATE,
    poster_path VARCHAR(255),
    backdrop_path VARCHAR(255),
    popularity DECIMAL,
    vote_average NUMERIC(5, 3),
    vote_count INT,
    type VARCHAR(50) NOT NULL,
    original_language VARCHAR(10),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    CONSTRAINT media_tmdb_id_type_key UNIQUE (tmdb_id, type),
    CONSTRAINT media_type_check CHECK (type IN ('movie', 'tv'))
);

CREATE TABLE watchlists (
    watchlist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    CONSTRAINT watchlists_user_name_key UNIQUE (user_id, name),
    CONSTRAINT watchlists_name_length CHECK (char_length(name) <= 100),
    CONSTRAINT watchlists_description_length CHECK (char_length(description) <= 500),
    CONSTRAINT watchlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE watchlistitems (
    watchlist_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    watchlist_id UUID NOT NULL,
    media_id UUID NOT NULL,
    watched BOOLEAN NOT NULL DEFAULT false,
    added_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'),
    CONSTRAINT watchlistitems_watchlist_media_key UNIQUE (watchlist_id, media_id),
    CONSTRAINT watchlistitems_watchlist_id_fkey FOREIGN KEY (watchlist_id) REFERENCES watchlists(watchlist_id) ON DELETE CASCADE,
    CONSTRAINT watchlistitems_media_id_fkey FOREIGN KEY (media_id) REFERENCES media(media_id) ON DELETE CASCADE
);

-- Used by the join from titles to lists and by the nightly cleanup of titles no list uses
CREATE INDEX watchlistitems_media_id_idx ON watchlistitems (media_id);

CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER media_set_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER watchlists_set_updated_at BEFORE UPDATE ON watchlists
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();