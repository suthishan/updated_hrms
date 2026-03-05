-- =============================================================================
-- Packaging Creative Approval Portal — PostgreSQL Schema
-- Extends the existing backend-intranet tbl_requests / tbl_approvals system
-- Matches: backend-intranet/models/packaging.model.js
--          backend-intranet/controllers/packaging.controller.js
-- =============================================================================

-- =============================================================================
-- 1. Seed the Packaging Creative request type in tbl_req_master
--    (tbl_req_master must already exist from the base intranet schema)
-- =============================================================================

INSERT INTO tbl_req_master (
    req_name,
    req_description,
    req_status,
    req_doc_code,
    req_rev_sts,
    issue_date,
    is_required_approver_flow,
    is_required_to_tag_emp,
    is_required_approver_remark
)
VALUES (
    'Packaging Creative Approval',
    'Multi-level approval workflow for packaging artwork, label designs and promotional creatives',
    'active',
    'PKG-CREATIVE',
    'A',
    CURRENT_DATE,
    TRUE,
    FALSE,
    TRUE
)
ON CONFLICT (req_doc_code) DO NOTHING;

-- =============================================================================
-- 2. Packaging file attachments
--    One tbl_packaging_files row per file uploaded against a tbl_requests record
--    (request_type_id = PKG-CREATIVE).
--    form_data JSONB on tbl_requests stores: title, productName, productCategory,
--    batchRef, description, workflowType, workflowSteps[].
-- =============================================================================

CREATE TABLE IF NOT EXISTS tbl_packaging_files (
    id              SERIAL          PRIMARY KEY,
    request_id      INTEGER         NOT NULL
                        REFERENCES tbl_requests(id) ON DELETE CASCADE,
    file_name       VARCHAR(255)    NOT NULL,
    file_type       VARCHAR(10)     NOT NULL
                        CHECK (file_type IN ('pdf', 'jpeg', 'jpg')),
    file_size       BIGINT          NOT NULL,   -- bytes
    file_url        TEXT            NOT NULL,   -- relative path or S3 key served via /uploads/
    uploaded_at     TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pkg_files_request
    ON tbl_packaging_files (request_id);

-- =============================================================================
-- 3. Packaging-specific approver pool
--    Used by SelectApproversComponent to display available approvers.
--    Different from tbl_department_approvers (which is department-scoped).
--    An employee can appear here even if they are not yet in tbl_department_approvers.
-- =============================================================================

CREATE TABLE IF NOT EXISTS tbl_packaging_approvers (
    id              SERIAL          PRIMARY KEY,
    emp_uuid        VARCHAR(100)    NOT NULL UNIQUE,  -- FK-compatible with tbl_emp_master.emp_uuid
    emp_name        VARCHAR(200)    NOT NULL,
    emp_email       VARCHAR(200),
    emp_designation VARCHAR(200),
    department      VARCHAR(100),
    location        VARCHAR(100),
    phone           VARCHAR(30),
    role_key        VARCHAR(50)     NOT NULL DEFAULT 'APPROVER',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pkg_approvers_active
    ON tbl_packaging_approvers (is_active);

-- =============================================================================
-- 4. Sample approvers seed data (adjust emp_uuid to match your tbl_emp_master)
-- =============================================================================

INSERT INTO tbl_packaging_approvers
    (emp_uuid, emp_name, emp_email, emp_designation, department, location, phone, role_key)
VALUES
    ('EMP-UUID-001', 'Rajesh Kumar',    'rajesh.kumar@japfa.com',    'Brand Manager',          'Marketing',    'Supa',        '+91-98765-43210', 'APPROVER'),
    ('EMP-UUID-002', 'Priya Sharma',    'priya.sharma@japfa.com',    'QA Lead',                'Quality',      'KGP',         '+91-98765-43211', 'APPROVER'),
    ('EMP-UUID-003', 'Arjun Mehta',     'arjun.mehta@japfa.com',     'Regulatory Head',        'Regulatory',   'Bhubaneswar', '+91-98765-43212', 'APPROVER'),
    ('EMP-UUID-004', 'Sunita Patel',    'sunita.patel@japfa.com',    'Packaging Design Lead',  'Design',       'Supa',        '+91-98765-43213', 'APPROVER'),
    ('EMP-UUID-005', 'Vikram Singh',    'vikram.singh@japfa.com',    'Supply Chain Manager',   'Supply Chain', 'KGP',         '+91-98765-43214', 'APPROVER'),
    ('EMP-UUID-006', 'Ananya Reddy',    'ananya.reddy@japfa.com',    'Legal Compliance Head',  'Legal',        'Bhubaneswar', '+91-98765-43215', 'APPROVER'),
    ('EMP-UUID-007', 'Mohan Das',       'mohan.das@japfa.com',       'Production Manager',     'Production',   'Supa',        '+91-98765-43216', 'APPROVER'),
    ('EMP-UUID-008', 'Kavitha Nair',    'kavitha.nair@japfa.com',    'Creative Director',      'Design',       'KGP',         '+91-98765-43217', 'APPROVER')
ON CONFLICT (emp_uuid) DO NOTHING;

-- =============================================================================
-- 5. View: vw_packaging_requests
--    Flattened view used by getPackagingRequests() query.
--    Joins tbl_requests + tbl_emp_master + tbl_req_master,
--    filtered to PKG-CREATIVE request type.
-- =============================================================================

CREATE OR REPLACE VIEW vw_packaging_requests AS
SELECT
    r.id                    AS request_id,
    r.emp_id,
    r.requester_name,
    r.department,
    r.status,
    r.priority,
    r.form_data,
    r.created_at,
    r.updated_at,
    r.submitted_at,
    e.emp_designation,
    e.emp_id                AS emp_code,
    rt.rid                  AS request_type,
    rt.req_name             AS request_name,
    rt.req_doc_code

FROM tbl_requests r
JOIN tbl_req_master rt
    ON rt.rid = r.request_type_id
JOIN tbl_emp_master e
    ON e.emp_uuid = r.emp_id
WHERE rt.req_doc_code = 'PKG-CREATIVE';

-- =============================================================================
-- 6. Useful queries for application reference
-- =============================================================================

-- Get full request detail with files and approvals (used by getPackagingRequestById):
-- SELECT
--     r.*,
--     json_agg(DISTINCT jsonb_build_object(
--         'id', f.id::text, 'name', f.file_name, 'type', f.file_type,
--         'size', f.file_size, 'url', f.file_url, 'uploadedAt', f.uploaded_at
--     )) FILTER (WHERE f.id IS NOT NULL) AS files,
--     json_agg(DISTINCT jsonb_build_object(
--         'approval_level', a.approval_level,
--         'approver_uuid', a.assigned_approver_uuid,
--         'approver_name', a.assigned_approver_name,
--         'decision', a.decision,
--         'remarks', a.remarks,
--         'action_date', a.action_date
--     )) FILTER (WHERE a.request_id IS NOT NULL) AS approvals
-- FROM vw_packaging_requests r
-- LEFT JOIN tbl_packaging_files f ON f.request_id = r.request_id
-- LEFT JOIN tbl_approvals a       ON a.request_id = r.request_id
-- WHERE r.request_id = $1
-- GROUP BY r.request_id, r.emp_id, r.requester_name, r.department,
--          r.status, r.priority, r.form_data, r.created_at, r.updated_at,
--          r.submitted_at, r.emp_designation, r.emp_code,
--          r.request_type, r.request_name, r.req_doc_code;

-- =============================================================================
-- 7. Packaging dashboard stats function
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_packaging_dashboard_stats(p_emp_uuid TEXT, p_role TEXT)
RETURNS TABLE (
    total_requests  BIGINT,
    draft           BIGINT,
    pending         BIGINT,
    in_review       BIGINT,
    approved        BIGINT,
    rejected        BIGINT
) AS $$
DECLARE
    pkg_type_id INTEGER;
BEGIN
    SELECT rid INTO pkg_type_id
    FROM tbl_req_master
    WHERE req_doc_code = 'PKG-CREATIVE'
    LIMIT 1;

    IF p_role = 'REQUESTER' THEN
        RETURN QUERY
        SELECT
            COUNT(*)                                                                    AS total_requests,
            COUNT(*) FILTER (WHERE r.status = 'DRAFT')                                 AS draft,
            COUNT(*) FILTER (WHERE r.status = 'SUBMITTED')                             AS pending,
            COUNT(*) FILTER (WHERE r.status LIKE 'L%_APPROVED')                        AS in_review,
            COUNT(*) FILTER (WHERE r.status = 'APPROVED')                              AS approved,
            COUNT(*) FILTER (WHERE r.status LIKE '%_REJECTED')                         AS rejected
        FROM tbl_requests r
        WHERE r.emp_id = p_emp_uuid
          AND r.request_type_id = pkg_type_id;

    ELSIF p_role = 'APPROVER' THEN
        RETURN QUERY
        SELECT
            COUNT(DISTINCT r.id)                                                        AS total_requests,
            0::BIGINT                                                                   AS draft,
            COUNT(DISTINCT r.id) FILTER (WHERE a.decision = 'PENDING')                 AS pending,
            COUNT(DISTINCT r.id) FILTER (WHERE a.decision = 'APPROVED'
                                           AND r.status NOT IN ('APPROVED','L1_REJECTED','L2_REJECTED','L3_REJECTED')) AS in_review,
            COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'APPROVED')                  AS approved,
            COUNT(DISTINCT r.id) FILTER (WHERE r.status LIKE '%_REJECTED')              AS rejected
        FROM tbl_approvals a
        JOIN tbl_requests r ON r.id = a.request_id
        WHERE a.assigned_approver_uuid = p_emp_uuid
          AND r.request_type_id = pkg_type_id;

    ELSE -- ADMIN
        RETURN QUERY
        SELECT
            COUNT(*)                                                                    AS total_requests,
            COUNT(*) FILTER (WHERE r.status = 'DRAFT')                                 AS draft,
            COUNT(*) FILTER (WHERE r.status = 'SUBMITTED')                             AS pending,
            COUNT(*) FILTER (WHERE r.status LIKE 'L%_APPROVED')                        AS in_review,
            COUNT(*) FILTER (WHERE r.status = 'APPROVED')                              AS approved,
            COUNT(*) FILTER (WHERE r.status LIKE '%_REJECTED')                         AS rejected
        FROM tbl_requests r
        WHERE r.request_type_id = pkg_type_id;
    END IF;
END;
$$ LANGUAGE plpgsql;
