CREATE TABLE IF NOT EXISTS tournaments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR     NOT NULL,
    type            VARCHAR(5)  NOT NULL CHECK (type IN ('5s', '7s', '9s', '11s')),
    logo            BYTEA,
    number_of_teams INT         NOT NULL DEFAULT 0,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      UUID        REFERENCES users(id) ON DELETE SET NULL,
    modified_at     TIMESTAMPTZ,
    modified_by     UUID        REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tournament_admins (
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (tournament_id, user_id)
);
