-- =============================================================================
-- Audit CAR (Corrective Action Register) — PostgreSQL Schema
-- Matches backend-intranet models: car.audit.model.js / car.audit.controller.js
-- =============================================================================

-- Enable pg_trgm for fuzzy employee name matching used by the sync controller
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================================================
-- 1. Reference / Lookup Tables
-- =============================================================================

-- Audit Areas
-- IDs must match the AUDIT_AREAS const in create-observation.component.ts
CREATE TABLE IF NOT EXISTS tbl_audit_areas (
    id          SERIAL PRIMARY KEY,
    area_name   VARCHAR(100) NOT NULL UNIQUE,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Divisions
-- IDs must match the DIVISIONS const in create-observation.component.ts
CREATE TABLE IF NOT EXISTS tbl_divisions (
    id              SERIAL PRIMARY KEY,
    division_name   VARCHAR(100) NOT NULL UNIQUE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. Main Observations Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS tbl_audit_observations (
    observation_id          SERIAL PRIMARY KEY,
    observation_number      VARCHAR(30)  NOT NULL UNIQUE,   -- e.g. OBS-2024-0001
    audit_year              INTEGER      NOT NULL,
    audit_area_id           INTEGER      REFERENCES tbl_audit_areas(id) ON DELETE SET NULL,
    division_id             INTEGER      REFERENCES tbl_divisions(id)   ON DELETE SET NULL,
    observation_title       TEXT         NOT NULL,
    risk_rating             VARCHAR(20)  NOT NULL
                                CHECK (risk_rating IN ('High','Medium','Low','Improvement')),
    details_of_findings     TEXT         NOT NULL,
    followup_commitment     TEXT         NOT NULL,
    responsible_person_id   INTEGER      REFERENCES tbl_emp_master(eid) ON DELETE SET NULL,
    initial_target_date     DATE         NOT NULL,
    subsequent_followup_1   TEXT,
    updated_target_date_1   DATE,
    status                  VARCHAR(20)  NOT NULL DEFAULT 'Open'
                                CHECK (status IN ('Open','Repeated','Closed','Overdue')),
    closure_date            DATE,
    closure_remarks         TEXT,
    closed_by_user_id       INTEGER      REFERENCES tbl_emp_master(eid) ON DELETE SET NULL,
    created_by_user_id      INTEGER      REFERENCES tbl_emp_master(eid) ON DELETE SET NULL,
    created_at              TIMESTAMPTZ  DEFAULT NOW(),
    updated_at              TIMESTAMPTZ  DEFAULT NOW()
);

-- Indexes for common filter queries (getAllObservations)
CREATE INDEX IF NOT EXISTS idx_obs_year        ON tbl_audit_observations(audit_year);
CREATE INDEX IF NOT EXISTS idx_obs_status      ON tbl_audit_observations(status);
CREATE INDEX IF NOT EXISTS idx_obs_risk        ON tbl_audit_observations(risk_rating);
CREATE INDEX IF NOT EXISTS idx_obs_area        ON tbl_audit_observations(audit_area_id);
CREATE INDEX IF NOT EXISTS idx_obs_division    ON tbl_audit_observations(division_id);
CREATE INDEX IF NOT EXISTS idx_obs_responsible ON tbl_audit_observations(responsible_person_id);

-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_obs_updated_at ON tbl_audit_observations;
CREATE TRIGGER trg_obs_updated_at
    BEFORE UPDATE ON tbl_audit_observations
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- =============================================================================
-- 3. Staging Table (Excel bulk upload buffer)
-- =============================================================================

CREATE TABLE IF NOT EXISTS tbl_audit_observations_staging (
    staging_id              SERIAL PRIMARY KEY,
    batch_id                VARCHAR(80)  NOT NULL,          -- e.g. BATCH-1717000000-ABCD1234
    upload_filename         VARCHAR(255),
    audit_year              VARCHAR(10),
    audit_area              VARCHAR(100),
    division                VARCHAR(100),
    observation_title       TEXT,
    risk_rating             VARCHAR(30),
    details_of_findings     TEXT,
    followup_commitment     TEXT,
    responsible_person      VARCHAR(200),
    initial_target_date     VARCHAR(30),
    subsequent_followup_1   TEXT,
    updated_target_date_1   VARCHAR(30),
    status                  VARCHAR(30)  DEFAULT 'Open',
    uploaded_by_user_id     INTEGER,
    sync_status             VARCHAR(20)  NOT NULL DEFAULT 'Pending'
                                CHECK (sync_status IN ('Pending','Synced','Error')),
    sync_error              TEXT,
    synced_observation_id   INTEGER      REFERENCES tbl_audit_observations(observation_id) ON DELETE SET NULL,
    synced_at               TIMESTAMPTZ,
    created_at              TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staging_batch       ON tbl_audit_observations_staging(batch_id);
CREATE INDEX IF NOT EXISTS idx_staging_sync_status ON tbl_audit_observations_staging(sync_status);

-- =============================================================================
-- 4. Seed Data — Audit Areas (IDs must match frontend constants)
-- =============================================================================

INSERT INTO tbl_audit_areas (id, area_name) VALUES
    (1,  'Procurement'),
    (2,  'Finance'),
    (3,  'IT Security'),
    (4,  'IT Operations'),
    (5,  'Human Resources'),
    (6,  'Operations'),
    (7,  'Logistics'),
    (8,  'Quality Control'),
    (9,  'Compliance'),
    (10, 'Legal'),
    (11, 'Administration')
ON CONFLICT (id) DO UPDATE
    SET area_name = EXCLUDED.area_name;

-- Advance the sequence past seeded IDs
SELECT setval('tbl_audit_areas_id_seq', 11, true);

-- =============================================================================
-- 5. Seed Data — Divisions (IDs must match frontend constants)
-- =============================================================================

INSERT INTO tbl_divisions (id, division_name) VALUES
    (1, 'Supply Chain'),
    (2, 'Finance & Accounts'),
    (3, 'Information Technology'),
    (4, 'Human Resources'),
    (5, 'Poultry Operations'),
    (6, 'Aquaculture'),
    (7, 'Feed Business'),
    (8, 'Corporate'),
    (9, 'Legal & Compliance')
ON CONFLICT (id) DO UPDATE
    SET division_name = EXCLUDED.division_name;

SELECT setval('tbl_divisions_id_seq', 9, true);

-- =============================================================================
-- 6. Useful Views
-- =============================================================================

-- Full observation view with all joined display names
CREATE OR REPLACE VIEW vw_audit_observations AS
SELECT
    o.observation_id,
    o.observation_number,
    o.audit_year,
    o.audit_area_id,
    o.division_id,
    o.observation_title,
    o.risk_rating,
    o.details_of_findings,
    o.followup_commitment,
    o.responsible_person_id,
    o.initial_target_date,
    o.subsequent_followup_1,
    o.updated_target_date_1,
    o.status,
    o.closure_date,
    o.closure_remarks,
    o.closed_by_user_id,
    o.created_by_user_id,
    o.created_at,
    o.updated_at,
    aa.area_name                AS audit_area,
    d.division_name             AS division,
    rp.emp_name                 AS responsible_person,
    rp.emp_code                 AS responsible_person_code,
    rp.emp_email                AS responsible_person_email,
    cb.emp_name                 AS closed_by,
    cr.emp_name                 AS created_by
FROM tbl_audit_observations o
LEFT JOIN tbl_audit_areas   aa  ON aa.id  = o.audit_area_id
LEFT JOIN tbl_divisions     d   ON d.id   = o.division_id
LEFT JOIN tbl_emp_master    rp  ON rp.eid = o.responsible_person_id
LEFT JOIN tbl_emp_master    cb  ON cb.eid = o.closed_by_user_id
LEFT JOIN tbl_emp_master    cr  ON cr.eid = o.created_by_user_id;

-- Batch summary view
CREATE OR REPLACE VIEW vw_audit_batch_summary AS
SELECT
    batch_id,
    upload_filename,
    uploaded_by_user_id,
    MIN(created_at)                                             AS uploaded_at,
    COUNT(*)                                                    AS total_rows,
    COUNT(*) FILTER (WHERE sync_status = 'Synced')              AS synced,
    COUNT(*) FILTER (WHERE sync_status = 'Error')               AS errors,
    COUNT(*) FILTER (WHERE sync_status = 'Pending')             AS pending
FROM tbl_audit_observations_staging
GROUP BY batch_id, upload_filename, uploaded_by_user_id
ORDER BY MIN(created_at) DESC;

-- =============================================================================
-- 7. Helper: mark overdue observations (run via pg_cron or scheduled job)
-- =============================================================================
-- Example: run daily to flip status to 'Overdue' where past target date

CREATE OR REPLACE FUNCTION fn_mark_overdue_observations()
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
    affected INTEGER;
BEGIN
    UPDATE tbl_audit_observations
    SET    status = 'Overdue', updated_at = NOW()
    WHERE  status NOT IN ('Closed', 'Overdue')
      AND  COALESCE(updated_target_date_1, initial_target_date) < CURRENT_DATE;
    GET DIAGNOSTICS affected = ROW_COUNT;
    RETURN affected;
END;
$$;

-- To schedule with pg_cron (requires pg_cron extension):
-- SELECT cron.schedule('mark-overdue-audit', '0 1 * * *', 'SELECT fn_mark_overdue_observations()');

-- =============================================================================
-- 8. Sample data (comment out in production)
-- =============================================================================

/*
INSERT INTO tbl_audit_observations
    (observation_number, audit_year, audit_area_id, division_id, observation_title,
     risk_rating, details_of_findings, followup_commitment,
     responsible_person_id, initial_target_date, status, created_by_user_id)
VALUES
    ('OBS-2024-0001', 2024, 1, 1,
     'Vendor due diligence not performed for new suppliers',
     'High',
     'Three new vendors onboarded without completing the mandatory due-diligence checklist.',
     'Implement DD checklist; all new vendors will be screened within 30 days.',
     1, '2024-09-30', 'Open', 1),

    ('OBS-2024-0002', 2024, 2, 2,
     'Invoice approval workflow not documented',
     'Low',
     'No standard operating procedure exists for the invoice approval process.',
     'SOP will be drafted and approved by Finance Head within 60 days.',
     2, '2024-08-31', 'Closed', 1),

    ('OBS-2024-0003', 2024, 3, 3,
     'Patch management policy outdated',
     'High',
     'Server patches are not applied on a monthly basis. Policy document last updated 2021.',
     'Monthly patch schedule will be enforced. Policy to be revised.',
     3, '2024-07-31', 'Overdue', 1);
*/
