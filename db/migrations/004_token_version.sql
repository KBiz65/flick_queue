-- Goes up by one when the password changes, so login tokens issued before the change stop working
ALTER TABLE users ADD COLUMN token_version INT NOT NULL DEFAULT 0;