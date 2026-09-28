-- Username format, length limits, and case-insensitive uniqueness for usernames and emails.
-- Safe to run once on an existing database; everything rolls back if any row breaks a rule.
BEGIN;

ALTER TABLE users
    DROP CONSTRAINT users_username_key,
    DROP CONSTRAINT users_email_key,
    ADD CONSTRAINT users_username_format CHECK (username ~ '^[A-Za-z0-9_.]{6,30}$'),
    ADD CONSTRAINT users_first_name_length CHECK (char_length(first_name) <= 50),
    ADD CONSTRAINT users_last_name_length CHECK (char_length(last_name) <= 50),
    ADD CONSTRAINT users_email_length CHECK (char_length(email) <= 254);

CREATE UNIQUE INDEX users_username_lower_key ON users (lower(username));
CREATE UNIQUE INDEX users_email_lower_key ON users (lower(email));

ALTER TABLE watchlists
    ADD CONSTRAINT watchlists_name_length CHECK (char_length(name) <= 100),
    ADD CONSTRAINT watchlists_description_length CHECK (char_length(description) <= 500);

COMMIT;