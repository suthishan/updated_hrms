const { query } = require('../db/db');

const AccountModel = {
    create: async ({ userId, name, accountType = 'checking', balance = 0, isOnBudget = true }) => {
        const sql = `
            INSERT INTO accounts (user_id, name, account_type, balance, is_on_budget)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
        const result = await query(sql, [userId, name, accountType, balance, isOnBudget]);
        return result.rows[0];
    },

    findById: async (id) => {
        const sql = `SELECT * FROM accounts WHERE id = $1 AND is_closed = FALSE`;
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    },

    getByUser: async (userId) => {
        const sql = `
            SELECT * FROM accounts
            WHERE user_id = $1 AND is_closed = FALSE
            ORDER BY sort_order, name`;
        const result = await query(sql, [userId]);
        return result.rows;
    },

    update: async (id, { name, accountType, isOnBudget, isClosed }) => {
        const sql = `
            UPDATE accounts
            SET name = COALESCE($2, name),
                account_type = COALESCE($3, account_type),
                is_on_budget = COALESCE($4, is_on_budget),
                is_closed = COALESCE($5, is_closed)
            WHERE id = $1
            RETURNING *`;
        const result = await query(sql, [id, name, accountType, isOnBudget, isClosed]);
        return result.rows[0];
    },

    updateBalance: async (id, amount) => {
        const sql = `UPDATE accounts SET balance = balance + $2 WHERE id = $1 RETURNING *`;
        const result = await query(sql, [id, amount]);
        return result.rows[0];
    },

    verifyOwnership: async (accountId, userId) => {
        const sql = `SELECT id FROM accounts WHERE id = $1 AND user_id = $2`;
        const result = await query(sql, [accountId, userId]);
        return result.rows.length > 0;
    },
};

module.exports = AccountModel;
