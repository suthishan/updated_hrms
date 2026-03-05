const pool = require('../db/db');
const model = require('../models/policy.model');
const path = require('path');
const fs = require('fs');

exports.updateProfile = async (req, res, next) => {

    try {
        const { emp_id } = req.user;
        const { signature, profile_picture } = req.body;
        const query = `
            UPDATE employee SET emp_email = ?,  signature = ?, profile_picture = ? WHERE emp_id = ?
        `;
        const [result] = await pool.execute(query, [req.user.emp_email, signature, profile_picture, emp_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                sts: "0",
                message: "Employee not found"
            });
        }
        return res.json({
            sts: "1",
            message: "Profile updated successfully"
        });
    } catch (error) {
        next(error);
    }
};