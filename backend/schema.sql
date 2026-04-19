-- ============================================================
-- Soccer Tournament Portal — Database Schema
-- PostgreSQL 15+
-- Run once to bootstrap the database
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
    id   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    role_id       UUID         NOT NULL REFERENCES roles(id),
    phone_number  VARCHAR(20),
    address       TEXT,
    date_of_birth DATE,
    profile_image BYTEA,
    never_logged  BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- Seed default roles
-- ============================================================
INSERT INTO roles (id, name) VALUES
    ('00000000-0000-0000-0000-000000000001', 'SuperAdmin'),
    ('00000000-0000-0000-0000-000000000002', 'TournamentAdmin'),
    ('00000000-0000-0000-0000-000000000003', 'TeamManager'),
    ('00000000-0000-0000-0000-000000000004', 'Player')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Seed a default SuperAdmin user
-- Password: Admin@123  (BCrypt hash — change in production)
-- ============================================================
INSERT INTO users (id, name, email, password_hash, role_id, created_at)
VALUES (
    gen_random_uuid(),
    'Super Admin',
    'admin@soccer.local',
    '$2a$12$K8GpUdqkJ2zQp6P9aLq.J.m0g6rJlKx9BZRGgekSwCXz6J2aNYvfe',
    '00000000-0000-0000-0000-000000000001',
    now()
)
ON CONFLICT (email) DO NOTHING;
