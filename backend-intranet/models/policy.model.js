const pool = require('../db/db');


/**
 * Update Policy Master
 */
exports.updatePolicyMaster = async (policyDocId, data) => {

    const query = `
        UPDATE tbl_policy_master
        SET policy_doc_title       = COALESCE($2, policy_doc_title),
            policy_doc_description = COALESCE($3, policy_doc_description),
            is_mandatory           = COALESCE($4, is_mandatory),
            is_active              = COALESCE($5, is_active),
            updated_at             = CURRENT_TIMESTAMP
        WHERE policy_doc_id = $1
        RETURNING *;
    `;

    return pool.query(query, [
        policyDocId,
        data.policy_doc_title,
        data.policy_doc_description,
        data.is_mandatory,
        data.is_active
    ]);
};


/**
 * Reset previous current version
 */
exports.resetCurrentVersion = async (policyDocId, client) => {

    const query = `
        UPDATE tbl_policy_version
        SET is_current = FALSE
        WHERE policy_doc_id = $1
        AND is_current = TRUE;
    `;

    return client.query(query, [policyDocId]);
};


/**
 * Insert new policy version
 */
exports.insertPolicyVersion = async (data, filePath, client) => {

    const query = `
        INSERT INTO tbl_policy_version
        (
            policy_doc_id,
            version_number,
            file_path,
            effective_from,
            is_current
        )
        VALUES ($1,$2,$3,$4,TRUE)
        RETURNING *;
    `;

    return client.query(query, [
        data.policy_doc_id,
        data.version_number,
        filePath,
        data.effective_from
    ]);
};

/**
 * Create Policy Master
 */
exports.insertPolicyMaster = async (data, client) => {

    const query = `
        INSERT INTO tbl_policy_master
        (
            policy_doc_code,
            policy_doc_title,
            policy_doc_description,
            is_mandatory,
            is_active,
            created_by
        )
        VALUES ($1,$2,$3,$4,TRUE,$5)
        RETURNING *;
    `;

    return client.query(query, [
        data.policy_doc_code,
        data.policy_doc_title,
        data.policy_doc_description,
        data.is_mandatory,
        data.created_by
    ]);
};

/**
 * Get policy with current version
 */
exports.getPolicyWithCurrentVersion = async (policyDocId) => {

    const query = `
        SELECT pm.policy_doc_id,
               pm.policy_doc_code,
               pm.policy_doc_title,
               pm.policy_doc_description,
               pm.is_mandatory,
               pm.is_active,
               pv.version_id,
               pv.version_number,
               pv.file_path,
               pv.effective_from
        FROM tbl_policy_master pm
        LEFT JOIN tbl_policy_version pv
            ON pm.policy_doc_id = pv.policy_doc_id
            AND pv.is_current = TRUE
        WHERE pm.policy_doc_id = $1;
    `;

    return pool.query(query, [policyDocId]);
};


/**
 * Get all policies with current version
 */
exports.getAllPolicies = async () => {

    const query = `
        SELECT pm.policy_doc_id,
               pm.policy_doc_code,
               pm.policy_doc_title,
               pm.is_mandatory,
               pm.is_active,
               pv.version_number,
               pv.file_path,
               pv.effective_from
        FROM tbl_policy_master pm
        LEFT JOIN tbl_policy_version pv
            ON pm.policy_doc_id = pv.policy_doc_id
            AND pv.is_current = TRUE
        ORDER BY pm.created_at DESC;
    `;

    return pool.query(query);
};



/**
 * Create or Update Employee Consent
 */
exports.upsertEmployeeConsent = async (data) => {

    const query = `
        INSERT INTO tbl_employee_policy_consent
        (
            emp_id,
            policy_doc_id,
            version_id,
            consent_status,
            ip_address,
            user_agent
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (emp_id, version_id)
        DO UPDATE SET
            consent_status = EXCLUDED.consent_status,
            consent_at     = CURRENT_TIMESTAMP,
            ip_address     = EXCLUDED.ip_address,
            user_agent     = EXCLUDED.user_agent
        RETURNING *;
    `;

    return pool.query(query, [
        data.emp_id,
        data.policy_doc_id,
        data.version_id,
        data.consent_status,
        data.ip_address,
        data.user_agent
    ]);
};


/**
 * Validate Version Belongs to Policy
 */
exports.validateVersion = async (policyDocId, versionId) => {

    const query = `
        SELECT 1
        FROM tbl_policy_version
        WHERE policy_doc_id = $1
        AND version_id = $2
        LIMIT 1;
    `;

    return pool.query(query, [policyDocId, versionId]);
};