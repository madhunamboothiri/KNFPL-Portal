ALTER TABLE users
    ADD COLUMN IF NOT EXISTS phone_number   VARCHAR(20),
    ADD COLUMN IF NOT EXISTS address        TEXT,
    ADD COLUMN IF NOT EXISTS date_of_birth  DATE,
    ADD COLUMN IF NOT EXISTS profile_image  BYTEA;
