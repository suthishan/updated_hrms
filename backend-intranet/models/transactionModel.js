const { query } = require('../db/db');

const TransactionModel = {
    /**
     * Create a new transaction
     */
    create: async ({ accountId, categoryId, payee, memo, amount, transactionDate, isIncome = false }) => {
        const sql = `
            INSERT INTO transactions (account_id, category_id, payee, memo, amount, transaction_date, is_income)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`;
        const result = await query(sql, [accountId, categoryId, payee, memo, amount, transactionDate, isIncome]);
        return result.rows[0];
    },

    /**
     * Update a transaction
     */
    update: async (id, { categoryId, payee, memo, amount, transactionDate, isIncome, isCleared }) => {
        const sql = `
            UPDATE transactions
            SET category_id = COALESCE($2, category_id),
                payee = COALESCE($3, payee),
                memo = COALESCE($4, memo),
                amount = COALESCE($5, amount),
                transaction_date = COALESCE($6, transaction_date),
                is_income = COALESCE($7, is_income),
                is_cleared = COALESCE($8, is_cleared)
            WHERE id = $1
            RETURNING *`;
        const result = await query(sql, [id, categoryId, payee, memo, amount, transactionDate, isIncome, isCleared]);
        return result.rows[0];
    },

    /**
     * Delete a transaction
     */
    delete: async (id) => {
        const sql = `DELETE FROM transactions WHERE id = $1 RETURNING id`;
        const result = await query(sql, [id]);
        return result.rows[0];
    },

    /**
     * Find transaction by ID
     */
    findById: async (id) => {
        const sql = `SELECT * FROM transactions WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    },

    /**
     * Get transactions by account with pagination
     */
    getByAccount: async (accountId, { limit = 50, offset = 0, startDate, endDate } = {}) => {
        let sql = `
            SELECT t.*, c.name AS category_name
            FROM transactions t
            LEFT JOIN categories c ON c.id = t.category_id
            WHERE t.account_id = $1`;
        const params = [accountId];
        let paramIndex = 2;

        if (startDate) {
            sql += ` AND t.transaction_date >= $${paramIndex++}`;
            params.push(startDate);
        }
        if (endDate) {
            sql += ` AND t.transaction_date <= $${paramIndex++}`;
            params.push(endDate);
        }

        sql += ` ORDER BY t.transaction_date DESC, t.created_at DESC`;
        sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
        params.push(limit, offset);

        const result = await query(sql, params);
        return result.rows;
    },

    /**
     * Get transactions by category for a specific month
     */
    getByCategory: async (categoryId, month, year) => {
        const sql = `
            SELECT * FROM transactions
            WHERE category_id = $1
              AND EXTRACT(MONTH FROM transaction_date) = $2
              AND EXTRACT(YEAR FROM transaction_date) = $3
            ORDER BY transaction_date DESC`;
        const result = await query(sql, [categoryId, month, year]);
        return result.rows;
    },

    /**
     * Get total outflows for a category in a specific month
     */
    getCategoryOutflow: async (categoryId, month, year) => {
        const sql = `
            SELECT COALESCE(SUM(ABS(amount)), 0) AS total_outflow
            FROM transactions
            WHERE category_id = $1
              AND EXTRACT(MONTH FROM transaction_date) = $2
              AND EXTRACT(YEAR FROM transaction_date) = $3
              AND is_income = FALSE`;
        const result = await query(sql, [categoryId, month, year]);
        return parseFloat(result.rows[0].total_outflow);
    },
};

module.exports = TransactionModel;
