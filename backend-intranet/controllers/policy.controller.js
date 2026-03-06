const pool = require('../db/db');
const model = require('../models/policy.model');
const path = require('path');
const fs = require('fs');
/**
 * Update Policy Master
 */
exports.updatePolicy = async (req, res, next) => {

    try {

        const { policy_doc_id } = req.params;

        const result = await model.updatePolicyMaster(
            policy_doc_id,
            req.body
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Policy not found'
            });
        }

        return res.status(200).json({
            message: 'Policy updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Upload / Create New Version
 */
exports.uploadPolicyVersion = async (req, res, next) => {

    const client = await pool.connect();

    try {

        if (!req.file) {
            return res.status(400).json({
                message: 'Policy document file is required'
            });
        }

        await client.query('BEGIN');

        const filePath = req.file.path;

        const data = {
            policy_doc_id: req.body.policy_doc_id,
            version_number: req.body.version_number,
            effective_from: req.body.effective_from
        };

        // Reset previous version
        await model.resetCurrentVersion(
            data.policy_doc_id,
            client
        );

        // Insert new version
        const result = await model.insertPolicyVersion(
            data,
            filePath,
            client
        );

        await client.query('COMMIT');

        return res.status(201).json({
            message: 'Policy version uploaded successfully',
            data: result.rows[0]
        });

    } catch (error) {

        await client.query('ROLLBACK');
        next(error);

    } finally {
        client.release();
    }
};


/**
 * Get Single Policy
 */
exports.getPolicy = async (req, res, next) => {

    try {

        const { policy_doc_id } = req.params;

        const result = await model.getPolicyWithCurrentVersion(
            policy_doc_id
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Policy not found'
            });
        }

        return res.status(200).json({
            data: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Get All Policies
 */
exports.getPolicies = async (req, res, next) => {

    try {

        const result = await model.getAllPolicies();

        return res.status(200).json({
            count: result.rowCount,
            data: result.rows
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Create New Policy With First Version
 */
exports.createPolicy = async (req, res, next) => {

    const client = await pool.connect();
    let finalFilePath = null;

    try {

        if (!req.file) {
            return res.status(400).json({
                message: 'Policy document file is required'
            });
        }

        const policyCode = req.body.policy_doc_code;

        if (!policyCode) {
            // Clean up temp file before returning
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: 'policy_doc_code is required'
            });
        }

        // Move file from temp → final destination now that req.body is available
        const version = req.body.version_number || 1;
        const ext = path.extname(req.file.originalname);
        const finalDir = path.resolve(__dirname, `../uploads/policies/${policyCode}`);

        if (!fs.existsSync(finalDir)) {
            fs.mkdirSync(finalDir, { recursive: true });
        }

        finalFilePath = path.join(finalDir, `v${version}${ext}`);
        fs.renameSync(req.file.path, finalFilePath);

        // --- DB operations ---
        await client.query('BEGIN');

        const masterData = {
            policy_doc_code: policyCode,
            policy_doc_title: req.body.policy_doc_title,
            policy_doc_description: req.body.policy_doc_description,
            is_mandatory: req.body.is_mandatory ?? true,
            created_by: req.user?.id || null
        };

        const masterResult = await model.insertPolicyMaster(masterData, client);
        const policyDocId = masterResult.rows[0].policy_doc_id;

        const versionData = {
            policy_doc_id: policyDocId,
            version_number: version,
            effective_from: req.body.effective_from
        };

        const versionResult = await model.insertPolicyVersion(
            versionData,
            finalFilePath,
            client
        );

        await client.query('COMMIT');

        return res.status(201).json({
            message: 'Policy created successfully',
            policy: masterResult.rows[0],
            version: versionResult.rows[0]
        });

    } catch (error) {

        await client.query('ROLLBACK');

        // Clean up the uploaded file if DB failed
        const fileToDelete = finalFilePath || req.file?.path;
        if (fileToDelete && fs.existsSync(fileToDelete)) {
            fs.unlinkSync(fileToDelete);
        }

        next(error);

    } finally {
        client.release();
    }
};


/**
 * Employee Policy Consent
 */
exports.createConsent = async (req, res, next) => {

    try {

        const { policy_doc_id, version_id, consent_status ,emp_uuid} = req.body;

        if (!policy_doc_id || !version_id || !consent_status || !emp_uuid) {
            return res.status(400).json({
                message: 'policy_doc_id, version_id, consent_status and emp_uuid are required'
            });
        }

        if (!['ACCEPTED', 'REJECTED'].includes(consent_status)) {
            return res.status(400).json({
                message: 'Invalid consent_status'
            });
        }

        // Validate version belongs to policy
        const validation = await model.validateVersion(
            policy_doc_id,
            version_id
        );

        if (validation.rowCount === 0) {
            return res.status(400).json({
                message: 'Invalid policy or version combination'
            });
        }

        const consentData = {
            // emp_id: req.user.id,   // From auth middleware
            emp_id: emp_uuid,
            policy_doc_id,
            version_id,
            consent_status,
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        };
        console.log("Consent Data:", consentData);
        const result = await model.upsertEmployeeConsent(consentData);

        return res.status(201).json({
            message: 'Consent recorded successfully',
            data: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};