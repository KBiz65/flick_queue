-- Records when a user confirmed they are 18 or older before turning on adult titles
ALTER TABLE users ADD COLUMN adult_confirmed_at TIMESTAMP WITHOUT TIME ZONE;